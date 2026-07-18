import type { ThemeConfig } from "@/types/theme";

export const bohoConfig: ThemeConfig = {
  id: "boho",
  name: "Boho Ethnic",
  fonts: {
    display: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
  },
  colors: {
    bg: "#faf5ed",
    surface: "#fdf9f2",
    text: "#3d322b",
    textMuted: "#8c7d70",
    accent: "#d4a853",
    accentMuted: "#e3c47a",
    secondary: "#c97d60",
    border: "#e2d5c5",
    dark: "#3d322b",
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
    showDecorative: true,
  },
};
