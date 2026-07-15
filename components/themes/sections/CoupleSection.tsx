"use client";

import Image from "next/image";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";
import type { Invitation } from "@prisma/client";

interface Props {
  invitation: Invitation;
}

function CircularGold({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors } = config;

  return (
    <Section className="py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.secondary }}>
          Mempelai
        </p>
        <h2
          className="text-3xl font-light mb-12"
          style={{ fontFamily: config.fonts.display, color: colors.text }}
        >
          Dua Jiwa, Satu Ikatan
        </h2>

        <div className="grid grid-cols-2 gap-8 items-start">
          <Section delay={0.1} className="flex flex-col items-center">
            {invitation.groomImage && (
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4" style={{ border: `3px solid ${colors.accent}` }}>
                <Image src={invitation.groomImage} alt={invitation.groomName} width={128} height={128} className="w-full h-full object-cover" unoptimized />
              </div>
            )}
            <p className="text-2xl font-light" style={{ fontFamily: config.fonts.display, color: colors.text }}>
              {invitation.groomName}
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textMuted }}>
              {typeof invitation.parentsInfo === "object" && invitation.parentsInfo !== null
                ? `Putra dari ${(invitation.parentsInfo as { groomFather?: string; groomMother?: string }).groomFather ?? ""}${(invitation.parentsInfo as { groomFather?: string; groomMother?: string }).groomMother ? ` & ${(invitation.parentsInfo as { groomMother: string }).groomMother}` : ""}`
                : invitation.groomFullName}
            </p>
          </Section>

          <Section delay={0.2} className="flex flex-col items-center">
            {invitation.brideImage && (
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4" style={{ border: `3px solid ${colors.accent}` }}>
                <Image src={invitation.brideImage} alt={invitation.brideName} width={128} height={128} className="w-full h-full object-cover" unoptimized />
              </div>
            )}
            <p className="text-2xl font-light" style={{ fontFamily: config.fonts.display, color: colors.text }}>
              {invitation.brideName}
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textMuted }}>
              {typeof invitation.parentsInfo === "object" && invitation.parentsInfo !== null
                ? `Putri dari ${(invitation.parentsInfo as { brideFather?: string; brideMother?: string }).brideFather ?? ""}${(invitation.parentsInfo as { brideFather?: string; brideMother?: string }).brideMother ? ` & ${(invitation.parentsInfo as { brideMother: string }).brideMother}` : ""}`
                : invitation.brideFullName}
            </p>
          </Section>
        </div>
      </div>
    </Section>
  );
}

function CircularWhiteShadow({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors } = config;

  return (
    <Section className="py-16 px-6" style={{ background: "#f4ece1" }}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.secondary }}>
          Mempelai
        </p>
        <h2
          className="text-3xl font-light mb-12"
          style={{ fontFamily: config.fonts.display, color: colors.text }}
        >
          Dua Jiwa, Satu Ikatan
        </h2>

        <div className="grid grid-cols-2 gap-8 items-start">
          <Section delay={0.1} className="flex flex-col items-center">
            {invitation.groomImage && (
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 shadow-lg" style={{ border: "4px solid white" }}>
                <Image src={invitation.groomImage} alt={invitation.groomName} width={160} height={160} className="w-full h-full object-cover" unoptimized />
              </div>
            )}
            <p className="text-2xl font-medium" style={{ fontFamily: config.fonts.display, color: colors.text }}>
              {invitation.groomName}
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textMuted }}>
              {typeof invitation.parentsInfo === "object" && invitation.parentsInfo !== null
                ? `Putra dari ${(invitation.parentsInfo as { groomFather?: string; groomMother?: string }).groomFather ?? ""}${(invitation.parentsInfo as { groomFather?: string; groomMother?: string }).groomMother ? ` & ${(invitation.parentsInfo as { groomMother: string }).groomMother}` : ""}`
                : invitation.groomFullName}
            </p>
          </Section>

          <Section delay={0.2} className="flex flex-col items-center">
            {invitation.brideImage && (
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 shadow-lg" style={{ border: "4px solid white" }}>
                <Image src={invitation.brideImage} alt={invitation.brideName} width={160} height={160} className="w-full h-full object-cover" unoptimized />
              </div>
            )}
            <p className="text-2xl font-medium" style={{ fontFamily: config.fonts.display, color: colors.text }}>
              {invitation.brideName}
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textMuted }}>
              {typeof invitation.parentsInfo === "object" && invitation.parentsInfo !== null
                ? `Putri dari ${(invitation.parentsInfo as { brideFather?: string; brideMother?: string }).brideFather ?? ""}${(invitation.parentsInfo as { brideFather?: string; brideMother?: string }).brideMother ? ` & ${(invitation.parentsInfo as { brideMother: string }).brideMother}` : ""}`
                : invitation.brideFullName}
            </p>
          </Section>
        </div>
      </div>
    </Section>
  );
}

function SquareGrayscale({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors } = config;

  return (
    <Section className="py-16 px-6" style={{ background: colors.bg }}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.secondary }}>
          Mempelai
        </p>
        <h2
          className="text-3xl font-light mb-12"
          style={{ fontFamily: config.fonts.display, color: colors.text }}
        >
          Dua Jiwa, Satu Ikatan
        </h2>

        <div className="grid grid-cols-2 gap-16 items-start">
          <Section delay={0.1} className="flex flex-col items-center">
            <div className="relative w-full aspect-square mb-4 overflow-hidden grayscale">
              {invitation.groomImage && (
                <Image src={invitation.groomImage} alt={invitation.groomName} fill className="object-cover" unoptimized />
              )}
            </div>
            <span className="text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
              Groom
            </span>
            <p className="uppercase font-light mt-1" style={{ fontFamily: config.fonts.display, color: colors.text }}>
              {invitation.groomName}
            </p>
            <p className="text-xs mt-2" style={{ color: colors.textMuted }}>
              Son of {typeof invitation.parentsInfo === "object" && invitation.parentsInfo !== null
                ? (invitation.parentsInfo as { groomFather?: string }).groomFather ?? invitation.groomFullName ?? ""
                : invitation.groomFullName ?? ""}
            </p>
          </Section>

          <Section delay={0.2} className="flex flex-col items-center">
            <div className="relative w-full aspect-square mb-4 overflow-hidden grayscale">
              {invitation.brideImage && (
                <Image src={invitation.brideImage} alt={invitation.brideName} fill className="object-cover" unoptimized />
              )}
            </div>
            <span className="text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
              Bride
            </span>
            <p className="uppercase font-light mt-1" style={{ fontFamily: config.fonts.display, color: colors.text }}>
              {invitation.brideName}
            </p>
            <p className="text-xs mt-2" style={{ color: colors.textMuted }}>
              Daughter of {typeof invitation.parentsInfo === "object" && invitation.parentsInfo !== null
                ? (invitation.parentsInfo as { brideFather?: string }).brideFather ?? invitation.brideFullName ?? ""
                : invitation.brideFullName ?? ""}
            </p>
          </Section>
        </div>
      </div>
    </Section>
  );
}

export default function CoupleSection(props: Props) {
  const config = useThemeConfig();

  switch (config.layout.couple) {
    case "circular-white-shadow":
      return <CircularWhiteShadow {...props} />;
    case "square-grayscale":
      return <SquareGrayscale {...props} />;
    case "circular-gold":
    default:
      return <CircularGold {...props} />;
  }
}
