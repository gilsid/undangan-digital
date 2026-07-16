"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";

interface Props {
  invitation: Invitation;
}

export default function BohoQuoteSection({ invitation }: Props) {
  const reduce = useReducedMotion();

  if (!invitation.quoteText) return null;

  const childVariants: Variants = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.3, 1] as const } },
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
    <section style={{ background: "#faf5ed" }}>
      <Section direction="up" stagger staggerDelay={0.15} className="py-16 px-6 text-center max-w-2xl mx-auto">
        <motion.div variants={childVariants}>
          <div className="h-px w-16 mx-auto mb-8" style={{ background: "#d4a853", opacity: 0.3 }} />
        </motion.div>
        <motion.p
          variants={springChild}
          className="text-xl md:text-2xl font-light italic leading-relaxed"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#3d322b" }}
        >
          &ldquo;{invitation.quoteText}&rdquo;
        </motion.p>
        {invitation.quoteSource && (
          <motion.p variants={childVariants} className="text-sm mt-4" style={{ color: "#d4a853", opacity: 0.8 }}>
            — {invitation.quoteSource}
          </motion.p>
        )}
        <motion.div variants={childVariants}>
          <div className="h-px w-16 mx-auto mt-8" style={{ background: "#d4a853", opacity: 0.3 }} />
        </motion.div>
      </Section>
    </section>
  );
}
