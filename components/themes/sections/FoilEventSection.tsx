"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import BlueprintCard from "@/components/themes/shared/BlueprintCard";
import MapsEmbed, { getMapsSrc } from "@/components/MapsEmbed";
import { childSpringConfigVariant, childVariant, formatDateID } from "@/hooks/useThemeCommon";

interface Props {
  invitation: Invitation;
}

export default function FoilEventSection({ invitation }: Props) {
  const reduce = useReducedMotion();

  const childVariants = childSpringConfigVariant(reduce, 80, 18, 20);

  const headerVariant = childVariant(reduce, 16, 0.6);

  return (
    <section className="py-16 px-6" style={{ background: "#12151c" }}>
      <Section direction="up" stagger staggerDelay={0.15} className="text-center mb-10">
        <motion.p
          variants={headerVariant}
          className="text-xs uppercase tracking-[0.3em]"
          style={{ color: "var(--foil-gold)", opacity: 0.7 }}
        >
          Tanggal Acara
        </motion.p>
        <motion.h2
          variants={headerVariant}
          className="text-3xl mt-2"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}
        >
          Rangkaian Acara
        </motion.h2>
      </Section>

      <div className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {invitation.akadTime && (
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.1 }}
          >
            <BlueprintCard className="text-center">
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--foil-gold)", opacity: 0.8 }}>
                Akad Nikah
              </p>
              <p className="text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                {invitation.akadTime}
              </p>
            </BlueprintCard>
          </motion.div>
        )}
        {invitation.resepsiTime && (
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.2 }}
          >
            <BlueprintCard className="text-center">
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--foil-gold)", opacity: 0.8 }}>
                Resepsi
              </p>
              <p className="text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                {invitation.resepsiTime}
              </p>
            </BlueprintCard>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 20 }}
        whileInView={reduce ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.3 }}
        className="text-center mt-8 max-w-md mx-auto"
      >
        <BlueprintCard>
          <p className="text-base" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            {invitation.venueName}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{invitation.venueAddress}</p>
          {getMapsSrc(invitation.mapsEmbedUrl) && !getMapsSrc(invitation.mapsEmbedUrl)!.includes("/maps/embed") && (
            <a
              href={getMapsSrc(invitation.mapsEmbedUrl)!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-5 py-2 rounded-md text-sm transition-all duration-300 hover:opacity-80"
              style={{ border: "1px solid var(--foil-gold)", color: "var(--foil-gold)" }}
            >
              Buka Google Maps
            </a>
          )}
        </BlueprintCard>
      </motion.div>

      {getMapsSrc(invitation.mapsEmbedUrl)?.includes("/maps/embed") && (
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 max-w-2xl mx-auto rounded-lg overflow-hidden"
          style={{ height: 240, border: "1px solid rgba(216,185,120,0.18)" }}
        >
          <MapsEmbed mapsEmbedUrl={invitation.mapsEmbedUrl} iframeHeight={240} />
        </motion.div>
      )}
    </section>
  );
}
