"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Invitation, Wish } from "@prisma/client";
import { useState, useEffect, useRef } from "react";
import MapsEmbed, { getMapsSrc } from "@/components/MapsEmbed";
import Image from "next/image";

interface Props {
  invitation: Invitation;
  guestName?: string;
  wishes: Wish[];
}

function useCountdown(target: Date) {
  const [diff, setDiff] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setDiff(target.getTime() - Date.now());
    const timer = setTimeout(update, 0);
    const t = setInterval(update, 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(t);
    };
  }, [target]);

  if (diff === null) {
    return { days: 0, hours: 0, mins: 0, secs: 0, isReady: false, isOver: false };
  }

  const isOver = diff <= 0;
  const total = Math.max(0, diff);
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const mins = Math.floor((total % 3600000) / 60000);
  const secs = Math.floor((total % 60000) / 1000);
  return { days, hours, mins, secs, isReady: true, isOver };
}

function SectionReveal({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? {} : { opacity: 0, y: 20 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function BlueprintCorner() {
  return (
    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[var(--foil-gold)] opacity-40" />
  );
}

function BlueprintCornerOpposite() {
  return (
    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[var(--foil-gold)] opacity-40" />
  );
}

function BlueprintCard({ className = "", children, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`relative bg-[#1a1e27] border border-[rgba(216,185,120,0.18)] rounded-lg p-6 ${className}`}
      {...props}
    >
      <BlueprintCorner />
      <BlueprintCornerOpposite />
      {children}
    </div>
  );
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div
        className="text-3xl md:text-4xl font-medium text-[var(--foil-gold)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <p className="text-xs uppercase tracking-widest text-[--text-muted] mt-1">{label}</p>
    </div>
  );
}

export default function FoilBlueprintTheme({ invitation, guestName, wishes: initialWishes }: Props) {
  const [opened, setOpened] = useState(false);
  const [wishName, setWishName] = useState("");
  const [wishMsg, setWishMsg] = useState("");
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [rsvpName, setRsvpName] = useState(guestName ?? "");
  const [rsvpAttendance, setRsvpAttendance] = useState("HADIR");
  const [rsvpCount, setRsvpCount] = useState(1);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [wishSent, setWishSent] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const countdown = useCountdown(new Date(invitation.weddingDate));
  const reduce = useReducedMotion();

  function openInvitation() {
    setOpened(true);
    if (invitation.musicUrl && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  function toggleMusic() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  async function submitRsvp(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invitationId: invitation.id,
        guestName: rsvpName,
        attendance: rsvpAttendance,
        guestCount: rsvpCount,
      }),
    });
    setRsvpSent(true);
  }

  async function submitWish(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invitationId: invitation.id,
        name: wishName,
        message: wishMsg,
      }),
    });
    if (res.ok) {
      const w = await res.json();
      setWishes((p) => [w, ...p]);
      setWishName("");
      setWishMsg("");
      setWishSent(true);
      setTimeout(() => setWishSent(false), 3000);
    }
  }

  async function copyAccount(idx: number, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {}
  }

  const bankAccounts = invitation.bankAccounts as
    | { bank: string; accountNumber: string; accountName: string }[]
    | null;

  const gallery = invitation.gallery ?? [];

  // ── Cover Screen ──
  if (!opened) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{
          background: invitation.heroImage
            ? `linear-gradient(rgba(18,21,28,0.7), rgba(18,21,28,0.85)), url(${invitation.heroImage}) center/cover no-repeat`
            : "#12151c",
        }}
      >
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative px-8 py-10 border border-[rgba(216,185,120,0.18)] rounded-lg"
        >
          <BlueprintCorner />
          <BlueprintCornerOpposite />
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--foil-gold)] mb-5">
            Undangan Pernikahan
          </p>
          {guestName && (
            <p className="text-[var(--text-secondary)] text-sm mb-2">Kepada Yth.</p>
          )}
          {guestName && (
            <h2
              className="text-xl font-light text-[var(--text-primary)] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {guestName}
            </h2>
          )}
          <h1
            className="text-4xl md:text-5xl text-[var(--text-primary)] leading-tight mb-3"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {invitation.groomName}
            <span className="block text-[var(--foil-gold)] text-2xl md:text-3xl my-2">&amp;</span>
            {invitation.brideName}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-4 mb-8" style={{ fontFamily: "var(--font-mono)" }}>
            {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <motion.button
            onClick={openInvitation}
            whileHover={reduce ? {} : { scale: 1.02 }}
            whileTap={reduce ? {} : { scale: 0.98 }}
            className="px-8 py-2.5 rounded-md text-sm tracking-widest uppercase transition-all duration-300"
            style={{
              border: "1px solid var(--foil-gold)",
              color: "var(--foil-gold)",
              letterSpacing: "0.2em",
            }}
          >
            Buka Undangan
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#12151c", color: "#ede9e1" }}>
      {/* Audio */}
      {invitation.musicUrl && <audio ref={audioRef} src={invitation.musicUrl} loop />}

      {/* Music toggle */}
      {invitation.musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:border-[var(--foil-gold)]"
          style={{ background: "#1a1e27", border: "1px solid rgba(216,185,120,0.35)" }}
          aria-label={playing ? "Matikan musik" : "Putar musik"}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d8b978" strokeWidth="1.5">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d8b978" strokeWidth="1.5">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
      )}

      {/* ── Hero ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{
          background: invitation.heroImage
            ? `linear-gradient(rgba(18,21,28,0.6), rgba(18,21,28,0.8)), url(${invitation.heroImage}) center/cover no-repeat`
            : "#12151c",
        }}
      >
        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(216,185,120,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(216,185,120,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 30 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10"
        >
          <p className="text-[var(--foil-gold)] text-xs uppercase tracking-[0.4em] mb-6">
            The Wedding of
          </p>
          <h1
            className="text-[var(--text-primary)] leading-tight"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,8vw,5rem)", fontWeight: 500 }}
          >
            {invitation.groomFullName ?? invitation.groomName}
          </h1>
          <p className="text-[var(--foil-gold)] text-2xl md:text-3xl my-2" style={{ fontFamily: "var(--font-display)" }}>&amp;</p>
          <h1
            className="text-[var(--text-primary)] leading-tight"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,8vw,5rem)", fontWeight: 500 }}
          >
            {invitation.brideFullName ?? invitation.brideName}
          </h1>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-px w-12" style={{ background: "var(--foil-gold)", opacity: 0.4 }} />
            <p className="text-[var(--text-secondary)] text-sm" style={{ fontFamily: "var(--font-mono)" }}>
              {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="h-px w-12" style={{ background: "var(--foil-gold)", opacity: 0.4 }} />
          </div>
        </motion.div>
        <motion.div
          className="absolute bottom-8"
          animate={reduce ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8b978" strokeWidth="1.5" opacity="0.6">
            <path d="M7 10l5 5 5-5" />
          </svg>
        </motion.div>
      </section>

      {/* ── Quote ── */}
      {invitation.quoteText && (
        <SectionReveal className="py-16 px-6 text-center max-w-2xl mx-auto">
          <div className="h-px w-16 mx-auto mb-8" style={{ background: "var(--foil-gold)", opacity: 0.3 }} />
          <p
            className="text-xl md:text-2xl font-light italic leading-relaxed"
            style={{ fontFamily: "var(--font-display)", color: "#a9a296" }}
          >
            &ldquo;{invitation.quoteText}&rdquo;
          </p>
          {invitation.quoteSource && (
            <p className="text-sm mt-4" style={{ color: "var(--foil-gold)", opacity: 0.7 }}>— {invitation.quoteSource}</p>
          )}
          <div className="h-px w-16 mx-auto mt-8" style={{ background: "var(--foil-gold)", opacity: 0.3 }} />
        </SectionReveal>
      )}

      {/* ── Couple Profile ── */}
      <section className="py-16 px-6" style={{ background: "#171b23" }}>
        <SectionReveal className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--foil-gold)", opacity: 0.7 }}>Mempelai</p>
          <h2
            className="text-3xl mt-2"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}
          >
            Dua Jiwa, Satu Ikatan
          </h2>
        </SectionReveal>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <SectionReveal delay={0.1} className="text-center">
            <BlueprintCard className="p-4">
              <div className="w-36 h-44 mx-auto mb-4 overflow-hidden rounded-sm border" style={{ border: "1px solid rgba(216,185,120,0.3)" }}>
                <Image
                  src={invitation.groomImage || "/placeholders/elegant/groom.png"}
                  alt={invitation.groomName}
                  width={144}
                  height={176}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <h3 className="text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                {invitation.groomFullName ?? invitation.groomName}
              </h3>
              {(invitation.parentsInfo as { groomFather?: string } | null)?.groomFather && (
                <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                  Putra dari Bapak{" "}
                  {(invitation.parentsInfo as { groomFather: string }).groomFather}
                  {(invitation.parentsInfo as { groomMother?: string }).groomMother &&
                    ` & Ibu ${(invitation.parentsInfo as { groomMother: string }).groomMother}`}
                </p>
              )}
            </BlueprintCard>
          </SectionReveal>

          <SectionReveal delay={0.2} className="text-center">
            <BlueprintCard className="p-4">
              <div className="w-36 h-44 mx-auto mb-4 overflow-hidden rounded-sm border" style={{ border: "1px solid rgba(216,185,120,0.3)" }}>
                <Image
                  src={invitation.brideImage || "/placeholders/elegant/bride.png"}
                  alt={invitation.brideName}
                  width={144}
                  height={176}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <h3 className="text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                {invitation.brideFullName ?? invitation.brideName}
              </h3>
              {(invitation.parentsInfo as { brideFather?: string } | null)?.brideFather && (
                <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                  Putri dari Bapak{" "}
                  {(invitation.parentsInfo as { brideFather: string }).brideFather}
                  {(invitation.parentsInfo as { brideMother?: string }).brideMother &&
                    ` & Ibu ${(invitation.parentsInfo as { brideMother: string }).brideMother}`}
                </p>
              )}
            </BlueprintCard>
          </SectionReveal>
        </div>
      </section>

      {/* ── Event Details ── */}
      <section className="py-16 px-6">
        <SectionReveal className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--foil-gold)", opacity: 0.7 }}>Tanggal Acara</p>
          <h2
            className="text-3xl mt-2"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}
          >
            Rangkaian Acara
          </h2>
        </SectionReveal>

        <div className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {invitation.akadTime && (
            <SectionReveal delay={0.1}>
              <BlueprintCard className="text-center">
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--foil-gold)", opacity: 0.8 }}>Akad Nikah</p>
                <p className="text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                  {invitation.akadTime}
                </p>
              </BlueprintCard>
            </SectionReveal>
          )}
          {invitation.resepsiTime && (
            <SectionReveal delay={0.2}>
              <BlueprintCard className="text-center">
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--foil-gold)", opacity: 0.8 }}>Resepsi</p>
                <p className="text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                  {invitation.resepsiTime}
                </p>
              </BlueprintCard>
            </SectionReveal>
          )}
        </div>

        <SectionReveal delay={0.3} className="text-center mt-8 max-w-md mx-auto">
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
        </SectionReveal>

        {getMapsSrc(invitation.mapsEmbedUrl)?.includes("/maps/embed") && (
          <SectionReveal delay={0.4} className="mt-8 max-w-2xl mx-auto rounded-lg overflow-hidden" style={{ height: 240, border: "1px solid rgba(216,185,120,0.18)" }}>
            <MapsEmbed mapsEmbedUrl={invitation.mapsEmbedUrl} iframeHeight={240} />
          </SectionReveal>
        )}
      </section>

      {/* ── Love Story Timeline ── */}
      {invitation.loveStory && (
        <section className="py-16 px-6" style={{ background: "#171b23" }}>
          <SectionReveal className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--foil-gold)", opacity: 0.7 }}>Our Story</p>
              <h2
                className="text-3xl mt-2"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}
              >
                Cerita Kita
              </h2>
            </div>
            <p className="leading-relaxed whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>
              {invitation.loveStory}
            </p>
          </SectionReveal>
        </section>
      )}

      {/* ── Gallery ── */}
      {gallery.length > 0 && (
        <section className="py-16 px-6">
          <SectionReveal className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--foil-gold)", opacity: 0.7 }}>Kenangan</p>
            <h2
              className="text-3xl mt-2"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}
            >
              Galeri Foto
            </h2>
          </SectionReveal>
          <div className="max-w-4xl mx-auto columns-2 md:columns-3 gap-3 space-y-3">
            {gallery.map((url, i) => (
              <SectionReveal key={i} delay={i * 0.05}>
                <div
                  className="overflow-hidden rounded-lg border transition-all duration-500"
                  style={{ border: "1px solid rgba(216,185,120,0.12)" }}
                >
                  <motion.img
                    src={url}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-full object-cover"
                    whileHover={reduce ? {} : { scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Countdown ── */}
      <section className="py-16 px-6" style={{ background: "#171b23" }}>
        <SectionReveal className="text-center max-w-lg mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: "var(--foil-gold)", opacity: 0.7 }}>
            {countdown.isOver ? "Hari Bahagia" : "Menuju Hari Bahagia"}
          </p>
          <h2
            className="text-3xl mb-8"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}
          >
            {countdown.isOver ? "Acara Telah Berlangsung" : "Hitung Mundur"}
          </h2>
          {countdown.isOver ? (
            <p className="text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--text-secondary)" }}>
              Terima kasih telah menjadi bagian dari hari bahagia kami
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              <BlueprintCard>
                <CountdownBox value={countdown.days} label="Hari" />
              </BlueprintCard>
              <BlueprintCard>
                <CountdownBox value={countdown.hours} label="Jam" />
              </BlueprintCard>
              <BlueprintCard>
                <CountdownBox value={countdown.mins} label="Menit" />
              </BlueprintCard>
              <BlueprintCard>
                <CountdownBox value={countdown.secs} label="Detik" />
              </BlueprintCard>
            </div>
          )}
        </SectionReveal>
      </section>

      {/* ── RSVP ── */}
      <section className="py-16 px-6">
        <SectionReveal className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--foil-gold)", opacity: 0.7 }}>
              Konfirmasi Kehadiran
            </p>
            <h2
              className="text-3xl mt-2"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}
            >
              RSVP
            </h2>
          </div>

          {rsvpSent ? (
            <BlueprintCard className="text-center py-8">
              <p className="text-xl mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--foil-gold)" }}>Terima kasih!</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Konfirmasi kehadiran Anda telah kami terima.</p>
            </BlueprintCard>
          ) : (
            <BlueprintCard>
              <form onSubmit={submitRsvp} className="space-y-4">
                <div>
                  <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>Nama</label>
                  <input
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    required
                    className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      background: "#20242f",
                      border: "1px solid rgba(216,185,120,0.18)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-2" style={{ color: "var(--text-muted)" }}>Kehadiran</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: "HADIR", label: "Hadir" },
                      { val: "TIDAK_HADIR", label: "Tidak Hadir" },
                      { val: "RAGU", label: "Ragu-ragu" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setRsvpAttendance(opt.val)}
                        className="py-2 rounded-md text-xs transition-all duration-200"
                        style={{
                          background: rsvpAttendance === opt.val ? "var(--foil-gold)" : "transparent",
                          border: `1px solid ${rsvpAttendance === opt.val ? "var(--foil-gold)" : "rgba(216,185,120,0.18)"}`,
                          color: rsvpAttendance === opt.val ? "#12151c" : "var(--text-muted)",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                {rsvpAttendance === "HADIR" && (
                  <div>
                    <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                      Jumlah tamu (termasuk Anda)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={rsvpCount}
                      onChange={(e) => setRsvpCount(Number(e.target.value))}
                      className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{
                        background: "#20242f",
                        border: "1px solid rgba(216,185,120,0.18)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                )}
                <motion.button
                  type="submit"
                  whileHover={reduce ? {} : { scale: 1.01 }}
                  whileTap={reduce ? {} : { scale: 0.99 }}
                  className="w-full py-3 rounded-md font-medium text-sm transition-all duration-300 hover:opacity-90"
                  style={{ background: "var(--foil-gold)", color: "#12151c" }}
                >
                  Kirim Konfirmasi
                </motion.button>
              </form>
            </BlueprintCard>
          )}
        </SectionReveal>
      </section>

      {/* ── Gift ── */}
      {bankAccounts && bankAccounts.length > 0 && (
        <section className="py-16 px-6" style={{ background: "#171b23" }}>
          <SectionReveal className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--foil-gold)", opacity: 0.7 }}>
                Amplop Digital
              </p>
              <h2
                className="text-3xl mt-2"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}
              >
                Kirim Kado
              </h2>
            </div>

            <button
              onClick={() => setBankOpen((p) => !p)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-md transition-all duration-200"
              style={{
                border: "1px solid rgba(216,185,120,0.18)",
                background: bankOpen ? "#1a1e27" : "#1a1e27",
              }}
            >
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Amplop Digital (opsional)
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d8b978"
                strokeWidth="2"
                style={{ transform: bankOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {bankOpen && (
              <motion.div
                initial={reduce ? {} : { opacity: 0, y: -8 }}
                animate={reduce ? {} : { opacity: 1, y: 0 }}
                className="mt-3 space-y-3"
              >
                {bankAccounts.map((acc, i) => (
                  <BlueprintCard key={i}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--foil-gold)", opacity: 0.7 }}>{acc.bank}</p>
                        <p className="text-base font-medium" style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{acc.accountNumber}</p>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{acc.accountName}</p>
                      </div>
                      <button
                        onClick={() => copyAccount(i, acc.accountNumber)}
                        className="px-3 py-1.5 rounded-md text-xs transition-all duration-200"
                        style={{
                          border: "1px solid rgba(216,185,120,0.3)",
                          color: copiedIdx === i ? "var(--status-success)" : "var(--foil-gold)",
                        }}
                      >
                        {copiedIdx === i ? "Tersalin" : "Salin"}
                      </button>
                    </div>
                  </BlueprintCard>
                ))}
              </motion.div>
            )}
          </SectionReveal>
        </section>
      )}

      {/* ── Wishes ── */}
      <section className="py-16 px-6">
        <SectionReveal className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--foil-gold)", opacity: 0.7 }}>
              Tamu Undangan
            </p>
            <h2
              className="text-3xl mt-2"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}
            >
              Ucapan & Doa
            </h2>
          </div>

          <BlueprintCard className="mb-8">
            <form onSubmit={submitWish} className="space-y-3">
              <input
                value={wishName}
                onChange={(e) => setWishName(e.target.value)}
                placeholder="Nama Anda"
                required
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  background: "#20242f",
                  border: "1px solid rgba(216,185,120,0.18)",
                  color: "var(--text-primary)",
                }}
              />
              <textarea
                value={wishMsg}
                onChange={(e) => setWishMsg(e.target.value)}
                placeholder="Tulis ucapan & doa untuk mempelai..."
                required
                rows={3}
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  background: "#20242f",
                  border: "1px solid rgba(216,185,120,0.18)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                type="submit"
                className="w-full py-2 rounded-md text-sm transition-all duration-300 hover:opacity-90"
                style={{ background: "var(--foil-gold)", color: "#12151c" }}
              >
                {wishSent ? "Terkirim!" : "Kirim Ucapan"}
              </button>
            </form>
          </BlueprintCard>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {wishes.map((w) => (
              <motion.div
                key={w.id}
                initial={reduce ? {} : { opacity: 0, y: 10 }}
                animate={reduce ? {} : { opacity: 1, y: 0 }}
                className="rounded-lg p-4 border"
                style={{ background: "#1a1e27", border: "1px solid rgba(216,185,120,0.12)" }}
              >
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{w.name}</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{w.message}</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {new Date(w.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </motion.div>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-6 text-center" style={{ background: "#0e1016" }}>
        <div className="max-w-md mx-auto">
          <div className="h-px w-16 mx-auto mb-6" style={{ background: "var(--foil-gold)", opacity: 0.3 }} />
          <p
            className="text-2xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--text-primary)" }}
          >
            {invitation.groomName} & {invitation.brideName}
          </p>
          <p className="text-sm mt-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="text-xs mt-6" style={{ color: "var(--text-muted)", opacity: 0.6 }}>
            Terima kasih atas doa dan kehadiran Anda
          </p>
        </div>
      </footer>
    </div>
  );
}
