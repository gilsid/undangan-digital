"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";

interface Props {
  invitation: Invitation;
}

interface BankAccount {
  bank: string;
  accountNumber: string;
  accountName: string;
}

export default function GiftSection({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors, decorations } = config;
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const bankAccounts = invitation.bankAccounts as BankAccount[] | null;
  if (!bankAccounts || bankAccounts.length === 0) return null;

  const isMinimalist = config.id === "minimalist";
  const title = isMinimalist ? "Digital Gift" : "Amplop Digital (opsional)";
  const cardRounded = decorations.cardStyle === "border-only" ? "rounded-lg" : decorations.cardStyle;

  async function copyNumber(acc: BankAccount, idx: number) {
    try {
      await navigator.clipboard.writeText(acc.accountNumber);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <section className="py-16 px-6" style={{ background: colors.bg }}>
      <Section className="max-w-md mx-auto">
        <button
          onClick={() => setOpen((p) => !p)}
          className="w-full flex items-center justify-between px-5 py-4 transition-colors"
          style={{ border: `1px solid ${colors.border}`, background: open ? colors.surface : "transparent", borderRadius: decorations.cardStyle === "border-only" ? 0 : undefined }}
        >
          <span className="text-sm font-medium" style={{ color: colors.textMuted }}>
            {title}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.accent}
            strokeWidth="2"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {open && (
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: -8 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            className="mt-3 space-y-3"
          >
            {bankAccounts.map((acc, i) => (
              <div
                key={i}
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
                  onClick={() => copyNumber(acc, i)}
                  className="mt-2 text-xs px-3 py-1 transition-opacity hover:opacity-80"
                  style={{
                    background: colors.accent,
                    color: config.id === "minimalist" ? colors.bg : colors.dark,
                    borderRadius: decorations.buttonStyle === "solid-black" ? 0 : "9999px",
                  }}
                >
                  {copiedIdx === i ? "Tersalin" : "Salin"}
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </Section>
    </section>
  );
}
