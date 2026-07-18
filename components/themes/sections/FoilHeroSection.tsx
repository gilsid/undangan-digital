"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import { childVariant, formatDateID } from "@/hooks/useThemeCommon";

interface Props {
  invitation: Invitation;
}

export default function FoilHeroSection({ invitation }: Props) {
  const reduce = useReducedMotion();

  const childVariants = childVariant(reduce, 30, 0.8);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{
        background: invitation.heroImage
          ? `linear-gradient(rgba(18,21,28,0.6), rgba(18,21,28,0.8)), url(${invitation.heroImage}) center/cover no-repeat`
          : "#12151c",
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(216,185,120,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(216,185,120,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <Section
        direction="up"
        stagger
        staggerDelay={0.2}
        className="relative z-10"
      >
        <motion.p
          variants={childVariants}
          className="text-[var(--foil-gold)] text-xs uppercase tracking-[0.4em] mb-6"
        >
          The Wedding of
        </motion.p>
        <motion.h1
          variants={childVariants}
          className="text-[var(--text-primary)] leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem,8vw,5rem)",
            fontWeight: 500,
          }}
        >
          {invitation.groomFullName ?? invitation.groomName}
        </motion.h1>
        <motion.p
          variants={childVariants}
          className="text-[var(--foil-gold)] text-2xl md:text-3xl my-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          &amp;
        </motion.p>
        <motion.h1
          variants={childVariants}
          className="text-[var(--text-primary)] leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem,8vw,5rem)",
            fontWeight: 500,
          }}
        >
          {invitation.brideFullName ?? invitation.brideName}
        </motion.h1>
        <motion.div
          variants={childVariants}
          className="mt-6 flex items-center justify-center gap-4"
        >
          <div className="h-px w-12" style={{ background: "var(--foil-gold)", opacity: 0.4 }} />
          <p className="text-[var(--text-secondary)] text-sm" style={{ fontFamily: "var(--font-mono)" }}>
            {formatDateID(invitation.weddingDate)}
          </p>
          <div className="h-px w-12" style={{ background: "var(--foil-gold)", opacity: 0.4 }} />
        </motion.div>
      </Section>
      <motion.div
        className="absolute bottom-8"
        animate={reduce ? {} : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8b978" strokeWidth="1.5" opacity="0.6">
          <path d="M7 10l5 5 5-5" />
        </svg>
      </motion.div>
    </section>
  );
}
