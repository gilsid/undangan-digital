"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";

interface Props {
  invitation: Invitation;
}

function CenteredDividerHero({ invitation }: Props) {
  const config = useThemeConfig();
  const reduce = useReducedMotion();
  const { colors, fonts } = config;

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{
        background: invitation.heroImage
          ? `linear-gradient(rgba(44,44,44,0.45), rgba(44,44,44,0.6)), url(${invitation.heroImage}) center/cover no-repeat`
          : `linear-gradient(160deg, ${colors.secondary} 0%, ${colors.dark} 100%)`,
      }}
    >
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 30 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <p className="text-xs uppercase tracking-[0.4em] mb-6" style={{ color: colors.accentMuted }}>
          The Wedding of
        </p>
        <h1
          className="text-white leading-tight"
          style={{ fontFamily: fonts.display, fontSize: "clamp(2.5rem,8vw,5rem)", fontWeight: 300 }}
        >
          {invitation.groomFullName ?? invitation.groomName}
        </h1>
        <p className="text-3xl my-2" style={{ color: colors.accent, fontFamily: fonts.display }}>&amp;</p>
        <h1
          className="text-white leading-tight"
          style={{ fontFamily: fonts.display, fontSize: "clamp(2.5rem,8vw,5rem)", fontWeight: 300 }}
        >
          {invitation.brideFullName ?? invitation.brideName}
        </h1>
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="h-px w-12" style={{ background: `${colors.accent}80` }} />
          <p className="text-white/80 text-sm">
            {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </p>
          <div className="h-px w-12" style={{ background: `${colors.accent}80` }} />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8"
        animate={reduce ? {} : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
          <path d="M7 10l5 5 5-5" />
        </svg>
      </motion.div>
    </section>
  );
}

function BackdropCardHero({ invitation }: Props) {
  const config = useThemeConfig();
  const reduce = useReducedMotion();
  const { colors, fonts } = config;

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{
        background: invitation.heroImage
          ? `linear-gradient(rgba(62,57,53,0.35), rgba(62,57,53,0.5)), url(${invitation.heroImage}) center/cover no-repeat`
          : `linear-gradient(160deg, ${colors.secondary} 0%, ${colors.dark} 100%)`,
      }}
    >
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 30 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="p-8 rounded-3xl backdrop-blur-xs"
        style={{ background: `${colors.dark}33` }}
      >
        <p className="text-xs uppercase tracking-[0.4em] mb-4 font-semibold" style={{ color: colors.bg }}>
          Pernikahan Dari
        </p>
        <h1
          className="text-white leading-tight"
          style={{ fontFamily: fonts.display, fontSize: "clamp(2.2rem,7vw,4.5rem)", fontWeight: 400 }}
        >
          {invitation.groomFullName ?? invitation.groomName}
        </h1>
        <p className="text-2xl my-2 italic font-serif" style={{ color: `${colors.bg}e0` }}>&amp;</p>
        <h1
          className="text-white leading-tight"
          style={{ fontFamily: fonts.display, fontSize: "clamp(2.2rem,7vw,4.5rem)", fontWeight: 400 }}
        >
          {invitation.brideFullName ?? invitation.brideName}
        </h1>
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="h-px w-8" style={{ background: `${colors.bg}99` }} />
          <p className="text-white text-sm font-medium tracking-wider">
            {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </p>
          <div className="h-px w-8" style={{ background: `${colors.bg}99` }} />
        </div>
      </motion.div>
    </section>
  );
}

function EditorialThreeRowHero({ invitation }: Props) {
  const config = useThemeConfig();
  const reduce = useReducedMotion();
  const { colors, fonts } = config;

  return (
    <section className="min-h-screen flex flex-col justify-between p-8 md:p-16" style={{ background: colors.bg, borderBottom: `1px solid ${colors.border}` }}>
      <div className="w-full flex justify-between items-start text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
        <span>{invitation.groomName} &amp; {invitation.brideName}</span>
        <span>{new Date(invitation.weddingDate).getFullYear()}</span>
      </div>
      <div className="my-auto py-12">
        <motion.p
          initial={reduce ? {} : { opacity: 0 }}
          animate={reduce ? {} : { opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-[10px] uppercase tracking-[0.4em] mb-6"
          style={{ color: colors.textMuted }}
        >
          The Union Of
        </motion.p>
        <motion.h1
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extralight tracking-tight uppercase leading-none"
          style={{ color: colors.text, fontFamily: fonts.display }}
        >
          {invitation.groomFullName ?? invitation.groomName}
        </motion.h1>
        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          animate={reduce ? {} : { opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-2xl my-3 font-light italic"
          style={{ color: colors.textMuted }}
        >
          &amp;
        </motion.div>
        <motion.h1
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-5xl md:text-7xl font-extralight tracking-tight uppercase leading-none"
          style={{ color: colors.text, fontFamily: fonts.display }}
        >
          {invitation.brideFullName ?? invitation.brideName}
        </motion.h1>
      </div>
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
        <div>
          <p className="font-medium" style={{ color: colors.text }}>Save The Date</p>
          <p className="mt-1">
            {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="h-px w-6" style={{ background: colors.border }} />
          <span>Scroll to view</span>
        </div>
      </div>
    </section>
  );
}

export default function HeroSection(props: Props) {
  const config = useThemeConfig();
  switch (config.layout.hero) {
    case "centered-divider": return <CenteredDividerHero {...props} />;
    case "backdrop-card": return <BackdropCardHero {...props} />;
    case "editorial-three-row": return <EditorialThreeRowHero {...props} />;
  }
}
