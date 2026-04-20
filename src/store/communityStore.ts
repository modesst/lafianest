// src/store/communityStore.ts
import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import { CommunityPost } from '../types';
import { UniversityKey } from '../constants/universities';
import { MOCK_COMMUNITY } from '../utils/mockData';

interface CommunityState {
  posts: CommunityPost[];
  isLoading: boolean;
  activeTag: string | null;
  fetchPosts: (universityKey?: UniversityKey, tag?: string) => Promise<void>;
  createPost: (data: Partial<CommunityPost>) => Promise<void>;
  reportPost: (postId: string, reason: string) => Promise<void>;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  posts: MOCK_COMMUNITY,
  isLoading: false,
  activeTag: null,

  fetchPosts: async (universityKey, tag) => {
    set({ isLoading: true, activeTag: tag || null });
    try {
      let query = supabase
        .from('community_posts')
        .select('*')
        .eq('is_removed', false)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (universityKey) {
        query = query.eq('university', universityKey);
      }
      if (tag) {
        query = query.eq('tag', tag);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      if (data && data.length > 0) {
        set({ posts: data, isLoading: false });
      } else {
        let filteredMock = MOCK_COMMUNITY;
        if (universityKey) filteredMock = filteredMock.filter(p => p.university === universityKey);
        if (tag) filteredMock = filteredMock.filter(p => p.tag === tag);
        set({ posts: filteredMock, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching community posts:', error);
      set({ posts: MOCK_COMMUNITY, isLoading: false });
    }
  },

  createPost: async (data) => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('community_posts')
        .insert([{ ...data, author_id: session.user.id }]);
      
      if (error) throw error;
      set({ isLoading: false });
      await get().fetchPosts();
    } catch (error) {
      console.error('Error creating community post:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  reportPost: async (postId, reason) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const reporterId = session?.user?.id;

      const { error } = await supabase
        .from('scam_reports')
        .insert([{ 
          listing_id: postId,
          reporter_id: reporterId,
          reason,
          details: 'Community Post Report'
        }]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error reporting post:', error);
      throw error;
    }
  },
}));
