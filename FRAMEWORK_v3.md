# LafiaNest – Production Build Framework v3.0
**For: All Students in Lafia & Nasarawa State, Nigeria**
**Stack:** React Native + Expo + TypeScript + Supabase + NativeWind + Zustand
**Version:** 3.0 | April 2026
**Agent Rule:** You are the official LafiaNest coding agent. Always start your response with the full file path. Always generate the COMPLETE file — no placeholders, no TODOs, no skeleton code, no partial implementations.

---

## 0. Agent Mindset — Read This First

LafiaNest is NOT a generic housing app. It solves a real, urgent pain for students across Nasarawa State: **rent scams, unsafe landlords, zero transparency, and zero tools for roommate-finding.** This app serves students from multiple universities — FULAFIA, NSUK Keffi, NSUK Lafia Campus, College of Agriculture Lafia, and all other tertiary institutions in Nasarawa State.

**The #1 enemy:** Generic AI UI — flat cards, Inter font, purple gradients, boring list layouts.
**The goal:** When any student opens LafiaNest, they should feel like it was built *specifically for them* — by someone who understands their daily housing struggle.

Think: **Zillow meets a premium Nigerian fintech app** — clean, trustworthy, warm, and fast.

---

## 1. University Registry — The Foundation of Multi-Campus Support

Every feature in this app is campus-aware. This registry is the single source of truth.

```ts
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
```

---

## 2. Design System — Lock These In Forever

### 2.1 Color Tokens

```ts
// src/constants/colors.ts
export const COLORS = {
  // Primary palette
  navy:            '#0F2557',
  navyLight:       '#1E3A8A',
  terracotta:      '#C27B52',
  terracottaLight: '#F0C9A8',

  // Functional
  teal:         '#0D9488',
  tealLight:    '#CCFBF1',
  gold:         '#B45309',
  goldLight:    '#FEF3C7',
  error:        '#DC2626',
  errorLight:   '#FEE2E2',
  warning:      '#D97706',
  warningLight: '#FEF3C7',

  // Neutral scale
  bg:       '#F7F3EE',
  bgDeep:   '#EDE8E2',
  card:     '#FFFFFF',
  border:   '#E5DED5',
  overlay:  'rgba(15, 37, 87, 0.55)',

  // Text scale
  ink:      '#131922',
  inkMid:   '#374151',
  inkLight: '#6B7280',
  inkFaint: '#9CA3AF',

  white:    '#FFFFFF',
} as const;
```

### 2.2 Typography System

```ts
// src/constants/typography.ts
// Fonts: @expo-google-fonts/cormorant-garamond + @expo-google-fonts/dm-sans

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
```

### 2.3 Spacing & Shape System

```ts
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
```

---

## 3. Component Library — Build in This Order

### 3.1 `<PriceTag />`
```
Layout: [₦] [Amount — DMSans Bold 20px] [/month — inkLight 13px]
Always use formatRent() — never raw numbers.
Example: ₦45,000/month
```

### 3.2 `<DistanceBadge />`
```
Props: lat, lng, universityKey (from user's active campus in filterStore)
Design: Pill — tealLight bg, teal text, map-pin icon left
States:
  - "Walking distance" if < 0.5km
  - "1.2 km to FULAFIA" if >= 0.5km — always include university shortname
  - Shimmer skeleton while calculating
```

### 3.3 `<UniversityTag />`
```
NEW — Small pill per university a listing is close to.
Design: navy bg, white text, graduation-cap icon, 11px DMSans 500
Examples: "FULAFIA" | "NSUK Keffi" | "COA Lafia"
Show on PropertyCard bottom-right image overlay.
Show all tags (can be multiple) on PropertyDetailScreen.
```

### 3.4 `<VerifiedBadge />`
```
Design: Pill — shield-check icon + "Verified"
Colors: teal icon, tealLight bg, teal text
Position: Card image bottom-left overlay OR inline in detail header
```

### 3.5 `<LandlordTrustScore />`
```
NEW — The single most important trust signal in the app.

Visual: Circular SVG progress ring (react-native-svg)
  Ring color by score:
    0–40  → COLORS.error (red)
    41–70 → COLORS.gold (amber)
    71–100 → COLORS.teal (green)
  Center: score number in FONTS.displayBold + "/100" in bodySmall inkLight
  Below ring: "Trust Score" label (uppercase 12px)

Sub-states:
  score < 40: "⚠️ Proceed with caution" warning text below ring
  score >= 71: "Highly Trusted ✓" teal text beside ring
  loading: grey shimmer ring

Ring animation: stroke-dashoffset from 0 → final value, 600ms ease-out on mount.

Position: Landlord profile header + PropertyDetailScreen landlord section.
```

### 3.6 `<PropertyCard />`
```
[IMAGE AREA — 200px]
  Full bleed photo, rounded top 14px
  Bottom gradient: transparent → rgba(0,0,0,0.45)
  VerifiedBadge — bottom-left
  UniversityTag — bottom-right
  Heart/Save — top-right (32px circle, white 70% opacity)
  DistanceBadge — top-left

[CARD BODY — white, 14px padding]
  Row: PriceTag + RoomType pill
  Title: h3, 2 lines max, ellipsis
  Location: map-pin terracotta 12px + address bodySmall
  Bottom row: [beds · baths icons] spacer [FlexibleLease pill if lease_type='semester']

Width: 100% vertical | 72% horizontal scroll
Corners: 14px | Shadow: SHADOW.card | Press: spring scale 0.97 + SHADOW.float
```

### 3.7 `<SectionHeader />`
```
Row: [LABEL uppercase 12px inkLight] spacer [See all → terracotta 13px DMSans 500]
Bottom border: 1px COLORS.border | Margin bottom: 12px
```

### 3.8 `<FilterChip />`
```
Active: navy bg, white text, SHADOW.subtle
Inactive: bgDeep bg, inkMid text, border 1px COLORS.border
Shape: pill | Padding: 8px 16px | Font: 13px DMSans 500
Animation: spring scale + bg color interpolation on press
```

### 3.9 `<SafeMessageButton />`
```
Full width, COLORS.terracotta bg
Icon: message-circle white 18px left
Text: "Message Landlord" — DMSans 600 15px white
Sub-text below: "📱 Phone shared only on mutual consent" — bodySmall inkLight
RULE: NEVER display landlord phone number anywhere in the UI.
Phone is only revealed after both parties explicitly consent inside the chat screen.
```

### 3.10 `<ScamReportButton />`
```
Ghost button — error border, error text, flag icon left
Text: "Report Suspicious Listing"
Press state: errorLight bg fill
Position: Last item in PropertyDetailScreen before safe area inset
```

### 3.11 `<RentHistoryTimeline />`
```
Vertical timeline — each row:
  [Year — DMSans Bold inkLight] — [₦Amount — navy] [Δ: ↑ error / ↓ teal / — inkFaint]
  Sub-text if changed: "+₦5,000 from previous year"
Connector: 1px dashed COLORS.border
Header: "Rent History" + ℹ️ icon with tooltip: "Shows how rent has changed each year"
```

### 3.12 `<MoveInChecklist />`
```
NEW — Reduces showing-up-to-disappointment for students.

2-column grid of 8 items:
  Roof condition | Water supply | Electricity stable | Toilet functional
  Property painted | Gate functional | Generator available | Borehole/tank

Checked: teal checkmark icon + ink text
Unchecked: inkFaint icon + strikethrough text
Footer: "Last confirmed: [date]" — bodySmall inkLight
Banner (if all 8 checked): teal bg "Move-In Ready ✓" across top of component
Placeholder (if not completed): grey "Landlord has not completed this checklist yet"
```

### 3.13 `<AffordabilityMeter />`
```
NEW — Financial clarity for students.

Props: rentAmount, paymentFrequency, monthlyBudget (from profile/filterStore)

Visual: horizontal segmented bar (full width)
  Green zone (0–40%): "Comfortable"
  Orange zone (40–60%): "Stretching"
  Red zone (60%+): "Too High"
  Marker dot: positioned on bar at user's calculated percentage

Below bar:
  "₦45,000/yr ≈ ₦3,750/mo · 38% of your ₦10,000 budget"
  
If no budget set:
  "Set your budget to see affordability"
  Inline input to set budget — saves to profile via authStore
```

### 3.14 `<ViewingScheduler />`
```
NEW — Safe viewing workflow. Two-step bottom sheet.

Step 1 — Pick time:
  Calendar (next 14 days, no past dates)
  Available time slots (set by landlord in their profile)
  "Add a friend to notify" — optional name + phone field

Step 2 — Safety brief (terracottaLight bg card):
  "⚠️ Before you go:"
  • Tell someone where you're going
  • Bring a friend if possible
  • Go during daylight hours
  • Do NOT pay any money at the viewing
  [✓ I understand — Confirm Viewing] navy button

On confirm:
  Both parties get in-app notification
  If student has emergency contact + notify toggle ON → SMS sent to contact
  Viewing added to viewingStore
```

### 3.15 `<RoommateCard />`
```
NEW — Card for Roommate Board feed.

Layout:
  [48px avatar circle — initials fallback if no photo]
  [UniversityTag badge]
  Name (first name only for privacy) + "Level: 300L"
  Budget: ₦XX,000/month in PriceTag style
  Lifestyle tags: pill row — "Female" | "Non-smoker" | "Quiet" | "Early riser" etc
  [Message] ghost terracotta button right-aligned
  "Posted 2 days ago" — bodySmall inkLight, bottom-right
  
Privacy rule: Full name hidden until both users agree to connect via messaging.
```

### 3.16 `<NeighborhoodScore />`
```
NEW — Community-powered area rating.

5 category rows:
  🔒 Safety | 💡 Electricity | 💧 Water | 🔊 Noise | 🛒 Market Access
  Each row: icon + label + 5-star mini row (filled = teal, empty = bgDeep)

Overall: Large score (e.g. "4.2") in FONTS.displayBold + "/5" bodySmall
Source line: "Based on X student reviews" — bodySmall inkLight
CTA: "Rate this area →" terracotta link → opens anonymous review sheet

Map heatmap version (MapScreen use):
  Translucent circle overlay (40px radius)
  Green (>= 4.0) | Yellow (3.0–3.9) | Orange (< 3.0)
  Tap → opens NeighborhoodScore bottom sheet for that area
```

### 3.17 `<CommunityPost />`
```
NEW — Community Board post card.

Layout:
  [UniversityTag] [time ago — bodySmall inkLight]
  Post text (3 lines max, "Read more" terracotta expand)
  Tag pill: "Room Available" | "Splitting Costs" | "⚠️ Scam Alert" | "Looking for Room"
  Bottom row: [Reply count ghost button] spacer [Report flag — ghost small inkLight]

Scam Alert variant:
  errorLight bg tint
  "⚠️ Scam Alert" in error bold at top
  Scam details (landlord name, area) in bodySmall
  "Under review" badge if not yet moderated
```

### 3.18 `<SkeletonCard />`
```
Shimmer placeholder matching PropertyCard exact layout and dimensions.
Animated + LinearGradient: bgDeep → white → bgDeep, 1200ms infinite loop, left → right.
Use this everywhere — NEVER use ActivityIndicator for list loading.
```

### 3.19 `<EmptyState />`
```
Props: emoji (string), heading, subtext, ctaLabel, onCta
Layout: vertically centered — emoji (56px) → h2 heading → body subtext → CTA button
Examples:
  No listings: 🏠 "No homes found" / "Try adjusting your filters" / "Clear Filters"
  No roommates: 👥 "No posts yet" / "Be the first to post" / "Post Now"
  No messages: 💬 "No messages yet" / "Find a home and reach out" / "Browse Listings"
```

---

## 4. Screen Specifications

### Screen 1: `AuthScreen.tsx`
**Path:** `src/screens/AuthScreen.tsx`

```
BACKGROUND: Full bleed campus photo + rgba(0,0,0,0.55) overlay + grain texture

TOP 40% — Hero:
  LafiaNest logomark SVG 48px
  "LafiaNest" — Cormorant Garamond Bold 36px white
  "Safe Homes. Every Campus. Nasarawa." — DMSans 400 15px white 80%

BOTTOM 60% — Sliding white card (28px top corners, SHADOW.float):
  Heading: "Let's get started" — h2

  Phone input:
    🇳🇬 +234 prefix | 10-digit field
    Border: 1.5px COLORS.border | Focused: COLORS.navy | Radius: 12px | Height: 54px

  OTP input (after phone submit):
    6 boxes — 48x54px, 8px gap
    Active box: navy border + terracotta caret
    Filled box: navyLight bg, white text

  University selector (after OTP):
    "Which university are you from?" — h3
    Horizontal scrollable row of university pills
    Selected: navy bg white text | Unselected: bgDeep bg

  Role selector (after university):
    3 horizontal cards — 🎓 Student | 🏠 Landlord | 🤝 Agent
    Selected: navy bg white | Unselected: bgDeep bg

  CTA: Full width navy "Continue" — DMSans 600 15px white

Animations:
  Card: translateY +40px → 0 on mount, spring physics
  OTP boxes: staggered fade-in 50ms delay each
  Selection cards: spring scale on tap
```

---

### Screen 2: `StudentHomeScreen.tsx`
**Path:** `src/screens/StudentHomeScreen.tsx`

```
STICKY HEADER (white, SHADOW.subtle):
  Row: [LafiaNest logo 24px] spacer [Bell icon] [Avatar circle 36px]
  Sub-row: [🗺 terracotta] "[City] — [University shortname]" inkLight 13px
  Tap sub-row → UniversitySwitcher bottom sheet

UNIVERSITY SWITCHER SHEET:
  "Viewing listings near:" — h3
  List of all UNIVERSITIES — tap to change active campus
  Switches filterStore.activeUniversity (session-scoped)

SEARCH BAR (16px margin, 12px top):
  Height: 52px | Radius: 14px | bgDeep bg | 1px COLORS.border
  Left: search icon inkLight
  Placeholder: "Search area, price, type…"
  Right: filter icon (navy 32px circle) → opens FilterSheet

FILTER SHEET (full-height bottom sheet):
  University filter: multi-select university chips
  Property type: Self-contain | Room | Flat | Duplex
  Max rent: slider ₦10,000 → ₦200,000
  Distance to campus: ≤0.5km | ≤1km | ≤2km | Any
  Toggles: Verified only | Flexible lease | Move-in ready | No-increment pledge
  [Apply Filters] navy button | [Reset] ghost button

FILTER CHIPS ROW (horizontal ScrollView, no scrollbar):
  All | Self-contain | Room & Parlour | Flat | Under ₦30k | Verified | Near Campus | Semester Lease

SECTION: "Near [Active University]" — SectionHeader
  Horizontal FlatList PropertyCards (72% width)
  Sorted by distance to filterStore.activeUniversity ASC

SECTION: "Recently Added" — SectionHeader
  Vertical FlatList PropertyCards
  Sorted by created_at DESC

SECTION: "No-Increment Pledge Homes" — SectionHeader
  Terracotta-tinted section header + shield icon
  Horizontal scroll, no_increment_pledge = true only

SECTION: "Find a Roommate" — SectionHeader  [NEW]
  Horizontal scroll of 3 RoommateCards (preview)
  "See all →" navigates to RoommateScreen

SECTION: "Highly Trusted Landlords" — SectionHeader  [NEW]
  Horizontal scroll of landlord cards
  Each card: avatar + name + LandlordTrustScore ring + listing count
  Filter: trust_score >= 80 only

BOTTOM TAB BAR:
  Home | Map | ⊕ Add Listing (terracotta) | Saved | Profile
  Active: navy icon + 3px navy dot | Inactive: inkFaint
  Height: 72px | white bg | top shadow
```

---

### Screen 3: `MapScreen.tsx`
**Path:** `src/screens/MapScreen.tsx`

```
FULL SCREEN MapView (react-native-maps):
  Custom muted map style JSON

  PINS:
    University pins: large navy shield marker + shortName label (one per university)
    Listing pins:
      Verified: teal circle white dot
      Unverified: terracotta circle
      Selected: enlarged + SHADOW.float
      Cluster: navy circle + count number

  NEIGHBORHOOD HEATMAP OVERLAY (toggle):  [NEW]
    "Scores" toggle button top-right
    ON: translucent area circles
      Green (>= 4.0) | Yellow (3.0–3.9) | Orange (< 3.0)
    Tap circle → NeighborhoodScore bottom sheet for that area

  TOP OVERLAY (floating, 16px inset):
    Back arrow | Search bar (80% width) | Heatmap toggle button

  BOTTOM SHEET (react-native-bottom-sheet):
    Handle: 4x40px pill COLORS.border
    Collapsed (80px): "[X] listings · [active filter summary]"
    Half (40%): Horizontal PropertyCard scroll, synced to marker selection
    Full (90%): Vertical list all filtered results

  Marker tap: animateToRegion → bottom sheet snaps half → tapped card scrolls into view
```

---

### Screen 4: `PropertyDetailScreen.tsx`
**Path:** `src/screens/PropertyDetailScreen.tsx`

```
PHOTO GALLERY (full bleed, 280px):
  Horizontal PagerView | dot indicators
  Top: Back + Share + Save (floating circle buttons)
  Photo count: "3/7" dark pill bottom-right
  Video play button if video_url exists

PRICE HEADER (16px padding, white):
  PriceTag (large) + VerifiedBadge
  Title: h2 ink
  Location row: map-pin + address + DistanceBadge
  UniversityTag pills (all university_tags on this listing)

INFO PILLS ROW (horizontal scroll):
  🛏 Beds | 🚿 Bath | Payment freq | FlexibleLease badge if semester

SECTION: About this Property
  Expandable (3 lines, "Read more" terracotta)

SECTION: Amenities
  3-col icon grid | Available: ink | Unavailable: inkFaint strikethrough

SECTION: Move-In Checklist  [NEW]
  MoveInChecklist component
  "Move-In Ready ✓" teal banner if all 8 checked

SECTION: Is This Affordable?  [NEW]
  AffordabilityMeter component

SECTION: Rent History
  RentHistoryTimeline component

SECTION: Neighborhood  [NEW]
  NeighborhoodScore component for listing's area
  "Rate this area" CTA if no reviews yet

SECTION: Getting There  [NEW]
  Non-interactive map preview (180px, radius 14px)
  "🎓 [distance] · 🚌 ~[commute est.] by keke"
  "Open full map" link

SECTION: About the Landlord  [NEW EXPANDED]
  Row: [48px avatar] [Name + "Landlord since YYYY"] [LandlordTrustScore ring 56px right]
  Agent license: "NIESV-XXXXX ✓" badge if is_verified agent
  Response rate: "Usually responds within 2 hours" — bodySmall inkLight

SECTION: House Rules
  Shield icon + bulleted list

SCHEDULE VIEWING BUTTON (above sticky bar):  [NEW]
  Ghost navy button full width
  "📅 Schedule a Viewing" — DMSans 600 15px navy
  Opens ViewingScheduler bottom sheet

STICKY BOTTOM BAR:
  [PriceTag compact] spacer [SafeMessageButton 60%]
  Height: 80px + safe area inset

BELOW FOLD:
  ScamReportButton full width
  Disclaimer bodySmall inkFaint centered
```

---

### Screen 5: `ListingFormScreen.tsx`
**Path:** `src/screens/ListingFormScreen.tsx`

```
STEPPER HEADER (sticky):
  5 steps: Basic Info → Media → Amenities → Terms & Pricing → Move-In Checklist
  Dots: completed navy filled | active terracotta ring | future border
  Progress bar: 4px animated terracotta fill

STEP 1 — Basic Info:
  Title input (h3 style placeholder: "e.g. Spacious Self-contain near FULAFIA")
  "Which students is this close to?" — multi-select UniversityKey chips  [NEW]
  Property type: 4-card grid (Self-contain / Room / Flat / Duplex) with icons
  Address: full text input + "Use My GPS" teal button
  GPS Picker: compact inline map for manual pin drop if needed
  Description: multiline, min 3 lines

STEP 2 — Photos & Videos:
  3-column upload grid, dashed border when empty
  First photo = cover (star icon badge overlay)
  Video: single upload, thumbnail + play overlay
  Minimum 3 photos enforced with inline error if fewer

STEP 3 — Amenities:
  2-per-row toggle chips:
  Water | Electricity | Security | Kitchen | Ensuite Bathroom | Furnished
  Parking | Generator | WiFi | Borehole | Fence | CCTV
  Active: navy bg + white + checkmark | Inactive: bgDeep bg

STEP 4 — Terms & Pricing:
  Rent: ₦ prefix + large DMSans Bold number input
  Payment terms: Yearly / 6-Monthly / Monthly (segmented control)
  Caution fee field
  Lease type toggle:  [NEW]
    "Standard Lease" vs "Semester Lease (4–6 months)"
    Semester → FlexibleLease badge on listing automatically
  No-Increment Pledge card:
    Shield icon + "I pledge no sudden rent increases" navy heading
    "Earn 3× more student inquiries with this badge" — bodySmall inkLight
    Toggle ON → teal ring + badge applied

STEP 5 — Move-In Checklist:  [NEW STEP]
  "Help students know exactly what to expect"
  8 toggle items (same as MoveInChecklist component list)
  All 8 checked → "Move-In Ready" badge auto-applied to listing
  "Skip for now" ghost link (can complete later from listing management)

STICKY BOTTOM NAV:
  "← Previous" ghost | "Next →" / "Submit Listing" navy
  Submit: spinner + "Submitting your listing…" text
```

---

### Screen 6: `RoommateScreen.tsx` *(NEW)*
**Path:** `src/screens/RoommateScreen.tsx`

```
HEADER:
  "Find a Roommate" — h1
  "Connect with students looking to split rent" — body inkLight

TAB BAR (below header):
  [Browse Posts] [My Post]
  Active: 2px navy underline | Inactive: inkFaint

BROWSE POSTS TAB:
  Filter chips: All | FULAFIA | NSUK Keffi | NSUK Lafia | COA Lafia
  Vertical FlatList of RoommateCards
  Empty: 👥 "No posts for this campus yet" + "Post Yours" CTA

MY POST TAB:
  No post: EmptyState + "Create My Post" terracotta button
  Has post: RoommateCard preview + "Edit" + "Delete" options
    "X students have messaged you about this post" counter in teal

CREATE POST SHEET (full height bottom sheet):
  University: pre-filled from profile (editable)
  Level: 100L / 200L / 300L / 400L / Postgrad / Other
  Monthly budget: ₦ input
  Preferred area: text input
  Property type: chips (Self-contain / Room / Flat)
  Lifestyle tags (multi-select):
    Female only | Non-smoker | Quiet | Social | Early riser | Night owl | Religious
  About me: max 150 chars with counter
  Post expires: "Auto-expires in 30 days" notice
  [Post to Board] navy button

SAFETY NOTICE (pinned top of Browse tab):
  warningLight bg card:
  "⚠️ Never send money to a potential roommate before meeting in person"
```

---

### Screen 7: `CommunityScreen.tsx` *(NEW)*
**Path:** `src/screens/CommunityScreen.tsx`

```
HEADER: "Community Board" — h1
"Housing tips & scam alerts from students" — body inkLight

TAB BAR:
  [All] [Room Available] [Splitting Costs] [⚠️ Scam Alerts] [Looking for Room]

POST FEED:
  Vertical list of CommunityPost cards
  Scam Alert posts: always pinned at top, errorLight bg tint
  Empty: EmptyState component

COMPOSE FAB:
  Floating terracotta circle + pencil icon, bottom-right, SHADOW.float
  Tap → Compose Sheet

COMPOSE SHEET (full height):
  Tag selector (required first step):
    Room Available | Splitting Costs | ⚠️ Scam Alert | Looking for Room | General
  University: pre-filled, editable
  Text: max 280 chars, char counter
  
  Scam Alert extra fields (shown when tag = Scam Alert):
    Landlord name (optional) | Area/street | "What happened?" | Upload photo of receipt/chat
  
  [Post to Community] navy button
  Privacy note: "Posted as your first name only"

MODERATION NOTE on all posts:
  Flag button visible on every post
  Scam alerts: "Under review by LafiaNest team" badge until moderated
```

---

### Screen 8: `ProfileScreen.tsx`
**Path:** `src/screens/ProfileScreen.tsx`

```
STUDENT PROFILE:
  Avatar circle 80px + pencil edit overlay
  Full name | UniversityTag badge | "Student" role badge
  Monthly budget: ₦ editable field — "Powers your affordability meter"  [NEW]
  Emergency contact:  [NEW]
    Name + phone fields
    Toggle: "Notify when I schedule a viewing"

  SECTIONS:
    Saved Listings (count chip + "View all" link)
    My Viewing Schedule (upcoming viewings list with status chips)  [NEW]
    My Roommate Post (link → RoommateScreen My Post tab)  [NEW]
    Notification Settings
    [Sign Out] ghost error button

LANDLORD PROFILE:
  Avatar 80px + LandlordTrustScore ring (56px, prominent)  [NEW]
  Full name + "Landlord since [year]"
  Agent license badge: "NIESV-XXXXX ✓" if verified  [NEW]
  Active listings: count + "Manage" link
  Viewing Requests: pending / confirmed / past sections  [NEW]
  [Sign Out]
```

---

## 5. Complete Supabase Schema

```sql
-- ============================================
-- CORE TABLES
-- ============================================

create table profiles (
  id                       uuid references auth.users primary key,
  phone                    text unique not null,
  full_name                text,
  avatar_url               text,
  role                     text check (role in ('student','landlord','agent')) not null,
  university               text,         -- UniversityKey
  academic_level           text,         -- '100L','200L' etc (students)
  monthly_budget           numeric,      -- for AffordabilityMeter
  emergency_contact_name   text,
  emergency_contact_phone  text,
  notify_emergency_on_viewing boolean default false,
  is_verified              boolean default false,
  agent_license            text,
  created_at               timestamptz default now()
);

create table listings (
  id                  uuid primary key default gen_random_uuid(),
  owner_id            uuid references profiles(id) on delete cascade,
  title               text not null,
  description         text,
  property_type       text check (property_type in ('self_contain','room','flat','duplex')),
  university_tags     text[] default '{}',   -- UniversityKey[]
  rent                numeric not null,
  payment_frequency   text check (payment_frequency in ('yearly','6monthly','monthly')) default 'yearly',
  lease_type          text check (lease_type in ('standard','semester')) default 'standard',
  caution_fee         numeric default 0,
  address             text not null,
  lat                 double precision not null,
  lng                 double precision not null,
  photos              text[] default '{}',
  video_url           text,
  virtual_tour_url    text,
  amenities           text[] default '{}',
  house_rules         text,
  no_increment_pledge boolean default false,
  rent_history        jsonb default '[]',    -- [{year:2023, amount:40000}]
  move_in_ready       boolean default false,
  move_in_checklist   jsonb default '{}',   -- {roof:true, water:true, ...}
  last_confirmed_at   timestamptz,
  is_verified         boolean default false,
  is_active           boolean default true,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index listings_location_idx on listings using btree (lat, lng);
create index listings_university_tags_idx on listings using gin (university_tags);

create table messages (
  id                     uuid primary key default gen_random_uuid(),
  listing_id             uuid references listings(id) on delete cascade,
  sender_id              uuid references profiles(id) on delete cascade,
  receiver_id            uuid references profiles(id) on delete cascade,
  content                text not null,
  is_read                boolean default false,
  phone_consent_sender   boolean default false,
  phone_consent_receiver boolean default false,
  created_at             timestamptz default now()
);

create table saved_listings (
  user_id    uuid references profiles(id) on delete cascade,
  listing_id uuid references listings(id) on delete cascade,
  saved_at   timestamptz default now(),
  primary key (user_id, listing_id)
);

create table scam_reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id),
  listing_id  uuid references listings(id) on delete cascade,
  reason      text not null,
  details     text,
  photo_url   text,
  created_at  timestamptz default now()
);

-- ============================================
-- NEW TABLES — v3.0
-- ============================================

create table viewings (
  id              uuid primary key default gen_random_uuid(),
  listing_id      uuid references listings(id) on delete cascade,
  student_id      uuid references profiles(id) on delete cascade,
  landlord_id     uuid references profiles(id) on delete cascade,
  scheduled_at    timestamptz not null,
  status          text check (status in ('pending','confirmed','cancelled','completed')) default 'pending',
  friend_notified boolean default false,
  friend_name     text,
  friend_phone    text,
  created_at      timestamptz default now()
);

create table roommate_posts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references profiles(id) on delete cascade,
  university      text not null,
  academic_level  text,
  monthly_budget  numeric,
  area_preference text,
  property_type   text,
  lifestyle_tags  text[] default '{}',
  bio             text,
  is_active       boolean default true,
  expires_at      timestamptz default (now() + interval '30 days'),
  created_at      timestamptz default now()
);

create table neighborhood_reviews (
  id            uuid primary key default gen_random_uuid(),
  reviewer_id   uuid references profiles(id) on delete cascade,
  area_name     text not null,
  lat           double precision,
  lng           double precision,
  safety        smallint check (safety between 1 and 5),
  electricity   smallint check (electricity between 1 and 5),
  water         smallint check (water between 1 and 5),
  noise         smallint check (noise between 1 and 5),
  market_access smallint check (market_access between 1 and 5),
  created_at    timestamptz default now(),
  unique (reviewer_id, area_name)
);

create table community_posts (
  id                  uuid primary key default gen_random_uuid(),
  author_id           uuid references profiles(id) on delete cascade,
  university          text,
  tag                 text check (tag in ('room_available','splitting_costs','scam_alert','looking_for_room','general')) not null,
  content             text not null,
  scam_landlord_name  text,
  scam_area           text,
  scam_photo_url      text,
  is_pinned           boolean default false,
  is_removed          boolean default false,
  created_at          timestamptz default now()
);

-- ============================================
-- VIEWS
-- ============================================

create or replace view landlord_trust_scores as
select
  p.id as landlord_id,
  p.full_name,
  -- Response rate (0–25)
  least(25, coalesce(
    (count(distinct m.id) filter (where m.sender_id = p.id) * 25 /
     nullif(count(distinct m.id) filter (where m.receiver_id = p.id), 0)), 0
  ))::int as response_score,
  -- No scam reports (0–20)
  greatest(0, 20 - count(distinct sr.id) * 10)::int as scam_score,
  -- Account age (0–15)
  least(15, extract(month from age(now(), p.created_at))::int)::int as age_score,
  -- Verified (0–15)
  case when p.is_verified then 15 else 0 end as verified_score,
  -- Total (rent consistency 25pts counted separately in app logic)
  (
    least(25, coalesce(
      (count(distinct m.id) filter (where m.sender_id = p.id) * 25 /
       nullif(count(distinct m.id) filter (where m.receiver_id = p.id), 0)), 0
    )) +
    greatest(0, 20 - count(distinct sr.id) * 10) +
    least(15, extract(month from age(now(), p.created_at))::int) +
    case when p.is_verified then 15 else 0 end
  )::int as trust_score
from profiles p
left join messages m on m.receiver_id = p.id or m.sender_id = p.id
left join listings l on l.owner_id = p.id
left join scam_reports sr on sr.listing_id = l.id
where p.role in ('landlord','agent')
group by p.id, p.full_name, p.is_verified, p.created_at;
```

---

## 6. Zustand Stores

```ts
// src/store/authStore.ts
interface AuthState {
  user: Profile | null;
  session: Session | null;
  isLoading: boolean;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

// src/store/filterStore.ts
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
  setFilter: (key: keyof FilterState, value: any) => void;
  setActiveUniversity: (key: UniversityKey) => void;
  resetFilters: () => void;
}

// src/store/listingsStore.ts
interface ListingsState {
  listings: Listing[];
  selectedListing: Listing | null;
  isLoading: boolean;
  fetchListings: () => Promise<void>;
  fetchNearUniversity: (universityKey: UniversityKey) => Promise<void>;
  setSelected: (id: string) => void;
}

// src/store/roommateStore.ts  [NEW]
interface RoommateState {
  posts: RoommatePost[];
  myPost: RoommatePost | null;
  isLoading: boolean;
  fetchPosts: (universityKey?: UniversityKey) => Promise<void>;
  createPost: (data: Partial<RoommatePost>) => Promise<void>;
  updateMyPost: (data: Partial<RoommatePost>) => Promise<void>;
  deleteMyPost: () => Promise<void>;
}

// src/store/communityStore.ts  [NEW]
interface CommunityState {
  posts: CommunityPost[];
  isLoading: boolean;
  activeTag: string | null;
  fetchPosts: (universityKey?: UniversityKey, tag?: string) => Promise<void>;
  createPost: (data: Partial<CommunityPost>) => Promise<void>;
  reportPost: (postId: string, reason: string) => Promise<void>;
}

// src/store/viewingStore.ts  [NEW]
interface ViewingState {
  viewings: Viewing[];
  isLoading: boolean;
  fetchMyViewings: () => Promise<void>;
  scheduleViewing: (data: Partial<Viewing>) => Promise<void>;
  cancelViewing: (viewingId: string) => Promise<void>;
  confirmViewing: (viewingId: string) => Promise<void>;
}
```

---

## 7. Utilities

```ts
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
```

---

## 8. Animation Rules — No Exceptions

Every interactive element must have an animation. No static UI.

```
Page mount:           Fade + translateY +20px → 0 | 300ms ease-out
Card press:           Spring scale 1.0 → 0.97 | stiffness 300, damping 20
Button press-in/out:  Scale 0.96 → 1.0 (Pressable + Animated)
Filter chip select:   Spring scale + background color interpolation
Bottom sheet:         react-native-bottom-sheet spring physics defaults
Image pager:          translateX interpolation
Badge mount:          Fade in, 100ms delay after parent
Trust score ring:     stroke-dashoffset 0 → final, 600ms ease-out on mount
Skeleton:             Animated LinearGradient shimmer, bgDeep→white→bgDeep, 1200ms loop
Tab switch:           Content fade 150ms
University chip:      Spring scale + color interpolation
```

**Skeleton rule:** Use for ALL list/feed loading. ActivityIndicator ONLY for OTP, image upload, form submit.

---

## 9. Anti-Pattern Rules

```
❌ fontFamily: 'Inter' or system fonts — Cormorant + DM Sans only
❌ Purple or blue gradient backgrounds
❌ Cards with only title + price — always include distance, university tags, badges
❌ Raw color strings like '#ccc' — always COLORS tokens
❌ Magic number spacing (marginTop: 10) — always SPACING constants
❌ ActivityIndicator for feed loading — always SkeletonCard
❌ Phone numbers visible before mutual consent — SAFETY CRITICAL
❌ Empty states with no illustration, heading, or CTA
❌ Distance badge without university name ("1.2 km" is wrong — "1.2 km to FULAFIA" is correct)
❌ Hardcoding FULAFIA — always use filterStore.activeUniversity
❌ Showing trust score as a plain number — always LandlordTrustScore ring component
❌ formatRent() skipped — ₦45000 is wrong, ₦45,000 is correct
❌ Raw Supabase errors shown to users — always friendly copy + retry button
❌ Listing without university_tags populated — always auto-detect on create
```

---

## 10. File Structure

```
src/
├── constants/
│   ├── colors.ts
│   ├── typography.ts
│   ├── layout.ts
│   └── universities.ts          ← NEW
├── components/
│   ├── PriceTag.tsx
│   ├── DistanceBadge.tsx
│   ├── UniversityTag.tsx        ← NEW
│   ├── VerifiedBadge.tsx
│   ├── LandlordTrustScore.tsx   ← NEW
│   ├── PropertyCard.tsx
│   ├── SectionHeader.tsx
│   ├── FilterChip.tsx
│   ├── SafeMessageButton.tsx
│   ├── ScamReportButton.tsx
│   ├── RentHistoryTimeline.tsx
│   ├── MoveInChecklist.tsx      ← NEW
│   ├── AffordabilityMeter.tsx   ← NEW
│   ├── ViewingScheduler.tsx     ← NEW
│   ├── RoommateCard.tsx         ← NEW
│   ├── NeighborhoodScore.tsx    ← NEW
│   ├── CommunityPost.tsx        ← NEW
│   ├── SkeletonCard.tsx
│   └── EmptyState.tsx
├── screens/
│   ├── AuthScreen.tsx
│   ├── StudentHomeScreen.tsx
│   ├── MapScreen.tsx
│   ├── PropertyDetailScreen.tsx
│   ├── ListingFormScreen.tsx
│   ├── RoommateScreen.tsx       ← NEW
│   ├── CommunityScreen.tsx      ← NEW
│   └── ProfileScreen.tsx
├── store/
│   ├── authStore.ts
│   ├── listingsStore.ts
│   ├── filterStore.ts
│   ├── roommateStore.ts         ← NEW
│   ├── communityStore.ts        ← NEW
│   └── viewingStore.ts          ← NEW
├── utils/
│   ├── distance.ts
│   └── supabase.ts
└── navigation/
    └── AppNavigator.tsx
```

---

## 11. Build Order — Follow Exactly

**Phase 1 — Foundation**
1. `constants/colors.ts`
2. `constants/typography.ts`
3. `constants/layout.ts`
4. `constants/universities.ts`
5. `utils/distance.ts`
6. `utils/supabase.ts`

**Phase 2 — Core Components**
7. `PriceTag.tsx`
8. `DistanceBadge.tsx`
9. `UniversityTag.tsx`
10. `VerifiedBadge.tsx`
11. `LandlordTrustScore.tsx`
12. `PropertyCard.tsx`
13. `SkeletonCard.tsx`
14. `FilterChip.tsx`
15. `SectionHeader.tsx`
16. `EmptyState.tsx`

**Phase 3 — Feature Components**
17. `SafeMessageButton.tsx`
18. `ScamReportButton.tsx`
19. `RentHistoryTimeline.tsx`
20. `MoveInChecklist.tsx`
21. `AffordabilityMeter.tsx`
22. `ViewingScheduler.tsx`
23. `RoommateCard.tsx`
24. `NeighborhoodScore.tsx`
25. `CommunityPost.tsx`

**Phase 4 — State**
26. `authStore.ts`
27. `listingsStore.ts`
28. `filterStore.ts`
29. `roommateStore.ts`
30. `communityStore.ts`
31. `viewingStore.ts`

**Phase 5 — Core Screens**
32. `AuthScreen.tsx`
33. `StudentHomeScreen.tsx`
34. `PropertyDetailScreen.tsx`
35. `MapScreen.tsx`
36. `ListingFormScreen.tsx`

**Phase 6 — New Feature Screens**
37. `RoommateScreen.tsx`
38. `CommunityScreen.tsx`
39. `ProfileScreen.tsx`

**Phase 7 — Navigation**
40. `AppNavigator.tsx`

---

## 12. Feature Completion Table

| Feature | Locked | Priority |
|---|---|---|
| Multi-university support (FULAFIA, NSUK Keffi, NSUK Lafia, COA, Other) | ✅ | Core |
| GPS distance to user's active campus | ✅ | Core |
| Verified listings badge | ✅ | Core |
| Rent history timeline | ✅ | Core |
| No-increment pledge | ✅ | Core |
| Safe in-app messaging (consent before phone reveal) | ✅ | Core/Safety |
| Scam report button | ✅ | Safety |
| Property type + price + distance filters | ✅ | Core |
| Landlord Trust Score ring (0–100) | ✅ | Trust |
| Agent license verification badge | ✅ | Trust |
| Move-In Ready checklist + badge | ✅ | Trust |
| Viewing Scheduler + pre-viewing safety brief | ✅ | Safety |
| Emergency contact notification on viewings | ✅ | Safety |
| Roommate Finder board | ✅ | Social |
| Community Board (posts + scam alerts) | ✅ | Community |
| Neighborhood Score + map heatmap | ✅ | Community |
| Affordability Meter (rent vs student budget) | ✅ | Finance |
| Flexible / Semester lease type filter + badge | ✅ | Access |
| Listing freshness indicator | ✅ | UX |
| Virtual tour video support | ✅ | UX |
| University switcher (change active campus in-session) | ✅ | UX |
| Paystack Deposit Escrow | 🔜 v4.0 | Monetization |

---

*LafiaNest v3.0 — Built for every student in Nasarawa State.*
*Not just FULAFIA. Not just women. Every student who deserves a safe, transparent, fairly-priced home.*
