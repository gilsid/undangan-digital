"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Section from "@/components/themes/template/Section";
import MapsEmbed, { getMapsSrc } from "@/components/MapsEmbed";
import { childSpringConfigVariant, childEasedVariant } from "@/hooks/useThemeCommon";

interface Props {
  invitation: Invitation;
}

export default function BohoEventSection({ invitation }: Props) {
  const reduce = useReducedMotion();

  const childVariants = childSpringConfigVariant(reduce, 80, 18, 20);

  const headerVariant = childEasedVariant(reduce, 0.6);

  return (
    <section className="py-16 px-6" style={{ background: "#faf5ed" }}>
      <Section direction="up" stagger staggerDelay={0.15} className="text-center mb-10">
        <motion.p
          variants={headerVariant}
          className="text-xs uppercase tracking-[0.3em]"
          style={{ color: "#d4a853", opacity: 0.7 }}
        >
          Tanggal Acara
        </motion.p>
        <motion.h2
          variants={headerVariant}
          className="text-3xl mt-2"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500, color: "#3d322b" }}
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
            <div
              className="p-6 rounded-lg text-center"
              style={{ background: "#fdf9f2", border: "1px solid #e2d5c5" }}
            >
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#d4a853", opacity: 0.8 }}>
                Akad Nikah
              </p>
              <p className="text-lg" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#3d322b" }}>
                {invitation.akadTime}
              </p>
            </div>
          </motion.div>
        )}
        {invitation.resepsiTime && (
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.2 }}
          >
            <div
              className="p-6 rounded-lg text-center"
              style={{ background: "#fdf9f2", border: "1px solid #e2d5c5" }}
            >
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#d4a853", opacity: 0.8 }}>
                Resepsi
              </p>
              <p className="text-lg" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#3d322b" }}>
                {invitation.resepsiTime}
              </p>
            </div>
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
        <div
          className="p-6 rounded-lg"
          style={{ background: "#fdf9f2", border: "1px solid #e2d5c5" }}
        >
          <p className="text-base" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#3d322b" }}>
            {invitation.venueName}
          </p>
          <p className="text-sm mt-1" style={{ color: "#8c7d70" }}>{invitation.venueAddress}</p>
          {getMapsSrc(invitation.mapsEmbedUrl) && !getMapsSrc(invitation.mapsEmbedUrl)!.includes("/maps/embed") && (
            <a
              href={getMapsSrc(invitation.mapsEmbedUrl)!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-5 py-2 rounded-md text-sm transition-all duration-300 hover:opacity-80"
              style={{ border: "1px solid #d4a853", color: "#d4a853" }}
            >
              Buka Google Maps
            </a>
          )}
        </div>
      </motion.div>

      {getMapsSrc(invitation.mapsEmbedUrl)?.includes("/maps/embed") && (
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 max-w-2xl mx-auto rounded-lg overflow-hidden"
          style={{ height: 240, border: "1px solid #e2d5c5" }}
        >
          <MapsEmbed mapsEmbedUrl={invitation.mapsEmbedUrl} iframeHeight={240} />
        </motion.div>
      )}
    </section>
  );
}
