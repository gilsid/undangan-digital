"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Section from "@/components/themes/template/Section";
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

export default function TropicalCoupleSection({ invitation }: Props) {
  const reduce = useReducedMotion();
  const parents = invitation.parentsInfo as {
    groomFather?: string;
    groomMother?: string;
    brideFather?: string;
    brideMother?: string;
  } | null;

  return (
    <Section className="py-16 px-6" style={{ background: "#ffffff" }}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: C.coral }}>
          Mempelai
        </p>
        <h2
          className="text-3xl font-light mb-12"
          style={{ fontFamily: "Playfair Display, serif", color: C.text }}
        >
          Dua Jiwa, Satu Ikatan
        </h2>

        <div className="grid grid-cols-2 gap-8 items-start">
          <Section delay={0.1} className="flex flex-col items-center">
            <motion.div
              className="w-32 h-32 rounded-full overflow-hidden mb-4"
              style={{ border: "3px solid #d6e2d4" }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Image src={invitation.groomImage || "/placeholders/groom.png"} alt={invitation.groomName} width={128} height={128} className="w-full h-full object-cover" unoptimized />
            </motion.div>
            <p className="text-2xl font-light" style={{ fontFamily: "Playfair Display, serif", color: C.text }}>
              {invitation.groomName}
            </p>
            <p className="text-sm mt-2" style={{ color: C.sage }}>
              {parents
                ? `Putra dari ${parents.groomFather ?? ""}${parents.groomMother ? ` & ${parents.groomMother}` : ""}`
                : invitation.groomFullName}
            </p>
          </Section>

          <Section delay={0.2} className="flex flex-col items-center">
            <motion.div
              className="w-32 h-32 rounded-full overflow-hidden mb-4"
              style={{ border: "3px solid #d6e2d4" }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Image src={invitation.brideImage || "/placeholders/bride.png"} alt={invitation.brideName} width={128} height={128} className="w-full h-full object-cover" unoptimized />
            </motion.div>
            <p className="text-2xl font-light" style={{ fontFamily: "Playfair Display, serif", color: C.text }}>
              {invitation.brideName}
            </p>
            <p className="text-sm mt-2" style={{ color: C.sage }}>
              {parents
                ? `Putri dari ${parents.brideFather ?? ""}${parents.brideMother ? ` & ${parents.brideMother}` : ""}`
                : invitation.brideFullName}
            </p>
          </Section>
        </div>
      </div>
    </Section>
  );
}
