"use client";

import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";
import MapsEmbed, { getMapsSrc } from "@/components/MapsEmbed";
import type { Invitation } from "@prisma/client";

interface Props {
  invitation: Invitation;
}

function RoundedCards({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors } = config;
  const mapsSrc = getMapsSrc(invitation.mapsEmbedUrl);

  return (
    <Section className="py-16 px-6" style={{ background: colors.dark }}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.accent }}>
          Lokasi & Waktu
        </p>
        <h2
          className="text-3xl font-light mb-10"
          style={{ fontFamily: config.fonts.display, color: colors.accent }}
        >
          Acara
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {invitation.akadTime && (
            <div className="rounded-2xl p-6 text-left" style={{ border: `1px solid ${colors.accent}`, background: colors.surface }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.accent }}>Akad</p>
              <p className="text-sm" style={{ color: colors.text }}>{invitation.akadTime}</p>
            </div>
          )}
          {invitation.resepsiTime && (
            <div className="rounded-2xl p-6 text-left" style={{ border: `1px solid ${colors.accent}`, background: colors.surface }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.accent }}>Resepsi</p>
              <p className="text-sm" style={{ color: colors.text }}>{invitation.resepsiTime}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl p-6 text-left mb-8" style={{ border: `1px solid ${colors.accent}`, background: colors.surface }}>
          <p className="text-sm font-medium" style={{ fontFamily: config.fonts.display, color: colors.text }}>
            {invitation.venueName}
          </p>
          <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
            {invitation.venueAddress}
          </p>
        </div>

        {mapsSrc && !mapsSrc.includes("/maps/embed") && (
          <a
            href={mapsSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 rounded-full text-sm transition-opacity hover:opacity-80"
            style={{ border: `1px solid ${colors.accent}`, color: colors.accent }}
          >
            Buka Google Maps
          </a>
        )}

        {mapsSrc?.includes("/maps/embed") && (
          <Section delay={0.3} className="mt-8 rounded-2xl overflow-hidden" style={{ height: 240 }}>
            <MapsEmbed mapsEmbedUrl={invitation.mapsEmbedUrl} iframeHeight={240} />
          </Section>
        )}
      </div>
    </Section>
  );
}

function TranslucentCards({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors } = config;
  const mapsSrc = getMapsSrc(invitation.mapsEmbedUrl);

  return (
    <Section className="py-16 px-6" style={{ background: colors.secondary }}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.text }}>
          Lokasi & Waktu
        </p>
        <h2
          className="text-3xl font-light mb-10"
          style={{ fontFamily: config.fonts.display, color: colors.text }}
        >
          Acara
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {invitation.akadTime && (
            <div className="rounded-2xl p-6 text-left backdrop-blur border" style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.15)" }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.text }}>Akad</p>
              <p className="text-sm" style={{ color: colors.textMuted }}>{invitation.akadTime}</p>
            </div>
          )}
          {invitation.resepsiTime && (
            <div className="rounded-2xl p-6 text-left backdrop-blur border" style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.15)" }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.text }}>Resepsi</p>
              <p className="text-sm" style={{ color: colors.textMuted }}>{invitation.resepsiTime}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl p-6 text-left mb-8 backdrop-blur border" style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.15)" }}>
          <p className="text-sm font-medium" style={{ fontFamily: config.fonts.display, color: colors.text }}>
            {invitation.venueName}
          </p>
          <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
            {invitation.venueAddress}
          </p>
        </div>

        {mapsSrc && !mapsSrc.includes("/maps/embed") && (
          <a
            href={mapsSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 rounded-full text-sm transition-opacity hover:opacity-80"
            style={{ background: "#b85c3e", color: "white" }}
          >
            Buka Google Maps
          </a>
        )}

        {mapsSrc?.includes("/maps/embed") && (
          <Section delay={0.3} className="mt-8 rounded-2xl overflow-hidden" style={{ height: 240 }}>
            <MapsEmbed mapsEmbedUrl={invitation.mapsEmbedUrl} iframeHeight={240} />
          </Section>
        )}
      </div>
    </Section>
  );
}

function TextForwardGrid({ invitation }: Props) {
  const config = useThemeConfig();
  const { colors } = config;
  const mapsSrc = getMapsSrc(invitation.mapsEmbedUrl);

  return (
    <Section className="py-16 px-6" style={{ background: colors.bg }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.secondary }}>
            Lokasi & Waktu
          </p>
          <h2
            className="text-3xl font-light"
            style={{ fontFamily: config.fonts.display, color: colors.text }}
          >
            Acara
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            {invitation.akadTime && (
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.secondary }}>Akad</p>
                <p className="text-sm" style={{ color: colors.textMuted }}>{invitation.akadTime}</p>
              </div>
            )}
            {invitation.resepsiTime && (
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.secondary }}>Resepsi</p>
                <p className="text-sm" style={{ color: colors.textMuted }}>{invitation.resepsiTime}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium" style={{ fontFamily: config.fonts.display, color: colors.text }}>
                {invitation.venueName}
              </p>
              <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                {invitation.venueAddress}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {mapsSrc && !mapsSrc.includes("/maps/embed") && (
              <a
                href={mapsSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline underline-offset-2"
                style={{ color: colors.textMuted }}
              >
                View on Google Maps
              </a>
            )}
            {mapsSrc?.includes("/maps/embed") && (
              <div className="overflow-hidden rounded-lg" style={{ height: 240 }}>
                <MapsEmbed mapsEmbedUrl={invitation.mapsEmbedUrl} iframeHeight={240} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default function EventSection(props: Props) {
  const config = useThemeConfig();

  switch (config.layout.event) {
    case "translucent-cards":
      return <TranslucentCards {...props} />;
    case "text-forward-grid":
      return <TextForwardGrid {...props} />;
    case "rounded-cards":
    default:
      return <RoundedCards {...props} />;
  }
}
