"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";
import { childVariant, childEasedVariant, formatDateID } from "@/hooks/useThemeCommon";

interface Props {
  invitation: Invitation;
}

export default function FooterSection({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors, fonts } = config;
  const reduce = useReducedMotion();
  const isElegant = config.id === "elegant";
  const isFoil = config.id === "foil-blueprint";
  const isTropical = config.id === "tropical";

  // ── Elegant path: manual stagger, divider after names, per-element animation ──
  if (isElegant) {
    const isMinimalist = config.id === "minimalist";
    const spring = { type: "spring" as const, stiffness: 200, damping: 18 };
    const bg = isMinimalist ? colors.surface : colors.dark;
    const textColor = isMinimalist ? colors.text : "#ffffff";
    const mutedColor = isMinimalist ? colors.textMuted : "rgba(255,255,255,0.4)";
    const dividerColor = isMinimalist ? colors.border : colors.accent;
    const thankYou = isMinimalist ? "Thank You" : "Terima kasih atas doa dan kehadiran Anda";

    const stagger = { names: 0, date: 0.15, divider: 0.25, thanks: 0.4 };

    return (
      <footer className="py-12 px-6 text-center" style={{ background: bg }}>
        <Section>
          <motion.p
            className="text-3xl font-light"
            style={{ fontFamily: fonts.display, color: textColor }}
            initial={reduce ? {} : { opacity: 0, y: 10 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={spring}
          >
            {invitation.groomName} & {invitation.brideName}
          </motion.p>
          <motion.p
            className="text-sm mt-2"
            style={{ color: mutedColor }}
            initial={reduce ? {} : { opacity: 0, y: 8 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ ...spring, delay: stagger.date }}
          >
            {formatDateID(invitation.weddingDate)}
          </motion.p>
          <motion.div
            className="h-px w-24 mx-auto my-6"
            style={{ background: dividerColor, opacity: isMinimalist ? 1 : 0.3, originX: 0 }}
            initial={reduce ? {} : { scaleX: 0 }}
            animate={reduce ? {} : { scaleX: 1 }}
            transition={{ ...spring, delay: stagger.divider }}
          />
          <motion.p
            className="text-xs"
            style={{ color: mutedColor }}
            initial={reduce ? {} : { opacity: 0, y: 8 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ ...spring, delay: stagger.thanks }}
          >
            {thankYou}
          </motion.p>
        </Section>
      </footer>
    );
  }

  // ── Boho / Foil / Tropical path: divider before names, Section stagger ──

  const textVariant = isFoil
    ? childVariant(reduce, 16, 0.5)
    : childEasedVariant(reduce, 0.5);

  const dividerVariants: Variants = reduce ? { hidden: {}, visible: {} } : {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.6,
        ease: isFoil ? "easeOut" : [0.25, 0.4, 0.3, 1],
      },
    },
  };

  const dividerColor = isTropical ? colors.textMuted : colors.accent;
  const hasDividerOpacity = !isTropical; // Tropical has no divider opacity

  return (
    <footer
      className="py-12 px-6 text-center"
      style={{ background: isFoil ? colors.dark : colors.bg }}
    >
      <Section direction="up" stagger staggerDelay={0.15} className="max-w-md mx-auto">
        <motion.div
          variants={dividerVariants}
          className="h-px w-16 mx-auto mb-6"
          style={{
            background: dividerColor,
            ...(hasDividerOpacity ? { opacity: 0.3 } : {}),
            transformOrigin: "left",
          }}
        />
        <motion.p
          variants={textVariant}
          className="text-2xl"
          style={{
            fontFamily: fonts.display,
            fontStyle: isTropical || isFoil ? undefined : ("italic" as const),
            fontWeight: isTropical ? 300 : 500,
            color: colors.text,
          }}
        >
          {invitation.groomName} & {invitation.brideName}
        </motion.p>
        <motion.p
          variants={textVariant}
          className="text-sm mt-2"
          style={{
            color: colors.textMuted,
            ...(isFoil ? { fontFamily: fonts.mono } : {}),
          }}
        >
          {formatDateID(invitation.weddingDate)}
        </motion.p>
        <motion.p
          variants={textVariant}
          className="text-xs mt-6"
          style={{ color: colors.textMuted, opacity: 0.6 }}
        >
          Terima kasih atas doa dan kehadiran Anda
        </motion.p>
      </Section>
    </footer>
  );
}
