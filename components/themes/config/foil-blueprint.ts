import type { ThemeConfig } from "@/types/theme";

export const foilBlueprintConfig: ThemeConfig = {
  id: "foil-blueprint",
  name: "Foil Blueprint",
  fonts: {
    display: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  colors: {
    bg: "#12151c",
    surface: "#1a1e27",
    text: "#ede9e1",
    textMuted: "#736c60",
    accent: "#d8b978",
    accentMuted: "#b89a5e",
    secondary: "#a9a296",
    border: "rgba(216,185,120,0.18)",
    dark: "#0e1016",
  },
  layout: {
    cover: "centered",
    hero: "centered-divider",
    couple: "circular-gold",
    event: "rounded-cards",
    countdown: "vertical-stack",
    gallery: "masonry-columns",
  },
  decorations: {
    sectionDivider: "gold-line",
    cardStyle: "rounded-lg",
    buttonStyle: "outline-gold",
    showDecorative: false,
  },
};
