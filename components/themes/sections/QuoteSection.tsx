"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";
import type { Invitation } from "@prisma/client";

interface Props {
  invitation: Invitation;
}

export default function QuoteSection({ invitation }: Props) {
  const config = useThemeConfig();
  const reduce = useReducedMotion();
  const { colors, decorations } = config;

  if (!invitation.quoteText) return null;

  const dividerColor =
    decorations.sectionDivider === "hairline" ? colors.border : `${colors.accent}30`;

  const container: Variants = reduce ? {} : {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const fadeChild: Variants = reduce ? {} : {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  const springChild: Variants = reduce ? {} : {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <Section className="py-16 px-6">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeChild} className="w-16 h-px mx-auto mb-6" style={{ background: dividerColor }} />
        <motion.p
          variants={springChild}
          className="text-lg italic leading-relaxed"
          style={{ fontFamily: config.fonts.display, color: colors.textMuted }}
        >
          &ldquo;{invitation.quoteText}&rdquo;
        </motion.p>
        {invitation.quoteSource && (
          <motion.p variants={fadeChild} className="mt-4 text-sm" style={{ color: colors.secondary }}>
            &mdash; {invitation.quoteSource}
          </motion.p>
        )}
        <motion.div variants={fadeChild} className="w-16 h-px mx-auto mt-6" style={{ background: dividerColor }} />
      </motion.div>
    </Section>
  );
}
