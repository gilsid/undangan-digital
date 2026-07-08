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

// Minimalist Theme: Pure White (#ffffff) + Jet Black (#111111) + Steel Gray (#777777) + Pale Gray (#f5f5f5)
// Fonts: Clean Sans-Serif (Inter) with generous letter-spacing and uppercase tracking

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
      initial={reduce ? {} : { opacity: 0, y: 15 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
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
    <div className="text-center flex-1">
      <motion.div
        key={value}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="text-3xl font-light tracking-tighter text-[#111111]"
      >
        {String(value).padStart(2, "0")}
      </motion.div>
      <p className="text-[9px] uppercase tracking-[0.2em] text-[#777777] mt-0.5">{label}</p>
    </div>
  );
}

export default function MinimalistTheme({ invitation, guestName, wishes: initialWishes }: Props) {
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

  // Cover Screen
  if (!opened) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between p-8 text-left relative">
        <div className="border border-[#111111]/10 flex-1 flex flex-col justify-between p-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#777777]">
              Wedding Invitation
            </p>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-light text-[#111111] uppercase tracking-wide leading-tight">
              {invitation.groomName}
              <span className="block text-[#777777] text-xl font-normal lowercase my-1">and</span>
              {invitation.brideName}
            </h1>
            <p className="text-sm tracking-widest text-[#777777] uppercase mt-6">
              {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="space-y-6">
            {guestName && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#777777] mb-1">Kepada Yth.</p>
                <p className="text-lg font-medium text-[#111111]">{guestName}</p>
              </div>
            )}
            <motion.button
              onClick={openInvitation}
              whileHover={reduce ? {} : { x: 5 }}
              className="group flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-semibold text-[#111111]"
            >
              Open Invitation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased">
      {invitation.musicUrl && (
        <audio ref={audioRef} src={invitation.musicUrl} loop />
      )}

      {/* Music toggle */}
      {invitation.musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 w-9 h-9 rounded-full flex items-center justify-center border border-[#111111] bg-white transition-colors hover:bg-neutral-50"
          aria-label={playing ? "Mute" : "Unmute"}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
      )}

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-between p-8 md:p-16 border-b border-neutral-100">
        <div className="w-full flex justify-between items-start text-xs uppercase tracking-widest text-[#777777]">
          <span>{invitation.groomName} &amp; {invitation.brideName}</span>
          <span>{new Date(invitation.weddingDate).getFullYear()}</span>
        </div>
        <div className="my-auto py-12">
          <motion.p
            initial={reduce ? {} : { opacity: 0 }}
            animate={reduce ? {} : { opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-[10px] uppercase tracking-[0.4em] text-[#777777] mb-6"
          >
            The Union Of
          </motion.p>
          <motion.h1
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extralight tracking-tight uppercase leading-none text-[#111111]"
          >
            {invitation.groomFullName ?? invitation.groomName}
          </motion.h1>
          <motion.div
            initial={reduce ? {} : { opacity: 0 }}
            animate={reduce ? {} : { opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-[#777777] text-2xl my-3 font-light italic"
          >
            &amp;
          </motion.div>
          <motion.h1
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-5xl md:text-7xl font-extralight tracking-tight uppercase leading-none text-[#111111]"
          >
            {invitation.brideFullName ?? invitation.brideName}
          </motion.h1>
        </div>
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-xs uppercase tracking-widest text-[#777777]">
          <div>
            <p className="text-[#111111] font-medium">Save The Date</p>
            <p className="mt-1">
              {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="h-px w-6 bg-neutral-200" />
            <span>Scroll to view</span>
          </div>
        </div>
      </section>

      {/* Kutipan */}
      {invitation.quoteText && (
        <SectionReveal className="py-24 px-8 max-w-xl mx-auto text-center border-b border-neutral-50">
          <p className="text-sm font-light tracking-wide leading-relaxed text-[#777777]">
            &ldquo;{invitation.quoteText}&rdquo;
          </p>
          {invitation.quoteSource && (
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#111111] mt-6 font-semibold">{invitation.quoteSource}</p>
          )}
        </SectionReveal>
      )}

      {/* Mempelai */}
      <section className="py-24 px-8 max-w-4xl mx-auto border-b border-neutral-50">
        <SectionReveal className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#777777]">Profile</p>
          <h2 className="text-3xl font-extralight tracking-tight uppercase mt-1">The Couple</h2>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Groom */}
          <SectionReveal delay={0.05} className="flex flex-col gap-6">
            <div className="aspect-square bg-neutral-50 grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden relative">
              <Image
                src={invitation.groomImage || "/placeholders/minimalist/groom.png"}
                alt={invitation.groomName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#777777] mb-1">Groom</p>
              <h3 className="text-xl font-light uppercase tracking-wide">
                {invitation.groomFullName ?? invitation.groomName}
              </h3>
              {(invitation.parentsInfo as { groomFather?: string; groomMother?: string } | null)?.groomFather && (
                <p className="text-xs text-[#777777] mt-2 tracking-wide">
                  Son of Mr. {(invitation.parentsInfo as { groomFather: string }).groomFather}
                  {(invitation.parentsInfo as { groomMother?: string }).groomMother &&
                    ` & Mrs. ${(invitation.parentsInfo as { groomMother: string }).groomMother}`}
                </p>
              )}
            </div>
          </SectionReveal>

          {/* Bride */}
          <SectionReveal delay={0.15} className="flex flex-col gap-6">
            <div className="aspect-square bg-neutral-50 grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden relative">
              <Image
                src={invitation.brideImage || "/placeholders/minimalist/bride.png"}
                alt={invitation.brideName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#777777] mb-1">Bride</p>
              <h3 className="text-xl font-light uppercase tracking-wide">
                {invitation.brideFullName ?? invitation.brideName}
              </h3>
              {(invitation.parentsInfo as { brideFather?: string; brideMother?: string } | null)?.brideFather && (
                <p className="text-xs text-[#777777] mt-2 tracking-wide">
                  Daughter of Mr. {(invitation.parentsInfo as { brideFather: string }).brideFather}
                  {(invitation.parentsInfo as { brideMother?: string }).brideMother &&
                    ` & Mrs. ${(invitation.parentsInfo as { brideMother: string }).brideMother}`}
                </p>
              )}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Detail Acara */}
      <section className="py-24 px-8 max-w-4xl mx-auto border-b border-neutral-50">
        <SectionReveal className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#777777]">Celebration</p>
          <h2 className="text-3xl font-extralight tracking-tight uppercase mt-1">Date &amp; Venue</h2>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            {invitation.akadTime && (
              <SectionReveal delay={0.05}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#777777] font-semibold mb-2">Akad Nikah</p>
                <p className="text-lg font-light tracking-wide">{invitation.akadTime}</p>
              </SectionReveal>
            )}
            {invitation.resepsiTime && (
              <SectionReveal delay={0.1}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#777777] font-semibold mb-2">Resepsi</p>
                <p className="text-lg font-light tracking-wide">{invitation.resepsiTime}</p>
              </SectionReveal>
            )}
            <SectionReveal delay={0.15} className="pt-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#777777] font-semibold mb-2">Location</p>
              <p className="text-lg font-light tracking-wide uppercase">{invitation.venueName}</p>
              <p className="text-xs text-[#777777] mt-1 tracking-wide">{invitation.venueAddress}</p>
              {invitation.mapsEmbedUrl && !invitation.mapsEmbedUrl.includes("/maps/embed") && (
                <a
                  href={invitation.mapsEmbedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-[10px] uppercase tracking-[0.2em] font-semibold border-b border-[#111111] pb-1 hover:text-[#777777] hover:border-neutral-300 transition-colors"
                >
                  View on Google Maps
                </a>
              )}
            </SectionReveal>
          </div>

          {invitation.mapsEmbedUrl?.includes("/maps/embed") && (
            <SectionReveal delay={0.2} className="w-full bg-[#fcfcfc] border border-neutral-100 p-2">
              <iframe
                src={invitation.mapsEmbedUrl}
                width="100%"
                height="280"
                style={{ border: 0, filter: "grayscale(1) contrast(1.1)" }}
                allowFullScreen
                loading="lazy"
              />
            </SectionReveal>
          )}
        </div>
      </section>

      {/* Cerita Cinta */}
      {invitation.loveStory && (
        <section className="py-24 px-8 max-w-3xl mx-auto border-b border-neutral-50">
          <SectionReveal className="mb-12 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#777777]">History</p>
            <h2 className="text-3xl font-extralight tracking-tight uppercase mt-1">Our Journey</h2>
          </SectionReveal>
          <SectionReveal className="text-sm font-light leading-relaxed text-[#777777] text-justify space-y-6">
            <p className="whitespace-pre-line">{invitation.loveStory}</p>
          </SectionReveal>
        </section>
      )}

      {/* Galeri */}
      {gallery.length > 0 && (
        <section className="py-24 px-8 max-w-4xl mx-auto border-b border-neutral-50">
          <SectionReveal className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#777777]">Gallery</p>
            <h2 className="text-3xl font-extralight tracking-tight uppercase mt-1">Visual Log</h2>
          </SectionReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {gallery.map((url, i) => (
              <SectionReveal key={i} delay={i * 0.05} className="aspect-square overflow-hidden bg-neutral-50 grayscale hover:grayscale-0 transition-all duration-500 relative">
                <Image
                  src={url}
                  alt={`Photo ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {/* Countdown */}
      <section className="py-24 px-8 max-w-xl mx-auto text-center border-b border-neutral-50">
        <SectionReveal>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#777777] mb-2 font-bold">
            {countdown.isOver ? "Celebration" : "Timeline"}
          </p>
          <h2 className="text-3xl font-extralight tracking-tight uppercase mb-12">
            {countdown.isOver ? "Event Passed" : "Time Remaining"}
          </h2>
          {countdown.isOver ? (
            <p className="text-sm font-light text-[#777777] tracking-wide">
              Thank you for being part of our special day 🎉
            </p>
          ) : (
            <div className="flex justify-between items-center max-w-xs mx-auto border-t border-b border-neutral-100 py-6">
              <CountdownBox value={countdown.days} label="Days" />
              <div className="h-4 w-px bg-neutral-200" />
              <CountdownBox value={countdown.hours} label="Hours" />
              <div className="h-4 w-px bg-neutral-200" />
              <CountdownBox value={countdown.mins} label="Mins" />
              <div className="h-4 w-px bg-neutral-200" />
              <CountdownBox value={countdown.secs} label="Secs" />
            </div>
          )}
        </SectionReveal>
      </section>

      {/* RSVP */}
      <section className="py-24 px-8 max-w-md mx-auto border-b border-neutral-50">
        <SectionReveal>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#777777] text-center mb-2 font-semibold">
            RSVP
          </p>
          <h2 className="text-3xl font-extralight tracking-tight text-center uppercase mb-12">
            Will You Attend?
          </h2>

          {rsvpSent ? (
            <div className="text-center py-6 text-sm tracking-wide text-[#777777]">
              <p className="font-medium text-[#111111] mb-1">Confirmation Received.</p>
              <p>Thank you for letting us know.</p>
            </div>
          ) : (
            <form onSubmit={submitRsvp} className="space-y-6 text-left">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-[#777777] mb-1.5 font-bold">Your Name</label>
                <input
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  required
                  className="w-full rounded-none px-3 py-2 text-sm border border-neutral-200 text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-[#777777] mb-2.5 font-bold">Attendance</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: "HADIR", label: "Attend" },
                    { val: "TIDAK_HADIR", label: "Regret" },
                    { val: "RAGU", label: "Maybe" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setRsvpAttendance(opt.val)}
                      className="py-2 text-[10px] uppercase tracking-widest transition-all font-semibold"
                      style={{
                        background: rsvpAttendance === opt.val ? "#111111" : "transparent",
                        border: `1px solid ${rsvpAttendance === opt.val ? "#111111" : "#e5e5e5"}`,
                        color: rsvpAttendance === opt.val ? "#ffffff" : "#777777",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {rsvpAttendance === "HADIR" && (
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#777777] mb-1.5 font-bold">
                    Guests Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={rsvpCount}
                    onChange={(e) => setRsvpCount(Number(e.target.value))}
                    className="w-full rounded-none px-3 py-2 text-sm border border-neutral-200 text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
              )}
              <motion.button
                type="submit"
                whileHover={reduce ? {} : { scale: 1.01 }}
                whileTap={reduce ? {} : { scale: 0.99 }}
                className="w-full py-3 bg-[#111111] text-white text-[10px] uppercase tracking-[0.25em] font-semibold transition-colors hover:bg-neutral-800"
              >
                Send RSVP
              </motion.button>
            </form>
          )}
        </SectionReveal>
      </section>

      {/* Amplop Digital */}
      {bankAccounts && bankAccounts.length > 0 && (
        <section className="py-24 px-8 max-w-md mx-auto border-b border-neutral-50">
          <SectionReveal>
            <button
              onClick={() => setBankOpen((p) => !p)}
              className="w-full flex items-center justify-between px-4 py-3 border border-neutral-200 transition-colors hover:border-[#111111]"
              style={{ background: bankOpen ? "#fafafa" : "white" }}
            >
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#777777]">
                Digital Gift
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ transform: bankOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {bankOpen && (
              <motion.div
                initial={reduce ? {} : { opacity: 0, y: -5 }}
                animate={reduce ? {} : { opacity: 1, y: 0 }}
                className="mt-2 space-y-2"
              >
                {bankAccounts.map((acc, i) => (
                  <div key={i} className="p-4 border border-neutral-100 bg-white">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#777777] font-semibold mb-1">{acc.bank}</p>
                    <p className="font-mono text-base font-medium">{acc.accountNumber}</p>
                    <p className="text-xs text-[#777777] mt-0.5">{acc.accountName}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </SectionReveal>
        </section>
      )}

      {/* Ucapan & Doa */}
      <section className="py-24 px-8 max-w-lg mx-auto">
        <SectionReveal>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#777777] text-center mb-2 font-semibold">
            Guest Book
          </p>
          <h2 className="text-3xl font-extralight tracking-tight text-center uppercase mb-12">
            Wishes &amp; Prayers
          </h2>

          <form onSubmit={submitWish} className="mb-12 space-y-4">
            <input
              value={wishName}
              onChange={(e) => setWishName(e.target.value)}
              placeholder="Your Name"
              required
              className="w-full rounded-none border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-[#111111]"
            />
            <textarea
              value={wishMsg}
              onChange={(e) => setWishMsg(e.target.value)}
              placeholder="Leave your wishes..."
              required
              rows={3}
              className="w-full rounded-none border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-[#111111]"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-[#111111] text-white text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-neutral-800 transition-colors"
            >
              {wishSent ? "Sent!" : "Send Wishes"}
            </button>
          </form>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {wishes.map((w) => (
              <motion.div
                key={w.id}
                initial={reduce ? {} : { opacity: 0 }}
                animate={reduce ? {} : { opacity: 1 }}
                className="border-b border-neutral-100 pb-4 text-left"
              >
                <p className="font-semibold text-xs uppercase tracking-wider text-[#111111]">{w.name}</p>
                <p className="text-xs text-[#777777] mt-1.5 leading-relaxed">{w.message}</p>
                <p className="text-[8px] uppercase tracking-widest text-[#777777] mt-2">
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
      <footer className="py-20 px-8 text-center border-t border-neutral-100 bg-[#fafafa]">
        <p className="text-xl font-light uppercase tracking-widest text-[#111111]">
          {invitation.groomName} &amp; {invitation.brideName}
        </p>
        <p className="text-[9px] uppercase tracking-[0.3em] text-[#777777] mt-2">
          {new Date(invitation.weddingDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="h-px w-8 bg-neutral-200 mx-auto my-6" />
        <p className="text-[9px] uppercase tracking-widest text-[#777777]">Thank You</p>
      </footer>
    </div>
  );
}
