"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import { formatDateID } from "@/hooks/useThemeCommon";

interface Props {
  invitation: Invitation;
  guestName?: string;
  onOpen?: () => void;
}

export default function BohoCoverSection({ invitation, guestName, onOpen }: Props) {
  const reduce = useReducedMotion();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{
        background: `linear-gradient(rgba(61,50,43,0.55), rgba(61,50,43,0.55)), url(${invitation.heroImage || "/placeholders/hero.png"}) center/cover no-repeat`,
      }}
    >
      {/* Mandala ring SVG decor */}
      <motion.svg
        initial={reduce ? {} : { opacity: 0, scale: 0.8 }}
        animate={reduce ? {} : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.3, 1] as const }}
        width="80"
        height="80"
        viewBox="0 0 80 80"
        className="mb-6"
      >
        <circle cx="40" cy="40" r="36" fill="none" stroke="#d4a853" strokeWidth="0.8" opacity="0.4" />
        <circle cx="40" cy="40" r="28" fill="none" stroke="#d4a853" strokeWidth="0.5" opacity="0.3" />
        <circle cx="40" cy="40" r="20" fill="none" stroke="#c97d60" strokeWidth="0.5" opacity="0.25" />
        <circle cx="40" cy="40" r="12" fill="none" stroke="#d4a853" strokeWidth="0.4" opacity="0.2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <circle
            key={a}
            cx={40 + 28 * Math.cos((a * Math.PI) / 180)}
            cy={40 + 28 * Math.sin((a * Math.PI) / 180)}
            r="2"
            fill="#d4a853"
            opacity="0.3"
          />
        ))}
      </motion.svg>

      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 20 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.3, 1] as const }}
        className="relative px-8 py-10"
      >
        <p
          className="text-xs uppercase tracking-[0.35em] mb-5"
          style={{ color: "#8c7d70" }}
        >
          Undangan Pernikahan
        </p>
        {guestName && (
          <>
            <p className="text-sm mb-2" style={{ color: "#8c7d70" }}>Kepada Yth.</p>
            <h2
              className="text-xl font-light mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#3d322b" }}
            >
              {guestName}
            </h2>
          </>
        )}
        <h1
          className="text-4xl md:text-5xl leading-tight mb-3"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500, color: "#3d322b" }}
        >
          {invitation.groomName}
          <span className="block text-2xl md:text-3xl my-2" style={{ color: "#d4a853" }}>&amp;</span>
          {invitation.brideName}
        </h1>
        <p className="text-sm mt-4 mb-8" style={{ color: "#8c7d70" }}>
          {formatDateID(invitation.weddingDate)}
        </p>
        <motion.button
          onClick={onOpen}
          whileHover={reduce ? {} : { scale: 1.02 }}
          whileTap={reduce ? {} : { scale: 0.98 }}
          className="px-8 py-2.5 rounded-md text-sm tracking-widest uppercase transition-all duration-300"
          style={{ background: "#d4a853", color: "#fff", letterSpacing: "0.2em" }}
        >
          Buka Undangan
        </motion.button>
      </motion.div>
    </div>
  );
}
