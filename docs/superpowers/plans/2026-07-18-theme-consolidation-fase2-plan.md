# Fase 2: Theme Section Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Merge 48 theme section files → 28 files. Zero visual change.

**Architecture:** Each section type becomes 1 unified file. Per-theme color + animation config extracted into mapping functions keyed by `config.id`. Themes that differ structurally (Elegant's multi-layout vs others) use conditionals on `config.id` or `config.layout.*`.

**Critical insight:** Each theme maps the same HTML element to DIFFERENT config color slots. E.g., quote text is `colors.textMuted` in Elegant but `colors.text` in Boho. Blind `useThemeConfig()` breaks output. Solution: `getXxxColors(colors, id)` mapping function per section.

## Global Constraints

- Zero visual change — config-derived values MUST produce identical output to hardcoded originals
- Foil CSS vars (`var(--foil-gold)` etc.) → config values. Verify each.
- BlueprintCard wrapper: `config.id === "foil-blueprint"`
- Build must pass after each section: `pnpm build`
- No deleted files until all entry files updated

## Execution Order (5 subagent batches)

| Batch | Sections | Files → | Complexity |
|-------|----------|---------|------------|
| 1 | QuoteSection, CountdownSection | 8 → 2 | Low |
| 2 | LoveStorySection, FooterSection | 7 → 2 | Low |
| 3 | RSVPSection | 4 → 1 | Medium |
| 4 | GallerySection, GiftSection | 8 → 2 | Medium |
| 5 | Theme entry + delete 20 files, build | — | Low |

---
### Task 1: QuoteSection — 4-way merge

**Files:** Modify `components/themes/sections/QuoteSection.tsx`

**Pattern:** All 4 themes share identical HTML skeleton (divider → quote → source → divider). Differences:
- Color mapping (each theme uses different config slots)
- Font size (Boho uses `text-xl md:text-2xl`, others `text-lg`)
- Animation params (fade vs spring, duration, ease)
- Wrapper: Elegant uses `<Section>`, others use `<section>` + `<Section direction="up" stagger>`

**Implementation:**

```typescript
function useQuoteColors(colors: ThemeColors, id: string) {
  switch (id) {
    case "elegant": return { divider: `${colors.accent}30`, quote: colors.textMuted, source: colors.secondary };
    case "boho": return { divider: `${colors.accent}4d`, quote: colors.text, source: `${colors.accent}cc` };
    case "foil-blueprint": return { divider: `${colors.accent}4d`, quote: colors.secondary, source: `${colors.accent}b3` };
    case "tropical": return { divider: colors.textMuted, quote: colors.text, source: colors.accent };
    default: return { divider: `${colors.accent}30`, quote: colors.textMuted, source: colors.secondary };
  }
}
```

**Font class mapping:** Elegant/Tropical use `text-lg`, Boho uses `text-xl md:text-2xl`, Foil uses `text-xl md:text-2xl`. Map via config.id.

- [ ] **Step 1: Verify config values match hardcoded**

Check: `grep` for each hardcoded color in `BohoQuoteSection.tsx`, `FoilQuoteSection.tsx`, `TropicalQuoteSection.tsx` and compare with config files in `components/themes/config/`.

- [ ] **Step 2: Rewrite QuoteSection.tsx** as unified with per-theme color mapping + font mapping + animation params

- [ ] **Step 3: Build check**

Run: `pnpm build`
Expected: 0 errors, 0 warnings

- [ ] **Step 4: Commit**

```bash
git add components/themes/sections/QuoteSection.tsx
git commit -m "refactor: unify QuoteSection across all 4 themes"
```

---
### Task 2: CountdownSection — 4-way merge

**Files:** Modify `components/themes/sections/CountdownSection.tsx`

**Differences:**
- Elegant: 3 layout variants (vertical-stack, card-grid, line-separated), config-driven, `CountdownItem` sub-component
- Boho/Foil/Tropical: only card-grid layout, shared `useCountdown` hook, Section direction="up" stagger
- Foil: BlueprintCard wrapper
- Colors/fonts per theme

**Strategy:** Elegant's multi-layout stays (already config-driven). Themes all map to card-grid. BlueprintCard conditional via `config.id === "foil-blueprint"`. Color mapping function pattern from Task 1.

- [ ] **Step 1: Read all 4 source files** to extract color/animation differences

- [ ] **Step 2: Rewrite CountdownSection.tsx** with unified structure + per-theme color map + BlueprintCard conditional

- [ ] **Step 3: Build check**

- [ ] **Step 4: Commit**

---
### Task 3: LoveStorySection — 3-way merge (Elegant/Boho/Foil, Tropical stays separate)

**Files:** Modify `components/themes/sections/LoveStorySection.tsx`

**Scope:** Elegant, Boho, Foil all use centered layout (label → heading → paragraph). Colors/fonts/animation differ. Tropical has left-bordered timeline layout — unchanged.

- [ ] **Step 1: Read Elegant/Boho/Foil source files**

- [ ] **Step 2: Rewrite LoveStorySection.tsx** as unified with per-theme color mapping

- [ ] **Step 3: Build check**

- [ ] **Step 4: Commit**

### Task 3b: FooterSection — 4-way merge

**Files:** Modify `components/themes/sections/FooterSection.tsx`

**Key diff:** Divider position: Elegant places divider AFTER names+date, others place BEFORE. Add `dividerFirst` logic: `["boho", "foil-blueprint", "tropical"].includes(config.id)`.

Elegant uses isMinimalist checks for bg styling. Themes all use Section direction="up" stagger.

- [ ] **Step 1: Read all 4 source files**

- [ ] **Step 2: Rewrite FooterSection.tsx** with `dividerFirst` + per-theme colors

- [ ] **Step 3: Build check**

- [ ] **Step 4: Commit**

---
### Task 5: RSVPSection — 4-way merge

**Files:** Modify `components/themes/sections/RSVPSection.tsx`

**Differences:**
- Card wrapper: none (Elegant) vs div card (Boho/Tropical) vs BlueprintCard (Foil)
- Animation: fieldDelay (Elegant) vs Section stagger (others)
- Label: "Ragu" (Elegant/Tropical) vs "Ragu-ragu" (Boho)
- Form logic is 95% identical — all use `useRsvp` hook

- [ ] **Step 1: Read all 4 source files**

- [ ] **Step 2: Rewrite RSVPSection.tsx** as unified with per-theme card wrapper, animation model, labels

- [ ] **Step 3: Build check**

- [ ] **Step 4: Commit**

---
### Task 6: GallerySection — 4-way merge

**Files:** Modify `components/themes/sections/GallerySection.tsx`

**Differences:**
- Elegant: grid layout via `config.layout.gallery` (rounded-grid, rounded-shadow-grid, grayscale-grid), useThemeConfig
- Boho/Foil/Tropical: CSS columns (masonry: `columns-2 md:columns-3`), no config.layout variant for masonry
- Foil: uses BlueprintCard per item

**Strategy:** Add `masonry-columns` to `GalleryLayout` type. Elegant stays on existing grid values. Boho/Foil/Tropical use `masonry-columns`. Unified file dispatches on gallery layout type.

- [ ] **Step 1: Update `types/theme.ts`** — add `'masonry-columns'` to `GalleryLayout`

- [ ] **Step 2: Read Boho/Foil/Tropical gallery files** for color mapping

- [ ] **Step 3: Rewrite GallerySection.tsx** — Elegant grid system unchanged, new masonry-columns handler for Boho/Foil/Tropical

- [ ] **Step 4: Update `components/themes/config/boho.ts`, `foil-blueprint.ts`, `tropical.ts`** — set `layout.gallery: "masonry-columns"`

- [ ] **Step 5: Build check**

- [ ] **Step 6: Commit**

---
### Task 7: GiftSection — 4-way merge

**Files:** Modify `components/themes/sections/GiftSection.tsx`

**Differences:**
- Elegant: no section header, vertical copy button layout, chevron via framer motion
- Boho/Foil/Tropical: "Amplop Digital" + "Kirim Kado" header, inline copy button, CSS rotate chevron
- All: accordion toggle, bank accounts list, copy to clipboard

- [ ] **Step 1: Read all 4 source files**

- [ ] **Step 2: Rewrite GiftSection.tsx** with:
  - Per-theme color mapping
  - `elegant` conditional for unique header/button layout
  - `foil-blueprint` conditional for BlueprintCard
  - Shared accordion + copy logic

- [ ] **Step 3: Build check**

- [ ] **Step 4: Commit**

---
### Task 8: Theme Entry Updates + File Deletions

**Files:**
- Modify: `components/themes/Boho.tsx`, `components/themes/FoilBlueprint.tsx`, `components/themes/Tropical.tsx`, `components/themes/Elegant.tsx`
- Delete: 20 files (see design doc)

**Updates needed:**
- `Boho.tsx`: Remove all `Boho{Section}` imports. Add imports from unified `sections/{Section}` files. Keep `BohoCoverSection`, `BohoCoupleSection`, `BohoEventSection`, `BohoHeroSection`.
- `FoilBlueprint.tsx`: Same — switch to unified imports. Keep Foil-specific cover/couple/event/hero.
- `Tropical.tsx`: Same — switch to unified imports. Keep Tropical-specific cover/couple/event/hero/lovestory.
- `Elegant.tsx`: No changes needed (already imports base sections).

- [ ] **Step 1: Update Boho.tsx** — replace theme-specific imports with unified ones

- [ ] **Step 2: Update FoilBlueprint.tsx** — same

- [ ] **Step 3: Update Tropical.tsx** — same

- [ ] **Step 4: Build check** — catch any import errors

- [ ] **Step 5: Delete 20 obsolete files** after build passes

- [ ] **Step 6: Build check again** — confirm clean

- [ ] **Step 7: Commit**

```bash
git add components/themes/Boho.tsx components/themes/FoilBlueprint.tsx components/themes/Tropical.tsx
git add -u components/themes/sections/  # track deletes
git commit -m "refactor: update theme entries, delete 20 obsolete section files"
```

---
### Task 9: Final Build + Verify

- [ ] **Step 1: Clean build**

```bash
pnpm build
```
Expected: 0 errors, 0 warnings

- [ ] **Step 2: Visual verification**

```bash
npx next start -p 3001 &
sleep 8
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/sample-undangan
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/admin/login
kill %1 2>/dev/null
```
Expected: 200 for both URLs

- [ ] **Step 3: Summary** — report total file count reduction (48 → 28)
