// src/types/index.ts
import { UniversityKey } from '../constants/universities';

export interface Profile {
  id: string;
  phone: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'student' | 'landlord' | 'agent';
  university: UniversityKey | null;
  academic_level: string | null;
  monthly_budget: number | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  notify_emergency_on_viewing: boolean;
  is_verified: boolean;
  agent_license: string | null;
  created_at: string;
}

export interface Listing {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  property_type: 'self_contain' | 'room' | 'flat' | 'duplex';
  university_tags: UniversityKey[];
  rent: number;
  payment_frequency: 'yearly' | '6monthly' | 'monthly';
  lease_type: 'standard' | 'semester';
  caution_fee: number;
  address: string;
  lat: number;
  lng: number;
  photos: string[];
  video_url: string | null;
  virtual_tour_url: string | null;
  amenities: string[];
  house_rules: string | null;
  no_increment_pledge: boolean;
  rent_history: Array<{ year: number; amount: number }>;
  move_in_ready: boolean;
  move_in_checklist: Record<string, boolean>;
  last_confirmed_at: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Virtual fields for UI convenience
  beds?: number;
  baths?: number;
}

export interface RoommatePost {
  id: string;
  user_id: string;
  university: UniversityKey;
  academic_level: string;
  monthly_budget: number;
  area_preference: string;
  property_type: string;
  lifestyle_tags: string[];
  bio: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
  
  // Virtual
  user_name?: string;
  user_avatar?: string;
}

export interface CommunityPost {
  id: string;
  author_id: string;
  university: UniversityKey;
  tag: 'room_available' | 'splitting_costs' | 'scam_alert' | 'looking_for_room' | 'general';
  content: string;
  scam_landlord_name?: string;
  scam_area?: string;
  scam_photo_url?: string;
  is_pinned: boolean;
  is_removed: boolean;
  created_at: string;

  // Virtual
  author_name?: string;
}

export interface Viewing {
  id: string;
  listing_id: string;
  student_id: string;
  landlord_id: string;
  scheduled_at: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  friend_notified: boolean;
  friend_name?: string;
  friend_phone?: string;
  created_at: string;
  
  // Virtual
  listing_title?: string;
  landlord_name?: string;
}
