"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";

interface Props {
  invitation: Invitation;
  guestName?: string;
  onOpen?: () => void;
}

function CenteredCover({ invitation, guestName, onOpen }: Props) {
  const config = useThemeConfig();
  const reduce = useReducedMotion();
  const { colors, fonts } = config;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{
        background: invitation.heroImage
          ? `linear-gradient(rgba(44,44,44,0.55), rgba(44,44,44,0.55)), url(${invitation.heroImage}) center/cover no-repeat`
          : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.dark} 100%)`,
      }}
    >
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 20 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: colors.accentMuted }}>
          Undangan Pernikahan
        </p>
        {guestName && <p className="text-white/80 text-sm mb-1">Kepada Yth.</p>}
        {guestName && (
          <h2 className="text-xl font-light text-white mb-6" style={{ fontFamily: fonts.display }}>
            {guestName}
          </h2>
        )}
        <h1
          className="text-4xl md:text-5xl font-light text-white mb-2 leading-tight"
          style={{ fontFamily: fonts.display }}
        >
          {invitation.groomName}
          <span className="block text-2xl my-1" style={{ color: colors.accent }}>&amp;</span>
          {invitation.brideName}
        </h1>
        <p className="text-white/70 text-sm mt-4 mb-10">
          {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </p>
        <button
          onClick={onOpen}
          className="px-8 py-3 rounded-full text-sm tracking-widest uppercase transition-shadow"
          style={{
            background: "transparent",
            border: `1px solid ${colors.accent}`,
            color: colors.accentMuted,
            letterSpacing: "0.2em",
          }}
        >
          Buka Undangan
        </button>
      </motion.div>
    </div>
  );
}

function CardCenteredCover({ invitation, guestName, onOpen }: Props) {
  const config = useThemeConfig();
  const reduce = useReducedMotion();
  const { colors, fonts } = config;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
      style={{
        background: invitation.heroImage
          ? `linear-gradient(rgba(62,57,53,0.5), rgba(62,57,53,0.5)), url(${invitation.heroImage}) center/cover no-repeat`
          : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.dark} 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#c2593f0a_1px,transparent_1px)] [background-size:16px_16px]" />
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 20 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-sm w-full shadow-xl"
        style={{
          background: `${colors.bg}/95`,
          border: `1px solid ${colors.accent}20`,
          borderRadius: "24px",
          padding: "2rem",
        }}
      >
        <p className="text-xs uppercase tracking-[0.25em] font-medium mb-2" style={{ color: colors.secondary }}>
          Undangan Pernikahan
        </p>
        <div className="h-px w-16 mx-auto my-3" style={{ background: `${colors.accent}30` }} />
        {guestName && <p className="text-xs mb-1" style={{ color: `${colors.text}70` }}>Kepada Yth. Bapak/Ibu/Saudara/i</p>}
        {guestName && (
          <h2 className="text-xl font-medium mb-6" style={{ fontFamily: fonts.display, color: colors.text }}>
            {guestName}
          </h2>
        )}
        <h1
          className="text-4xl font-light mb-2 leading-snug"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          {invitation.groomName}
          <span className="block text-2xl my-1 italic font-serif" style={{ color: colors.accent }}>&amp;</span>
          {invitation.brideName}
        </h1>
        <p className="text-xs mt-4 mb-8 font-medium tracking-wide" style={{ color: `${colors.text}80` }}>
          {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </p>
        <button
          onClick={onOpen}
          className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-shadow"
          style={{ background: colors.accent }}
        >
          Buka Undangan
        </button>
      </motion.div>
    </div>
  );
}

function FramedCover({ invitation, guestName, onOpen }: Props) {
  const config = useThemeConfig();
  const reduce = useReducedMotion();
  const { colors, fonts } = config;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-8 text-left relative">
      <div className="border flex-1 flex flex-col justify-between p-8" style={{ borderColor: `${colors.text}10` }}>
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: colors.textMuted }}>
            Wedding Invitation
          </p>
        </div>
        <div>
          <h1
            className="text-4xl md:text-5xl font-light uppercase tracking-wide leading-none"
            style={{ color: colors.text, fontFamily: fonts.display }}
          >
            {invitation.groomName}
            <span className="block text-xl font-normal lowercase my-1" style={{ color: colors.textMuted }}>and</span>
            {invitation.brideName}
          </h1>
          <p className="text-sm tracking-widest uppercase mt-6" style={{ color: colors.textMuted }}>
            {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
        <div className="space-y-6">
          {guestName && (
            <div>
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>Kepada Yth.</p>
              <p className="text-lg font-medium" style={{ color: colors.text }}>{guestName}</p>
            </div>
          )}
          <button
            onClick={onOpen}
            className="group flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-semibold"
            style={{ color: colors.text }}
          >
            Open Invitation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CoverSection(props: Props) {
  const config = useThemeConfig();
  switch (config.layout.cover) {
    case "centered": return <CenteredCover {...props} />;
    case "card-centered": return <CardCenteredCover {...props} />;
    case "framed": return <FramedCover {...props} />;
  }
}
