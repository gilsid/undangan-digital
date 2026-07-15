"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Invitation, Wish } from "@prisma/client";
import { useWish } from "@/hooks/useThemeCommon";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";

interface Props {
  invitation: Invitation;
  initialWishes: Wish[];
}

export default function WishesSection({ invitation, initialWishes }: Props) {
  const config = useThemeConfig();
  const { colors, fonts, decorations } = config;
  const reduce = useReducedMotion();
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const wish = useWish({
    onSubmit: (w) => setWishes((prev) => [w, ...prev]),
  });

  const isMinimalist = config.id === "minimalist";
  const isRustic = config.id === "rustic";
  const isElegant = config.id === "elegant";

  let bg: string;
  if (isMinimalist) bg = colors.bg;
  else if (isRustic) bg = "#f4ece1";
  else bg = "#f0ebe4"; // elegant

  const inputRounded = decorations.cardStyle === "border-only" ? "rounded-none" : decorations.cardStyle;
  const cardRounded = decorations.cardStyle === "border-only" ? "rounded-none" : "rounded-xl";

  return (
    <section className="py-16 px-6" style={{ background: bg }}>
      <Section className="max-w-lg mx-auto">
        <p className="text-xs uppercase tracking-[0.3em] text-center mb-2" style={{ color: colors.textMuted }}>
          Tamu Undangan
        </p>
        <h2
          className="text-3xl font-light text-center mb-8"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          Ucapan & Doa
        </h2>

        <form
          onSubmit={(e) => wish.submit(e, invitation.id)}
          className="mb-8 space-y-3"
        >
          <input
            value={wish.name}
            onChange={(e) => wish.setName(e.target.value)}
            placeholder="Nama Anda"
            required
            className={`w-full border px-3 py-2 text-sm ${inputRounded}`}
            style={{ borderColor: colors.border, background: colors.bg, color: colors.text }}
          />
          <textarea
            value={wish.message}
            onChange={(e) => wish.setMessage(e.target.value)}
            placeholder="Tulis ucapan & doa untuk mempelai..."
            required
            rows={3}
            className={`w-full border px-3 py-2 text-sm ${inputRounded}`}
            style={{ borderColor: colors.border, background: colors.bg, color: colors.text }}
          />
          <button
            type="submit"
            className={`w-full py-2 text-sm transition-opacity hover:opacity-90 ${inputRounded}`}
            style={{ background: colors.accent, color: isMinimalist ? colors.bg : colors.dark }}
          >
            {wish.sent ? "Terkirim!" : "Kirim Ucapan"}
          </button>
        </form>

        <div
          className="space-y-4 max-h-80 overflow-y-auto pr-1"
          style={isMinimalist ? { borderTop: `1px solid ${colors.border}` } : {}}
        >
          {wishes.map((w) => (
            <motion.div
              key={w.id}
              initial={reduce ? {} : { opacity: 0, y: 10 }}
              animate={reduce ? {} : { opacity: 1, y: 0 }}
              className={isMinimalist ? "py-3" : `p-4 ${cardRounded}`}
              style={isMinimalist ? { borderBottom: `1px solid ${colors.border}` } : { background: "#fff" }}
            >
              <p className="font-medium text-sm" style={{ color: colors.text }}>
                {w.name}
              </p>
              <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
                {w.message}
              </p>
              <p className="text-xs mt-1" style={{ color: colors.textMuted, opacity: 0.6 }}>
                {new Date(w.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>
    </section>
  );
}
