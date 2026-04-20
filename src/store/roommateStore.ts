// src/store/roommateStore.ts
import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import { RoommatePost } from '../types';
import { UniversityKey } from '../constants/universities';
import { MOCK_ROOMMATES } from '../utils/mockData';

interface RoommateState {
  posts: RoommatePost[];
  myPost: RoommatePost | null;
  isLoading: boolean;
  fetchPosts: (universityKey?: UniversityKey) => Promise<void>;
  createPost: (data: Partial<RoommatePost>) => Promise<void>;
  updateMyPost: (data: Partial<RoommatePost>) => Promise<void>;
  deleteMyPost: () => Promise<void>;
}

export const useRoommateStore = create<RoommateState>((set, get) => ({
  posts: MOCK_ROOMMATES,
  myPost: null,
  isLoading: false,

  fetchPosts: async (universityKey) => {
    set({ isLoading: true });
    try {
      let query = supabase
        .from('roommate_posts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (universityKey) {
        query = query.eq('university', universityKey);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      if (data && data.length > 0) {
        set({ posts: data, isLoading: false });
      } else {
        set({ 
          posts: universityKey ? MOCK_ROOMMATES.filter(p => p.university === universityKey) : MOCK_ROOMMATES, 
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching roommate posts:', error);
      set({ posts: MOCK_ROOMMATES, isLoading: false });
    }
  },

  createPost: async (data) => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('roommate_posts')
        .insert([{ ...data, user_id: session.user.id }]);
      
      if (error) throw error;
      set({ isLoading: false });
      await get().fetchPosts();
    } catch (error) {
      console.error('Error creating roommate post:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateMyPost: async (data) => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('roommate_posts')
        .update(data)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      set({ isLoading: false });
    } catch (error) {
      console.error('Error updating roommate post:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteMyPost: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('roommate_posts')
        .delete()
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      set({ myPost: null, isLoading: false });
      await get().fetchPosts();
    } catch (error) {
      console.error('Error deleting roommate post:', error);
      set({ isLoading: false });
      throw error;
    }
  },
}));
