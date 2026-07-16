"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";

interface Props {
  invitation: Invitation;
}

const C = {
  bg: "#f7f5ef",
  surface: "#ffffff",
  text: "#2a4231",
  sage: "#7e9b85",
  coral: "#e8846b",
  emerald: "#2d5a4b",
  border: "#d6e2d4",
};

export default function TropicalGallerySection({ invitation }: Props) {
  const gallery = invitation.gallery ?? [];
  const reduce = useReducedMotion();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight" && lightboxIdx !== null)
        setLightboxIdx((lightboxIdx + 1) % gallery.length);
      if (e.key === "ArrowLeft" && lightboxIdx !== null)
        setLightboxIdx((lightboxIdx - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, gallery.length, closeLightbox]);

  if (gallery.length === 0) return null;

  return (
    <section className="py-16 px-6" style={{ background: C.bg }}>
      <Section className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.3em]" style={{ color: C.sage }}>
          Kenangan
        </p>
        <h2
          className="text-3xl mt-2"
          style={{ fontFamily: "Playfair Display, serif", fontWeight: 300, color: C.text }}
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
            className="overflow-hidden rounded-lg cursor-pointer"
            style={{ border: `1px solid ${C.border}` }}
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
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl z-10"
              onClick={closeLightbox}
            >
              ✕
            </button>
            {gallery.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-3xl z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIdx((lightboxIdx - 1 + gallery.length) % gallery.length);
                  }}
                >
                  ‹
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-3xl z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIdx((lightboxIdx + 1) % gallery.length);
                  }}
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
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
