"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";

interface Props {
  invitation: Invitation;
  guestName?: string;
}

export default function BohoRSVPSection({ invitation, guestName }: Props) {
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
    <section className="py-16 px-6" style={{ background: "#faf5ed" }}>
      <Section direction="up" stagger staggerDelay={0.15} className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <motion.p
            variants={childVariants}
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "#d4a853", opacity: 0.7 }}
          >
            Konfirmasi Kehadiran
          </motion.p>
          <motion.h2
            variants={childVariants}
            className="text-3xl mt-2"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500, color: "#3d322b" }}
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
                className="p-8 rounded-lg text-center"
                style={{ background: "#fdf9f2", border: "1px solid #e2d5c5" }}
              >
                <p className="text-xl mb-2" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#d4a853" }}>
                  Terima kasih!
                </p>
                <p className="text-sm" style={{ color: "#8c7d70" }}>
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
                className="p-6 rounded-lg"
                style={{ background: "#fdf9f2", border: "1px solid #e2d5c5" }}
              >
                <form onSubmit={submit} className="space-y-4">
                  <motion.div variants={childVariants}>
                    <label className="block text-xs mb-1" style={{ color: "#8c7d70" }}>Nama</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                    <label className="block text-xs mb-2" style={{ color: "#8c7d70" }}>Kehadiran</label>
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
                            background: attendance === opt.val ? "#d4a853" : "transparent",
                            border: `1px solid ${attendance === opt.val ? "#d4a853" : "#e2d5c5"}`,
                            color: attendance === opt.val ? "#fff" : "#8c7d70",
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
                      <label className="block text-xs mb-1" style={{ color: "#8c7d70" }}>
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
                          background: "#faf5ed",
                          border: "1px solid #e2d5c5",
                          color: "#3d322b",
                        }}
                      />
                    </motion.div>
                  )}
                  <motion.button
                    type="submit"
                    variants={childVariants}
                    whileHover={reduce ? {} : { scale: 1.01 }}
                    whileTap={reduce ? {} : { scale: 0.99 }}
                    className="w-full py-3 rounded-md font-medium text-sm transition-all duration-300 hover:opacity-90"
                    style={{ background: "#d4a853", color: "#fff" }}
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
