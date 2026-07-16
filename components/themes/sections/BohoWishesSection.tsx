"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Invitation, Wish } from "@prisma/client";
import Section from "@/components/themes/template/Section";

interface Props {
  invitation: Invitation;
  initialWishes: Wish[];
}

export default function BohoWishesSection({ invitation, initialWishes }: Props) {
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.3, 1] as const } },
  };

  const wishVariants = {
    hidden: { opacity: 0, y: 10, x: 0 },
    visible: (i: number) => ({
      opacity: 1, y: 0, x: 0,
      transition: { delay: i * 0.03, duration: 0.4 },
    }),
  };

  return (
    <section className="py-16 px-6" style={{ background: "#faf5ed" }}>
      <Section direction="up" stagger staggerDelay={0.15} className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <motion.p
            variants={childVariants}
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "#d4a853", opacity: 0.7 }}
          >
            Tamu Undangan
          </motion.p>
          <motion.h2
            variants={childVariants}
            className="text-3xl mt-2"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500, color: "#3d322b" }}
          >
            Ucapan & Doa
          </motion.h2>
        </div>

        <div
          className="p-6 rounded-lg mb-8"
          style={{ background: "#fdf9f2", border: "1px solid #e2d5c5" }}
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
                  background: "#faf5ed",
                  border: "1px solid #e2d5c5",
                  color: "#3d322b",
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
                  background: "#faf5ed",
                  border: "1px solid #e2d5c5",
                  color: "#3d322b",
                }}
              />
            </motion.div>
            <motion.button
              type="submit"
              variants={childVariants}
              whileHover={reduce ? {} : { scale: 1.01 }}
              whileTap={reduce ? {} : { scale: 0.99 }}
              className="w-full py-2 rounded-md text-sm transition-all duration-300 hover:opacity-90"
              style={{ background: "#d4a853", color: "#fff" }}
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
                background: "#fdf9f2",
                border: w.id === newWishId ? "1px solid #d4a853" : "1px solid #e2d5c5",
                transition: w.id === newWishId ? "border-color 2s ease-out" : "none",
              }}
            >
              <p className="text-sm font-medium" style={{ color: "#3d322b" }}>{w.name}</p>
              <p className="text-sm mt-1" style={{ color: "#8c7d70" }}>{w.message}</p>
              <p className="text-xs mt-1" style={{ color: "#8c7d70" }}>
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
