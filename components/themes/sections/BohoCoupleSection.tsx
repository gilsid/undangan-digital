"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Image from "next/image";
import Section from "@/components/themes/template/Section";

interface Props {
  invitation: Invitation;
}

export default function BohoCoupleSection({ invitation }: Props) {
  const reduce = useReducedMotion();

  const childVariants: Variants = reduce ? { hidden: {}, visible: {} } : {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.3, 1] as const } },
  };

  const cardVariants: Variants = reduce ? { hidden: {}, visible: {} } : {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const parentsInfo = invitation.parentsInfo as
    | { groomFather?: string; groomMother?: string; brideFather?: string; brideMother?: string }
    | null;

  return (
    <section className="py-16 px-6" style={{ background: "#fdf9f2" }}>
      <Section direction="up" stagger staggerDelay={0.15} className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.p
            variants={childVariants}
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "#d4a853", opacity: 0.7 }}
          >
            Mempelai
          </motion.p>
          <motion.h2
            variants={childVariants}
            className="text-3xl mt-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 500,
              color: "#3d322b",
            }}
          >
            Dua Jiwa, Satu Ikatan
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            variants={cardVariants}
            initial={reduce ? {} : "hidden"}
            animate={reduce ? {} : "visible"}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <div
              className="p-6 rounded-lg"
              style={{ background: "#fdf9f2", border: "1px solid #e2d5c5" }}
            >
              <motion.div
                className="w-36 h-44 mx-auto mb-4 overflow-hidden rounded-sm"
                style={{ border: "2px solid #d4a853" }}
                whileHover={reduce ? {} : { scale: 1.03 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={invitation.groomImage || "/placeholders/groom.png"}
                  alt={invitation.groomName}
                  width={144}
                  height={176}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </motion.div>
              <h3 className="text-xl" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500, color: "#3d322b" }}>
                {invitation.groomFullName ?? invitation.groomName}
              </h3>
              {parentsInfo?.groomFather && (
                <p className="text-sm mt-2" style={{ color: "#8c7d70" }}>
                  Putra dari Bapak {parentsInfo.groomFather}
                  {parentsInfo.groomMother && ` & Ibu ${parentsInfo.groomMother}`}
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial={reduce ? {} : "hidden"}
            animate={reduce ? {} : "visible"}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div
              className="p-6 rounded-lg"
              style={{ background: "#fdf9f2", border: "1px solid #e2d5c5" }}
            >
              <motion.div
                className="w-36 h-44 mx-auto mb-4 overflow-hidden rounded-sm"
                style={{ border: "2px solid #d4a853" }}
                whileHover={reduce ? {} : { scale: 1.03 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={invitation.brideImage || "/placeholders/bride.png"}
                  alt={invitation.brideName}
                  width={144}
                  height={176}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </motion.div>
              <h3 className="text-xl" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500, color: "#3d322b" }}>
                {invitation.brideFullName ?? invitation.brideName}
              </h3>
              {parentsInfo?.brideFather && (
                <p className="text-sm mt-2" style={{ color: "#8c7d70" }}>
                  Putri dari Bapak {parentsInfo.brideFather}
                  {parentsInfo.brideMother && ` & Ibu ${parentsInfo.brideMother}`}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </Section>
    </section>
  );
}
