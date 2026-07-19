"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";
import { childVariant, childEasedVariant, childSpringConfigVariant } from "@/hooks/useThemeCommon";
import type { Invitation } from "@prisma/client";

interface Props {
  invitation: Invitation;
}

export default function LoveStorySection({ invitation }: Props) {
  const config = useThemeConfig();
  const reduce = useReducedMotion();
  const { colors, fonts } = config;
  const isElegant = config.id === "elegant";
  const isFoil = config.id === "foil-blueprint";

  if (!invitation.loveStory) return null;

  // ── Animation variants per theme ──
  // Elegant uses inline Variants; Boho uses childEasedVariant; Foil uses childVariant
  let subtitleHeadingVariant: Variants;
  let bodyVariant: Variants;

  if (isElegant) {
    subtitleHeadingVariant = (reduce ? {} : {
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
    }) as Variants;
    bodyVariant = (reduce ? {} : {
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
    }) as Variants;
  } else if (isFoil) {
    subtitleHeadingVariant = childVariant(reduce, 16, 0.6);
    bodyVariant = childSpringConfigVariant(reduce, 80, 15, 24);
  } else {
    // boho
    subtitleHeadingVariant = childEasedVariant(reduce, 0.6);
    bodyVariant = childSpringConfigVariant(reduce, 80, 15, 24);
  }

  // ── Elegant path (different DOM structure: flat container with inline stagger) ──
  if (isElegant) {
    const container: Variants = (reduce ? {} : {
      hidden: {},
      visible: { transition: { staggerChildren: 0.15 } },
    }) as Variants;

    return (
      <Section className="py-16 px-6">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={subtitleHeadingVariant} className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.secondary }}>
            Our Story
          </motion.p>
          <motion.h2
            variants={subtitleHeadingVariant}
            className="text-3xl font-light mb-8"
            style={{ fontFamily: fonts.display, color: colors.secondary }}
          >
            Cerita Kita
          </motion.h2>
          <motion.p
            variants={bodyVariant}
            className="leading-relaxed whitespace-pre-line"
            style={{ color: colors.textMuted }}
          >
            {invitation.loveStory}
          </motion.p>
        </motion.div>
      </Section>
    );
  }

  // ── Boho / Foil path (shared structure: outer section, Section stagger, mb-10 wrapper) ──
  return (
    <section className="py-16 px-6" style={{ background: isFoil ? "#171b23" : colors.surface }}>
      <Section direction="up" stagger staggerDelay={0.15} className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <motion.p
            variants={subtitleHeadingVariant}
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: colors.accent, opacity: 0.7 }}
          >
            Our Story
          </motion.p>
          <motion.h2
            variants={subtitleHeadingVariant}
            className="text-3xl mt-2"
            style={{
              fontFamily: fonts.display,
              fontStyle: isFoil ? undefined : ("italic" as const),
              fontWeight: 500,
              color: colors.text,
            }}
          >
            Cerita Kita
          </motion.h2>
        </div>
        <motion.p
          variants={bodyVariant}
          className="leading-relaxed whitespace-pre-line"
          style={{ color: isFoil ? colors.secondary : colors.textMuted }}
        >
          {invitation.loveStory}
        </motion.p>
      </Section>
    </section>
  );
}
