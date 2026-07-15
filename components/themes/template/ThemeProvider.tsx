"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ThemeConfig } from "@/types/theme";

const ThemeContext = createContext<ThemeConfig | null>(null);

export function ThemeProvider({ config, children }: { config: ThemeConfig; children: ReactNode }) {
  return <ThemeContext.Provider value={config}>{children}</ThemeContext.Provider>;
}

export function useThemeConfig(): ThemeConfig {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeConfig must be used within ThemeProvider");
  return ctx;
}
