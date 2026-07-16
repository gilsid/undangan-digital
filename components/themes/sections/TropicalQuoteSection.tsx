"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Section from "@/components/themes/template/Section";
import type { Invitation } from "@prisma/client";

interface Props {
  invitation: Invitation;
}

const C = {
  bg: "#f7f5ef",
  text: "#2a4231",
  sage: "#7e9b85",
  coral: "#e8846b",
  border: "#d6e2d4",
};

export default function TropicalQuoteSection({ invitation }: Props) {
  const reduce = useReducedMotion();

  if (!invitation.quoteText) return null;

  const container: Variants = reduce ? {} : {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const fadeChild: Variants = reduce ? {} : {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.3, 1] as const } },
  };
  const springChild: Variants = reduce ? {} : {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <Section className="py-16 px-6" style={{ background: C.bg }}>
      <motion.div
        className="max-w-2xl mx-auto text-center"
        variants={reduce ? {} : {
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={reduce ? {} : {
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.3, 1] as const } },
        }} className="w-16 h-px mx-auto mb-6" style={{ background: C.sage }} />
        <motion.p
          variants={reduce ? {} : {
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
          }}
          className="text-lg italic leading-relaxed"
          style={{ fontFamily: "Playfair Display, serif", color: C.text }}
        >
          &ldquo;{invitation.quoteText}&rdquo;
        </motion.p>
        {invitation.quoteSource && (
          <motion.p
            variants={reduce ? {} : {
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.3, 1] as const } },
            }}
            className="mt-4 text-sm"
            style={{ color: C.coral }}
          >
            &mdash; {invitation.quoteSource}
          </motion.p>
        )}
        <motion.div
          variants={reduce ? {} : {
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.3, 1] as const } },
          }}
          className="w-16 h-px mx-auto mt-6"
          style={{ background: C.sage }}
        />
      </motion.div>
    </Section>
  );
}
