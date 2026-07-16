"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";

interface Props {
  invitation: Invitation;
}

export default function BohoHeroSection({ invitation }: Props) {
  const reduce = useReducedMotion();

  const childVariants: Variants = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.4, 0.3, 1] as const } },
      };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #faf5ed 0%, #fdf9f2 100%)",
      }}
    >
      <Section
        direction="up"
        stagger
        staggerDelay={0.2}
        className="relative z-10"
      >
        <motion.p
          variants={childVariants}
          className="text-xs uppercase tracking-[0.4em] mb-6"
          style={{ color: "#d4a853" }}
        >
          The Wedding of
        </motion.p>
        <motion.h1
          variants={childVariants}
          className="leading-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: "clamp(2.5rem,8vw,5rem)",
            fontWeight: 500,
            color: "#3d322b",
          }}
        >
          {invitation.groomFullName ?? invitation.groomName}
        </motion.h1>
        <motion.p
          variants={childVariants}
          className="text-2xl md:text-3xl my-2"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#d4a853" }}
        >
          &amp;
        </motion.p>
        <motion.h1
          variants={childVariants}
          className="leading-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: "clamp(2.5rem,8vw,5rem)",
            fontWeight: 500,
            color: "#3d322b",
          }}
        >
          {invitation.brideFullName ?? invitation.brideName}
        </motion.h1>
        <motion.div
          variants={childVariants}
          className="mt-6 flex items-center justify-center gap-4"
        >
          <div className="h-px w-12" style={{ background: "#d4a853", opacity: 0.4 }} />
          <p className="text-sm" style={{ color: "#8c7d70" }}>
            {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="h-px w-12" style={{ background: "#d4a853", opacity: 0.4 }} />
        </motion.div>
      </Section>
      <motion.div
        className="absolute bottom-8"
        animate={reduce ? {} : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="1.5" opacity="0.6">
          <path d="M7 10l5 5 5-5" />
        </svg>
      </motion.div>
    </section>
  );
}
