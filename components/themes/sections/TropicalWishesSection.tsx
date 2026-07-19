"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Invitation, Wish } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import { useWish, childEasedVariant, formatDateID } from "@/hooks/useThemeCommon";

const C = {
  bg: "#f7f5ef",
  surface: "#ffffff",
  text: "#2a4231",
  sage: "#7e9b85",
  coral: "#e8846b",
  emerald: "#2d5a4b",
  border: "#d6e2d4",
};

interface Props {
  invitation: Invitation;
  initialWishes: Wish[];
}

export default function TropicalWishesSection({ invitation, initialWishes }: Props) {
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

  const childVariants = childEasedVariant(reduce, 0.5);

  const wishVariants = {
    hidden: { opacity: 0, y: 10, x: 0 },
    visible: (i: number) => ({
      opacity: 1, y: 0, x: 0,
      transition: { delay: i * 0.03, duration: 0.4 },
    }),
  };

  return (
    <section className="py-16 px-6" style={{ background: C.bg }}>
      <Section direction="up" stagger staggerDelay={0.15} className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <motion.p
            variants={childVariants}
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: C.sage }}
          >
            Tamu Undangan
          </motion.p>
          <motion.h2
            variants={childVariants}
            className="text-3xl mt-2"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 300, color: C.text }}
          >
            Ucapan & Doa
          </motion.h2>
        </div>

        <div
          className="p-6 rounded-lg mb-8"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <form onSubmit={(e) => wish.submit(e, invitation.id)} className="space-y-3">
            <motion.div variants={childVariants}>
              <input
                value={wish.name}
                onChange={(e) => wish.setName(e.target.value)}
                placeholder="Nama Anda"
                required
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  color: C.text,
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
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                }}
              />
            </motion.div>
            <motion.button
              type="submit"
              variants={childVariants}
              whileHover={reduce ? {} : { scale: 1.01 }}
              whileTap={reduce ? {} : { scale: 0.99 }}
              className="w-full py-2 rounded-md text-sm transition-all duration-300 hover:opacity-90"
              style={{ background: C.coral, color: "#fff" }}
            >
              {wish.sent ? "Terkirim!" : "Kirim Ucapan"}
            </motion.button>
          </form>
        </div>

        <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
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
                background: C.surface,
                border: w.id === newWishId ? `1px solid ${C.coral}` : `1px solid ${C.border}`,
                transition: w.id === newWishId ? "border-color 2s ease-out" : "none",
              }}
            >
              <p className="text-sm font-medium" style={{ color: C.text }}>{w.name}</p>
              <p className="text-sm mt-1" style={{ color: C.sage }}>{w.message}</p>
              <p className="text-xs mt-1" style={{ color: C.sage }}>
                {formatDateID(w.createdAt)}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>
    </section>
  );
}
