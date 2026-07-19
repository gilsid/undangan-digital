"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import { formatDateID } from "@/hooks/useThemeCommon";

interface Props {
  invitation: Invitation;
  guestName?: string;
  onOpen?: () => void;
}

const C = {
  bg: "#f7f5ef",
  text: "#2a4231",
  sage: "#7e9b85",
  coral: "#e8846b",
  emerald: "#2d5a4b",
  border: "#d6e2d4",
};

function LeafDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute -top-4 -left-4 w-24 h-24 opacity-20" viewBox="0 0 100 100" fill="none">
        <path d="M50 10 C60 30, 80 40, 90 50 C80 60, 60 70, 50 90 C40 70, 20 60, 10 50 C20 40, 40 30, 50 10Z" fill={C.emerald} />
      </svg>
      <svg className="absolute top-1/4 -right-6 w-20 h-20 opacity-15 rotate-45" viewBox="0 0 100 100" fill="none">
        <path d="M50 10 C60 30, 80 40, 90 50 C80 60, 60 70, 50 90 C40 70, 20 60, 10 50 C20 40, 40 30, 50 10Z" fill={C.emerald} />
      </svg>
      <svg className="absolute bottom-1/3 -left-8 w-16 h-16 opacity-20 -rotate-12" viewBox="0 0 100 100" fill="none">
        <path d="M50 10 C60 30, 80 40, 90 50 C80 60, 60 70, 50 90 C40 70, 20 60, 10 50 C20 40, 40 30, 50 10Z" fill={C.emerald} />
      </svg>
      <svg className="absolute bottom-10 right-8 w-14 h-14 opacity-15 rotate-45" viewBox="0 0 100 100" fill="none">
        <path d="M50 10 C60 30, 80 40, 90 50 C80 60, 60 70, 50 90 C40 70, 20 60, 10 50 C20 40, 40 30, 50 10Z" fill={C.emerald} />
      </svg>
    </div>
  );
}

export default function TropicalCoverSection({ invitation, guestName, onOpen }: Props) {
  const reduce = useReducedMotion();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
      style={{
        background: `linear-gradient(rgba(42,66,49,0.5), rgba(42,66,49,0.5)), url(${invitation.heroImage || "/placeholders/hero.png"}) center/cover no-repeat`,
      }}
    >
      <LeafDecor />
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 30 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.3, 1] as const }}
        className="relative z-10 max-w-sm w-full"
      >
        <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: C.sage }}>
          Undangan Pernikahan
        </p>
        {guestName && (
          <>
            <p className="text-sm mb-1" style={{ color: C.sage }}>Kepada Yth.</p>
            <h2
              className="text-xl font-light mb-6"
              style={{ fontFamily: "Playfair Display, serif", color: C.text }}
            >
              {guestName}
            </h2>
          </>
        )}
        <h1
          className="text-4xl md:text-5xl font-light leading-tight"
          style={{ fontFamily: "Playfair Display, serif", color: C.text }}
        >
          {invitation.groomName}
        </h1>
        <span className="block text-2xl my-1" style={{ color: C.coral }}>
          &amp;
        </span>
        <h1
          className="text-4xl md:text-5xl font-light mb-2 leading-tight"
          style={{ fontFamily: "Playfair Display, serif", color: C.text }}
        >
          {invitation.brideName}
        </h1>
        <p className="text-sm mt-4 mb-10" style={{ color: C.sage }}>
          {formatDateID(invitation.weddingDate)}
        </p>
        <motion.button
          onClick={onOpen}
          whileHover={reduce ? {} : { scale: 1.02 }}
          whileTap={reduce ? {} : { scale: 0.98 }}
          className="px-8 py-3 rounded-full text-sm tracking-widest uppercase text-white shadow-md transition-shadow"
          style={{ background: C.coral }}
        >
          Buka Undangan
        </motion.button>
      </motion.div>
    </div>
  );
}
