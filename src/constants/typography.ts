// src/constants/typography.ts
// Fonts: @expo-google-fonts/cormorant-garamond + @expo-google-fonts/dm-sans

import { COLORS } from './colors';

export const FONTS = {
  display:     'CormorantGaramond_600SemiBold',
  displayBold: 'CormorantGaramond_700Bold',
  body:        'DMSans_400Regular',
  bodySemi:    'DMSans_500Medium',
  bodyBold:    'DMSans_700Bold',
} as const;

export const TEXT = {
  hero:       { fontFamily: FONTS.displayBold, fontSize: 36, lineHeight: 44, color: COLORS.navy },
  h1:         { fontFamily: FONTS.display,     fontSize: 28, lineHeight: 36, color: COLORS.navy },
  h2:         { fontFamily: FONTS.displayBold, fontSize: 22, lineHeight: 30, color: COLORS.ink },
  h3:         { fontFamily: FONTS.bodySemi,    fontSize: 18, lineHeight: 26, color: COLORS.ink },
  body:       { fontFamily: FONTS.body,        fontSize: 15, lineHeight: 23, color: COLORS.inkMid },
  bodySmall:  { fontFamily: FONTS.body,        fontSize: 13, lineHeight: 20, color: COLORS.inkLight },
  label:      { fontFamily: FONTS.bodySemi,    fontSize: 12, lineHeight: 16, color: COLORS.inkLight, letterSpacing: 1.2, textTransform: 'uppercase' as const },
  price:      { fontFamily: FONTS.bodyBold,    fontSize: 20, lineHeight: 26, color: COLORS.navy },
  priceLarge: { fontFamily: FONTS.displayBold, fontSize: 32, lineHeight: 38, color: COLORS.navy },
  badge:      { fontFamily: FONTS.bodySemi,    fontSize: 11, lineHeight: 14, letterSpacing: 0.5 },
} as const;
