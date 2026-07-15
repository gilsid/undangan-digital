import type { ThemeConfig } from "@/types/theme";

export const minimalistConfig: ThemeConfig = {
  id: "minimalist",
  name: "Minimalist",
  fonts: {
    display: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  colors: {
    bg: "#ffffff",
    surface: "#fafafa",
    text: "#111111",
    textMuted: "#777777",
    accent: "#111111",
    accentMuted: "#333333",
    secondary: "#777777",
    border: "#e5e5e5",
    dark: "#111111",
  },
  layout: {
    cover: "framed",
    hero: "editorial-three-row",
    couple: "square-grayscale",
    event: "text-forward-grid",
    countdown: "line-separated",
    gallery: "grayscale-grid",
  },
  decorations: {
    sectionDivider: "hairline",
    cardStyle: "border-only",
    buttonStyle: "solid-black",
    showDecorative: false,
  },
};
