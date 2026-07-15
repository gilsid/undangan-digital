import type { ThemeConfig } from "@/types/theme";

export const elegantConfig: ThemeConfig = {
  id: "elegant",
  name: "Elegant",
  fonts: {
    display: "'Cormorant Garamond', serif",
    body: "'Inter', sans-serif",
  },
  colors: {
    bg: "#faf7f2",
    surface: "#ffffff",
    text: "#2c2c2c",
    textMuted: "#8a8580",
    accent: "#c9a84c",
    accentMuted: "#e0c97c",
    secondary: "#8a9e8a",
    border: "#e5e0d8",
    dark: "#2c2c2c",
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
