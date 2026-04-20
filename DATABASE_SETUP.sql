-- LafiaNest v3.0 Production Database Setup
-- Version: 3.0 | April 2026
-- Instructions: Copy and run this entire script in the Supabase SQL Editor.

-- ==========================================
-- 1. EXTENSIONS & CLEANUP
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. CORE TABLES
-- ==========================================

-- PROFILES: Unified user data for Students, Landlords, and Agents
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    phone TEXT UNIQUE, -- Made nullable to support Email/Social auth fallback
    full_name TEXT,
    avatar_url TEXT,
    role TEXT CHECK (role IN ('student', 'landlord', 'agent')) NOT NULL,
    university TEXT,         -- UniversityKey
    academic_level TEXT,     -- '100L', '200L', etc.
    monthly_budget NUMERIC,  -- Powers the AffordabilityMeter
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    notify_emergency_on_viewing BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    agent_license TEXT,      -- For verified agents
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- LISTINGS: Detailed property data with v3 features
CREATE TABLE IF NOT EXISTS public.listings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    property_type TEXT CHECK (property_type IN ('self_contain', 'room', 'flat', 'duplex')),
    university_tags TEXT[] DEFAULT '{}', -- Array of UniversityKeys
    rent NUMERIC NOT NULL CHECK (rent > 0),
    payment_frequency TEXT CHECK (payment_frequency IN ('yearly', '6monthly', 'monthly')) DEFAULT 'yearly',
    lease_type TEXT CHECK (lease_type IN ('standard', 'semester')) DEFAULT 'standard',
    caution_fee NUMERIC DEFAULT 0,
    address TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    photos TEXT[] DEFAULT '{}',
    video_url TEXT,
    virtual_tour_url TEXT,
    amenities TEXT[] DEFAULT '{}',
    house_rules TEXT,
    no_increment_pledge BOOLEAN DEFAULT false,
    rent_history JSONB DEFAULT '[]', -- [{year: 2023, amount: 40000}]
    move_in_ready BOOLEAN DEFAULT false,
    move_in_checklist JSONB DEFAULT '{}', -- {roof: true, water: true, ...}
    last_confirmed_at TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- MESSAGES: Secure chat with mutual consent logic
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    phone_consent_sender BOOLEAN DEFAULT false,
    phone_consent_receiver BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- SAVED LISTINGS: Favourites/Bookmarks
CREATE TABLE IF NOT EXISTS public.saved_listings (
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
    saved_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, listing_id)
);

-- ==========================================
-- 3. v3.0 FEATURE TABLES
-- ==========================================

-- VIEWINGS: Safety-focused viewing scheduler
CREATE TABLE IF NOT EXISTS public.viewings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE,
    student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    landlord_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
    friend_notified BOOLEAN DEFAULT false,
    friend_name TEXT,
    friend_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ROOMMATE POSTS: Student matching board
CREATE TABLE IF NOT EXISTS public.roommate_posts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    university TEXT NOT NULL,
    academic_level TEXT,
    monthly_budget NUMERIC,
    area_preference TEXT,
    property_type TEXT,
    lifestyle_tags TEXT[] DEFAULT '{}',
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ DEFAULT (now() + interval '30 days'),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- COMMUNITY POSTS: Housing tips and scam alerts
CREATE TABLE IF NOT EXISTS public.community_posts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    university TEXT NOT NULL,
    tag TEXT CHECK (tag IN ('room_available', 'splitting_costs', 'scam_alert', 'looking_for_room', 'general')) NOT NULL,
    content TEXT NOT NULL,
    scam_landlord_name TEXT,
    scam_area TEXT,
    scam_photo_url TEXT,
    is_pinned BOOLEAN DEFAULT false,
    is_removed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- SCAM REPORTS: Listing-specific reporting
CREATE TABLE IF NOT EXISTS public.scam_reports (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id uuid REFERENCES public.profiles(id),
    listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 4. INDEXES (Performance)
-- ==========================================
CREATE INDEX IF NOT EXISTS listings_location_idx ON public.listings USING btree (lat, lng);
CREATE INDEX IF NOT EXISTS listings_university_tags_idx ON public.listings USING gin (university_tags);
CREATE INDEX IF NOT EXISTS roommate_uni_idx ON public.roommate_posts (university);
CREATE INDEX IF NOT EXISTS community_uni_idx ON public.community_posts (university);
CREATE INDEX IF NOT EXISTS community_tag_idx ON public.community_posts (tag);

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viewings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roommate_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scam_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self write
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Listings: Public read (active), owner manage
CREATE POLICY "Listings are viewable by everyone" ON public.listings FOR SELECT USING (is_active = true);
CREATE POLICY "Landlords can manage their own listings" ON public.listings FOR ALL USING (auth.uid() = owner_id);

-- Messages: Private chat access
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Saved Listings: Private manage
CREATE POLICY "Users can manage their own saved listings" ON public.saved_listings FOR ALL USING (auth.uid() = user_id);

-- Viewings: Private scheduler access
CREATE POLICY "Users can view their own viewings" ON public.viewings FOR SELECT USING (auth.uid() = student_id OR auth.uid() = landlord_id);
CREATE POLICY "Students can request viewings" ON public.viewings FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Participants can update viewings" ON public.viewings FOR UPDATE USING (auth.uid() = student_id OR auth.uid() = landlord_id);

-- Roommate Posts: Public read, self manage
CREATE POLICY "Roommate posts are viewable by everyone" ON public.roommate_posts FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage their own roommate posts" ON public.roommate_posts FOR ALL USING (auth.uid() = user_id);

-- Community Posts: Public read, author manage
CREATE POLICY "Community posts are viewable by everyone" ON public.community_posts FOR SELECT USING (is_removed = false);
CREATE POLICY "Users can create community posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can delete their own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id);

-- Scam Reports: Private create, admin read (handled via Supabase dashboard)
CREATE POLICY "Users can submit scam reports" ON public.scam_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- ==========================================
-- 6. AUTOMATION (Updated At)
-- ==========================================
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_listings_updated_at BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ==========================================
-- SETUP COMPLETE
-- ==========================================
