"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import { BlueprintCorner, BlueprintCornerOpposite } from "@/components/themes/shared/BlueprintCorner";
import { formatDateID } from "@/hooks/useThemeCommon";

interface Props {
  invitation: Invitation;
  guestName?: string;
  onOpen?: () => void;
}

export default function FoilCoverSection({ invitation, guestName, onOpen }: Props) {
  const reduce = useReducedMotion();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{
        background: invitation.heroImage
          ? `linear-gradient(rgba(18,21,28,0.7), rgba(18,21,28,0.85)), url(${invitation.heroImage}) center/cover no-repeat`
          : "#12151c",
      }}
    >
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 20 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative px-8 py-10 border border-[rgba(216,185,120,0.18)] rounded-lg"
      >
        <BlueprintCorner />
        <BlueprintCornerOpposite />
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--foil-gold)] mb-5">
          Undangan Pernikahan
        </p>
        {guestName && (
          <>
            <p className="text-[var(--text-secondary)] text-sm mb-2">Kepada Yth.</p>
            <h2
              className="text-xl font-light text-[var(--text-primary)] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {guestName}
            </h2>
          </>
        )}
        <h1
          className="text-4xl md:text-5xl text-[var(--text-primary)] leading-tight mb-3"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
        >
          {invitation.groomName}
          <span className="block text-[var(--foil-gold)] text-2xl md:text-3xl my-2">&amp;</span>
          {invitation.brideName}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-4 mb-8" style={{ fontFamily: "var(--font-mono)" }}>
          {formatDateID(invitation.weddingDate)}
        </p>
        <motion.button
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
    </div>
  );
}
