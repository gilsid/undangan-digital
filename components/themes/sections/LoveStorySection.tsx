"use client";

import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";
import type { Invitation } from "@prisma/client";

interface Props {
  invitation: Invitation;
}

export default function LoveStorySection({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors } = config;

  if (!invitation.loveStory) return null;

  return (
    <Section className="py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.secondary }}>
          Our Story
        </p>
        <h2
          className="text-3xl font-light mb-8"
          style={{ fontFamily: config.fonts.display, color: colors.secondary }}
        >
          Cerita Kita
        </h2>
        <p
          className="leading-relaxed whitespace-pre-line"
          style={{ color: colors.textMuted }}
        >
          {invitation.loveStory}
        </p>
      </div>
    </Section>
  );
}
