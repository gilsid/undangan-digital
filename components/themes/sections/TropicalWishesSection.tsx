"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Invitation, Wish } from "@prisma/client";
import Section from "@/components/themes/template/Section";

interface Props {
  invitation: Invitation;
  initialWishes: Wish[];
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

export default function TropicalWishesSection({ invitation, initialWishes }: Props) {
  const [wishName, setWishName] = useState("");
  const [wishMsg, setWishMsg] = useState("");
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [wishSent, setWishSent] = useState(false);
  const [newWishId, setNewWishId] = useState<string | null>(null);
  const reduce = useReducedMotion();

  async function submitWish(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invitationId: invitation.id,
        name: wishName,
        message: wishMsg,
      }),
    });
    if (res.ok) {
      const w = await res.json();
      setWishes((p) => [w, ...p]);
      setWishName("");
      setWishMsg("");
      setWishSent(true);
      setNewWishId(w.id);
      setTimeout(() => { setWishSent(false); setNewWishId(null); }, 3000);
    }
  }

  const childVariants: Variants = reduce ? { hidden: {}, visible: {} } : {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

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
          className="rounded-lg p-6 mb-8"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <form onSubmit={submitWish} className="space-y-3">
            <motion.div variants={childVariants}>
              <input
                value={wishName}
                onChange={(e) => setWishName(e.target.value)}
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
                value={wishMsg}
                onChange={(e) => setWishMsg(e.target.value)}
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
              className="w-full py-2 rounded-md text-sm transition-all duration-300 hover:opacity-90 text-white"
              style={{ background: C.emerald }}
            >
              {wishSent ? "Terkirim!" : "Kirim Ucapan"}
            </motion.button>
          </form>
        </div>

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
                background: C.surface,
                border: `1px solid ${w.id === newWishId ? C.emerald : C.border}`,
                transition: w.id === newWishId ? "background-color 2s ease-out" : "none",
              }}
            >
              <p className="text-sm font-medium" style={{ color: C.text }}>{w.name}</p>
              <p className="text-sm mt-1" style={{ color: C.sage }}>{w.message}</p>
              <p className="text-xs mt-1" style={{ color: C.sage }}>
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