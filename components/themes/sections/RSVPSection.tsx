"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Invitation } from "@prisma/client";
import { useRsvp } from "@/hooks/useThemeCommon";
import Section from "@/components/themes/template/Section";
import { useThemeConfig } from "@/components/themes/template/ThemeProvider";
import BlueprintCard from "@/components/themes/shared/BlueprintCard";

interface Props {
  invitation: Invitation;
  guestName?: string;
}

const attendOptions = [
  { val: "HADIR", label: "Hadir" },
  { val: "TIDAK_HADIR", label: "Tidak Hadir" },
  { val: "RAGU", label: "Ragu" },
];

export default function RSVPSection({ invitation, guestName }: Props) {
  const config = useThemeConfig();
  const { colors } = config;
  const reduce = useReducedMotion();
  const rsvp = useRsvp({ invitationId: invitation.id, guestName });

  const isElegant = config.id === "elegant";
  const isFoil = config.id === "foil-blueprint";
  const isBoho = config.id === "boho";
  const isTropical = config.id === "tropical";

  // ── Color / style variables ──
  const bg = isElegant ? colors.dark : colors.bg;
  const textColor = isElegant ? "#ffffff" : colors.text;
  const mutedColor = isElegant ? "rgba(255,255,255,0.6)" : colors.textMuted;
  const inputBg = isElegant
    ? "rgba(255,255,255,0.1)"
    : isFoil
      ? "#20242f"
      : colors.bg;
  const inputBorder = isElegant ? "rgba(255,255,255,0.2)" : colors.border;
  const titleColor = isElegant ? "#ffffff" : colors.text;
  const inputRounded = isElegant ? "rounded-lg" : "rounded-md";
  const inputClass = `w-full px-3 py-2 text-sm border ${inputRounded}${
    isElegant ? "" : " focus:outline-none focus:ring-2 transition-all"
  }`;
  const raguLabel = isElegant ? "Ragu" : "Ragu-ragu";

  // ── Animation ──
  const fieldDelay = { name: 0, attendance: 0.15, count: 0.3, submit: 0.4 };

  // Child variants for Boho-like stagger (inlined to avoid conditional import)
  let childVariants: Variants = {};
  if (!isElegant) {
    if (isFoil) {
      childVariants = {
        hidden: reduce ? {} : { opacity: 0, y: 16 },
        visible: reduce
          ? {}
          : { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      };
    } else {
      childVariants = {
        hidden: reduce ? {} : { opacity: 0, y: 16 },
        visible: reduce
          ? {}
          : {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0.25, 0.4, 0.3, 1],
              },
            },
      };
    }
  }

  // ── Button text color on accent backgrounds ──
  const accentTextColor = isElegant
    ? colors.dark
    : isFoil
      ? colors.bg
      : "#ffffff";

  // ── Card wrappers ──
  function FormCard({ children }: { children: React.ReactNode }) {
    if (isFoil) return <BlueprintCard>{children}</BlueprintCard>;
    return (
      <div
        className="p-6 rounded-lg"
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        {children}
      </div>
    );
  }

  function SuccessCard({ children }: { children: React.ReactNode }) {
    if (isFoil)
      return <BlueprintCard className="text-center py-8">{children}</BlueprintCard>;
    return (
      <div
        className="p-8 rounded-lg text-center"
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        {children}
      </div>
    );
  }

  // ── Header ──
  function renderHeader() {
    if (isElegant) {
      return (
        <>
          <p
            className="text-xs uppercase tracking-[0.3em] text-center mb-2"
            style={{ color: mutedColor }}
          >
            Konfirmasi Kehadiran
          </p>
          <h2
            className="text-3xl font-light text-center mb-8"
            style={{ fontFamily: config.fonts.display, color: titleColor }}
          >
            RSVP
          </h2>
        </>
      );
    }
    return (
      <div className="text-center mb-8">
        <motion.p
          variants={childVariants}
          className="text-xs uppercase tracking-[0.3em]"
          style={{
            color: isTropical ? colors.textMuted : colors.accent,
            opacity: isBoho || isFoil ? 0.7 : undefined,
          }}
        >
          Konfirmasi Kehadiran
        </motion.p>
        <motion.h2
          variants={childVariants}
          className="text-3xl mt-2"
          style={{
            fontFamily: config.fonts.display,
            fontStyle: isBoho ? "italic" : undefined,
            fontWeight: isBoho ? 500 : isFoil ? 500 : 300,
            color: titleColor,
          }}
        >
          RSVP
        </motion.h2>
      </div>
    );
  }

  // ── Animated field wrapper ──
  function Field({
    children,
    delay,
  }: {
    children: React.ReactNode;
    delay?: number;
  }) {
    if (isElegant) {
      return (
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 8 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ delay }}
        >
          {children}
        </motion.div>
      );
    }
    return <motion.div variants={childVariants}>{children}</motion.div>;
  }

  // ── Label + input pair (shared) ──
  function Label({ children }: { children: React.ReactNode }) {
    return (
      <label className="block text-xs mb-1" style={{ color: mutedColor }}>
        {children}
      </label>
    );
  }

  // ── Render ──
  const attendBtnTransition = isElegant
    ? "py-2 text-xs transition-all"
    : "py-2 text-xs transition-all duration-200";

  return (
    <section className="py-16 px-6" style={{ background: bg }}>
      {isElegant ? (
        <Section className="max-w-md mx-auto">
          {renderHeader()}
          <AnimatePresence mode="wait">
            {rsvp.sent ? (
              <motion.div
                key="success"
                className="text-center py-8"
                style={{ color: colors.accent }}
                initial={reduce ? {} : { opacity: 0, scale: 0.9 }}
                animate={reduce ? {} : { opacity: 1, scale: 1 }}
                exit={reduce ? {} : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
              >
                <p
                  className="text-2xl mb-2"
                  style={{ fontFamily: config.fonts.display }}
                >
                  Terima kasih!
                </p>
                <p className="text-sm" style={{ color: mutedColor }}>
                  Konfirmasi kehadiran Anda telah kami terima.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={rsvp.submit}
                className="space-y-4"
                initial={reduce ? {} : { opacity: 0 }}
                animate={reduce ? {} : { opacity: 1 }}
                exit={reduce ? {} : { opacity: 0 }}
              >
                <Field delay={fieldDelay.name}>
                  <Label>Nama</Label>
                  <input
                    value={rsvp.name}
                    onChange={(e) => rsvp.setName(e.target.value)}
                    required
                    className={inputClass}
                    style={{
                      background: inputBg,
                      borderColor: inputBorder,
                      color: textColor,
                    }}
                  />
                </Field>

                <Field delay={fieldDelay.attendance}>
                  <Label>Kehadiran</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {attendOptions.map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => rsvp.setAttendance(opt.val)}
                        className={`${attendBtnTransition} ${inputRounded}`}
                        style={{
                          background:
                            rsvp.attendance === opt.val
                              ? colors.accent
                              : "transparent",
                          border: `1px solid ${
                            rsvp.attendance === opt.val
                              ? colors.accent
                              : inputBorder
                          }`,
                          color:
                            rsvp.attendance === opt.val
                              ? accentTextColor
                              : mutedColor,
                        }}
                      >
                        {opt.val === "RAGU" ? raguLabel : opt.label}
                      </button>
                    ))}
                  </div>
                </Field>

                {rsvp.attendance === "HADIR" && (
                  <Field delay={fieldDelay.count}>
                    <Label>Jumlah tamu (termasuk Anda)</Label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={rsvp.count}
                      onChange={(e) => rsvp.setCount(Number(e.target.value))}
                      className={inputClass}
                      style={{
                        background: inputBg,
                        borderColor: inputBorder,
                        color: textColor,
                      }}
                    />
                  </Field>
                )}

                <motion.button
                  type="submit"
                  initial={reduce ? {} : { opacity: 0, y: 8 }}
                  animate={reduce ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: fieldDelay.submit }}
                  className={`w-full py-3 text-sm font-medium transition-opacity hover:opacity-90 ${inputRounded}`}
                  style={{ background: colors.accent, color: accentTextColor }}
                >
                  Kirim Konfirmasi
                </motion.button>

                {rsvp.error && (
                  <motion.p
                    initial={reduce ? {} : { opacity: 0, y: 4 }}
                    animate={reduce ? {} : { opacity: 1, y: 0 }}
                    className="text-xs mt-2 text-center"
                    style={{ color: "#ef4444" }}
                  >
                    {rsvp.error}
                  </motion.p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </Section>
      ) : (
        <Section
          direction="up"
          stagger
          staggerDelay={0.15}
          className="max-w-md mx-auto"
        >
          {renderHeader()}
          <AnimatePresence mode="wait">
            {rsvp.sent ? (
              <motion.div
                key="success"
                initial={reduce ? {} : { opacity: 0, scale: 0.8 }}
                animate={reduce ? {} : { opacity: 1, scale: 1 }}
                exit={reduce ? {} : { opacity: 0, scale: 0.8 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
              >
                <SuccessCard>
                  <p
                    className="text-xl mb-2"
                    style={{
                      fontFamily: config.fonts.display,
                      fontStyle: isBoho ? "italic" : undefined,
                      color: isBoho
                        ? colors.accent
                        : isFoil
                          ? colors.accent
                          : colors.secondary,
                    }}
                  >
                    Terima kasih!
                  </p>
                  <p className="text-sm" style={{ color: mutedColor }}>
                    Konfirmasi kehadiran Anda telah kami terima.
                  </p>
                </SuccessCard>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={reduce ? {} : { opacity: 1 }}
                exit={reduce ? {} : { opacity: 0, scale: 0.8 }}
              >
                <FormCard>
                  <form onSubmit={rsvp.submit} className="space-y-4">
                    <Field>
                      <Label>Nama</Label>
                      <input
                        value={rsvp.name}
                        onChange={(e) => rsvp.setName(e.target.value)}
                        required
                        className={inputClass}
                        style={{
                          background: inputBg,
                          borderColor: inputBorder,
                          color: textColor,
                        }}
                      />
                    </Field>

                    <Field>
                      <Label>Kehadiran</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {attendOptions.map((opt) => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => rsvp.setAttendance(opt.val)}
                            className={`${attendBtnTransition} ${inputRounded}`}
                            style={{
                              background:
                                rsvp.attendance === opt.val
                                  ? colors.accent
                                  : "transparent",
                              border: `1px solid ${
                                rsvp.attendance === opt.val
                                  ? colors.accent
                                  : inputBorder
                              }`,
                              color:
                                rsvp.attendance === opt.val
                                  ? accentTextColor
                                  : mutedColor,
                            }}
                          >
                            {opt.val === "RAGU" ? raguLabel : opt.label}
                          </button>
                        ))}
                      </div>
                    </Field>

                    {rsvp.attendance === "HADIR" && (
                      <motion.div
                        variants={childVariants}
                        initial={reduce ? {} : { opacity: 0, height: 0 }}
                        animate={reduce ? {} : { opacity: 1, height: "auto" }}
                      >
                        <Label>Jumlah tamu (termasuk Anda)</Label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={rsvp.count}
                          onChange={(e) => rsvp.setCount(Number(e.target.value))}
                          className={inputClass}
                          style={{
                            background: inputBg,
                            borderColor: inputBorder,
                            color: textColor,
                          }}
                        />
                      </motion.div>
                    )}

                    {rsvp.error && (
                      <motion.p
                        initial={reduce ? {} : { opacity: 0, y: 4 }}
                        animate={reduce ? {} : { opacity: 1, y: 0 }}
                        className="text-xs mt-2 text-center"
                        style={{ color: "#ef4444" }}
                      >
                        {rsvp.error}
                      </motion.p>
                    )}

                    <motion.button
                      type="submit"
                      variants={childVariants}
                      whileHover={reduce ? {} : { scale: 1.01 }}
                      whileTap={reduce ? {} : { scale: 0.99 }}
                      className={`w-full py-3 ${inputRounded} font-medium text-sm transition-all duration-300 hover:opacity-90`}
                      style={{
                        background: colors.accent,
                        color: accentTextColor,
                      }}
                    >
                      Kirim Konfirmasi
                    </motion.button>
                  </form>
                </FormCard>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>
      )}
    </section>
  );
}
