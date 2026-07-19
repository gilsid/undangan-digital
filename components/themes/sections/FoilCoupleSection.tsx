"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Invitation } from "@prisma/client";
import Image from "next/image";
import Section from "@/components/themes/template/Section";
import BlueprintCard from "@/components/themes/shared/BlueprintCard";
import { childVariant, getParentsInfo, formatParents } from "@/hooks/useThemeCommon";

interface Props {
  invitation: Invitation;
}

export default function FoilCoupleSection({ invitation }: Props) {
  const reduce = useReducedMotion();

  const childVariants = childVariant(reduce, 16, 0.6);

  const cardVariants = childVariant(reduce, 30, 0.6);

  const parentsInfo = getParentsInfo(invitation.parentsInfo);

  return (
    <section className="py-16 px-6" style={{ background: "#171b23" }}>
      <Section direction="up" stagger staggerDelay={0.15} className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.p
            variants={childVariants}
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "var(--foil-gold)", opacity: 0.7 }}
          >
            Mempelai
          </motion.p>
          <motion.h2
            variants={childVariants}
            className="text-3xl mt-2"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              color: "var(--text-primary)",
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
            <BlueprintCard className="p-4">
              <motion.div
                className="w-36 h-44 mx-auto mb-4 overflow-hidden rounded-sm"
                style={{ border: "1px solid rgba(216,185,120,0.3)" }}
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
              <h3 className="text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}>
                {invitation.groomFullName ?? invitation.groomName}
              </h3>
              {parentsInfo?.groomFather && (
                <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                  {formatParents(invitation.parentsInfo, "groom")}
                </p>
              )}
            </BlueprintCard>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial={reduce ? {} : "hidden"}
            animate={reduce ? {} : "visible"}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <BlueprintCard className="p-4">
              <motion.div
                className="w-36 h-44 mx-auto mb-4 overflow-hidden rounded-sm"
                style={{ border: "1px solid rgba(216,185,120,0.3)" }}
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
              <h3 className="text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}>
                {invitation.brideFullName ?? invitation.brideName}
              </h3>
              {parentsInfo?.brideFather && (
                <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                  {formatParents(invitation.parentsInfo, "bride")}
                </p>
              )}
            </BlueprintCard>
          </motion.div>
        </div>
      </Section>
    </section>
  );
}
