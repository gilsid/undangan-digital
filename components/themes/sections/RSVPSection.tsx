"use client";

import type { Invitation } from "@prisma/client";
import { useRsvp } from "@/hooks/useThemeCommon";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";

interface Props {
  invitation: Invitation;
  guestName?: string;
}

const attendOptions = [
  { val: "HADIR", label: "Hadir" },
  { val: "TIDAK_HADIR", label: "Tidak Hadir" },
  { val: "RAGU", label: "Ragu" },
];

export default function RSVPSection({ invitation, guestName }: Props) {
  const config = useThemeConfig();
  const { colors, decorations } = config;
  const rsvp = useRsvp({ invitationId: invitation.id, guestName });
  const isBorderOnly = decorations.cardStyle === "border-only";
  const isMinimalist = config.id === "minimalist";

  const inputRounded = isBorderOnly ? "rounded-none" : decorations.cardStyle;

  const bg = isMinimalist ? colors.bg : colors.dark;
  const textColor = isMinimalist ? colors.text : "#ffffff";
  const mutedColor = isMinimalist ? colors.textMuted : "rgba(255,255,255,0.6)";
  const inputBg = isMinimalist ? colors.bg : "rgba(255,255,255,0.1)";
  const inputBorder = isMinimalist ? colors.border : "rgba(255,255,255,0.2)";
  const titleColor = isMinimalist ? colors.text : "#ffffff";
  const dividerColor = isMinimalist ? colors.border : undefined;

  return (
    <section
      className="py-16 px-6"
      style={{
        background: bg,
        ...(isMinimalist && decorations.sectionDivider === "hairline" ? { borderBottom: `1px solid ${colors.border}` } : {}),
      }}
    >
      <Section className="max-w-md mx-auto">
        <p className="text-xs uppercase tracking-[0.3em] text-center mb-2" style={{ color: mutedColor }}>
          Konfirmasi Kehadiran
        </p>
        <h2
          className="text-3xl font-light text-center mb-8"
          style={{ fontFamily: config.fonts.display, color: titleColor }}
        >
          RSVP
        </h2>

        {rsvp.sent ? (
          <div className="text-center py-8" style={{ color: colors.accent }}>
            <p className="text-2xl mb-2" style={{ fontFamily: config.fonts.display }}>
              Terima kasih!
            </p>
            <p className="text-sm" style={{ color: mutedColor }}>
              Konfirmasi kehadiran Anda telah kami terima.
            </p>
          </div>
        ) : (
          <form onSubmit={rsvp.submit} className="space-y-4">
            <div>
              <label className="block text-xs mb-1" style={{ color: mutedColor }}>
                Nama
              </label>
              <input
                value={rsvp.name}
                onChange={(e) => rsvp.setName(e.target.value)}
                required
                className={`w-full px-3 py-2 text-sm border ${inputRounded}`}
                style={{ background: inputBg, borderColor: inputBorder, color: textColor }}
              />
            </div>
            <div>
              <label className="block text-xs mb-2" style={{ color: mutedColor }}>
                Kehadiran
              </label>
              <div className="grid grid-cols-3 gap-2">
                {attendOptions.map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => rsvp.setAttendance(opt.val)}
                    className={`py-2 text-xs transition-all ${inputRounded}`}
                    style={{
                      background: rsvp.attendance === opt.val ? colors.accent : "transparent",
                      border: `1px solid ${rsvp.attendance === opt.val ? colors.accent : inputBorder}`,
                      color: rsvp.attendance === opt.val ? (isMinimalist ? colors.bg : colors.dark) : mutedColor,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {rsvp.attendance === "HADIR" && (
              <div>
                <label className="block text-xs mb-1" style={{ color: mutedColor }}>
                  Jumlah tamu (termasuk Anda)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={rsvp.count}
                  onChange={(e) => rsvp.setCount(Number(e.target.value))}
                  className={`w-full px-3 py-2 text-sm border ${inputRounded}`}
                  style={{ background: inputBg, borderColor: inputBorder, color: textColor }}
                />
              </div>
            )}
            <button
              type="submit"
              className={`w-full py-3 text-sm font-medium transition-opacity hover:opacity-90 ${inputRounded}`}
              style={{ background: colors.accent, color: isMinimalist ? colors.bg : colors.dark }}
            >
              Kirim Konfirmasi
            </button>
          </form>
        )}
      </Section>
    </section>
  );
}
