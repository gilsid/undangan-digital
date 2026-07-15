"use client";

import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";
import type { Invitation } from "@prisma/client";

interface Props {
  invitation: Invitation;
}

export default function QuoteSection({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors, decorations } = config;

  if (!invitation.quoteText) return null;

  const dividerColor =
    decorations.sectionDivider === "hairline" ? colors.border : `${colors.accent}30`;

  return (
    <Section className="py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-px mx-auto mb-6" style={{ background: dividerColor }} />
        <p
          className="text-lg italic leading-relaxed"
          style={{ fontFamily: config.fonts.display, color: colors.textMuted }}
        >
          &ldquo;{invitation.quoteText}&rdquo;
        </p>
        {invitation.quoteSource && (
          <p className="mt-4 text-sm" style={{ color: colors.secondary }}>
            &mdash; {invitation.quoteSource}
          </p>
        )}
        <div className="w-16 h-px mx-auto mt-6" style={{ background: dividerColor }} />
      </div>
    </Section>
  );
}
