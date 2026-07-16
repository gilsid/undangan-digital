"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";

interface Props {
  invitation: Invitation;
}

export default function FoilQuoteSection({ invitation }: Props) {
  const reduce = useReducedMotion();

  if (!invitation.quoteText) return null;

  const childVariants: Variants = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
      };

  const springChild: Variants = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 80, damping: 15 },
        },
      };

  return (
    <Section direction="up" stagger staggerDelay={0.15} className="py-16 px-6 text-center max-w-2xl mx-auto">
      <motion.div variants={childVariants}>
        <div className="h-px w-16 mx-auto mb-8" style={{ background: "var(--foil-gold)", opacity: 0.3 }} />
      </motion.div>
      <motion.p
        variants={springChild}
        className="text-xl md:text-2xl font-light italic leading-relaxed"
        style={{ fontFamily: "var(--font-display)", color: "#a9a296" }}
      >
        &ldquo;{invitation.quoteText}&rdquo;
      </motion.p>
      {invitation.quoteSource && (
        <motion.p variants={childVariants} className="text-sm mt-4" style={{ color: "var(--foil-gold)", opacity: 0.7 }}>
          — {invitation.quoteSource}
        </motion.p>
      )}
      <motion.div variants={childVariants}>
        <div className="h-px w-16 mx-auto mt-8" style={{ background: "var(--foil-gold)", opacity: 0.3 }} />
      </motion.div>
    </Section>
  );
}
