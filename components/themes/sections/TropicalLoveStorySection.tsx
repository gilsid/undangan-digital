"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Section from "@/components/themes/template/Section";
import type { Invitation } from "@prisma/client";

interface Props {
  invitation: Invitation;
}

const C = {
  text: "#2a4231",
  sage: "#7e9b85",
  coral: "#e8846b",
  emerald: "#2d5a4b",
  border: "#d6e2d4",
};

export default function TropicalLoveStorySection({ invitation }: Props) {
  const reduce = useReducedMotion();

  if (!invitation.loveStory) return null;

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
    <Section className="py-16 px-6">
      <motion.div
        className="max-w-2xl mx-auto"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.p variants={fadeChild} className="text-xs uppercase tracking-[0.3em] mb-2 text-center" style={{ color: C.emerald }}>
          Cerita Kita
        </motion.p>
        <motion.h2
          variants={fadeChild}
          className="text-3xl font-light mb-8 text-center"
          style={{ fontFamily: "Playfair Display, serif", color: C.text }}
        >
          Cerita Kita
        </motion.h2>

        <div className="relative pl-8 border-l-2" style={{ borderColor: C.border }}>
          <div
            className="absolute left-0 top-0 w-3 h-3 rounded-full -translate-x-[7px]"
            style={{ background: C.emerald }}
          />
          <motion.p
            variants={springChild}
            className="leading-relaxed whitespace-pre-line"
            style={{ color: C.sage }}
          >
            {invitation.loveStory}
          </motion.p>
        </div>
      </motion.div>
    </Section>
  );
}
