"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Invitation, Wish } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import BlueprintCard from "@/components/themes/shared/BlueprintCard";
import { useWish, childVariant, formatDateID } from "@/hooks/useThemeCommon";

interface Props {
  invitation: Invitation;
  initialWishes: Wish[];
}

export default function FoilWishesSection({ invitation, initialWishes }: Props) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [newWishId, setNewWishId] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const wish = useWish({
    onSubmit: (w) => {
      setWishes((prev) => [w, ...prev]);
      setNewWishId(w.id);
      setTimeout(() => setNewWishId(null), 3000);
    },
  });

  const childVariants = childVariant(reduce, 16, 0.5);

  const wishVariants = {
    hidden: { opacity: 0, y: 10, x: 0 },
    visible: (i: number) => ({
      opacity: 1, y: 0, x: 0,
      transition: { delay: i * 0.03, duration: 0.4 },
    }),
  };

  return (
    <section className="py-16 px-6" style={{ background: "#0e1016" }}>
      <Section direction="up" stagger staggerDelay={0.15} className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <motion.p
            variants={childVariants}
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "var(--foil-gold)", opacity: 0.7 }}
          >
            Tamu Undangan
          </motion.p>
          <motion.h2
            variants={childVariants}
            className="text-3xl mt-2"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}
          >
            Ucapan & Doa
          </motion.h2>
        </div>

        <BlueprintCard className="mb-8 p-6">
          <form onSubmit={(e) => wish.submit(e, invitation.id)} className="space-y-3">
            <motion.div variants={childVariants}>
              <input
                value={wish.name}
                onChange={(e) => wish.setName(e.target.value)}
                placeholder="Nama Anda"
                required
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  background: "#20242f",
                  border: "1px solid rgba(216,185,120,0.18)",
                  color: "var(--text-primary)",
                }}
              />
            </motion.div>
            <motion.div variants={childVariants}>
              <textarea
                value={wish.message}
                onChange={(e) => wish.setMessage(e.target.value)}
                placeholder="Tulis ucapan & doa untuk mempelai..."
                required
                rows={3}
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  background: "#20242f",
                  border: "1px solid rgba(216,185,120,0.18)",
                  color: "var(--text-primary)",
                }}
              />
            </motion.div>
            <motion.button
              type="submit"
              variants={childVariants}
              whileHover={reduce ? {} : { scale: 1.01 }}
              whileTap={reduce ? {} : { scale: 0.99 }}
              className="w-full py-2 rounded-md text-sm transition-all duration-300 hover:opacity-90"
              style={{ background: "var(--foil-gold)", color: "#12151c" }}
            >
              {wish.sent ? "Terkirim!" : "Kirim Ucapan"}
            </motion.button>
          </form>
        </BlueprintCard>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {wishes.map((w, i) => (
            <motion.div
              key={w.id}
              custom={i}
              variants={wishVariants}
              initial={w.id === newWishId ? { opacity: 0, x: 50 } : "hidden"}
              animate={w.id === newWishId ? { opacity: 1, x: 0 } : "visible"}
              whileInView={w.id !== newWishId ? "visible" : undefined}
              viewport={{ once: true }}
              className="rounded-lg p-4"
              style={{
                background: "#20242f",
                border: w.id === newWishId ? "1px solid var(--foil-gold)" : "1px solid rgba(216,185,120,0.08)",
                transition: w.id === newWishId ? "border-color 2s ease-out" : "none",
              }}
            >
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{w.name}</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{w.message}</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                {formatDateID(w.createdAt)}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>
    </section>
  );
}
