"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import BlueprintCard from "@/components/themes/shared/BlueprintCard";

interface Props {
  invitation: Invitation;
  guestName?: string;
  onOpen?: () => void;
}

export default function FoilCoverSection({ invitation, guestName, onOpen }: Props) {
  const reduce = useReducedMotion();

  const parentVariants: Variants = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      };

  const childVariants: Variants = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
      };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{
        background: invitation.heroImage
          ? `linear-gradient(rgba(18,21,28,0.7), rgba(18,21,28,0.85)), url(${invitation.heroImage}) center/cover no-repeat`
          : "#12151c",
      }}
    >
      <BlueprintCard>
        <motion.div
          variants={parentVariants}
          initial={reduce ? {} : "hidden"}
          animate={reduce ? {} : "visible"}
        >
          <motion.p variants={childVariants} className="text-xs uppercase tracking-[0.35em] text-[var(--foil-gold)] mb-5">
            Undangan Pernikahan
          </motion.p>
          {guestName && (
            <motion.div variants={childVariants}>
              <p className="text-[var(--text-secondary)] text-sm mb-2">Kepada Yth.</p>
              <h2
                className="text-xl font-light text-[var(--text-primary)] mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {guestName}
              </h2>
            </motion.div>
          )}
          <motion.h1
            variants={childVariants}
            className="text-4xl md:text-5xl text-[var(--text-primary)] leading-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {invitation.groomName}
          </motion.h1>
          <motion.span
            variants={childVariants}
            className="block text-[var(--foil-gold)] text-2xl md:text-3xl my-2"
          >
            &amp;
          </motion.span>
          <motion.h1
            variants={childVariants}
            className="text-4xl md:text-5xl text-[var(--text-primary)] leading-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {invitation.brideName}
          </motion.h1>
          <motion.p
            variants={childVariants}
            className="text-[var(--text-secondary)] text-sm mt-4 mb-8"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </motion.p>
          <motion.button
            variants={childVariants}
            onClick={onOpen}
            whileHover={reduce ? {} : { scale: 1.02 }}
            whileTap={reduce ? {} : { scale: 0.98 }}
            className="px-8 py-2.5 rounded-md text-sm tracking-widest uppercase transition-all duration-300"
            style={{
              border: "1px solid var(--foil-gold)",
              color: "var(--foil-gold)",
              letterSpacing: "0.2em",
            }}
          >
            Buka Undangan
          </motion.button>
        </motion.div>
      </BlueprintCard>
    </div>
  );
}
