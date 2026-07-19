export interface ThemeColors {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  accentMuted: string;
  secondary: string;
  border: string;
  dark: string;
}

export interface ThemeFonts {
  display: string;
  body: string;
  mono?: string;
}

export type CoverLayout = 'centered' | 'card-centered' | 'framed';
export type HeroLayout = 'centered-divider' | 'backdrop-card' | 'editorial-three-row';
export type CoupleLayout = 'circular-gold' | 'circular-white-shadow' | 'square-grayscale';
export type EventLayout = 'rounded-cards' | 'translucent-cards' | 'text-forward-grid';
export type CountdownLayout = 'vertical-stack' | 'card-grid' | 'line-separated';
export type GalleryLayout = 'rounded-grid' | 'rounded-shadow-grid' | 'grayscale-grid' | 'masonry-columns';

export interface ThemeLayouts {
  cover: CoverLayout;
  hero: HeroLayout;
  couple: CoupleLayout;
  event: EventLayout;
  countdown: CountdownLayout;
  gallery: GalleryLayout;
}

export interface ThemeDecorations {
  sectionDivider: 'gold-line' | 'terracotta-line' | 'hairline';
  cardStyle: 'rounded-lg' | 'rounded-2xl' | 'border-only';
  buttonStyle: 'outline-gold' | 'solid-terracotta' | 'solid-black';
  showDecorative: boolean;
}

export interface ThemeConfig {
  id: string;
  name: string;
  fonts: ThemeFonts;
  colors: ThemeColors;
  layout: ThemeLayouts;
  decorations: ThemeDecorations;
}
