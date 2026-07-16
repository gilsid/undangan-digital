"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";
import type { Invitation } from "@prisma/client";

interface Props {
  invitation: Invitation;
}

export default function LoveStorySection({ invitation }: Props) {
  const config = useThemeConfig();
  const reduce = useReducedMotion();
  const { colors } = config;

  if (!invitation.loveStory) return null;

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
        <motion.p variants={fadeChild} className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.secondary }}>
          Our Story
        </motion.p>
        <motion.h2
          variants={fadeChild}
          className="text-3xl font-light mb-8"
          style={{ fontFamily: config.fonts.display, color: colors.secondary }}
        >
          Cerita Kita
        </motion.h2>
        <motion.p
          variants={springChild}
          className="leading-relaxed whitespace-pre-line"
          style={{ color: colors.textMuted }}
        >
          {invitation.loveStory}
        </motion.p>
      </motion.div>
    </Section>
  );
}
