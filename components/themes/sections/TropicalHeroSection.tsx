"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";

interface Props {
  invitation: Invitation;
}

const C = {
  bg: "#f7f5ef",
  surface: "#ffffff",
  text: "#2a4231",
  sage: "#7e9b85",
  coral: "#e8846b",
  emerald: "#2d5a4b",
  border: "#d6e2d4",
};

export default function TropicalHeroSection({ invitation }: Props) {
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
        background: `linear-gradient(180deg, ${C.bg} 0%, #ffffff 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #2d5a4b 1px, transparent 1px), radial-gradient(circle at 75% 75%, #2d5a4b 1px, transparent 1px)",
          backgroundSize: "40px 40px, 40px 40px",
        }}
      />
      <Section direction="up" stagger staggerDelay={0.2} className="relative z-10">
        <motion.p
          variants={reduce ? { hidden: {}, visible: {} } : {
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.3, 1] as const } },
          }}
          className="text-xs uppercase tracking-[0.4em] mb-6"
          style={{ color: C.emerald }}
        >
          The Wedding of
        </motion.p>
        <motion.h1
          variants={reduce ? { hidden: {}, visible: {} } : {
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.3, 1] as const } },
          }}
          className="leading-tight"
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(2.5rem,8vw,5rem)",
            fontWeight: 300,
            color: C.text,
          }}
        >
          {invitation.groomFullName ?? invitation.groomName}
        </motion.h1>
        <motion.p
          variants={reduce ? { hidden: {}, visible: {} } : {
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.3, 1] as const } },
          }}
          className="text-2xl md:text-3xl my-2"
          style={{ fontFamily: "Playfair Display, serif", color: C.coral }}
        >
          &amp;
        </motion.p>
        <motion.h1
          variants={reduce ? { hidden: {}, visible: {} } : {
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.3, 1] as const } },
          }}
          className="leading-tight"
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(2.5rem,8vw,5rem)",
            fontWeight: 300,
            color: C.text,
          }}
        >
          {invitation.brideFullName ?? invitation.brideName}
        </motion.h1>
        <motion.div
          variants={reduce ? { hidden: {}, visible: {} } : {
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.3, 1] as const } },
          }}
          className="mt-6 flex items-center justify-center gap-3"
        >
          <div className="h-px w-12" style={{ background: C.sage }} />
          <p className="text-sm" style={{ color: C.sage }}>
            {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </p>
          <div className="h-px w-12" style={{ background: C.sage }} />
        </motion.div>
      </Section>
      <motion.div
        className="absolute bottom-8"
        animate={reduce ? {} : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.sage} strokeWidth="1.5">
          <path d="M7 10l5 5 5-5" />
        </svg>
      </motion.div>
    </section>
  );
}
