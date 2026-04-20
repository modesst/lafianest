// src/store/listingsStore.ts
import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import { Listing } from '../types';
import { UniversityKey } from '../constants/universities';
import { MOCK_LISTINGS } from '../utils/mockData';

interface ListingsState {
  listings: Listing[];
  selectedListing: Listing | null;
  isLoading: boolean;
  fetchListings: () => Promise<void>;
  fetchNearUniversity: (universityKey: UniversityKey) => Promise<void>;
  setSelected: (id: string | null) => void;
}

export const useListingsStore = create<ListingsState>((set, get) => ({
  listings: MOCK_LISTINGS, // Default to mock data for development
  selectedListing: null,
  isLoading: false,

  fetchListings: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data && data.length > 0) {
        set({ listings: data, isLoading: false });
      } else {
        // Fallback to mock if DB is empty
        set({ listings: MOCK_LISTINGS, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      set({ listings: MOCK_LISTINGS, isLoading: false });
    }
  },

  fetchNearUniversity: async (universityKey: UniversityKey) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .contains('university_tags', [universityKey])
        .eq('is_active', true);
      
      if (error) throw error;
      if (data && data.length > 0) {
        set({ listings: data, isLoading: false });
      } else {
        set({ 
          listings: MOCK_LISTINGS.filter(l => l.university_tags.includes(universityKey)), 
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching near university:', error);
      set({ listings: MOCK_LISTINGS, isLoading: false });
    }
  },

  setSelected: (id: string | null) => {
    if (!id) {
      set({ selectedListing: null });
      return;
    }
    const selected = get().listings.find((l) => l.id === id) || null;
    set({ selectedListing: selected });
  },
}));
