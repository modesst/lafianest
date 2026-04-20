// src/store/viewingStore.ts
import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import { Viewing } from '../types';

interface ViewingState {
  viewings: Viewing[];
  isLoading: boolean;
  fetchMyViewings: () => Promise<void>;
  scheduleViewing: (data: Partial<Viewing>) => Promise<void>;
  cancelViewing: (viewingId: string) => Promise<void>;
  confirmViewing: (viewingId: string) => Promise<void>;
}

export const useViewingStore = create<ViewingState>((set, get) => ({
  viewings: [],
  isLoading: false,

  fetchMyViewings: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('viewings')
        .select('*')
        .or(`student_id.eq.${session.user.id},landlord_id.eq.${session.user.id}`)
        .order('scheduled_at', { ascending: true });
      
      if (error) throw error;
      set({ viewings: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching viewings:', error);
      set({ isLoading: false });
    }
  },

  scheduleViewing: async (data) => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('viewings')
        .insert([{ ...data, student_id: session.user.id, status: 'pending' }]);
      
      if (error) throw error;
      set({ isLoading: false });
      await get().fetchMyViewings();
    } catch (error) {
      console.error('Error scheduling viewing:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  cancelViewing: async (viewingId) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('viewings')
        .update({ status: 'cancelled' })
        .eq('id', viewingId);
      
      if (error) throw error;
      set({ isLoading: false });
      await get().fetchMyViewings();
    } catch (error) {
      console.error('Error cancelling viewing:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  confirmViewing: async (viewingId) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('viewings')
        .update({ status: 'confirmed' })
        .eq('id', viewingId);
      
      if (error) throw error;
      set({ isLoading: false });
      await get().fetchMyViewings();
    } catch (error) {
      console.error('Error confirming viewing:', error);
      set({ isLoading: false });
      throw error;
    }
  },
}));
