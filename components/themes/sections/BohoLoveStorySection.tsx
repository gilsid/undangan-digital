"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";

interface Props {
  invitation: Invitation;
}

export default function BohoLoveStorySection({ invitation }: Props) {
  const reduce = useReducedMotion();

  if (!invitation.loveStory) return null;

  const childVariants: Variants = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.3, 1] as const } },
      };

  const springChild: Variants = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 80, damping: 15 },
        },
      };

  return (
    <section className="py-16 px-6" style={{ background: "#fdf9f2" }}>
      <Section direction="up" stagger staggerDelay={0.15} className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <motion.p
            variants={childVariants}
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "#d4a853", opacity: 0.7 }}
          >
            Our Story
          </motion.p>
          <motion.h2
            variants={childVariants}
            className="text-3xl mt-2"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500, color: "#3d322b" }}
          >
            Cerita Kita
          </motion.h2>
        </div>
        <motion.p
          variants={springChild}
          className="leading-relaxed whitespace-pre-line"
          style={{ color: "#8c7d70" }}
        >
          {invitation.loveStory}
        </motion.p>
      </Section>
    </section>
  );
}
