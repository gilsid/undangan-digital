"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";

interface Props {
  invitation: Invitation;
}

const spring = { type: "spring" as const, stiffness: 200, damping: 18 };

export default function FooterSection({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors, fonts } = config;
  const reduce = useReducedMotion();
  const isMinimalist = config.id === "minimalist";

  const bg = isMinimalist ? colors.surface : colors.dark;
  const textColor = isMinimalist ? colors.text : "#ffffff";
  const mutedColor = isMinimalist ? colors.textMuted : "rgba(255,255,255,0.4)";
  const dividerColor = isMinimalist ? colors.border : colors.accent;
  const thankYou = isMinimalist ? "Thank You" : "Terima kasih atas doa dan kehadiran Anda";

  const stagger = {
    names: 0,
    date: 0.15,
    divider: 0.25,
    thanks: 0.4,
  };

  return (
    <footer className="py-12 px-6 text-center" style={{ background: bg }}>
      <Section>
        <motion.p
          className="text-3xl font-light"
          style={{ fontFamily: fonts.display, color: textColor }}
          initial={reduce ? {} : { opacity: 0, y: 10 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={spring}
        >
          {invitation.groomName} & {invitation.brideName}
        </motion.p>
        <motion.p
          className="text-sm mt-2"
          style={{ color: mutedColor }}
          initial={reduce ? {} : { opacity: 0, y: 8 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ ...spring, delay: stagger.date }}
        >
          {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </motion.p>
        <motion.div
          className="h-px w-24 mx-auto my-6"
          style={{ background: dividerColor, opacity: isMinimalist ? 1 : 0.3, originX: 0 }}
          initial={reduce ? {} : { scaleX: 0 }}
          animate={reduce ? {} : { scaleX: 1 }}
          transition={{ ...spring, delay: stagger.divider }}
        />
        <motion.p
          className="text-xs"
          style={{ color: mutedColor }}
          initial={reduce ? {} : { opacity: 0, y: 8 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ ...spring, delay: stagger.thanks }}
        >
          {thankYou}
        </motion.p>
      </Section>
    </footer>
  );
}
