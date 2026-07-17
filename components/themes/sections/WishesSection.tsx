"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  const [newWishId, setNewWishId] = useState<string | null>(null);
  const wish = useWish({
    onSubmit: (w) => {
      setWishes((prev) => [w, ...prev]);
      setNewWishId(w.id);
      setTimeout(() => setNewWishId(null), 2500);
    },
  });

  const isMinimalist = config.id === "minimalist";
  const isRustic = config.id === "rustic";

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

        <motion.form
          onSubmit={(e) => wish.submit(e, invitation.id)}
          className="mb-8 space-y-3"
          whileHover={reduce ? {} : { scale: 1.01 }}
          transition={{ duration: 0.2 }}
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
          <motion.button
            type="submit"
            whileHover={reduce ? {} : { scale: 1.02 }}
            whileTap={reduce ? {} : { scale: 0.97 }}
            className={`w-full py-2 text-sm transition-opacity hover:opacity-90 ${inputRounded}`}
            style={{ background: colors.accent, color: isMinimalist ? colors.bg : colors.dark }}
          >
            {wish.sent ? "Terkirim!" : "Kirim Ucapan"}
          </motion.button>
          {wish.error && (
            <motion.p
              initial={reduce ? {} : { opacity: 0, y: 4 }}
              animate={reduce ? {} : { opacity: 1, y: 0 }}
              className="text-xs mt-2 text-center"
              style={{ color: "#ef4444" }}
            >
              {wish.error}
            </motion.p>
          )}
        </motion.form>

        <div
          className="space-y-4 max-h-80 overflow-y-auto pr-1"
          style={isMinimalist ? { borderTop: `1px solid ${colors.border}` } : {}}
        >
          <AnimatePresence mode="popLayout">
            {wishes.map((w, i) => {
              const isNew = newWishId === w.id && !reduce;
              return (
                <motion.div
                  key={w.id}
                  layout
                  initial={isNew ? { opacity: 0, x: 80 } : { opacity: 0, y: 10 }}
                  animate={
                    isNew
                      ? { opacity: 1, x: 0, background: isMinimalist ? colors.bg : "#fff" }
                      : { opacity: 1, y: 0 }
                  }
                  exit={reduce ? {} : { opacity: 0, x: -60, transition: { duration: 0.2 } }}
                  transition={
                    isNew
                      ? { x: { type: "spring", stiffness: 220, damping: 20 }, background: { duration: 2, ease: "easeOut" } }
                      : { delay: i * 0.05 }
                  }
                  className={isMinimalist ? "py-3" : `p-4 ${cardRounded}`}
                  style={{
                    ...(isMinimalist ? { borderBottom: `1px solid ${colors.border}` } : { background: "#fff" }),
                    ...(isNew && !isMinimalist ? { background: "#f59e0b" } : {}),
                  }}
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
              );
            })}
          </AnimatePresence>
        </div>
      </Section>
    </section>
  );
}
