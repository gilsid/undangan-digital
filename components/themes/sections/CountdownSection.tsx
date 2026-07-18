"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { motion, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import BlueprintCard from "@/components/themes/shared/BlueprintCard";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";

interface Props {
  invitation: Invitation;
}

/** Per-theme countdown card config — zero visual change guarantee */
interface CountdownTheme {
  bg: string;
  subtitleColor: string;
  subtitleOpacity: number;
  titleColor: string;
  titleFont: string;
  titleWeight: string | number | undefined;
  titleStyle: string | undefined;
  valueColor: string;
  valueFont: string;
  valueWeight: string | number | undefined;
  labelColor: string;
  isOverMsgColor: string;
  useBlueprintCard: boolean;
  useCardBox: boolean;
  cardBoxBg: string;
  cardBoxBorder: string;
}

function getCountdownTheme(id: string, colors: Record<string, string>): CountdownTheme {
  switch (id) {
    case "boho":
      return {
        bg: "#fdf9f2",
        subtitleColor: "#d4a853",
        subtitleOpacity: 0.7,
        titleColor: "#3d322b",
        titleFont: "'Playfair Display', serif",
        titleWeight: 500,
        titleStyle: "italic",
        valueColor: "#d4a853",
        valueFont: "'Playfair Display', serif",
        valueWeight: "medium",
        labelColor: "#8c7d70",
        isOverMsgColor: "#8c7d70",
        useBlueprintCard: false,
        useCardBox: false,
        cardBoxBg: "",
        cardBoxBorder: "",
      };
    case "foil-blueprint":
      return {
        bg: "#171b23",
        subtitleColor: "var(--foil-gold)",
        subtitleOpacity: 0.7,
        titleColor: "var(--text-primary)",
        titleFont: "var(--font-display)",
        titleWeight: 500,
        titleStyle: undefined,
        valueColor: "var(--foil-gold)",
        valueFont: "var(--font-mono)",
        valueWeight: "medium",
        labelColor: "var(--text-muted)",
        isOverMsgColor: "var(--text-secondary)",
        useBlueprintCard: true,
        useCardBox: false,
        cardBoxBg: "",
        cardBoxBorder: "",
      };
    case "tropical":
      return {
        bg: colors.bg,
        subtitleColor: colors.textMuted,
        subtitleOpacity: 1,
        titleColor: colors.text,
        titleFont: "'Playfair Display', serif",
        titleWeight: 300,
        titleStyle: undefined,
        valueColor: colors.secondary,
        valueFont: "'Playfair Display', serif",
        valueWeight: 300,
        labelColor: colors.textMuted,
        isOverMsgColor: colors.textMuted,
        useBlueprintCard: false,
        useCardBox: true,
        cardBoxBg: colors.surface,
        cardBoxBorder: colors.border,
      };
    default:
      return {
        bg: "",
        subtitleColor: "",
        subtitleOpacity: 1,
        titleColor: "",
        titleFont: "",
        titleWeight: undefined,
        titleStyle: undefined,
        valueColor: "",
        valueFont: "",
        valueWeight: undefined,
        labelColor: "",
        isOverMsgColor: "",
        useBlueprintCard: false,
        useCardBox: false,
        cardBoxBg: "",
        cardBoxBorder: "",
      };
  }
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
      <div className={`${fontClass} text-3xl md:text-4xl`} style={valueStyle}>
        {String(value).padStart(2, "0")}
      </div>
      <p className="text-xs uppercase tracking-widest mt-1">{label}</p>
    </motion.div>
  );
}

export default function CountdownSection({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors, layout, fonts } = config;
  const reduce = useReducedMotion();
  const cd = useCountdown(new Date(invitation.weddingDate));
  const variant = layout.countdown;
  const id = config.id;

  const title = cd.isOver ? "Acara Telah Berlangsung" : "Menuju Hari Bahagia";
  const subtitle = cd.isOver ? "Hari Bahagia" : "Hitung Mundur";

  const items = [
    { value: cd.days, label: variant === "line-separated" ? "Days" : "Hari", key: "days" as const },
    { value: cd.hours, label: variant === "line-separated" ? "Hours" : "Jam", key: "hours" as const },
    { value: cd.mins, label: variant === "line-separated" ? "Mins" : "Menit", key: "mins" as const },
    { value: cd.secs, label: variant === "line-separated" ? "Secs" : "Detik", key: "secs" as const },
  ];

  // ── Non-Elegant path (Boho/Foil/Tropical) — card-grid with Section stagger ──
  if (id !== "elegant") {
    const theme = getCountdownTheme(id, colors as unknown as Record<string, string>);

    if (cd.isOver) {
      return (
        <section className="py-16 px-6" style={{ background: theme.bg }}>
          <Section direction="up" stagger staggerDelay={0.15} className="text-center max-w-lg mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: theme.subtitleColor, opacity: theme.subtitleOpacity }}>
              {subtitle}
            </p>
            <h2 className="text-3xl mb-8" style={{ fontFamily: theme.titleFont, fontWeight: theme.titleWeight, fontStyle: theme.titleStyle, color: theme.titleColor }}>
              {title}
            </h2>
            <p className="text-lg" style={{ fontFamily: theme.titleFont, color: theme.isOverMsgColor }}>
              Terima kasih telah menjadi bagian dari hari bahagia kami
            </p>
          </Section>
        </section>
      );
    }

    const childVariants = {
      hidden: reduce ? {} : { opacity: 0, scale: 0.92, y: 12 },
      visible: reduce ? {} : { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 18 } },
    };

    const isFoil = id === "foil-blueprint";

    return (
      <section className="py-16 px-6" style={{ background: theme.bg }}>
        <Section direction="up" stagger staggerDelay={0.15} className="text-center max-w-lg mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: theme.subtitleColor, opacity: theme.subtitleOpacity }}>
            {subtitle}
          </p>
          <h2 className="text-3xl mb-8" style={{ fontFamily: theme.titleFont, fontWeight: theme.titleWeight, fontStyle: theme.titleStyle, color: theme.titleColor }}>
            {title}
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {items.map((item) => {
              const inner = theme.useCardBox ? (
                <div className="rounded-lg px-3 py-4" style={{ background: theme.cardBoxBg, border: `1px solid ${theme.cardBoxBorder}` }}>
                  <div className="text-3xl md:text-4xl" style={{ fontFamily: theme.valueFont, fontWeight: theme.valueWeight, color: theme.valueColor }}>
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <p className="text-xs uppercase tracking-widest mt-1" style={{ color: theme.labelColor }}>{item.label}</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-3xl md:text-4xl" style={{ fontFamily: theme.valueFont, fontWeight: theme.valueWeight, color: theme.valueColor }}>
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <p className="text-xs uppercase tracking-widest mt-1" style={{ color: theme.labelColor }}>{item.label}</p>
                </div>
              );
              return isFoil
                ? <BlueprintCard key={item.label}><motion.div variants={childVariants}>{inner}</motion.div></BlueprintCard>
                : <motion.div key={item.label} variants={childVariants}>{inner}</motion.div>;
            })}
          </div>
        </Section>
      </section>
    );
  }

  // ── Elegant path — 3 layout variants ──
  if (cd.isOver) {
    return (
      <section className="py-16 px-6 text-center" style={{ background: colors.bg }}>
        <Section>
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: colors.textMuted }}>{subtitle}</p>
          <h2 className="text-3xl font-light mt-2 mb-8" style={{ fontFamily: fonts.display, color: colors.text }}>{title}</h2>
          <p className="text-lg font-light" style={{ fontFamily: fonts.display, color: colors.textMuted }}>
            Terima kasih telah menjadi bagian dari hari bahagia kami
          </p>
        </Section>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 text-center" style={{ background: colors.bg }}>
      <Section>
        <p className="text-xs uppercase tracking-[0.3em]" style={{ color: colors.textMuted }}>{subtitle}</p>
        <h2 className="text-3xl font-light mt-2 mb-10" style={{ fontFamily: fonts.display, color: colors.text }}>{title}</h2>

        {variant === "vertical-stack" && (
          <div className="flex justify-center gap-8">
            {items.map((item) => (
              <CountdownItem
                key={item.label} value={item.value} label={item.label} fontClass=""
                valueStyle={{ fontFamily: fonts.display, color: colors.accent }}
                delay={stagger[item.key]}
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
                transition={{ ...springPop, delay: stagger[item.key] }}
                className="flex-1 p-3 rounded-lg"
                style={{ background: "#f2ede4", border: "1px solid #c2593f" }}
              >
                <div className="text-2xl font-semibold" style={{ fontFamily: fonts.display, color: colors.text }}>
                  {String(item.value).padStart(2, "0")}
                </div>
                <p className="text-xs mt-1" style={{ color: colors.textMuted }}>{item.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {variant === "line-separated" && (
          <div className="flex justify-between max-w-xs mx-auto" style={{ borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
            {items.map((item, i) => (
              <motion.div
                key={item.label}
                className="flex-1 py-4 relative"
                initial={reduce ? {} : { opacity: 0, scale: 0.8 }}
                animate={reduce ? {} : { opacity: 1, scale: 1 }}
                transition={{ ...springPop, delay: stagger[item.key] }}
              >
                <div className="text-xl font-medium" style={{ fontFamily: fonts.display, color: colors.text }}>
                  {String(item.value).padStart(2, "0")}
                </div>
                <p className="text-xs mt-1" style={{ color: colors.textMuted }}>{item.label}</p>
                {i < items.length - 1 && (
                  <div className="absolute right-0 top-4 bottom-4 w-px" style={{ background: colors.border }} />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </Section>
    </section>
  );
}
