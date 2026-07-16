"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import BlueprintCard from "@/components/themes/shared/BlueprintCard";
import { useCountdown } from "@/hooks/useCountdown";

interface Props {
  invitation: Invitation;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div
        className="text-3xl md:text-4xl font-medium text-[var(--foil-gold)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mt-1">{label}</p>
    </div>
  );
}

export default function FoilCountdownSection({ invitation }: Props) {
  const countdown = useCountdown(new Date(invitation.weddingDate));
  const reduce = useReducedMotion();

  const childVariants: Variants = reduce ? { hidden: {}, visible: {} } : {
    hidden: { opacity: 0, scale: 0.92, y: 12 },
    visible: {
      opacity: 1, scale: 1, y: 0,
      transition: { type: "spring", stiffness: 100, damping: 18 },
    },
  };

  const items = [
    { value: countdown.days, label: "Hari" },
    { value: countdown.hours, label: "Jam" },
    { value: countdown.mins, label: "Menit" },
    { value: countdown.secs, label: "Detik" },
  ];

  return (
    <section className="py-16 px-6" style={{ background: "#171b23" }}>
      <Section direction="up" stagger staggerDelay={0.15} className="text-center max-w-lg mx-auto">
        <motion.p
          variants={childVariants}
          className="text-xs uppercase tracking-[0.3em] mb-2"
          style={{ color: "var(--foil-gold)", opacity: 0.7 }}
        >
          {countdown.isOver ? "Hari Bahagia" : "Menuju Hari Bahagia"}
        </motion.p>
        <motion.h2
          variants={childVariants}
          className="text-3xl mb-8"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}
        >
          {countdown.isOver ? "Acara Telah Berlangsung" : "Hitung Mundur"}
        </motion.h2>
        {countdown.isOver ? (
          <motion.p
            variants={childVariants}
            className="text-lg"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-secondary)" }}
          >
            Terima kasih telah menjadi bagian dari hari bahagia kami
          </motion.p>
        ) : (
          <motion.div
            className="grid grid-cols-4 gap-4"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {items.map((item) => (
              <motion.div key={item.label} variants={childVariants}>
                <BlueprintCard>
                  <CountdownBox value={item.value} label={item.label} />
                </BlueprintCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Section>
    </section>
  );
}
