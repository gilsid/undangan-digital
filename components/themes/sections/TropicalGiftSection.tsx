"use client";

import { useState } from "react";
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

export default function TropicalGiftSection({ invitation }: Props) {
  const [bankOpen, setBankOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const bankAccounts = invitation.bankAccounts as
    | { bank: string; accountNumber: string; accountName: string }[]
    | null;

  if (!bankAccounts || bankAccounts.length === 0) return null;

  async function copyAccount(idx: number, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {}
  }

  const childVariants: Variants = reduce ? { hidden: {}, visible: {} } : {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="py-16 px-6" style={{ background: C.bg }}>
      <Section direction="up" stagger staggerDelay={0.15} className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <motion.p
            variants={childVariants}
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: C.sage }}
          >
            Amplop Digital
          </motion.p>
          <motion.h2
            variants={childVariants}
            className="text-3xl mt-2"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 300, color: C.text }}
          >
            Kirim Kado
          </motion.h2>
        </div>

        <motion.button
          onClick={() => setBankOpen((p) => !p)}
          whileHover={reduce ? {} : { scale: 1.005 }}
          className="w-full flex items-center justify-between px-5 py-4 rounded-md transition-all duration-200"
          style={{
            border: `1px solid ${C.border}`,
            background: C.surface,
          }}
        >
          <span className="text-sm" style={{ color: C.sage }}>
            Amplop Digital (opsional)
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.emerald}
            strokeWidth="2"
            style={{ transform: bankOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.button>
        {bankOpen && (
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
                transition={{ delay: i * 0.1, type: "spring", stiffness: 80, damping: 18 }}
              >
                <div
                  className="rounded-lg p-4"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: C.emerald }}>
                        {acc.bank}
                      </p>
                      <p className="text-base font-medium" style={{ fontFamily: "monospace", color: C.text }}>
                        {acc.accountNumber}
                      </p>
                      <p className="text-sm" style={{ color: C.sage }}>{acc.accountName}</p>
                    </div>
                    <motion.button
                      onClick={() => copyAccount(i, acc.accountNumber)}
                      whileTap={reduce ? {} : { scale: 0.95 }}
                      className="px-3 py-1.5 rounded-md text-xs transition-all duration-200"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: copiedIdx === i ? C.emerald : C.coral,
                      }}
                    >
                      {copiedIdx === i ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          ✓ Tersalin
                        </motion.span>
                      ) : (
                        "Salin"
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Section>
    </section>
  );
}