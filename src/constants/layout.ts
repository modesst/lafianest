// src/constants/layout.ts

export const SPACING = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, page: 20,
} as const;

export const RADIUS = {
  sm: 8, md: 14, lg: 20, xl: 28, pill: 999,
} as const;

export const SHADOW = {
  card: {
    shadowColor: '#0F2557', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  float: {
    shadowColor: '#0F2557', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14, shadowRadius: 24, elevation: 8,
  },
  subtle: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
} as const;
