// src/utils/distance.ts

import { UNIVERSITIES, UniversityKey } from '../constants/universities';

export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getDistanceToCampus(lat: number, lng: number, universityKey: UniversityKey): number {
  const { gateCoords } = UNIVERSITIES[universityKey];
  return getDistanceKm(lat, lng, gateCoords.lat, gateCoords.lng);
}

export function getClosestUniversity(lat: number, lng: number): UniversityKey {
  let closest: UniversityKey = 'fulafia';
  let minDist = Infinity;
  for (const uni of Object.values(UNIVERSITIES)) {
    const d = getDistanceKm(lat, lng, uni.gateCoords.lat, uni.gateCoords.lng);
    if (d < minDist) { minDist = d; closest = uni.id; }
  }
  return closest;
}

export function formatDistance(km: number, universityShortName: string): string {
  if (km < 0.5) return 'Walking distance';
  if (km < 1) return `${Math.round(km * 1000)}m to ${universityShortName}`;
  return `${km.toFixed(1)} km to ${universityShortName}`;
}

export function formatRent(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export function getAffordabilityPercent(
  rent: number, frequency: string, monthlyBudget: number
): number {
  const monthly =
    frequency === 'yearly' ? rent / 12 :
    frequency === '6monthly' ? rent / 6 : rent;
  return Math.round((monthly / monthlyBudget) * 100);
}
