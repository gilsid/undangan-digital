"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Invitation, Wish } from "@prisma/client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Props {
  invitation: Invitation;
  guestName?: string;
  wishes: Wish[];
}

// Elegant theme: dusty sage + ivory + gold-leaf
// Fonts: Cormorant Garamond (display) + Inter (body)

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
      initial={reduce ? {} : { opacity: 0, y: 24 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function CountdownBox({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="text-center">
      <motion.div
        key={value}
        initial={{ opacity: 0.4, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-4xl font-light"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: "#c9a84c" }}
      >
        {String(value).padStart(2, "0")}
      </motion.div>
      <p className="text-xs uppercase tracking-widest text-[#8a9e8a] mt-1">{label}</p>
    </div>
  );
}

export default function ElegantTheme({ invitation, guestName, wishes: initialWishes }: Props) {
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

  const bankAccounts = invitation.bankAccounts as
    | { bank: string; accountNumber: string; accountName: string }[]
    | null;

  const gallery = invitation.gallery ?? [];

  // Cover screen
  if (!opened) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{
          background: invitation.heroImage
            ? `linear-gradient(rgba(44,44,44,0.55), rgba(44,44,44,0.55)), url(${invitation.heroImage}) center/cover no-repeat`
            : "linear-gradient(135deg, #8a9e8a 0%, #2c2c2c 100%)",
        }}
      >
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-[#e0c97c] mb-4">
            Undangan Pernikahan
          </p>
          {guestName && (
            <p className="text-white/80 text-sm mb-2">Kepada Yth.</p>
          )}
          {guestName && (
            <h2
              className="text-2xl font-light text-white mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {guestName}
            </h2>
          )}
          <h1
            className="text-5xl font-light text-white mb-2 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {invitation.groomName}
            <span className="block text-[#c9a84c] text-3xl my-1">&</span>
            {invitation.brideName}
          </h1>
          <p className="text-white/70 text-sm mt-4 mb-10">
            {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <motion.button
            onClick={openInvitation}
            whileHover={reduce ? {} : { scale: 1.04 }}
            whileTap={reduce ? {} : { scale: 0.97 }}
            className="px-8 py-3 rounded-full text-sm tracking-widest uppercase transition-shadow"
            style={{
              background: "transparent",
              border: "1px solid #c9a84c",
              color: "#e0c97c",
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
    <div className="min-h-screen" style={{ background: "#f8f4ef" }}>
      {/* Audio */}
      {invitation.musicUrl && (
        <audio ref={audioRef} src={invitation.musicUrl} loop />
      )}

      {/* Music toggle — fixed */}
      {invitation.musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          style={{ background: "#8a9e8a" }}
          aria-label={playing ? "Matikan musik" : "Putar musik"}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
      )}

      {/* 2. Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{
          background: invitation.heroImage
            ? `linear-gradient(rgba(44,44,44,0.45), rgba(44,44,44,0.6)), url(${invitation.heroImage}) center/cover no-repeat`
            : "linear-gradient(160deg, #8a9e8a 0%, #2c2c2c 100%)",
        }}
      >
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 30 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="text-[#e0c97c] text-xs uppercase tracking-[0.4em] mb-6">
            The Wedding of
          </p>
          <h1
            className="text-white leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem,8vw,5rem)", fontWeight: 300 }}
          >
            {invitation.groomFullName ?? invitation.groomName}
          </h1>
          <p className="text-[#c9a84c] text-3xl my-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>&amp;</p>
          <h1
            className="text-white leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem,8vw,5rem)", fontWeight: 300 }}
          >
            {invitation.brideFullName ?? invitation.brideName}
          </h1>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-[#c9a84c]/50" />
            <p className="text-white/80 text-sm">
              {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="h-px w-12 bg-[#c9a84c]/50" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8"
          animate={reduce ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M7 10l5 5 5-5" />
          </svg>
        </motion.div>
      </section>

      {/* 3. Kutipan */}
      {invitation.quoteText && (
        <SectionReveal className="py-16 px-6 text-center max-w-2xl mx-auto">
          <div className="h-px bg-[#c9a84c]/30 mb-8" />
          <p
            className="text-xl font-light italic leading-relaxed"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#6b6560" }}
          >
            &ldquo;{invitation.quoteText}&rdquo;
          </p>
          {invitation.quoteSource && (
            <p className="text-sm text-[#8a9e8a] mt-4">— {invitation.quoteSource}</p>
          )}
          <div className="h-px bg-[#c9a84c]/30 mt-8" />
        </SectionReveal>
      )}

      {/* 4. Mempelai */}
      <section className="py-16 px-6">
        <SectionReveal className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a9e8a]">Mempelai</p>
          <h2
            className="text-3xl font-light mt-2"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2c2c2c" }}
          >
            Dua Jiwa, Satu Ikatan
          </h2>
        </SectionReveal>

        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Groom */}
          <SectionReveal delay={0.1} className="text-center">
            <div
              className="w-32 h-32 mx-auto rounded-full mb-4 overflow-hidden"
              style={{ border: "3px solid #c9a84c" }}
            >
              <Image
                src={invitation.groomImage || "/placeholders/elegant/groom.png"}
                alt={invitation.groomName}
                width={128}
                height={128}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <h3
              className="text-2xl font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {invitation.groomFullName ?? invitation.groomName}
            </h3>
            {(invitation.parentsInfo as { groomFather?: string; groomMother?: string } | null)?.groomFather && (
              <p className="text-sm text-[#6b6560] mt-2">
                Putra dari Bapak{" "}
                {(invitation.parentsInfo as { groomFather: string }).groomFather}
                {(invitation.parentsInfo as { groomMother?: string }).groomMother &&
                  ` & Ibu ${(invitation.parentsInfo as { groomMother: string }).groomMother}`}
              </p>
            )}
          </SectionReveal>

          {/* Bride */}
          <SectionReveal delay={0.2} className="text-center">
            <div
              className="w-32 h-32 mx-auto rounded-full mb-4 overflow-hidden"
              style={{ border: "3px solid #c9a84c" }}
            >
              <Image
                src={invitation.brideImage || "/placeholders/elegant/bride.png"}
                alt={invitation.brideName}
                width={128}
                height={128}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <h3
              className="text-2xl font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {invitation.brideFullName ?? invitation.brideName}
            </h3>
            {(invitation.parentsInfo as { brideFather?: string; brideMother?: string } | null)?.brideFather && (
              <p className="text-sm text-[#6b6560] mt-2">
                Putri dari Bapak{" "}
                {(invitation.parentsInfo as { brideFather: string }).brideFather}
                {(invitation.parentsInfo as { brideMother?: string }).brideMother &&
                  ` & Ibu ${(invitation.parentsInfo as { brideMother: string }).brideMother}`}
              </p>
            )}
          </SectionReveal>
        </div>
      </section>

      {/* 5. Detail Acara */}
      <section className="py-16 px-6" style={{ background: "#2c2c2c" }}>
        <SectionReveal className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a9e8a]">Tanggal Acara</p>
          <h2
            className="text-3xl font-light mt-2 text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Rangkaian Acara
          </h2>
        </SectionReveal>

        <div className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {invitation.akadTime && (
            <SectionReveal delay={0.1} className="text-center p-6 rounded-2xl" style={{ border: "1px solid #c9a84c33", background: "#ffffff08" }}>
              <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-3">Akad Nikah</p>
              <p className="text-white text-lg font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {invitation.akadTime}
              </p>
            </SectionReveal>
          )}
          {invitation.resepsiTime && (
            <SectionReveal delay={0.2} className="text-center p-6 rounded-2xl" style={{ border: "1px solid #c9a84c33", background: "#ffffff08" }}>
              <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-3">Resepsi</p>
              <p className="text-white text-lg font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {invitation.resepsiTime}
              </p>
            </SectionReveal>
          )}
        </div>

        <SectionReveal delay={0.3} className="text-center mt-8 max-w-md mx-auto">
          <p className="text-white font-light text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {invitation.venueName}
          </p>
          <p className="text-white/60 text-sm mt-1">{invitation.venueAddress}</p>
          {invitation.mapsEmbedUrl && !invitation.mapsEmbedUrl.includes("/maps/embed") && (
            <a
              href={invitation.mapsEmbedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-5 py-2 rounded-full text-sm transition-opacity hover:opacity-80"
              style={{ border: "1px solid #c9a84c", color: "#c9a84c" }}
            >
              Buka Google Maps
            </a>
          )}
        </SectionReveal>

          {invitation.mapsEmbedUrl?.includes("/maps/embed") && (
          <SectionReveal delay={0.4} className="mt-8 max-w-2xl mx-auto rounded-2xl overflow-hidden" style={{ height: 240 }}>
            <iframe
              src={invitation.mapsEmbedUrl}
              width="100%"
              height="240"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </SectionReveal>
          )}
      </section>

      {/* 6. Cerita Cinta */}
      {invitation.loveStory && (
        <section className="py-16 px-6">
          <SectionReveal className="max-w-2xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8a9e8a] mb-2">Our Story</p>
            <h2
              className="text-3xl font-light mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2c2c2c" }}
            >
              Cerita Kita
            </h2>
            <p className="text-[#6b6560] leading-relaxed whitespace-pre-line">
              {invitation.loveStory}
            </p>
          </SectionReveal>
        </section>
      )}

      {/* 7. Galeri */}
      {gallery.length > 0 && (
        <section className="py-16 px-6" style={{ background: "#f0ebe4" }}>
          <SectionReveal className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8a9e8a]">Kenangan</p>
            <h2
              className="text-3xl font-light mt-2"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2c2c2c" }}
            >
              Galeri Foto
            </h2>
          </SectionReveal>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3">
            {gallery.map((url, i) => (
              <SectionReveal key={i} delay={i * 0.07} className="aspect-square rounded-xl overflow-hidden">
                <motion.img
                  src={url}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-full object-cover"
                  whileHover={reduce ? {} : { scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {/* 8. Countdown */}
      <section className="py-16 px-6 text-center" style={{ background: "#f8f4ef" }}>
        <SectionReveal>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a9e8a] mb-2">
            {countdown.isOver ? "Hari Bahagia" : "Menuju Hari Bahagia"}
          </p>
          <h2
            className="text-3xl font-light mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2c2c2c" }}
          >
            {countdown.isOver ? "Acara Telah Berlangsung" : "Hitung Mundur"}
          </h2>
          {countdown.isOver ? (
            <p className="text-lg font-light text-[#6b6560]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Terima kasih telah menjadi bagian dari hari bahagia kami 🎉
            </p>
          ) : (
            <div className="flex justify-center gap-8">
              <CountdownBox value={countdown.days} label="Hari" />
              <CountdownBox value={countdown.hours} label="Jam" />
              <CountdownBox value={countdown.mins} label="Menit" />
              <CountdownBox value={countdown.secs} label="Detik" />
            </div>
          )}
        </SectionReveal>
      </section>

      {/* 9. RSVP */}
      <section className="py-16 px-6" style={{ background: "#2c2c2c" }}>
        <SectionReveal className="max-w-md mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a9e8a] text-center mb-2">
            Konfirmasi Kehadiran
          </p>
          <h2
            className="text-3xl font-light text-center text-white mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            RSVP
          </h2>

          {rsvpSent ? (
            <div className="text-center text-[#e0c97c] py-8">
              <p className="text-2xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Terima kasih!</p>
              <p className="text-sm text-white/60">Konfirmasi kehadiran Anda telah kami terima.</p>
            </div>
          ) : (
            <form onSubmit={submitRsvp} className="space-y-4">
              <div>
                <label className="block text-xs text-white/60 mb-1">Nama</label>
                <input
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  required
                  className="w-full rounded-lg px-3 py-2 text-sm bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-2">Kehadiran</label>
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
                      className="py-2 rounded-lg text-xs transition-all"
                      style={{
                        background:
                          rsvpAttendance === opt.val ? "#c9a84c" : "transparent",
                        border: `1px solid ${rsvpAttendance === opt.val ? "#c9a84c" : "rgba(255,255,255,0.2)"}`,
                        color: rsvpAttendance === opt.val ? "#2c2c2c" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {rsvpAttendance === "HADIR" && (
                <div>
                  <label className="block text-xs text-white/60 mb-1">
                    Jumlah tamu (termasuk Anda)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={rsvpCount}
                    onChange={(e) => setRsvpCount(Number(e.target.value))}
                    className="w-full rounded-lg px-3 py-2 text-sm bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                  />
                </div>
              )}
              <motion.button
                type="submit"
                whileHover={reduce ? {} : { scale: 1.02 }}
                whileTap={reduce ? {} : { scale: 0.98 }}
                className="w-full py-3 rounded-lg font-medium text-sm transition-opacity"
                style={{ background: "#c9a84c", color: "#2c2c2c" }}
              >
                Kirim Konfirmasi
              </motion.button>
            </form>
          )}
        </SectionReveal>
      </section>

      {/* 10. Amplop Digital */}
      {bankAccounts && bankAccounts.length > 0 && (
        <section className="py-16 px-6">
          <SectionReveal className="max-w-md mx-auto">
            <button
              onClick={() => setBankOpen((p) => !p)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-xl transition-colors"
              style={{ border: "1px solid #c9a84c33", background: bankOpen ? "#f0ebe4" : "white" }}
            >
              <span className="text-sm font-medium" style={{ color: "#6b6560" }}>
                Amplop Digital (opsional)
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c9a84c"
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
                  <div key={i} className="p-4 rounded-xl bg-white border border-gray-100">
                    <p className="text-xs text-[#8a9e8a] uppercase tracking-widest mb-1">{acc.bank}</p>
                    <p className="font-mono text-lg font-medium">{acc.accountNumber}</p>
                    <p className="text-sm text-[#6b6560]">{acc.accountName}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </SectionReveal>
        </section>
      )}

      {/* 11. Ucapan & Doa */}
      <section className="py-16 px-6" style={{ background: "#f0ebe4" }}>
        <SectionReveal className="max-w-lg mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a9e8a] text-center mb-2">
            Tamu Undangan
          </p>
          <h2
            className="text-3xl font-light text-center mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2c2c2c" }}
          >
            Ucapan & Doa
          </h2>

          <form onSubmit={submitWish} className="mb-8 space-y-3">
            <input
              value={wishName}
              onChange={(e) => setWishName(e.target.value)}
              placeholder="Nama Anda"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8a9e8a]"
            />
            <textarea
              value={wishMsg}
              onChange={(e) => setWishMsg(e.target.value)}
              placeholder="Tulis ucapan & doa untuk mempelai..."
              required
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8a9e8a]"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white text-sm transition-opacity hover:opacity-90"
              style={{ background: "#8a9e8a" }}
            >
              {wishSent ? "Terkirim!" : "Kirim Ucapan"}
            </button>
          </form>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {wishes.map((w) => (
              <motion.div
                key={w.id}
                initial={reduce ? {} : { opacity: 0, y: 10 }}
                animate={reduce ? {} : { opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-xl"
              >
                <p className="font-medium text-sm">{w.name}</p>
                <p className="text-sm text-[#6b6560] mt-1">{w.message}</p>
                <p className="text-xs text-gray-400 mt-1">
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

      {/* 12. Footer */}
      <footer className="py-12 px-6 text-center" style={{ background: "#2c2c2c" }}>
        <p
          className="text-3xl font-light text-white"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {invitation.groomName} & {invitation.brideName}
        </p>
        <p className="text-[#8a9e8a] text-sm mt-2">
          {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="h-px w-24 bg-[#c9a84c]/30 mx-auto my-6" />
        <p className="text-white/40 text-xs">Terima kasih atas doa dan kehadiran Anda</p>
      </footer>
    </div>
  );
}
