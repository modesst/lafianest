// src/utils/supabase.ts
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL || Constants.expoConfig?.extra?.supabaseUrl || '').trim();
const supabaseAnonKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || Constants.expoConfig?.extra?.supabaseAnonKey || '').trim();

console.log('Supabase CLIENT_INIT:', {
  urlLength: supabaseUrl.length,
  keyLength: supabaseAnonKey.length,
  urlStart: supabaseUrl.substring(0, 15),
  keyStart: supabaseAnonKey.substring(0, 15)
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase: Missing environment variables! Check your .env file or app.config.js');
}

// Custom storage implementation using Expo SecureStore for better security
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
