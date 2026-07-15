"use client";

import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";

interface Props {
  invitation: Invitation;
}

export default function FooterSection({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors, fonts } = config;
  const isMinimalist = config.id === "minimalist";

  const bg = isMinimalist ? colors.surface : colors.dark;
  const textColor = isMinimalist ? colors.text : "#ffffff";
  const mutedColor = isMinimalist ? colors.textMuted : "rgba(255,255,255,0.4)";
  const dividerColor = isMinimalist ? colors.border : colors.accent;
  const thankYou = isMinimalist ? "Thank You" : "Terima kasih atas doa dan kehadiran Anda";

  return (
    <footer className="py-12 px-6 text-center" style={{ background: bg }}>
      <Section>
        <p
          className="text-3xl font-light"
          style={{ fontFamily: fonts.display, color: textColor }}
        >
          {invitation.groomName} & {invitation.brideName}
        </p>
        <p className="text-sm mt-2" style={{ color: mutedColor }}>
          {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <div
          className="h-px w-24 mx-auto my-6"
          style={{ background: dividerColor, opacity: isMinimalist ? 1 : 0.3 }}
        />
        <p className="text-xs" style={{ color: mutedColor }}>
          {thankYou}
        </p>
      </Section>
    </footer>
  );
}
