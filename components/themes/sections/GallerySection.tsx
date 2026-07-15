"use client";

import type { Invitation } from "@prisma/client";
import { motion, useReducedMotion } from "framer-motion";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";

interface Props {
  invitation: Invitation;
}

export default function GallerySection({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors, layout, decorations } = config;
  const reduce = useReducedMotion();
  const gallery = invitation.gallery ?? [];

  if (gallery.length === 0) return null;

  const variant = layout.gallery;

  let bg: string;
  let gridCols: string;
  let rounded: string;
  let gap: string;
  let shadow: string;
  let hoverScale: number;
  let grayscale: boolean;

  switch (variant) {
    case "rounded-grid":
      bg = colors.surface;
      gridCols = "grid-cols-2 md:grid-cols-3";
      rounded = "rounded-xl";
      gap = "gap-3";
      shadow = "";
      hoverScale = 1.05;
      grayscale = false;
      break;
    case "rounded-shadow-grid":
      bg = "#f4ece1";
      gridCols = "grid-cols-2 md:grid-cols-3";
      rounded = "rounded-2xl";
      gap = "gap-4";
      shadow = "shadow-md";
      hoverScale = 1.04;
      grayscale = false;
      break;
    case "grayscale-grid":
      bg = colors.bg;
      gridCols = "grid-cols-2 md:grid-cols-4";
      rounded = "";
      gap = "gap-2";
      shadow = "";
      hoverScale = 1;
      grayscale = true;
      break;
    default:
      bg = colors.surface;
      gridCols = "grid-cols-2 md:grid-cols-3";
      rounded = "rounded-xl";
      gap = "gap-3";
      shadow = "";
      hoverScale = 1.05;
      grayscale = false;
  }

  return (
    <section className="py-16 px-6" style={{ background: bg }}>
      <Section className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.3em]" style={{ color: colors.textMuted }}>
          Kenangan
        </p>
        <h2
          className="text-3xl font-light mt-2"
          style={{ fontFamily: config.fonts.display, color: colors.text }}
        >
          Galeri Foto
        </h2>
      </Section>
      <div className={`max-w-4xl mx-auto grid ${gridCols} ${gap}`}>
        {gallery.map((url, i) => (
          <Section key={i} delay={i * 0.07}>
            <div
              className={`aspect-square overflow-hidden ${rounded} ${shadow}`}
              style={grayscale ? { filter: "grayscale(1)", transition: "filter 0.4s" } : {}}
              onMouseEnter={(e) => {
                if (grayscale) (e.currentTarget as HTMLElement).style.filter = "grayscale(0)";
              }}
              onMouseLeave={(e) => {
                if (grayscale) (e.currentTarget as HTMLElement).style.filter = "grayscale(1)";
              }}
            >
              <motion.img
                src={url}
                alt={`Foto ${i + 1}`}
                className="w-full h-full object-cover"
                whileHover={reduce || grayscale ? {} : { scale: hoverScale }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </Section>
        ))}
      </div>
    </section>
  );
}
