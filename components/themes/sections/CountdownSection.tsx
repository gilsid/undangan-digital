"use client";

import { useCountdown } from "@/hooks/useCountdown";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";

interface Props {
  invitation: Invitation;
}

function CountdownItem({ value, label, fontClass, valueStyle }: {
  value: number;
  label: string;
  fontClass: string;
  valueStyle: React.CSSProperties;
}) {
  return (
    <div className="text-center">
      <div
        className={`${fontClass} text-3xl md:text-4xl`}
        style={valueStyle}
      >
        {String(value).padStart(2, "0")}
      </div>
      <p className="text-xs uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

export default function CountdownSection({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors, layout, fonts, decorations } = config;
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
    { value: cd.days, label: variant === "line-separated" ? "Days" : "Hari" },
    { value: cd.hours, label: variant === "line-separated" ? "Hours" : "Jam" },
    { value: cd.mins, label: variant === "line-separated" ? "Mins" : "Menit" },
    { value: cd.secs, label: variant === "line-separated" ? "Secs" : "Detik" },
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
              />
            ))}
          </div>
        )}

        {variant === "card-grid" && (
          <div className="flex justify-center gap-4 max-w-sm mx-auto">
            {items.map((item) => (
              <div
                key={item.label}
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
              </div>
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
              <div key={item.label} className="flex-1 py-4 relative">
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
              </div>
            ))}
          </div>
        )}
      </Section>
    </section>
  );
}
