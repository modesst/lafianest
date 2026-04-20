// src/store/filterStore.ts
import { create } from 'zustand';
import { UniversityKey } from '../constants/universities';

interface FilterState {
  activeUniversity: UniversityKey;       // user's active campus for distance calc
  universityTags: UniversityKey[];       // which universities to filter listings by
  propertyType: string | null;
  maxRent: number | null;
  verifiedOnly: boolean;
  flexibleLease: boolean;
  moveInReady: boolean;
  noPledgeOnly: boolean;
  maxDistanceKm: number | null;
  setFilter: (key: keyof Omit<FilterState, 'setFilter' | 'setActiveUniversity' | 'resetFilters'>, value: any) => void;
  setActiveUniversity: (key: UniversityKey) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  activeUniversity: 'fulafia',
  universityTags: [],
  propertyType: null,
  maxRent: null,
  verifiedOnly: false,
  flexibleLease: false,
  moveInReady: false,
  noPledgeOnly: false,
  maxDistanceKm: null,

  setFilter: (key, value) => set((state) => ({ ...state, [key]: value })),
  
  setActiveUniversity: (key: UniversityKey) => set({ activeUniversity: key }),
  
  resetFilters: () => set({
    universityTags: [],
    propertyType: null,
    maxRent: null,
    verifiedOnly: false,
    flexibleLease: false,
    moveInReady: false,
    noPledgeOnly: false,
    maxDistanceKm: null,
  }),
}));
