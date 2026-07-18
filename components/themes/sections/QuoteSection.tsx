"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";
import { childVariant, childSpringConfigVariant } from "@/hooks/useThemeCommon";

interface Props {
  invitation: Invitation;
}

/** Per-theme QuoteSection values — zero visual change guarantee */
interface QuoteThemeValues {
  bg: string;
  dividerColor: string;
  dividerOpacity: number;
  topDividerMargin: string;
  bottomDividerMargin: string;
  textColor: string;
  textClassName: string;
  sourceColor: string;
  sourceOpacity: number;
}

function useQuoteThemeValues(): QuoteThemeValues {
  const { colors, fonts, id, decorations } = useThemeConfig();

  switch (id) {
    case "boho":
      return {
        bg: colors.bg,
        dividerColor: colors.accent,
        dividerOpacity: 0.3,
        topDividerMargin: "mb-8",
        bottomDividerMargin: "mt-8",
        textColor: colors.text,
        textClassName: "text-xl md:text-2xl font-light italic leading-relaxed",
        sourceColor: colors.accent,
        sourceOpacity: 0.8,
      };
    case "foil-blueprint":
      return {
        bg: colors.bg,
        dividerColor: colors.accent,
        dividerOpacity: 0.3,
        topDividerMargin: "mb-8",
        bottomDividerMargin: "mt-8",
        textColor: colors.secondary,
        textClassName: "text-xl md:text-2xl font-light italic leading-relaxed",
        sourceColor: colors.accent,
        sourceOpacity: 0.7,
      };
    case "tropical":
      return {
        bg: colors.bg,
        dividerColor: colors.textMuted,
        dividerOpacity: 1,
        topDividerMargin: "mb-6",
        bottomDividerMargin: "mt-6",
        textColor: colors.text,
        textClassName: "text-lg italic leading-relaxed",
        sourceColor: colors.accent,
        sourceOpacity: 1,
      };
    default:
      // elegant
      return {
        bg: colors.bg,
        dividerColor:
          decorations.sectionDivider === "hairline"
            ? colors.border
            : `${colors.accent}30`,
        dividerOpacity: 1,
        topDividerMargin: "mb-6",
        bottomDividerMargin: "mt-6",
        textColor: colors.textMuted,
        textClassName: "text-lg italic leading-relaxed",
        sourceColor: colors.secondary,
        sourceOpacity: 1,
      };
  }
}

export default function QuoteSection({ invitation }: Props) {
  const config = useThemeConfig();
  const reduce = useReducedMotion();
  const v = useQuoteThemeValues();

  if (!invitation.quoteText) return null;

  const fadeChild = childVariant(reduce, 16, 0.6);
  const springChild = childSpringConfigVariant(reduce, 80, 15, 20);

  return (
    <Section
      direction="up"
      stagger
      staggerDelay={0.15}
      className="py-16 px-6 text-center max-w-2xl mx-auto"
      style={{ background: v.bg }}
    >
      <motion.div variants={fadeChild}>
        <div
          className={`h-px w-16 mx-auto ${v.topDividerMargin}`}
          style={{ background: v.dividerColor, opacity: v.dividerOpacity }}
        />
      </motion.div>
      <motion.p
        variants={springChild}
        className={v.textClassName}
        style={{ fontFamily: config.fonts.display, color: v.textColor }}
      >
        &ldquo;{invitation.quoteText}&rdquo;
      </motion.p>
      {invitation.quoteSource && (
        <motion.p
          variants={fadeChild}
          className="mt-4 text-sm"
          style={{ color: v.sourceColor, opacity: v.sourceOpacity }}
        >
          &mdash; {invitation.quoteSource}
        </motion.p>
      )}
      <motion.div variants={fadeChild}>
        <div
          className={`h-px w-16 mx-auto ${v.bottomDividerMargin}`}
          style={{ background: v.dividerColor, opacity: v.dividerOpacity }}
        />
      </motion.div>
    </Section>
  );
}
