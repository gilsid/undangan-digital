import type { ThemeConfig } from "@/types/theme";

export const tropicalConfig: ThemeConfig = {
  id: "tropical",
  name: "Tropical Garden",
  fonts: {
    display: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
  },
  colors: {
    bg: "#f7f5ef",
    surface: "#ffffff",
    text: "#2a4231",
    textMuted: "#7e9b85",
    accent: "#e8846b",
    accentMuted: "#f0a893",
    secondary: "#2d5a4b",
    border: "#d6e2d4",
    dark: "#2a4231",
  },
  layout: {
    cover: "centered",
    hero: "centered-divider",
    couple: "circular-gold",
    event: "rounded-cards",
    countdown: "vertical-stack",
    gallery: "rounded-grid",
  },
  decorations: {
    sectionDivider: "gold-line",
    cardStyle: "rounded-lg",
    buttonStyle: "outline-gold",
    showDecorative: true,
  },
};
