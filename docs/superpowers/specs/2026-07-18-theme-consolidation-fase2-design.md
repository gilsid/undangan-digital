# Fase 2: Theme Section Consolidation

**Date:** 2026-07-18
**Goal:** Reduce 48 theme-specific section files to ~25 unified files while preserving exact visual output per theme.

## Constraint: Zero Visual Change

Each theme's unique appearance MUST be preserved identically. No CSS, color, font, spacing, or layout changes. Migration of hardcoded values → `useThemeConfig()` must produce identical rendered output.

Verification: `useThemeConfig()` values in each theme's config file MUST match the hardcoded values being replaced. Compare before/after.

## Theme Configs → Hardcoded Value Mapping

All themes wrap sections in `ThemeProvider` with their respective config. Merging to `useThemeConfig()` is safe if config values match hardcoded ones.

Current state: Boho/Tropical use hardcoded hex/C.* constants. Foil uses CSS custom properties (`var(--foil-gold)`) — these come from `globals.css`. Foil's config does NOT have foil-gold as a color value. CSS vars need special handling.

**Foil CSS Variables**: `var(--foil-gold) #d8b978`, `var(--foil-gold-soft) #c8a96a`, `var(--text-primary) #ede9e1`, `var(--text-muted) #736c60`. These map to `foilBlueprintConfig.colors` values:
- `colors.accent` = `#d8b978` = `var(--foil-gold)`
- `colors.text` = `#ede9e1` = `var(--text-primary)`
- Waiting for text-muted: `#736c60` = `var(--text-muted)`

**Conclusion**: CSS vars in Foil sections can be replaced with `useThemeConfig().colors.accent` etc. Same values. File `foil-blueprint.ts` values match: `accent: "#d8b978"`, `text: "#ede9e1"`.

## Merge Plan

### Tier 1: Full 4-way merge (files become single unified component)

These sections have >85% identical HTML structure across all 4 themes. Differences are purely styling/color/font + minor boolean toggles.

#### 1. QuoteSection — 4 files → 1 file

**Files**: `QuoteSection.tsx`, `BohoQuoteSection.tsx`, `FoilQuoteSection.tsx`, `TropicalQuoteSection.tsx`
**Differences**: colors, fonts, animation variant import, background color, `Section` wrapper props.
**Merge strategy**:
- Single `QuoteSection.tsx` at existing path
- All themes import from `@/components/themes/sections/QuoteSection`
- Replace hardcoded colors with `useThemeConfig().colors.*`
- Section wrapper: Elegant uses `<Section>`, Boho/Foil/Tropical use `<Section direction="up" stagger>`. Use `<Section direction="up" stagger>` universally (produces same output for Elegant as `stagger` works with single child).
- Animation: Elegant uses inline Variants, others use themeCommon hooks. Standardize to shared `childVariant` from useThemeCommon.
- Background: Elegant uses `config.colors.bg`, others hardcode. Migrate to `config.colors.bg`.
- Divider color: use `config.colors.accent`.

#### 2. CountdownSection — 4 files → 1 file

**Files**: `CountdownSection.tsx`, `BohoCountdownSection.tsx`, `FoilCountdownSection.tsx`, `TropicalCountdownSection.tsx`
**Differences**: Elegant has 3 layout variants (others use card-grid only). BlueprintCard wrapper (Foil). Color/font differences.
**Merge strategy**:
- Keep Elegant's 3-layout system as-is (already config-driven)
- Boho/Foil/Tropical layouts map to `config.layout.countdown` = `card-grid`
- Foil's BlueprintCard: add `useBlueprintCard` boolean check in config or via `themeConfig.id === "foil-blueprint"`
- Hardcoded colors → `useThemeConfig().colors.*`
- `useCountdown` hook already shared

**Risk**: Low. Countdown is simple — 4 boxes with numbers. Foil's BlueprintCard wrapper is the only structural diff.

#### 3. LoveStorySection — 4 files → 3 files (Tropical keeps separate)

**Files**: `LoveStorySection.tsx`, `BohoLoveStorySection.tsx`, `FoilLoveStorySection.tsx`
**Keep separate**: `TropicalLoveStorySection.tsx`
**Differences (merged 3)**: colors, fonts, animation helpers. All centered layout, same heading pair "Our Story / Cerita Kita".
**Merge strategy**:
- Hardcoded colors → `useThemeConfig()`
- Animation: use shared variants
- Tropical stays separate: border-l-2 timeline layout (genuinely different DOM)

#### 4. FooterSection — 4 files → 1 file

**Files**: `FooterSection.tsx`, `BohoFooterSection.tsx`, `FoilFooterSection.tsx`, `TropicalFooterSection.tsx`
**Differences**: Divider position (before vs after names), colors, animation pattern, Elegant's isMinimalist check.
**Merge strategy**:
- Add `dividerFirst` option — Elegant = false, themes = true. Via `config.decorations.sectionDivider` or new decoration field.
- Actually simplest: Elegant's behavior is default (divider after). Boho/Foil/Tropical divider before → detect via `config.id === "boho" || config.id === "tropical" || config.id === "foil-blueprint"` or add explicit field.
- Colors → `useThemeConfig()`
- Animation → shared Section pattern universally

### Tier 2: Triad merge (3 themes share 1 file, Elegant keeps separate)

#### 5. FooterSection more carefully

Actually FooterSection from analysis: Elegant uses `isMinimalist` + manual delay-stagger. Others use `Section direction="up" stagger`. Divider position differs.

**Divider position**: Elegant: names → date → divider → thanks. Others: divider → names → date → thanks.
- Config field: `decorations.dividerPosition: "after" | "before"` or just check `themeConfig.id`.

#### 6. GallerySection — 4 files → 2 files

**Files merged**: `BohoGallerySection.tsx` + `FoilGallerySection.tsx` + `TropicalGallerySection.tsx` → unified `GallerySection.tsx` (new path) handles all 3.
**Keep separate**: Elegant's `GallerySection.tsx` remains.
**Differences (triad)**: Colors only. Same masonry columns layout, lightbox, etc.
**Merge strategy**:
- Triad unified file
- Colors → `useThemeConfig()`
- BlueprintCard wrapper for Foil

#### 7. GiftSection — 4 files → 2 files

**Files merged**: `BohoGiftSection.tsx` + `FoilGiftSection.tsx` + `TropicalGiftSection.tsx` → unified `GiftSection.tsx` handles all 3.
**Keep separate**: Elegant's `GiftSection.tsx` remains (different DOM: no section header, different copy button layout).
**Differences (triad)**: Colors, BlueprintCard (Foil). Same accordion + bank account pattern.
**Merge strategy**:
- Triad unified file
- Colors → `useThemeConfig()`
- BlueprintCard conditional

#### 8. RSVPSection — 4 files → 1 file

**Files**: `RSVPSection.tsx`, `BohoRSVPSection.tsx`, `FoilRSVPSection.tsx`, `TropicalRSVPSection.tsx`
**Differences**: Card wrapper type (BlueprintCard vs div vs none), animation model (fieldDelay vs stagger), label spelling ("Ragu" vs "Ragu-ragu"), color source.
**Merge strategy**:
- Single unified file at `RSVPSection.tsx`
- Card wrapper: `isFoil ? BlueprintCard : regular div`
- Animation: Elegant's fieldDelay pattern vs themes' stagger. Use Elegant's `Section` wrapper combined with animation mode toggle.
- Label: "Ragu-ragu" for Boho, "Ragu" for Elegant/Tropical. Use config value or theme check.
- Colors → `useThemeConfig()`
- All use `useRsvp` hook already

**Risk**: Medium. Animation model difference is the trickiest — Elegant wraps each field individually with motion divs + `fieldDelay` object. Need to support both modes.

### Tier 3: Keep separate (no merge)

- `CoverSection` — each theme has unique SVGs + decoration
- `CoupleSection` — image shape, card style, name format all fundamentally differ
- `EventSection` — different heading strings, card grid layout, text alignment
- `HeroSection` — unique overlay elements (grid, dots, gradient), font treatment
- `TropicalLoveStorySection` — timeline layout

These stay as theme-prefixed files.

## File Structure After Fase 2

```
sections/
  QuoteSection.tsx          ← unified (was 4 files)
  CountdownSection.tsx      ← unified (was 4 files)
  LoveStorySection.tsx      ← unified (was 3 files: Elegant/Boho/Foil)
  FooterSection.tsx         ← unified (was 4 files)
  RSVPSection.tsx           ← unified (was 4 files)
  GallerySection.tsx        ← unified (triad: Boho/Foil/Tropical) — handles all 3 via useThemeConfig()
  GiftSection.tsx           ← unified (triad: Boho/Foil/Tropical) — handles all 3 via useThemeConfig()
  CoverSection.tsx          ← Elegant only (unchanged)
  CoupleSection.tsx         ← Elegant only (unchanged)
  EventSection.tsx          ← Elegant only (unchanged)
  HeroSection.tsx           ← Elegant only (unchanged)
  BohoCoverSection.tsx      ← unchanged
  BohoCoupleSection.tsx     ← unchanged
  BohoEventSection.tsx      ← unchanged
  BohoHeroSection.tsx       ← unchanged
  FoilCoverSection.tsx      ← unchanged
  FoilCoupleSection.tsx     ← unchanged
  FoilEventSection.tsx      ← unchanged
  FoilHeroSection.tsx       ← unchanged
  TropicalCoverSection.tsx  ← unchanged
  TropicalCoupleSection.tsx ← unchanged
  TropicalEventSection.tsx  ← unchanged
  TropicalHeroSection.tsx   ← unchanged
  TropicalLoveStorySection.tsx ← unchanged (timeline layout)
  BohoWishesSection.tsx     ← unchanged (already updated Fase 1)
  FoilWishesSection.tsx     ← unchanged
  TropicalWishesSection.tsx ← unchanged
  WishesSection.tsx         ← unchanged
  BohoRSVPSection.tsx       ← will be deleted after RSVPSection merge
  FoilRSVPSection.tsx       ← will be deleted after RSVPSection merge
  TropicalRSVPSection.tsx   ← will be deleted after RSVPSection merge
  BohoQuoteSection.tsx      ← will be deleted after QuoteSection merge
  FoilQuoteSection.tsx      ← will be deleted after QuoteSection merge
  TropicalQuoteSection.tsx  ← will be deleted after QuoteSection merge
  BohoCountdownSection.tsx  ← will be deleted after CountdownSection merge
  FoilCountdownSection.tsx  ← will be deleted after CountdownSection merge
  TropicalCountdownSection.tsx ← will be deleted after CountdownSection merge
  BohoLoveStorySection.tsx  ← will be deleted after LoveStorySection merge
  FoilLoveStorySection.tsx  ← will be deleted after LoveStorySection merge
  BohoFooterSection.tsx     ← will be deleted after FooterSection merge
  FoilFooterSection.tsx     ← will be deleted after FooterSection merge
  TropicalFooterSection.tsx ← will be deleted after FooterSection merge
  BohoGallerySection.tsx    ← will be deleted after GallerySection merge
  FoilGallerySection.tsx    ← will be deleted after GallerySection merge
  TropicalGallerySection.tsx ← will be deleted after GallerySection merge
  BohoGiftSection.tsx       ← will be deleted after GiftSection merge
  FoilGiftSection.tsx       ← will be deleted after GiftSection merge
  TropicalGiftSection.tsx   ← will be deleted after GiftSection merge
```

Total before: 48 files. Total after: 28 files (17 unified/unchanged + 11 separate Boho/Foil/Tropical). Files deleted: 20.

### Deleted Files (20)

```
BohoQuoteSection.tsx, FoilQuoteSection.tsx, TropicalQuoteSection.tsx
BohoCountdownSection.tsx, FoilCountdownSection.tsx, TropicalCountdownSection.tsx
BohoLoveStorySection.tsx, FoilLoveStorySection.tsx
BohoFooterSection.tsx, FoilFooterSection.tsx, TropicalFooterSection.tsx
BohoRSVPSection.tsx, FoilRSVPSection.tsx, TropicalRSVPSection.tsx
BohoGallerySection.tsx, FoilGallerySection.tsx, TropicalGallerySection.tsx
BohoGiftSection.tsx, FoilGiftSection.tsx, TropicalGiftSection.tsx
```

## Theme Entry Files Changes

- `Boho.tsx`: change imports from `BohoQuoteSection` → `QuoteSection`, `BohoCountdownSection` → `CountdownSection`, etc.
- `FoilBlueprint.tsx`: same — switch to unified section imports
- `Tropical.tsx`: same — switch to unified section imports (except LoveStory)
- `Elegant.tsx`: unchanged (already imports base sections)

## Files to Delete After Migration (20 files)

All verified during implementation. FoilGallerySection/GiftSection use BlueprintCard wrapper — conditionalized via `config.id === "foil-blueprint"`.

## Risk Mitigation

For every merge:
1. **Color mapping**: config file value MUST equal hardcoded value being replaced. If not, keep hardcoded.
2. **CSS var mapping**: `var(--foil-gold)` → `config.colors.accent`. Verify value match.
3. **Build check**: `pnpm build` after each batch
4. **Visual check**: dev server + screenshot comparison or manual load

## Order of Execution

1. QuoteSection (easiest, lowest risk — verify pattern works)
2. CountdownSection (BlueprintCard pattern)
3. LoveStorySection + FooterSection (parallel)
4. RSVPSection (hardest — different animation model)
5. GallerySection + GiftSection (triad merge, parallel)
6. Theme entry files updates + cleanup
7. Final build + verification
