// src/store/authStore.ts
import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import { Session } from '@supabase/supabase-js';
import { Profile } from '../types';

interface AuthState {
  user: Profile | null;
  session: Session | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmailOtp: (email: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, data: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,

  initialize: async () => {
    console.log('AuthStore: Starting initialization');
    set({ isLoading: true });
    try {
      // Get initial session
      console.log('AuthStore: Calling getSession');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('AuthStore: getSession error:', sessionError);
      }
      console.log('AuthStore: session retrieved:', !!session);
      set({ session });
      
      if (session?.user) {
        console.log('AuthStore: Fetching profile for user:', session.user.id);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profileError) {
          console.error('AuthStore: profile fetch error:', profileError);
        }
        if (profile) {
          console.log('AuthStore: Profile found');
          set({ user: profile });
        }
      }
    } catch (error) {
      console.error('AuthStore: Auth initialization error:', error);
    } finally {
      console.log('AuthStore: Initialization complete');
      set({ isLoading: false });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session });
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) set({ user: profile });
        else set({ user: null });
      } else {
        set({ user: null });
      }
    });
  },

  signInWithPhone: async (phone: string) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signInWithOtp({ phone });
    set({ isLoading: false });
    if (error) throw error;
  },

  verifyOTP: async (phone: string, token: string) => {
    set({ isLoading: true });
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    set({ isLoading: false });
    if (error) throw error;
    set({ session: data.session });
  },

  signInWithEmail: async (email: string, pass: string) => {
    console.log('AuthStore: signInWithEmail start:', email);
    // Dynamic access to verify client internal state
    const client: any = supabase;
    console.log('AuthStore: Client key status:', {
      url: client.supabaseUrl?.substring(0, 15),
      key: client.supabaseKey?.substring(0, 15),
      keyLen: client.supabaseKey?.length,
    });

    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) {
        console.error('AuthStore: signIn error detail:', error);
        throw error;
      }
      set({ session: data.session });
    } catch (err) {
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  signInWithEmailOtp: async (email: string) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: {
        emailRedirectTo: 'lafianest://login-callback',
      }
    });
    set({ isLoading: false });
    if (error) throw error;
  },

  signUpWithEmail: async (email: string, pass: string, metadata: Partial<Profile>) => {
    console.log('AuthStore: signUpWithEmail start:', email);
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: metadata,
        },
      });
      if (error) {
        console.error('AuthStore: signUp error detail:', error);
        throw error;
      }
      set({ session: data.session });
    } catch (err) {
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { session } = get();
    if (!session?.user) return;

    set({ isLoading: true });
    
    // Use upsert to handle cases where the profile record might not exist yet
    // (e.g., right after email signup if there's no DB trigger)
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        phone: session.user.phone || '', // Supabase Auth phone if available
        ...updates,
        updated_at: new Date().toISOString(),
      });
    
    if (error) {
      set({ isLoading: false });
      throw error;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    set({ user: profile, isLoading: false });
  },
}));
