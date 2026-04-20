// src/constants/universities.ts

export type UniversityKey =
  | 'fulafia'
  | 'nsuk_keffi'
  | 'nsuk_lafia'
  | 'coa_lafia'
  | 'other_nasarawa';

export const UNIVERSITIES: Record<UniversityKey, {
  id: UniversityKey;
  name: string;
  shortName: string;
  city: string;
  gateCoords: { lat: number; lng: number };
  color: string;
}> = {
  fulafia: {
    id: 'fulafia',
    name: 'Federal University of Lafia',
    shortName: 'FULAFIA',
    city: 'Lafia',
    gateCoords: { lat: 8.5060, lng: 8.5227 },
    color: '#0F2557',
  },
  nsuk_keffi: {
    id: 'nsuk_keffi',
    name: 'Nasarawa State University',
    shortName: 'NSUK Keffi',
    city: 'Keffi',
    gateCoords: { lat: 8.8473, lng: 7.8734 },
    color: '#065F46',
  },
  nsuk_lafia: {
    id: 'nsuk_lafia',
    name: 'NSUK Lafia Campus',
    shortName: 'NSUK Lafia',
    city: 'Lafia',
    gateCoords: { lat: 8.5020, lng: 8.5180 },
    color: '#065F46',
  },
  coa_lafia: {
    id: 'coa_lafia',
    name: 'College of Agriculture Lafia',
    shortName: 'COA Lafia',
    city: 'Lafia',
    gateCoords: { lat: 8.4950, lng: 8.5100 },
    color: '#92400E',
  },
  other_nasarawa: {
    id: 'other_nasarawa',
    name: 'Other (Nasarawa State)',
    shortName: 'Nasarawa',
    city: 'Nasarawa',
    gateCoords: { lat: 8.5400, lng: 8.5300 },
    color: '#6B7280',
  },
};

export const UNIVERSITY_LIST = Object.values(UNIVERSITIES);
