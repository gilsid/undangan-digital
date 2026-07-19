"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";

interface Props {
  invitation: Invitation;
}

interface GalleryTheme {
  subtitleColor: string;
  subtitleOpacity: number | undefined;
  titleColor: string;
  titleWeight: number;
  itemBorder: string;
}

function getGalleryTheme(id: string): GalleryTheme {
  switch (id) {
    case "boho":
      return { subtitleColor: "#d4a853", subtitleOpacity: 0.7, titleColor: "#3d322b", titleWeight: 500, itemBorder: "#e2d5c5" };
    case "foil-blueprint":
      return { subtitleColor: "var(--foil-gold)", subtitleOpacity: 0.7, titleColor: "var(--text-primary)", titleWeight: 500, itemBorder: "rgba(216,185,120,0.12)" };
    case "tropical":
      return { subtitleColor: "#7e9b85", subtitleOpacity: undefined, titleColor: "#2a4231", titleWeight: 300, itemBorder: "#d6e2d4" };
    default:
      return { subtitleColor: "", subtitleOpacity: undefined, titleColor: "", titleWeight: 400, itemBorder: "" };
  }
}

export default function GallerySection({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors, layout, fonts } = config;
  const reduce = useReducedMotion();
  const gallery = invitation.gallery ?? [];
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const id = config.id;

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  const goPrev = useCallback(() => {
    setLightboxIdx((prev) => {
      if (prev === null) return null;
      return (prev - 1 + gallery.length) % gallery.length;
    });
  }, [gallery.length]);

  const goNext = useCallback(() => {
    setLightboxIdx((prev) => {
      if (prev === null) return null;
      return (prev + 1) % gallery.length;
    });
  }, [gallery.length]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, closeLightbox, goPrev, goNext]);

  if (gallery.length === 0) return null;

  const variant = layout.gallery;

  // ── Masonry columns (Boho/Foil/Tropical) ──
  if (variant === "masonry-columns") {
    const t = getGalleryTheme(id);

    return (
      <section className="py-16 px-6" style={{ background: id === "boho" ? "#faf5ed" : id === "foil-blueprint" ? "#12151c" : colors.bg }}>
        <Section className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: t.subtitleColor, opacity: t.subtitleOpacity }}>
            Kenangan
          </p>
          <h2
            className="text-3xl mt-2"
            style={{ fontFamily: id === "elegant" ? fonts.display : "'Playfair Display', serif", fontWeight: t.titleWeight, fontStyle: id === "boho" ? "italic" : undefined, color: t.titleColor }}
          >
            Galeri Foto
          </h2>
        </Section>
        <div className="max-w-4xl mx-auto columns-2 md:columns-3 gap-3 space-y-3">
          {gallery.map((url, i) => (
            <motion.div
              key={i}
              initial={reduce ? {} : { opacity: 0, y: 20 }}
              whileInView={reduce ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="overflow-hidden rounded-lg transition-all duration-500 cursor-pointer"
              style={{ border: `1px solid ${t.itemBorder}` }}
              onClick={() => setLightboxIdx(i)}
            >
              <motion.img
                src={url}
                alt={`Foto ${i + 1}`}
                className="w-full h-full object-cover"
                whileHover={reduce ? {} : { scale: 1.03 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {lightboxIdx !== null && (
            <motion.div
              key="lightbox"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              <button className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl z-10" onClick={closeLightbox}>
                ✕
              </button>
              {gallery.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-3xl z-10"
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  >
                    ‹
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-3xl z-10"
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                  >
                    ›
                  </button>
                </>
              )}
              <motion.img
                key={lightboxIdx}
                src={gallery[lightboxIdx]}
                alt={`Foto ${lightboxIdx + 1}`}
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
                initial={reduce ? {} : { scale: 0.8, opacity: 0 }}
                animate={reduce ? {} : { scale: 1, opacity: 1 }}
                exit={reduce ? {} : { scale: 0.8, opacity: 0 }}
                transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );
  }

  // ── Elegant grid variants ──
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
        <h2 className="text-3xl font-light mt-2" style={{ fontFamily: fonts.display, color: colors.text }}>
          Galeri Foto
        </h2>
      </Section>
      <div className={`max-w-4xl mx-auto grid ${gridCols} ${gap}`}>
        {gallery.map((url, i) => (
          <Section key={i} delay={i * 0.07}>
            <motion.div
              className={`aspect-square overflow-hidden ${rounded} ${shadow} cursor-pointer`}
              style={grayscale ? { filter: "grayscale(1)", transition: "filter 0.4s" } : {}}
              onMouseEnter={(e) => {
                if (grayscale) (e.currentTarget as HTMLElement).style.filter = "grayscale(0)";
              }}
              onMouseLeave={(e) => {
                if (grayscale) (e.currentTarget as HTMLElement).style.filter = "grayscale(1)";
              }}
              onClick={() => setLightboxIdx(i)}
            >
              <motion.img
                src={url}
                alt={`Foto ${i + 1}`}
                className="w-full h-full object-cover"
                whileHover={reduce || grayscale ? {} : { scale: hoverScale }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          </Section>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
            initial={reduce ? {} : { opacity: 0 }}
            animate={reduce ? {} : { opacity: 1 }}
            exit={reduce ? {} : { opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.img
              key={gallery[lightboxIdx]}
              src={gallery[lightboxIdx]}
              alt={`Foto ${lightboxIdx + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              initial={reduce ? {} : { scale: 0.8, opacity: 0 }}
              animate={reduce ? {} : { scale: 1, opacity: 1 }}
              exit={reduce ? {} : { scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />
            {gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl opacity-70 hover:opacity-100 transition-opacity p-2"
                  aria-label="Previous"
                >
                  &#8249;
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl opacity-70 hover:opacity-100 transition-opacity p-2"
                  aria-label="Next"
                >
                  &#8250;
                </button>
              </>
            )}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-2xl opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="absolute bottom-4 text-white text-sm opacity-60">
              {lightboxIdx + 1} / {gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
