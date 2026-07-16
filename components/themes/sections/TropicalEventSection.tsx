"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Section from "@/components/themes/template/Section";
import MapsEmbed, { getMapsSrc } from "@/components/MapsEmbed";
import type { Invitation } from "@prisma/client";

interface Props {
  invitation: Invitation;
}

const C = {
  bg: "#f7f5ef",
  surface: "#ffffff",
  text: "#2a4231",
  sage: "#7e9b85",
  coral: "#e8846b",
  emerald: "#2d5a4b",
  border: "#d6e2d4",
};

export default function TropicalEventSection({ invitation }: Props) {
  const reduce = useReducedMotion();
  const mapsSrc = getMapsSrc(invitation.mapsEmbedUrl);

  const container: Variants = reduce ? {} : {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const fadeChild: Variants = reduce ? {} : {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.3, 1] as const } },
  };
  const springChild: Variants = reduce ? {} : {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <Section className="py-16 px-6" style={{ background: C.bg }}>
      <motion.div
        className="max-w-3xl mx-auto text-center"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.p variants={fadeChild} className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: C.emerald }}>
          Rangkaian Acara
        </motion.p>
        <motion.h2
          variants={fadeChild}
          className="text-3xl font-light mb-10"
          style={{ fontFamily: "Playfair Display, serif", color: C.text }}
        >
          Rangkaian Acara
        </motion.h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {invitation.akadTime && (
            <motion.div variants={springChild} className="rounded-2xl p-6 text-left" style={{ border: "1px solid #d6e2d4", background: "#ffffff" }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: C.emerald }}>Akad</p>
              <p className="text-sm" style={{ color: C.text }}>{invitation.akadTime}</p>
            </motion.div>
          )}
          {invitation.resepsiTime && (
            <motion.div variants={springChild} className="rounded-2xl p-6 text-left" style={{ border: "1px solid #d6e2d4", background: "#ffffff" }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: C.emerald }}>Resepsi</p>
              <p className="text-sm" style={{ color: C.text }}>{invitation.resepsiTime}</p>
            </motion.div>
          )}
        </div>

        <motion.div variants={springChild} className="rounded-2xl p-6 text-left mb-8" style={{ border: "1px solid #d6e2d4", background: "#ffffff" }}>
          <p className="text-sm font-medium" style={{ fontFamily: "Playfair Display, serif", color: C.text }}>
            {invitation.venueName}
          </p>
          <p className="text-xs mt-1" style={{ color: C.sage }}>
            {invitation.venueAddress}
          </p>
        </motion.div>

        {mapsSrc && !mapsSrc.includes("/maps/embed") && (
          <motion.a
            variants={fadeChild}
            href={mapsSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 rounded-full text-sm transition-opacity hover:opacity-80"
            style={{ border: "1px solid #e8846b", color: C.coral }}
          >
            Buka Google Maps
          </motion.a>
        )}

        {mapsSrc?.includes("/maps/embed") && (
          <Section delay={0.3} className="mt-8 rounded-2xl overflow-hidden" style={{ height: 240 }}>
            <MapsEmbed mapsEmbedUrl={invitation.mapsEmbedUrl} iframeHeight={240} />
          </Section>
        )}
      </motion.div>
    </Section>
  );
}
