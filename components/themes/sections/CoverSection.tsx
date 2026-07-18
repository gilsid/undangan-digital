"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";
import { formatDateID } from "@/hooks/useThemeCommon";

interface Props {
  invitation: Invitation;
  guestName?: string;
  onOpen?: () => void;
}

function useCoverAnim() {
  const reduce = useReducedMotion();
  const container: Variants = reduce ? { hidden: {}, visible: {} } : {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const child: Variants = reduce ? { hidden: {}, visible: {} } : {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  const btnHover = reduce ? {} : { scale: 1.02 };
  const btnTap = reduce ? {} : { scale: 0.98 };
  return { container, child, btnHover, btnTap };
}

function CenteredCover({ invitation, guestName, onOpen }: Props) {
  const config = useThemeConfig();
  const { colors, fonts } = config;
  const { container, child, btnHover, btnTap } = useCoverAnim();

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
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={child} className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: colors.accentMuted }}>
          Undangan Pernikahan
        </motion.p>
        {guestName && (
          <motion.div variants={child}>
            <p className="text-white/80 text-sm mb-1">Kepada Yth.</p>
            <h2 className="text-xl font-light text-white mb-6" style={{ fontFamily: fonts.display }}>
              {guestName}
            </h2>
          </motion.div>
        )}
        <motion.h1
          variants={child}
          className="text-4xl md:text-5xl font-light text-white leading-tight"
          style={{ fontFamily: fonts.display }}
        >
          {invitation.groomName}
        </motion.h1>
        <motion.span variants={child} className="block text-2xl my-1" style={{ color: colors.accent }}>
          &amp;
        </motion.span>
        <motion.h1
          variants={child}
          className="text-4xl md:text-5xl font-light text-white mb-2 leading-tight"
          style={{ fontFamily: fonts.display }}
        >
          {invitation.brideName}
        </motion.h1>
        <motion.p variants={child} className="text-white/70 text-sm mt-4 mb-10">
          {formatDateID(invitation.weddingDate)}
        </motion.p>
        <motion.button
          variants={child}
          whileHover={btnHover}
          whileTap={btnTap}
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
        </motion.button>
      </motion.div>
    </div>
  );
}

function CardCenteredCover({ invitation, guestName, onOpen }: Props) {
  const config = useThemeConfig();
  const { colors, fonts } = config;
  const { container, child, btnHover, btnTap } = useCoverAnim();

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
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-sm w-full shadow-xl"
        style={{
          background: `${colors.bg}/95`,
          border: `1px solid ${colors.accent}20`,
          borderRadius: "24px",
          padding: "2rem",
        }}
      >
        <motion.p variants={child} className="text-xs uppercase tracking-[0.25em] font-medium mb-2" style={{ color: colors.secondary }}>
          Undangan Pernikahan
        </motion.p>
        <motion.div variants={child} className="h-px w-16 mx-auto my-3" style={{ background: `${colors.accent}30` }} />
        {guestName && (
          <motion.div variants={child}>
            <p className="text-xs mb-1" style={{ color: `${colors.text}70` }}>Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <h2 className="text-xl font-medium mb-6" style={{ fontFamily: fonts.display, color: colors.text }}>
              {guestName}
            </h2>
          </motion.div>
        )}
        <motion.h1
          variants={child}
          className="text-4xl font-light leading-snug"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          {invitation.groomName}
        </motion.h1>
        <motion.span variants={child} className="block text-2xl my-1 italic font-serif" style={{ color: colors.accent }}>
          &amp;
        </motion.span>
        <motion.h1
          variants={child}
          className="text-4xl font-light mb-2 leading-snug"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          {invitation.brideName}
        </motion.h1>
        <motion.p variants={child} className="text-xs mt-4 mb-8 font-medium tracking-wide" style={{ color: `${colors.text}80` }}>
          {formatDateID(invitation.weddingDate)}
        </motion.p>
        <motion.button
          variants={child}
          whileHover={btnHover}
          whileTap={btnTap}
          onClick={onOpen}
          className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-shadow"
          style={{ background: colors.accent }}
        >
          Buka Undangan
        </motion.button>
      </motion.div>
    </div>
  );
}

function FramedCover({ invitation, guestName, onOpen }: Props) {
  const config = useThemeConfig();
  const { colors, fonts } = config;
  const { container, child, btnHover, btnTap } = useCoverAnim();
  const upChild: Variants = useReducedMotion() ? { hidden: {}, visible: {} } : {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-8 text-left relative">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="border flex-1 flex flex-col justify-between p-8"
        style={{ borderColor: `${colors.text}10` }}
      >
        <motion.div variants={upChild}>
          <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: colors.textMuted }}>
            Wedding Invitation
          </p>
        </motion.div>
        <motion.div variants={upChild}>
          <h1
            className="text-4xl md:text-5xl font-light uppercase tracking-wide leading-none"
            style={{ color: colors.text, fontFamily: fonts.display }}
          >
            {invitation.groomName}
            <span className="block text-xl font-normal lowercase my-1" style={{ color: colors.textMuted }}>and</span>
            {invitation.brideName}
          </h1>
          <p className="text-sm tracking-widest uppercase mt-6" style={{ color: colors.textMuted }}>
            {formatDateID(invitation.weddingDate)}
          </p>
        </motion.div>
        <motion.div variants={upChild} className="space-y-6">
          {guestName && (
            <div>
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>Kepada Yth.</p>
              <p className="text-lg font-medium" style={{ color: colors.text }}>{guestName}</p>
            </div>
          )}
          <motion.button
            whileHover={btnHover}
            whileTap={btnTap}
            onClick={onOpen}
            className="group flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-semibold"
            style={{ color: colors.text }}
          >
            Open Invitation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
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
