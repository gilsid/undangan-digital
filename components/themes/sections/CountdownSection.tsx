"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { motion, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";

interface Props {
  invitation: Invitation;
}

const stagger = {
  days: 0,
  hours: 0.1,
  mins: 0.2,
  secs: 0.3,
};

const springPop = { type: "spring" as const, stiffness: 200, damping: 14 };

function CountdownItem({ value, label, fontClass, valueStyle, delay }: {
  value: number;
  label: string;
  fontClass: string;
  valueStyle: React.CSSProperties;
  delay: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="text-center"
      initial={reduce ? {} : { opacity: 0, scale: 0.8 }}
      animate={reduce ? {} : { opacity: 1, scale: 1 }}
      transition={{ ...springPop, delay }}
    >
      <div
        className={`${fontClass} text-3xl md:text-4xl`}
        style={valueStyle}
      >
        {String(value).padStart(2, "0")}
      </div>
      <p className="text-xs uppercase tracking-widest mt-1">{label}</p>
    </motion.div>
  );
}

export default function CountdownSection({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors, layout, fonts, decorations } = config;
  const reduce = useReducedMotion();
  const cd = useCountdown(new Date(invitation.weddingDate));
  const variant = layout.countdown;

  const title = cd.isOver ? "Acara Telah Berlangsung" : "Menuju Hari Bahagia";
  const subtitle = cd.isOver ? "Hari Bahagia" : "Hitung Mundur";

  if (cd.isOver) {
    return (
      <section className="py-16 px-6 text-center" style={{ background: colors.bg }}>
        <Section>
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: colors.textMuted }}>
            {subtitle}
          </p>
          <h2
            className="text-3xl font-light mt-2 mb-8"
            style={{ fontFamily: fonts.display, color: colors.text }}
          >
            {title}
          </h2>
          <p
            className="text-lg font-light"
            style={{ fontFamily: fonts.display, color: colors.textMuted }}
          >
            Terima kasih telah menjadi bagian dari hari bahagia kami
          </p>
        </Section>
      </section>
    );
  }

  const items = [
    { value: cd.days, label: variant === "line-separated" ? "Days" : "Hari", key: "days" },
    { value: cd.hours, label: variant === "line-separated" ? "Hours" : "Jam", key: "hours" },
    { value: cd.mins, label: variant === "line-separated" ? "Mins" : "Menit", key: "mins" },
    { value: cd.secs, label: variant === "line-separated" ? "Secs" : "Detik", key: "secs" },
  ];

  return (
    <section className="py-16 px-6 text-center" style={{ background: colors.bg }}>
      <Section>
        <p className="text-xs uppercase tracking-[0.3em]" style={{ color: colors.textMuted }}>
          {subtitle}
        </p>
        <h2
          className="text-3xl font-light mt-2 mb-10"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          {title}
        </h2>

        {variant === "vertical-stack" && (
          <div className="flex justify-center gap-8">
            {items.map((item) => (
              <CountdownItem
                key={item.label}
                value={item.value}
                label={item.label}
                fontClass=""
                valueStyle={{ fontFamily: fonts.display, color: colors.accent }}
                delay={stagger[item.key as keyof typeof stagger]}
              />
            ))}
          </div>
        )}

        {variant === "card-grid" && (
          <div className="flex justify-center gap-4 max-w-sm mx-auto">
            {items.map((item) => (
              <motion.div
                key={item.label}
                initial={reduce ? {} : { opacity: 0, scale: 0.8 }}
                animate={reduce ? {} : { opacity: 1, scale: 1 }}
                transition={{ ...springPop, delay: stagger[item.key as keyof typeof stagger] }}
                className="flex-1 p-3 rounded-lg"
                style={{ background: "#f2ede4", border: "1px solid #c2593f" }}
              >
                <div
                  className="text-2xl font-semibold"
                  style={{ fontFamily: fonts.display, color: colors.text }}
                >
                  {String(item.value).padStart(2, "0")}
                </div>
                <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {variant === "line-separated" && (
          <div
            className="flex justify-between max-w-xs mx-auto"
            style={{
              borderTop: `1px solid ${colors.border}`,
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            {items.map((item, i) => (
              <motion.div
                key={item.label}
                className="flex-1 py-4 relative"
                initial={reduce ? {} : { opacity: 0, scale: 0.8 }}
                animate={reduce ? {} : { opacity: 1, scale: 1 }}
                transition={{ ...springPop, delay: stagger[item.key as keyof typeof stagger] }}
              >
                <div
                  className="text-xl font-medium"
                  style={{ fontFamily: fonts.display, color: colors.text }}
                >
                  {String(item.value).padStart(2, "0")}
                </div>
                <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                  {item.label}
                </p>
                {i < items.length - 1 && (
                  <div
                    className="absolute right-0 top-4 bottom-4 w-px"
                    style={{ background: colors.border }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </Section>
    </section>
  );
}
