import type { ThemeConfig } from "@/types/theme";

export const rusticConfig: ThemeConfig = {
  id: "rustic",
  name: "Rustic",
  fonts: {
    display: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
  },
  colors: {
    bg: "#fbfaf7",
    surface: "#ffffff",
    text: "#3e3935",
    textMuted: "#7a7265",
    accent: "#c2593f",
    accentMuted: "#d47a60",
    secondary: "#6a7b60",
    border: "#e8e0d5",
    dark: "#3e3935",
  },
  layout: {
    cover: "card-centered",
    hero: "backdrop-card",
    couple: "circular-white-shadow",
    event: "translucent-cards",
    countdown: "card-grid",
    gallery: "rounded-shadow-grid",
  },
  decorations: {
    sectionDivider: "terracotta-line",
    cardStyle: "rounded-2xl",
    buttonStyle: "solid-terracotta",
    showDecorative: true,
  },
};
