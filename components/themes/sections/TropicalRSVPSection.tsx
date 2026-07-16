"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";

interface Props {
  invitation: Invitation;
  guestName?: string;
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

export default function TropicalRSVPSection({ invitation, guestName }: Props) {
  const [name, setName] = useState(guestName ?? "");
  const [attendance, setAttendance] = useState("HADIR");
  const [count, setCount] = useState(1);
  const [sent, setSent] = useState(false);
  const reduce = useReducedMotion();

  async function submit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invitationId: invitation.id,
        guestName: name,
        attendance,
        guestCount: count,
      }),
    });
    if (res.ok) setSent(true);
  }

  const childVariants: Variants = reduce ? { hidden: {}, visible: {} } : {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.3, 1] as const } },
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
            Konfirmasi Kehadiran
          </motion.p>
          <motion.h2
            variants={childVariants}
            className="text-3xl mt-2"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 300, color: C.text }}
          >
            RSVP
          </motion.h2>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={reduce ? {} : { opacity: 0, scale: 0.8 }}
              animate={reduce ? {} : { opacity: 1, scale: 1 }}
              exit={reduce ? {} : { opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <div
                className="rounded-lg text-center py-8 px-6"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}
              >
                <p className="text-xl mb-2" style={{ fontFamily: "Playfair Display, serif", color: C.emerald }}>
                  Terima kasih!
                </p>
                <p className="text-sm" style={{ color: C.sage }}>
                  Konfirmasi kehadiran Anda telah kami terima.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={reduce ? {} : { opacity: 1 }}
              exit={reduce ? {} : { opacity: 0, scale: 0.8 }}
            >
              <div
                className="rounded-lg p-6"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}
              >
                <form onSubmit={submit} className="space-y-4">
                  <motion.div variants={childVariants}>
                    <label className="block text-xs mb-1" style={{ color: C.sage }}>Nama</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                    <label className="block text-xs mb-2" style={{ color: C.sage }}>Kehadiran</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: "HADIR", label: "Hadir" },
                        { val: "TIDAK_HADIR", label: "Tidak Hadir" },
                        { val: "RAGU", label: "Ragu-ragu" },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setAttendance(opt.val)}
                          className="py-2 rounded-md text-xs transition-all duration-200"
                          style={{
                            background: attendance === opt.val ? C.emerald : "transparent",
                            border: `1px solid ${attendance === opt.val ? C.emerald : C.border}`,
                            color: attendance === opt.val ? "#ffffff" : C.sage,
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                  {attendance === "HADIR" && (
                    <motion.div
                      variants={childVariants}
                      initial={reduce ? {} : { opacity: 0, height: 0 }}
                      animate={reduce ? {} : { opacity: 1, height: "auto" }}
                    >
                      <label className="block text-xs mb-1" style={{ color: C.sage }}>
                        Jumlah tamu (termasuk Anda)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          background: C.bg,
                          border: `1px solid ${C.border}`,
                          color: C.text,
                        }}
                      />
                    </motion.div>
                  )}
                  <motion.button
                    type="submit"
                    variants={childVariants}
                    whileHover={reduce ? {} : { scale: 1.01 }}
                    whileTap={reduce ? {} : { scale: 0.99 }}
                    className="w-full py-3 rounded-md font-medium text-sm transition-all duration-300 hover:opacity-90 text-white"
                    style={{ background: C.emerald }}
                  >
                    Kirim Konfirmasi
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>
    </section>
  );
}