# LafiaNest – Production Build Framework
**For: Students in Federal University of Lafia (FULAFIA) and Other Universities and colages in Lafia and Nasarawa**  
**Stack:** React Native + Expo + TypeScript + Supabase + NativeWind  
**Version:** 2.0 | April 2026  
**Agent Rule:** You are the official LafiaNest coding agent. Always start your response with the file path. Always generate the COMPLETE file — no placeholders, no TODOs, no skeleton code.

---

## 0. Agent Mindset — Read This First

This is NOT a generic housing app. LafiaNest solves a real pain for students: **rent scams,agents scams,unwarrante increament of rent, unsafe landlords, and zero transparency**. Every design decision must reflect safety, trust, and elegance. Think: Zillow meets a premium Nigerian fintech app.

**The #1 enemy:** Generic AI UI — flat cards, overused Inter font, purple gradients, and boring list layouts.  
**The goal:** When a student opens this app, she should feel like it was designed *for her*, by someone who cares.

---

## 1. Design System — Lock These In Forever

### 1.1 Color Tokens

```ts
// src/constants/colors.ts
export const COLORS = {
  // Primary palette
  navy:         '#0F2557',   // Deep trust — headers, primary buttons
  navyLight:    '#1E3A8A',   // Secondary navy — tab bars, cards
  terracotta:   '#C27B52',   // Warm accent — CTAs, highlights, badges
  terracottaLight: '#F0C9A8',// Soft terracotta — background accents

  // Functional
  teal:         '#0D9488',   // Verified / success / distance badges
  tealLight:    '#CCFBF1',   // Verified badge background
  error:        '#DC2626',
  errorLight:   '#FEE2E2',
  warning:      '#D97706',
  warningLight: '#FEF3C7',

  // Neutral scale
  bg:           '#F7F3EE',   // Warm off-white — main background
  bgDeep:       '#EDE8E2',   // Slightly darker warm — dividers, shimmer
  card:         '#FFFFFF',
  border:       '#E5DED5',   // Warm border
  overlay:      'rgba(15, 37, 87, 0.55)',

  // Text scale
  ink:          '#131922',   // Primary text
  inkMid:       '#374151',   // Secondary text
  inkLight:     '#6B7280',   // Placeholder, captions
  inkFaint:     '#9CA3AF',   // Disabled states

  // White
  white:        '#FFFFFF',
} as const;
```

### 1.2 Typography System

```ts
// src/constants/typography.ts
// Font families — import via expo-google-fonts or @expo-google-fonts
// Primary Display: "Cormorant Garamond" (elegant, high-end property feel)
// Body / UI: "DM Sans" (clean, warm, modern — not Inter)
// Accent / Labels: "DM Mono" (for prices, distances, numbers)

export const FONTS = {
  display:    'CormorantGaramond_600SemiBold',
  displayBold:'CormorantGaramond_700Bold',
  body:       'DMSans_400Regular',
  bodySemi:   'DMSans_500Medium',
  bodyBold:   'DMSans_700Bold',
  mono:       'DMSans_400Regular',  // fallback until DM Mono loads
} as const;

export const TEXT = {
  // Display — for hero headings, screen titles
  hero:       { fontFamily: FONTS.displayBold, fontSize: 36, lineHeight: 44, color: COLORS.navy },
  h1:         { fontFamily: FONTS.display,     fontSize: 28, lineHeight: 36, color: COLORS.navy },
  h2:         { fontFamily: FONTS.displayBold, fontSize: 22, lineHeight: 30, color: COLORS.ink },
  h3:         { fontFamily: FONTS.bodySemi,    fontSize: 18, lineHeight: 26, color: COLORS.ink },

  // Body
  body:       { fontFamily: FONTS.body,        fontSize: 15, lineHeight: 23, color: COLORS.inkMid },
  bodySmall:  { fontFamily: FONTS.body,        fontSize: 13, lineHeight: 20, color: COLORS.inkLight },
  label:      { fontFamily: FONTS.bodySemi,    fontSize: 12, lineHeight: 16, color: COLORS.inkLight, letterSpacing: 1.2, textTransform: 'uppercase' as const },

  // Price / Numbers — always use mono styling
  price:      { fontFamily: FONTS.bodyBold,    fontSize: 20, lineHeight: 26, color: COLORS.navy },
  priceLarge: { fontFamily: FONTS.displayBold, fontSize: 32, lineHeight: 38, color: COLORS.navy },
  badge:      { fontFamily: FONTS.bodySemi,    fontSize: 11, lineHeight: 14, letterSpacing: 0.5 },
} as const;
```

### 1.3 Spacing & Shape System

```ts
// src/constants/layout.ts
export const SPACING = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  page: 20,   // horizontal screen padding
} as const;

export const RADIUS = {
  sm:   8,
  md:   14,
  lg:   20,
  xl:   28,
  pill: 999,
} as const;

export const SHADOW = {
  card: {
    shadowColor: '#0F2557',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  float: {
    shadowColor: '#0F2557',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
} as const;
```

---

## 2. Component Library — Build These Reusable Components First

### 2.1 `<PriceTag />` — Always show rent this way

```
Layout: [₦] [Amount in DM Sans Bold 20px] [/month in inkLight 13px]
Background: Transparent or card white
Never show raw numbers — always format with toLocaleString('en-NG')
Example: ₦45,000/month
```

### 2.2 `<DistanceBadge />` — GPS distance to campus

```
Design: Pill shape, tealLight background, teal text, map-pin icon left
Size: Small — 11px font, 6px vertical padding, 10px horizontal padding
States:
  - "2.1 km to campus" (teal)  
  - "Walking distance" if < 0.5km (teal + walking icon)
  - "Calculating…" skeleton shimmer while loading
```

### 2.3 `<VerifiedBadge />` — Landlord verification

```
Design: Inline pill — shield-check icon + "Verified" text
Colors: teal icon, tealLight bg, teal text
Position: Overlaid on card image bottom-left OR inline in detail header
```

### 2.4 `<PropertyCard />` — The most important component

```
Card anatomy (top to bottom):

[IMAGE AREA — 200px height]
  - Full bleed photo with rounded top corners (14px)
  - Gradient overlay bottom 50% (transparent → rgba(0,0,0,0.4))
  - VerifiedBadge overlaid bottom-left of image
  - Heart/Save button top-right (32px circle, white bg, 70% opacity)
  - DistanceBadge top-left

[CARD BODY — white, padded 14px]
  - Row: PriceTag + RoomType tag (e.g. "Self-contain" pill)
  - Title: h3 style, max 2 lines, ellipsis
  - Location line: map-pin icon (12px terracotta) + address (bodySmall)
  - Bottom row: [Bed/Bath icons + counts] spacer [Distance to user if available]

Card width: Full width on home feed, 72% on horizontal scroll
Corners: 14px all around
Shadow: SHADOW.card
Background: COLORS.card
Active state: Scale 0.98, shadow.float — use Animated.timing
```

### 2.5 `<SectionHeader />` — For home screen sections

```
Layout: Row — [Label (uppercase, 12px, letterSpacing 1.2)] spacer [See all →]
Label color: COLORS.inkLight
"See all" color: COLORS.terracotta, DMSans 500, 13px
Bottom border: 1px COLORS.border
Margin bottom: 12px
```

### 2.6 `<FilterChip />` — Filter bar component

```
Active:   COLORS.navy bg, white text, slight shadow
Inactive: COLORS.bgDeep bg, COLORS.inkMid text, COLORS.border border (1px)
Shape:    pill (radius 999)
Size:     paddingVertical 8, paddingHorizontal 16, font 13px DMSans 500
Animation: Spring scale on press
```

### 2.7 `<SafeMessageButton />` — Critical trust feature

```
Full width button
Left icon: message-circle (white, 18px)
Text: "Message Landlord" — DMSans 600, 15px, white
BG: COLORS.terracotta
Below button: Small text — "📱 Phone number shared only on mutual consent" (bodySmall, inkLight)
Never show phone number on listing — only after both parties consent in chat
```

### 2.8 `<ScamReportButton />` — Safety feature

```
Ghost button — red border, red text, flag icon
Text: "Report Suspicious Listing"
Size: small, 12px, errorLight bg on press
Position: Bottom of PropertyDetailScreen, below all content
```

### 2.9 `<RentHistoryTimeline />` — Transparency feature

```
Vertical timeline — each entry:
  [Year] ——— [Amount] [Change indicator: ↑ red / ↓ green / — gray]
  
Left column: Year in mono bold, inkLight
Right column: ₦Amount in navy, + "(+₦5k since last year)" in error or success colors
Connector: 1px dashed COLORS.border
Title: Section label "Rent History" with info icon tooltip explaining purpose
```

---

## 3. Screen-by-Screen Specifications

### Screen 1: `AuthScreen.tsx`

**Path:** `src/screens/AuthScreen.tsx`

**Layout & Design:**
```
Background: Full bleed image of FULAFIA campus (use local asset or placeholder)
  + dark overlay (rgba(0,0,0,0.55))
  + subtle grain texture overlay (use noise SVG or library)

Top 40%: Hero section
  - LafiaNest logo mark (SVG) — 48px
  - "LafiaNest" in Cormorant Garamond Bold 36px, white
  - Tagline: "Safe Homes for FULAFIA Women" — DMSans 400 15px, white 80% opacity

Bottom 60%: Sliding card (white, top corners 28px, shadow.float)
  - Heading: "Let's get started" — h2
  - Phone input: Nigerian flag + +234 prefix, then 10-digit input
    - Border: 1.5px COLORS.border, focused: COLORS.navy
    - Radius: 12px, height: 54px
  - OTP input: 6 boxes, 48x54px each, spaced 8px apart
    - Active box: navy border, terracotta cursor
  - Role selector: 3 horizontal cards
    - Icons: 🎓 Student | 🏠 Landlord | 🤝 Agent
    - Selected: navy bg, white text; Unselected: bgDeep bg
  - CTA button: Full width, COLORS.navy, "Continue" white DMSans 600
  
Animations:
  - Card slides up from bottom on mount (translateY + spring)
  - OTP boxes appear with staggered fade (delay 50ms each)
  - Role cards spring-scale on select
```

---

### Screen 2: `StudentHomeScreen.tsx`

**Path:** `src/screens/StudentHomeScreen.tsx`

**Layout (Scroll view — NOT FlatList at top level):**
```
HEADER (sticky, white, shadow.subtle):
  Row: [LafiaNest logo 24px] spacer [Notification bell] [Avatar circle 36px]
  Below: Location line — map-pin terracotta + "Near FULAFIA Campus" inkLight 13px

SEARCH BAR (16px horizontal margin, 12px top):
  Height: 52px, radius 14px, bgDeep bg, border COLORS.border
  Left: search icon (inkLight)
  Placeholder: "Search by area, price, type…"
  Right: Filter icon button (navy, 32px circle) — opens FilterSheet

FILTER CHIPS ROW (horizontal ScrollView, no scrollbar):
  Chips: All | Self-contain | Room & Parlour | Flat | Under ₦30k | Verified Only | Near Campus
  State managed by Zustand filterStore

SECTION: "Live Near Campus" (SectionHeader component)
  → Horizontal FlatList of PropertyCards (72% width, gap 12px)
  → Source: listings sorted by distance_to_campus ASC

SECTION: "Recently Added" (SectionHeader component)
  → Vertical list of PropertyCards (full width)
  → Source: listings sorted by created_at DESC

SECTION: "No-Increment Pledge Homes" (SectionHeader)
  → Terracotta tinted section header with shield icon
  → Horizontal scroll of cards where no_increment_pledge = true

BOTTOM TAB BAR:
  Tabs: Home (house) | Map (map) | Add Listing (plus-circle, terracotta) | Saved (heart) | Profile (user)
  Active: COLORS.navy icon + navy dot indicator below
  Inactive: COLORS.inkFaint
  Height: 72px, white bg, top shadow
```

---

### Screen 3: `MapScreen.tsx`

**Path:** `src/screens/MapScreen.tsx`

**Layout:**
```
FULL SCREEN MapView (react-native-maps, mapType: 'standard')
  
  Map customizations:
    - Custom style JSON (muted map — reduce clutter, keep roads legible)
    - Campus pin: Large navy marker with school icon + "FULAFIA" label
    - Listing pins: Custom circular markers
        Verified: teal circle, white dot, subtle shadow
        Unverified: terracotta circle, white dot
        Selected: enlarged + drop shadow

  TOP OVERLAY (floating, 16px from edges):
    - Back arrow (left)
    - Search bar (inline, 80% width)
    - Layer toggle (right — satellite / standard)

  BOTTOM SHEET (react-native-bottom-sheet library):
    Handle: 4x40px pill, COLORS.border, centered
    
    Collapsed (80px): 
      "[X] listings near you" — h3, + Filter chips row
    
    Half (40% screen): 
      Horizontal FlatList of PropertyCards (72% width)
      Scrolls in sync with map marker selection
    
    Full (90% screen):
      Full vertical list with all filtered results
  
  When marker tapped:
    → Map animates to center on listing (animateToRegion)
    → Bottom sheet snaps to half-open
    → Tapped card scrolls into view + shadow.float highlight
```

---

### Screen 4: `ListingFormScreen.tsx`

**Path:** `src/screens/ListingFormScreen.tsx`

**Layout:**
```
STEPPER HEADER (sticky):
  4 steps: Basic Info → Photos & Videos → Amenities → Terms & Pricing
  Visual: Connected dots — completed (navy filled), active (terracotta ring), future (border)
  Progress bar: 4px height, animated fill, terracotta color

STEP 1 — Basic Info:
  - Property Title input (h3 style placeholder)
  - Property Type: Grid of 4 type cards (Self-contain / Room / Flat / Duplex) with icons
  - Address: Full text input + "Use Current GPS" button (teal)
  - GPS Picker: Opens inline map for manual pin drop if needed
  - Description: Multiline input, min 3 lines, bodySmall placeholder text

STEP 2 — Photos & Videos:
  - Upload grid: 3 columns, square tiles, dashed border when empty
  - First photo = cover photo (labeled with star icon)
  - Video: Single upload, thumbnail preview with play button
  - Minimum 3 photos enforced — show inline warning if less

STEP 3 — Amenities:
  - Grid of toggle chips (2 per row):
    Water | Electricity | Security | Kitchen | Bathroom (ensuite) | Furnished
    Parking | Generator | WiFi | Borehole | Fence | CCTV
  - Active chip: navy bg, white text, checkmark icon left
  - Inactive: bgDeep bg

STEP 4 — Terms & Pricing:
  - Rent input: ₦ prefix, large number input, DM Sans Bold
  - Payment terms: Yearly / 6-Monthly / Monthly (segmented control)
  - Caution fee field
  - "No Sudden Increment Pledge" toggle:
      Large toggle card — shield icon, navy header "I pledge no sudden rent increases"
      subtext: "This badge builds trust and gets you more inquiries"
      Toggle ON = teal, badge appears on listing
  - Rules input: multiline (No smoking / Female tenants only / etc)
  
BOTTOM CTA:
  - "Previous" ghost button (left) + "Next" / "Submit Listing" solid navy (right)
  - On submit: loading state with "Submitting…" + spinner
```

---

### Screen 5: `PropertyDetailScreen.tsx`

**Path:** `src/screens/PropertyDetailScreen.tsx`

**Layout (ScrollView):**
```
PHOTO GALLERY (full bleed, 280px height):
  - Horizontal pager (PagerView or FlatList pagingEnabled)
  - Dot indicators: 6px circles, white active, white 40% opacity inactive
  - Top overlay row: Back button (left) + Share + Save buttons (right)
    Both on floating circle buttons (white bg, subtle shadow)
  - Photo count badge: "3/7" bottom right, dark pill

PRICE HEADER (16px padding, white bg):
  - PriceTag (large) — left
  - VerifiedBadge — right of price (if verified)
  - Title: h2 style, ink color
  - Location row: map-pin + address + DistanceBadge (campus) on same line

INFO PILLS ROW (horizontal scroll):
  Pills: [🛏 Bedrooms] [🚿 Bathroom] [📐 Size if known] [Payment frequency]
  Style: bgDeep bg, border, 12px radius, DMSans 500 13px

SECTION: About this Property
  - Expandable body text (max 3 lines, "Read more" terracotta link)

SECTION: Amenities
  - 3-column icon grid
  - Icon (20px) + label (bodySmall) pairs
  - Available: ink color; Unavailable: inkFaint + strikethrough

SECTION: Rent History
  → RentHistoryTimeline component (see 2.9)

SECTION: Location
  → Compact map view (200px height, radius 14px, non-interactive preview)
  → "View on full map" link opens MapScreen centered on this listing

SECTION: House Rules
  → Bulleted list, shield icon prefix, inkMid text

STICKY BOTTOM BAR (white bg, top border + shadow.float):
  Layout: [PriceTag compact] spacer [SafeMessageButton (60% width)]
  Height: 80px + safe area inset
  
BELOW FOLD:
  → ScamReportButton (full width ghost red)
  → Legal disclaimer text (bodySmall, inkFaint, centered)
```

---

## 4. Supabase Schema — Complete

```sql
-- profiles
create table profiles (
  id uuid references auth.users primary key,
  phone text unique not null,
  full_name text,
  avatar_url text,
  role text check (role in ('student', 'landlord', 'agent')) not null,
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- listings
create table listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  property_type text check (property_type in ('self_contain', 'room', 'flat', 'duplex')),
  rent numeric not null,
  payment_frequency text check (payment_frequency in ('yearly', '6monthly', 'monthly')) default 'yearly',
  caution_fee numeric default 0,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  photos text[] default '{}',     -- array of Supabase storage URLs
  video_url text,
  amenities text[] default '{}',
  house_rules text,
  no_increment_pledge boolean default false,
  rent_history jsonb default '[]', -- [{ year: 2023, amount: 40000 }, ...]
  is_verified boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for geo queries
create index listings_location_idx on listings using btree (lat, lng);

-- messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  sender_id uuid references profiles(id) on delete cascade,
  receiver_id uuid references profiles(id) on delete cascade,
  content text not null,
  is_read boolean default false,
  phone_consent_sender boolean default false,
  phone_consent_receiver boolean default false,
  created_at timestamptz default now()
);

-- saved / favourites
create table saved_listings (
  user_id uuid references profiles(id) on delete cascade,
  listing_id uuid references listings(id) on delete cascade,
  saved_at timestamptz default now(),
  primary key (user_id, listing_id)
);

-- scam reports
create table scam_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id),
  listing_id uuid references listings(id) on delete cascade,
  reason text not null,
  details text,
  created_at timestamptz default now()
);
```

---

## 5. Zustand Stores

### filterStore
```ts
// src/store/filterStore.ts
interface FilterState {
  propertyType: string | null;    // null = all
  maxRent: number | null;
  verifiedOnly: boolean;
  noPledgeOnly: boolean;
  maxDistance: number | null;     // km to campus
  setFilter: (key: string, value: any) => void;
  resetFilters: () => void;
}
```

### listingsStore
```ts
// src/store/listingsStore.ts
interface ListingsState {
  listings: Listing[];
  selectedListing: Listing | null;
  isLoading: boolean;
  fetchListings: () => Promise<void>;
  fetchByDistance: (lat: number, lng: number) => Promise<void>;
  setSelected: (id: string) => void;
}
```

### authStore
```ts
// src/store/authStore.ts
interface AuthState {
  user: Profile | null;
  session: Session | null;
  isLoading: boolean;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateRole: (role: 'student' | 'landlord' | 'agent') => Promise<void>;
}
```

---

## 6. GPS Distance Utility

```ts
// src/utils/distance.ts
const FULAFIA_GATE = { lat: 8.5060, lng: 8.5227 };

export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function getDistanceToCampus(lat: number, lng: number): number {
  return getDistanceKm(lat, lng, FULAFIA_GATE.lat, FULAFIA_GATE.lng);
}

export function formatDistance(km: number): string {
  if (km < 0.5) return 'Walking distance';
  if (km < 1) return `${Math.round(km * 1000)}m to campus`;
  return `${km.toFixed(1)} km to campus`;
}

export function formatRent(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}
```

---

## 7. Animation Rules — No Exceptions

These animations must appear in every screen. No static UI.

```
Page mount:     Fade in + translateY from +20px → 0, duration 300ms, easing ease-out
Card press:     Spring scale 1.0 → 0.97 → 1.0, stiffness 300, damping 20
Button press:   Scale 0.96 on press-in, 1.0 on press-out (Pressable + Animated)
Filter chip:    Spring scale + background color interpolation
Bottom sheet:   Spring physics (react-native-bottom-sheet defaults)
Image gallery:  Smooth pager swipe with translateX interpolation
Badges:         Fade in with 100ms delay after card appears
Skeleton loaders: Shimmer animation using Animated + linearGradient (left → right, 1200ms loop)
```

**Skeleton Loader pattern (use for ALL loading states):**
```
Show grey shimmer rectangles matching EXACT shape of real content
Never use spinners for list/feed loading — always skeleton
Spinner allowed only on: OTP verification, image upload, form submit
```

---

## 8. What "Premium" Means — Anti-Pattern List

Never do these:

❌ `fontFamily: 'Inter'` or `fontFamily: 'System'` — use Cormorant + DM Sans always  
❌ Purple or blue gradients as backgrounds  
❌ Generic card with just title + price and nothing else  
❌ Default React Native `<Text style={{ color: 'gray' }}>` — use TEXT constants  
❌ `marginBottom: 10` random magic numbers — use SPACING constants  
❌ Borders: `borderColor: '#ccc'` — use COLORS.border  
❌ Loading: just `<ActivityIndicator />` with no context — use skeleton loaders  
❌ Buttons: rounded square with no depth — use proper shadow + typography  
❌ Phone numbers visible before consent — safety critical  
❌ Empty states with no illustration or guidance — always add helpful empty state UI  

Always do these:

✅ Use COLORS, TEXT, SPACING, RADIUS, SHADOW constants exclusively  
✅ Wrap all screens in a `<SafeAreaView>` with `bg: COLORS.bg`  
✅ Format all money with `formatRent()` utility  
✅ Calculate and display campus distance on every listing card  
✅ Skeleton loaders on every data-fetching screen  
✅ Press animations on every interactive element  
✅ Empty states: illustration + heading + subtext + CTA button  
✅ Error states: friendly copy, retry button, never raw error messages  

---

## 9. File Structure

```
src/
├── constants/
│   ├── colors.ts
│   ├── typography.ts
│   └── layout.ts
├── components/
│   ├── PriceTag.tsx
│   ├── DistanceBadge.tsx
│   ├── VerifiedBadge.tsx
│   ├── PropertyCard.tsx
│   ├── SectionHeader.tsx
│   ├── FilterChip.tsx
│   ├── SafeMessageButton.tsx
│   ├── ScamReportButton.tsx
│   ├── RentHistoryTimeline.tsx
│   ├── SkeletonCard.tsx
│   └── EmptyState.tsx
├── screens/
│   ├── AuthScreen.tsx
│   ├── StudentHomeScreen.tsx
│   ├── MapScreen.tsx
│   ├── ListingFormScreen.tsx
│   └── PropertyDetailScreen.tsx
├── store/
│   ├── authStore.ts
│   ├── listingsStore.ts
│   └── filterStore.ts
├── utils/
│   ├── distance.ts
│   └── supabase.ts
└── navigation/
    └── AppNavigator.tsx
```

---

## 10. Build Order (Follow This Sequence)

Build in this exact order — each phase unblocks the next:

**Phase 1 — Foundation**
1. `src/constants/colors.ts`
2. `src/constants/typography.ts`
3. `src/constants/layout.ts`
4. `src/utils/distance.ts`
5. `src/utils/supabase.ts` (Supabase client init)

**Phase 2 — Components**
6. `PriceTag.tsx`
7. `DistanceBadge.tsx`
8. `VerifiedBadge.tsx`
9. `PropertyCard.tsx` (depends on all above)
10. `SkeletonCard.tsx`
11. `FilterChip.tsx`
12. `SectionHeader.tsx`
13. `SafeMessageButton.tsx`
14. `ScamReportButton.tsx`
15. `RentHistoryTimeline.tsx`

**Phase 3 — State**
16. `authStore.ts`
17. `listingsStore.ts`
18. `filterStore.ts`

**Phase 4 — Screens**
19. `AuthScreen.tsx`
20. `StudentHomeScreen.tsx`
21. `PropertyDetailScreen.tsx`
22. `MapScreen.tsx`
23. `ListingFormScreen.tsx`

**Phase 5 — Navigation**
24. `AppNavigator.tsx`

---

*LafiaNest Framework v2.0 — Built for real students, not demo apps.*
*Every screen must feel like it was designed for the women of FULAFIA.*
