"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Invitation, Wish } from "@prisma/client";
import { useState } from "react";
import MapsEmbed, { getMapsSrc } from "@/components/MapsEmbed";
import Image from "next/image";
import { useCountdown } from "@/hooks/useCountdown";
import { useMusic } from "@/hooks/useThemeCommon";
import SectionReveal from "@/components/themes/shared/SectionReveal";

interface Props {
  invitation: Invitation;
  guestName?: string;
  wishes: Wish[];
}

// Rustic Theme: Terracotta (#c2593f) + Olive (#6a7b60) + Cream (#fbfbf9) + Charcoal (#3e3935)
// Display fonts: 'Playfair Display', serif / handwritten accent

function CountdownBox({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="text-center bg-[#f2ede4] px-4 py-3 rounded-lg border border-[#c2593f]/20">
      <motion.div
        key={value}
        initial={{ opacity: 0.4, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl font-medium"
        style={{ fontFamily: "'Playfair Display', serif", color: "#c2593f" }}
      >
        {String(value).padStart(2, "0")}
      </motion.div>
      <p className="text-[10px] uppercase tracking-widest text-[#6a7b60] mt-1">{label}</p>
    </div>
  );
}

export default function RusticTheme({ invitation, guestName, wishes: initialWishes }: Props) {
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
  const { audioRef, playing, setPlaying, toggleMusic } = useMusic();
  const countdown = useCountdown(new Date(invitation.weddingDate));
  const reduce = useReducedMotion();

  function openInvitation() {
    setOpened(true);
    if (invitation.musicUrl && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  async function submitRsvp(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invitationId: invitation.id,
        guestName: rsvpName,
        attendance: rsvpAttendance,
        guestCount: rsvpCount,
      }),
    });
    if (res.ok) setRsvpSent(true);
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

  // Cover Screen
  if (!opened) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
        style={{
          background: invitation.heroImage
            ? `linear-gradient(rgba(62,57,53,0.5), rgba(62,57,53,0.5)), url(${invitation.heroImage}) center/cover no-repeat`
            : "linear-gradient(135deg, #6a7b60 0%, #3e3935 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(#c2593f0a_1px,transparent_1px)] [background-size:16px_16px]" />
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 bg-[#fbfbf9]/95 border border-[#c2593f]/20 rounded-3xl p-8 max-w-sm w-full shadow-xl"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-[#6a7b60] mb-2 font-medium">
            Undangan Pernikahan
          </p>
          <div className="h-px w-16 bg-[#c2593f]/30 mx-auto my-3" />
          {guestName && (
            <p className="text-[#3e3935]/70 text-xs mb-1">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          )}
          {guestName && (
            <h2
              className="text-xl font-medium text-[#3e3935] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {guestName}
            </h2>
          )}
          <h1
            className="text-4xl font-light text-[#3e3935] mb-2 leading-snug"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {invitation.groomName}
            <span className="block text-[#c2593f] text-2xl my-1 font-serif italic">&amp;</span>
            {invitation.brideName}
          </h1>
          <p className="text-[#3e3935]/80 text-xs mt-4 mb-8 font-medium tracking-wide">
            {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <motion.button
            onClick={openInvitation}
            whileHover={reduce ? {} : { scale: 1.03 }}
            whileTap={reduce ? {} : { scale: 0.98 }}
            className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[#fbfbf9] shadow-md transition-shadow"
            style={{
              background: "#c2593f",
            }}
          >
            Buka Undangan
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#fbfbf9", color: "#3e3935" }}>
      {invitation.musicUrl && (
        <audio ref={audioRef} src={invitation.musicUrl} loop />
      )}

      {/* Music toggle */}
      {invitation.musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          style={{ background: "#c2593f" }}
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

      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{
          background: invitation.heroImage
            ? `linear-gradient(rgba(62,57,53,0.35), rgba(62,57,53,0.5)), url(${invitation.heroImage}) center/cover no-repeat`
            : "linear-gradient(160deg, #6a7b60 0%, #3e3935 100%)",
        }}
      >
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 30 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-black/20 p-8 rounded-3xl backdrop-blur-xs"
        >
          <p className="text-[#fbfbf9] text-xs uppercase tracking-[0.4em] mb-4 font-semibold">
            Pernikahan Dari
          </p>
          <h1
            className="text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem,7vw,4.5rem)", fontWeight: 400 }}
          >
            {invitation.groomFullName ?? invitation.groomName}
          </h1>
          <p className="text-[#fbfbf9]/90 text-2xl my-2 italic font-serif">&amp;</p>
          <h1
            className="text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem,7vw,4.5rem)", fontWeight: 400 }}
          >
            {invitation.brideFullName ?? invitation.brideName}
          </h1>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-[#fbfbf9]/60" />
            <p className="text-white text-sm font-medium tracking-wider">
              {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="h-px w-8 bg-[#fbfbf9]/60" />
          </div>
        </motion.div>
      </section>

      {/* Kutipan */}
      {invitation.quoteText && (
        <SectionReveal className="py-16 px-6 text-center max-w-2xl mx-auto">
          <div className="h-px bg-[#c2593f]/20 mb-8" />
          <p
            className="text-lg italic leading-relaxed text-[#3e3935]/80"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            &ldquo;{invitation.quoteText}&rdquo;
          </p>
          {invitation.quoteSource && (
            <p className="text-xs uppercase tracking-widest text-[#6a7b60] mt-4 font-semibold">— {invitation.quoteSource}</p>
          )}
          <div className="h-px bg-[#c2593f]/20 mt-8" />
        </SectionReveal>
      )}

      {/* Mempelai */}
      <section className="py-16 px-6 bg-[#f4ece1]">
        <SectionReveal className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6a7b60] font-semibold">Kami yang Berbahagia</p>
          <h2
            className="text-3xl font-light mt-2 text-[#3e3935]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Kedua Mempelai
          </h2>
        </SectionReveal>

        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Groom */}
          <SectionReveal delay={0.1} className="text-center">
            <div
              className="w-40 h-40 mx-auto rounded-full mb-6 overflow-hidden shadow-lg border-4 border-[#fbfbf9]"
            >
              <Image
                src={invitation.groomImage || "/placeholders/rustic/groom.png"}
                alt={invitation.groomName}
                width={160}
                height={160}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <h3
              className="text-2xl font-medium"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {invitation.groomFullName ?? invitation.groomName}
            </h3>
            {(invitation.parentsInfo as { groomFather?: string; groomMother?: string } | null)?.groomFather && (
              <p className="text-sm text-[#3e3935]/70 mt-2">
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
              className="w-40 h-40 mx-auto rounded-full mb-6 overflow-hidden shadow-lg border-4 border-[#fbfbf9]"
            >
              <Image
                src={invitation.brideImage || "/placeholders/rustic/bride.png"}
                alt={invitation.brideName}
                width={160}
                height={160}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <h3
              className="text-2xl font-medium"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {invitation.brideFullName ?? invitation.brideName}
            </h3>
            {(invitation.parentsInfo as { brideFather?: string; brideMother?: string } | null)?.brideFather && (
              <p className="text-sm text-[#3e3935]/70 mt-2">
                Putri dari Bapak{" "}
                {(invitation.parentsInfo as { brideFather: string }).brideFather}
                {(invitation.parentsInfo as { brideMother?: string }).brideMother &&
                  ` & Ibu ${(invitation.parentsInfo as { brideMother: string }).brideMother}`}
              </p>
            )}
          </SectionReveal>
        </div>
      </section>

      {/* Detail Acara */}
      <section className="py-16 px-6 bg-[#6a7b60] text-white">
        <SectionReveal className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f4ece1] font-semibold">The Event</p>
          <h2
            className="text-3xl font-light mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Waktu & Tempat
          </h2>
        </SectionReveal>

        <div className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {invitation.akadTime && (
            <SectionReveal delay={0.1} className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <p className="text-[#f4ece1] text-xs uppercase tracking-widest mb-2 font-bold">Akad Nikah</p>
              <p className="text-white text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                {invitation.akadTime}
              </p>
            </SectionReveal>
          )}
          {invitation.resepsiTime && (
            <SectionReveal delay={0.2} className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <p className="text-[#f4ece1] text-xs uppercase tracking-widest mb-2 font-bold">Resepsi</p>
              <p className="text-white text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                {invitation.resepsiTime}
              </p>
            </SectionReveal>
          )}
        </div>

        <SectionReveal delay={0.3} className="text-center mt-10 max-w-md mx-auto">
          <p className="text-white font-medium text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            {invitation.venueName}
          </p>
          <p className="text-white/80 text-sm mt-1">{invitation.venueAddress}</p>
          {getMapsSrc(invitation.mapsEmbedUrl) && !getMapsSrc(invitation.mapsEmbedUrl)!.includes("/maps/embed") && (
            <a
              href={getMapsSrc(invitation.mapsEmbedUrl)!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-colors bg-[#c2593f] text-white hover:bg-[#c2593f]/90"
            >
              Petunjuk Peta (Google Maps)
            </a>
          )}
        </SectionReveal>

        {getMapsSrc(invitation.mapsEmbedUrl)?.includes("/maps/embed") && (
        <SectionReveal delay={0.4} className="mt-8 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-white/10" style={{ height: 240 }}>
          <MapsEmbed
            mapsEmbedUrl={invitation.mapsEmbedUrl}
            iframeHeight={240}
          />
        </SectionReveal>
        )}
      </section>

      {/* Cerita Cinta */}
      {invitation.loveStory && (
        <section className="py-16 px-6 bg-[#fbfbf9]">
          <SectionReveal className="max-w-2xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#6a7b60] mb-2 font-bold">Our Love Story</p>
            <h2
              className="text-3xl font-light mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Kisah Kasih Kami
            </h2>
            <p className="text-[#3e3935]/80 leading-relaxed whitespace-pre-line text-sm md:text-base">
              {invitation.loveStory}
            </p>
          </SectionReveal>
        </section>
      )}

      {/* Galeri */}
      {gallery.length > 0 && (
        <section className="py-16 px-6 bg-[#f4ece1]">
          <SectionReveal className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#6a7b60] font-bold">Momen Bahagia</p>
            <h2
              className="text-3xl font-light mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Galeri Kenangan
            </h2>
          </SectionReveal>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((url, i) => (
              <SectionReveal key={i} delay={i * 0.07} className="aspect-square rounded-2xl overflow-hidden shadow-md">
                <motion.img
                  src={url}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-full object-cover"
                  whileHover={reduce ? {} : { scale: 1.04 }}
                  transition={{ duration: 0.4 }}
                />
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {/* Countdown */}
      <section className="py-16 px-6 text-center bg-[#fbfbf9]">
        <SectionReveal>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6a7b60] mb-2 font-bold">
            {countdown.isOver ? "Hari Bahagia" : "Menghitung Hari"}
          </p>
          <h2
            className="text-3xl font-light mb-10"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {countdown.isOver ? "Acara Telah Selesai" : "Waktu yang Dinanti"}
          </h2>
          {countdown.isOver ? (
            <p className="text-base text-[#3e3935]/70" style={{ fontFamily: "'Playfair Display', serif" }}>
              Terima kasih telah menjadi bagian dari hari bahagia kami 🎉
            </p>
          ) : (
            <div className="flex justify-center gap-4 max-w-sm mx-auto">
              <CountdownBox value={countdown.days} label="Hari" />
              <CountdownBox value={countdown.hours} label="Jam" />
              <CountdownBox value={countdown.mins} label="Menit" />
              <CountdownBox value={countdown.secs} label="Detik" />
            </div>
          )}
        </SectionReveal>
      </section>

      {/* RSVP */}
      <section className="py-16 px-6 bg-[#3e3935] text-[#fbfbf9]">
        <SectionReveal className="max-w-md mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6a7b60] text-center mb-2 font-bold">
            Rencana Kehadiran
          </p>
          <h2
            className="text-3xl font-light text-center text-white mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Konfirmasi RSVP
          </h2>

          {rsvpSent ? (
            <div className="text-center text-[#f4ece1] py-8">
              <p className="text-xl mb-2 font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>Terima kasih atas konfirmasi Anda!</p>
              <p className="text-sm text-white/70">Pesan kehadiran telah tersimpan di daftar kami.</p>
            </div>
          ) : (
            <form onSubmit={submitRsvp} className="space-y-4 text-left">
              <div>
                <label className="block text-xs text-[#fbfbf9]/70 mb-1 font-medium">Nama Tamu</label>
                <input
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  required
                  className="w-full rounded-lg px-3 py-2 text-sm bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#c2593f]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#fbfbf9]/70 mb-2 font-medium">Kehadiran</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: "HADIR", label: "Hadir" },
                    { val: "TIDAK_HADIR", label: "Absen" },
                    { val: "RAGU", label: "Ragu" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setRsvpAttendance(opt.val)}
                      className="py-2 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background:
                          rsvpAttendance === opt.val ? "#c2593f" : "transparent",
                        border: `1px solid ${rsvpAttendance === opt.val ? "#c2593f" : "rgba(255,255,255,0.2)"}`,
                        color: "#fbfbf9",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {rsvpAttendance === "HADIR" && (
                <div>
                  <label className="block text-xs text-[#fbfbf9]/70 mb-1 font-medium">
                    Jumlah Kehadiran
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={rsvpCount}
                    onChange={(e) => setRsvpCount(Number(e.target.value))}
                    className="w-full rounded-lg px-3 py-2 text-sm bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#c2593f]"
                  />
                </div>
              )}
              <motion.button
                type="submit"
                whileHover={reduce ? {} : { scale: 1.02 }}
                whileTap={reduce ? {} : { scale: 0.98 }}
                className="w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest text-white transition-opacity"
                style={{ background: "#c2593f" }}
              >
                Kirim Konfirmasi
              </motion.button>
            </form>
          )}
        </SectionReveal>
      </section>

      {/* Amplop Digital */}
      {bankAccounts && bankAccounts.length > 0 && (
        <section className="py-16 px-6 bg-[#fbfbf9]">
          <SectionReveal className="max-w-md mx-auto">
            <button
              onClick={() => setBankOpen((p) => !p)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-xl transition-colors border border-[#c2593f]/25"
              style={{ background: bankOpen ? "#f4ece1" : "white" }}
            >
              <span className="text-sm font-semibold text-[#3e3935]/80">
                Tanda Kasih (Amplop Digital)
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c2593f"
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
                  <div key={i} className="p-4 rounded-xl bg-white border border-gray-150 shadow-xs">
                    <p className="text-xs text-[#c2593f] uppercase font-bold tracking-widest mb-1">{acc.bank}</p>
                    <p className="font-mono text-lg font-medium text-[#3e3935]">{acc.accountNumber}</p>
                    <p className="text-sm text-[#3e3935]/70">{acc.accountName}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </SectionReveal>
        </section>
      )}

      {/* Ucapan & Doa */}
      <section className="py-16 px-6 bg-[#f4ece1]">
        <SectionReveal className="max-w-lg mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6a7b60] text-center mb-2 font-bold">
            Buku Tamu
          </p>
          <h2
            className="text-3xl font-light text-center mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Kirim Doa Restu
          </h2>

          <form onSubmit={submitWish} className="mb-8 space-y-3">
            <input
              value={wishName}
              onChange={(e) => setWishName(e.target.value)}
              placeholder="Nama Lengkap"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6a7b60]"
            />
            <textarea
              value={wishMsg}
              onChange={(e) => setWishMsg(e.target.value)}
              placeholder="Tulis ucapan selamat & doa restu Anda..."
              required
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6a7b60]"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-white text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-90 shadow-xs"
              style={{ background: "#6a7b60" }}
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
                className="bg-white p-4 rounded-xl shadow-xs"
              >
                <p className="font-semibold text-sm">{w.name}</p>
                <p className="text-sm text-[#3e3935]/80 mt-1">{w.message}</p>
                <p className="text-[10px] text-gray-400 mt-2">
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

      {/* Footer */}
      <footer className="py-16 px-6 text-center bg-[#3e3935] text-[#fbfbf9]/60">
        <p
          className="text-3xl font-light text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {invitation.groomName} &amp; {invitation.brideName}
        </p>
        <p className="text-[#6a7b60] text-xs font-bold uppercase tracking-widest mt-2">
          {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="h-px w-16 bg-[#c2593f]/30 mx-auto my-6" />
        <p className="text-xs">Atas doa restu yang diberikan, kami ucapkan terima kasih.</p>
      </footer>
    </div>
  );
}
