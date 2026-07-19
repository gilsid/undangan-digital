"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import BlueprintCard from "@/components/themes/shared/BlueprintCard";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";

interface Props {
  invitation: Invitation;
}

interface BankAccount {
  bank: string;
  accountNumber: string;
  accountName: string;
}

interface GiftTheme {
  bg: string;
  subtitleColor: string;
  subtitleOpacity: number | undefined;
  titleColor: string;
  titleWeight: number;
  titleStyle: string | undefined;
  titleFont: string;
  accordionBg: string;
  accordionBorder: string;
  accordionLabel: string;
  cardBg: string;
  cardBorder: string;
  bankColor: string;
  bankFont: string;
  accountNumberColor: string;
  accountNumberFont: string;
  accountNameColor: string;
  copyBorder: string;
  copyColor: string;
  copyActiveColor: string;
  chevronColor: string;
}

function getGiftTheme(id: string, colors: Record<string, string>): GiftTheme {
  switch (id) {
    case "boho":
      return {
        bg: "#fdf9f2",
        subtitleColor: "#d4a853",
        subtitleOpacity: 0.7,
        titleColor: "#3d322b",
        titleWeight: 500,
        titleStyle: "italic",
        titleFont: "'Playfair Display', serif",
        accordionBg: "#fdf9f2",
        accordionBorder: "#e2d5c5",
        accordionLabel: "#8c7d70",
        cardBg: "#fdf9f2",
        cardBorder: "#e2d5c5",
        bankColor: "#d4a853",
        bankFont: "",
        accountNumberColor: "#3d322b",
        accountNumberFont: "'Playfair Display', serif",
        accountNameColor: "#8c7d70",
        copyBorder: "#d4a853",
        copyColor: "#d4a853",
        copyActiveColor: "#c97d60",
        chevronColor: "#d4a853",
      };
    case "foil-blueprint":
      return {
        bg: "#0e1016",
        subtitleColor: "var(--foil-gold)",
        subtitleOpacity: 0.7,
        titleColor: "var(--text-primary)",
        titleWeight: 500,
        titleStyle: undefined,
        titleFont: "var(--font-display)",
        accordionBg: "#1a1e27",
        accordionBorder: "rgba(216,185,120,0.18)",
        accordionLabel: "var(--text-muted)",
        cardBg: "#20242f",
        cardBorder: "rgba(216,185,120,0.08)",
        bankColor: "var(--foil-gold)",
        bankFont: "",
        accountNumberColor: "var(--text-primary)",
        accountNumberFont: "monospace",
        accountNameColor: "var(--text-muted)",
        copyBorder: "var(--foil-gold)",
        copyColor: "var(--foil-gold)",
        copyActiveColor: "var(--foil-gold)",
        chevronColor: "var(--foil-gold)",
      };
    case "tropical":
      return {
        bg: colors.bg,
        subtitleColor: colors.textMuted,
        subtitleOpacity: undefined,
        titleColor: colors.text,
        titleWeight: 300,
        titleStyle: undefined,
        titleFont: "'Playfair Display', serif",
        accordionBg: colors.surface,
        accordionBorder: colors.border,
        accordionLabel: colors.textMuted,
        cardBg: colors.surface,
        cardBorder: colors.border,
        bankColor: colors.secondary,
        bankFont: "",
        accountNumberColor: colors.text,
        accountNumberFont: "monospace",
        accountNameColor: colors.textMuted,
        copyBorder: colors.border,
        copyColor: colors.accent,
        copyActiveColor: colors.secondary,
        chevronColor: colors.secondary,
      };
    default:
      return { bg: "", subtitleColor: "", subtitleOpacity: undefined, titleColor: "", titleWeight: 400, titleStyle: undefined, titleFont: "", accordionBg: "", accordionBorder: "", accordionLabel: "", cardBg: "", cardBorder: "", bankColor: "", bankFont: "", accountNumberColor: "", accountNumberFont: "", accountNameColor: "", copyBorder: "", copyColor: "", copyActiveColor: "", chevronColor: "" };
  }
}

export default function GiftSection({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors, decorations } = config;
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const id = config.id;

  const bankAccounts = invitation.bankAccounts as BankAccount[] | null;
  if (!bankAccounts || bankAccounts.length === 0) return null;

  async function copyAccount(idx: number, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {}
  }

  // ── Non-Elegant path (Boho/Foil/Tropical) with section header ──
  if (id !== "elegant") {
    const t = getGiftTheme(id, colors as unknown as Record<string, string>);
    const isFoil = id === "foil-blueprint";
    const childVariants = {
      hidden: reduce ? {} : { opacity: 0, y: 16 },
      visible: reduce ? {} : { opacity: 1, y: 0, transition: { duration: 0.5, ease: id === "boho" ? [0.25, 0.4, 0.3, 1] as const : "easeOut" as const } },
    };

    const accordion = (
      <>
        <motion.button
          onClick={() => setOpen((p) => !p)}
          whileHover={reduce ? {} : { scale: 1.005 }}
          className="w-full flex items-center justify-between px-5 py-4 rounded-md transition-all duration-200"
          style={{ border: `1px solid ${t.accordionBorder}`, background: t.accordionBg }}
        >
          <span className="text-sm" style={{ color: t.accordionLabel }}>
            Amplop Digital (opsional)
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.chevronColor} strokeWidth="2" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.button>
        {open && (
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: -8 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            className="mt-3 space-y-3"
          >
            {bankAccounts.map((acc, i) => (
              <motion.div
                key={i}
                initial={reduce ? {} : { opacity: 0, y: 16 }}
                animate={reduce ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring" as const, stiffness: 80, damping: 18 }}
              >
                <div className="p-4 rounded-lg" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: t.bankColor, opacity: 0.7 }}>
                        {acc.bank}
                      </p>
                      <p className="text-base font-medium" style={{ fontFamily: t.accountNumberFont, color: t.accountNumberColor }}>
                        {acc.accountNumber}
                      </p>
                      <p className="text-sm" style={{ color: t.accountNameColor }}>{acc.accountName}</p>
                    </div>
                    <motion.button
                      onClick={() => copyAccount(i, acc.accountNumber)}
                      whileTap={reduce ? {} : { scale: 0.95 }}
                      className="px-3 py-1.5 rounded-md text-xs transition-all duration-200"
                      style={{ border: `1px solid ${t.copyBorder}`, color: copiedIdx === i ? t.copyActiveColor : t.copyColor }}
                    >
                      {copiedIdx === i ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                        >
                          ✓ Tersalin
                        </motion.span>
                      ) : "Salin"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </>
    );

    return (
      <section className="py-16 px-6" style={{ background: t.bg }}>
        <Section direction="up" stagger staggerDelay={0.15} className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <motion.p variants={childVariants} className="text-xs uppercase tracking-[0.3em]" style={{ color: t.subtitleColor, opacity: t.subtitleOpacity }}>
              Amplop Digital
            </motion.p>
            <motion.h2
              variants={childVariants}
              className="text-3xl mt-2"
              style={{ fontFamily: t.titleFont, fontWeight: t.titleWeight, fontStyle: t.titleStyle, color: t.titleColor }}
            >
              Kirim Kado
            </motion.h2>
          </div>
          {isFoil ? <BlueprintCard>{accordion}</BlueprintCard> : accordion}
        </Section>
      </section>
    );
  }

  // ── Elegant path (no section header, framer chevron, copy below) ──
  const isMinimalist = config.id === "minimalist";
  const title = isMinimalist ? "Digital Gift" : "Amplop Digital (opsional)";
  const cardRounded = decorations.cardStyle === "border-only" ? "rounded-lg" : decorations.cardStyle;

  return (
    <section className="py-16 px-6" style={{ background: colors.bg }}>
      <Section className="max-w-md mx-auto">
        <motion.button
          onClick={() => setOpen((p) => !p)}
          className="w-full flex items-center justify-between px-5 py-4 transition-colors"
          style={{ border: `1px solid ${colors.border}`, background: open ? colors.surface : "transparent", borderRadius: decorations.cardStyle === "border-only" ? 0 : undefined }}
          whileHover={reduce ? {} : { borderColor: colors.accent }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-sm font-medium" style={{ color: colors.textMuted }}>
            {title}
          </span>
          <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" animate={open ? { rotate: 180 } : { rotate: 0 }} transition={{ duration: 0.3 }}>
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </motion.button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: -8 }}
              animate={reduce ? {} : { opacity: 1, y: 0 }}
              exit={reduce ? {} : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-3 space-y-3"
            >
              {bankAccounts.map((acc, i) => (
                <motion.div
                  key={i}
                  initial={reduce ? {} : { opacity: 0, y: 12 }}
                  animate={reduce ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: "spring" as const, stiffness: 180, damping: 18 }}
                  className={`p-4 ${cardRounded}`}
                  style={{ background: colors.surface, border: decorations.cardStyle !== "border-only" ? "none" : `1px solid ${colors.border}` }}
                >
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.accent }}>
                    {acc.bank}
                  </p>
                  <p className="font-mono text-lg font-medium" style={{ color: colors.text }}>
                    {acc.accountNumber}
                  </p>
                  <p className="text-sm" style={{ color: colors.textMuted }}>
                    {acc.accountName}
                  </p>
                  <button
                    onClick={() => { copyAccount(i, acc.accountNumber); }}
                    className="mt-2 text-xs px-3 py-1 transition-opacity hover:opacity-80 relative"
                    style={{
                      background: colors.accent,
                      color: config.id === "minimalist" ? colors.bg : colors.dark,
                      borderRadius: decorations.buttonStyle === "solid-black" ? 0 : "9999px",
                    }}
                  >
                    {copiedIdx === i ? (
                      <motion.span
                        key="check"
                        className="inline-flex items-center gap-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" as const, stiffness: 400, damping: 12 }}
                      >
                        Tersalin
                      </motion.span>
                    ) : "Salin"}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Section>
    </section>
  );
}
