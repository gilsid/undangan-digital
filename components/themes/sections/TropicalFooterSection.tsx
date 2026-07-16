"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";

interface Props {
  invitation: Invitation;
}

const C = {
  bg: "#f7f5ef",
  text: "#2a4231",
  sage: "#7e9b85",
  coral: "#e8846b",
  emerald: "#2d5a4b",
  border: "#d6e2d4",
};

export default function TropicalFooterSection({ invitation }: Props) {
  const reduce = useReducedMotion();

  const childVariants: Variants = reduce ? { hidden: {}, visible: {} } : {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.3, 1] as const } },
  };

  const dividerVariants: Variants = reduce ? { hidden: {}, visible: {} } : {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.6, ease: [0.25, 0.4, 0.3, 1] as const } },
  };

  return (
    <footer className="py-12 px-6 text-center" style={{ background: C.bg }}>
      <Section direction="up" stagger staggerDelay={0.15} className="max-w-md mx-auto">
        <motion.div
          variants={dividerVariants}
          className="h-px w-16 mx-auto mb-6"
          style={{ background: C.sage, transformOrigin: "left" }}
        />
        <motion.p
          variants={childVariants}
          className="text-2xl"
          style={{ fontFamily: "Playfair Display, serif", fontWeight: 300, color: C.text }}
        >
          {invitation.groomName} & {invitation.brideName}
        </motion.p>
        <motion.p
          variants={childVariants}
          className="text-sm mt-2"
          style={{ color: C.sage }}
        >
          {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </motion.p>
        <motion.p
          variants={childVariants}
          className="text-xs mt-6"
          style={{ color: C.sage, opacity: 0.6 }}
        >
          Terima kasih atas doa dan kehadiran Anda
        </motion.p>
      </Section>
    </footer>
  );
}