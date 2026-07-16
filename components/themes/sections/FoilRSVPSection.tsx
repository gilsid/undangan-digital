"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import BlueprintCard from "@/components/themes/shared/BlueprintCard";

interface Props {
  invitation: Invitation;
  guestName?: string;
}

export default function FoilRSVPSection({ invitation, guestName }: Props) {
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="py-16 px-6" style={{ background: "#12151c" }}>
      <Section direction="up" stagger staggerDelay={0.15} className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <motion.p
            variants={childVariants}
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "var(--foil-gold)", opacity: 0.7 }}
          >
            Konfirmasi Kehadiran
          </motion.p>
          <motion.h2
            variants={childVariants}
            className="text-3xl mt-2"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}
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
              <BlueprintCard className="text-center py-8">
                <p className="text-xl mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--foil-gold)" }}>
                  Terima kasih!
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Konfirmasi kehadiran Anda telah kami terima.
                </p>
              </BlueprintCard>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={reduce ? {} : { opacity: 1 }}
              exit={reduce ? {} : { opacity: 0, scale: 0.8 }}
            >
              <BlueprintCard>
                <form onSubmit={submit} className="space-y-4">
                  <motion.div variants={childVariants}>
                    <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>Nama</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                    <label className="block text-xs mb-2" style={{ color: "var(--text-muted)" }}>Kehadiran</label>
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
                            background: attendance === opt.val ? "var(--foil-gold)" : "transparent",
                            border: `1px solid ${attendance === opt.val ? "var(--foil-gold)" : "rgba(216,185,120,0.18)"}`,
                            color: attendance === opt.val ? "#12151c" : "var(--text-muted)",
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
                      <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>
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
                          background: "#20242f",
                          border: "1px solid rgba(216,185,120,0.18)",
                          color: "var(--text-primary)",
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
                    style={{ background: "var(--foil-gold)", color: "#12151c" }}
                  >
                    Kirim Konfirmasi
                  </motion.button>
                </form>
              </BlueprintCard>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>
    </section>
  );
}
