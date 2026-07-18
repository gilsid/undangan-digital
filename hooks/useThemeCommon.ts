import { useState, useRef, type FormEvent } from "react";
import type { Wish } from "@prisma/client";
import type { Variants } from "framer-motion";

// ── Animation variant helpers (shared across all theme sections) ──

export function fadeUpVariant(reduce: boolean | null): Variants {
  if (reduce) return { hidden: {}, visible: {} };
  return {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };
}

export function springPopVariant(reduce: boolean | null): Variants {
  if (reduce) return { hidden: {}, visible: {} };
  return {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 14 } },
  };
}

/** Child item fade-up, configurable y offset and duration. Default matches most common pattern (y=16, dur=0.6). */
export function childVariant(reduce: boolean | null, y = 16, duration = 0.6): Variants {
  if (reduce) return { hidden: {}, visible: {} };
  return {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
  };
}

/** Staggered child fade-up with spring physics (Boho/Foil/Tropical pattern). */
export function childSpringVariant(reduce: boolean | null): Variants {
  if (reduce) return { hidden: {}, visible: {} };
  return {
    hidden: { opacity: 0, scale: 0.92, y: 12 },
    visible: {
      opacity: 1, scale: 1, y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 18 },
    },
  };
}

/** Eased child fade-up with cubic bezier (Boho-specific pattern). */
export function childEasedVariant(reduce: boolean | null, duration = 0.5): Variants {
  if (reduce) return { hidden: {}, visible: {} };
  return {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration, ease: [0.25, 0.4, 0.3, 1] as const } },
  };
}

/** Spring-based child variant with configurable stiffness/damping (BohoEvent pattern). */
export function childSpringConfigVariant(reduce: boolean | null, stiffness = 80, damping = 18, y = 20): Variants {
  if (reduce) return { hidden: {}, visible: {} };
  return {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1, y: 0,
      transition: { type: "spring" as const, stiffness, damping },
    },
  };
}

// ── Date helpers ──

export function formatDateID(date: Date | string): string {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

// ── ParentsInfo helpers ──

interface ParentsInfo {
  groomFather?: string;
  groomMother?: string;
  brideFather?: string;
  brideMother?: string;
}

export function getParentsInfo(data: unknown): ParentsInfo | null {
  if (typeof data !== "object" || data === null) return null;
  return data as ParentsInfo;
}

export function formatParents(
  data: unknown,
  side: "groom" | "bride",
  lang: "id" | "en" = "id",
): string {
  const info = getParentsInfo(data);
  if (!info) return "";

  const fatherKey = side === "groom" ? "groomFather" : "brideFather";
  const motherKey = side === "groom" ? "groomMother" : "brideMother";
  const father = info[fatherKey];
  const mother = info[motherKey];

  if (!father && !mother) return "";

  if (lang === "id") {
    let s = `Putra dari`;
    if (father) s += ` ${father}`;
    if (mother) s += ` & ${mother}`;
    return s;
  }
  // English
  let s = `${side === "groom" ? "Son" : "Daughter"} of`;
  if (father) s += ` ${father}`;
  if (mother) s += ` & ${mother}`;
  return s;
}

interface UseRsvpReturn {
  name: string;
  setName: (v: string) => void;
  attendance: string;
  setAttendance: (v: string) => void;
  count: number;
  setCount: (v: number) => void;
  sent: boolean;
  error: string | null;
  submit: (e: FormEvent) => Promise<void>;
}

interface UseWishReturn {
  name: string;
  setName: (v: string) => void;
  message: string;
  setMessage: (v: string) => void;
  sent: boolean;
  error: string | null;
  submit: (e: FormEvent, invitationId: string) => Promise<void>;
}

interface UseMusicReturn {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  toggleMusic: () => void;
}

interface UseRsvpOptions {
  invitationId: string;
  guestName?: string;
  onSubmit?: () => void;
}

interface UseWishOptions {
  onSubmit?: (wish: Wish) => void;
}

export function useRsvp({ invitationId, guestName, onSubmit }: UseRsvpOptions) {
  const [name, setName] = useState(guestName ?? "");
  const [attendance, setAttendance] = useState("HADIR");
  const [count, setCount] = useState(1);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invitationId,
        guestName: name,
        attendance,
        guestCount: count,
      }),
    });
    if (res.ok) {
      setSent(true);
      onSubmit?.();
    } else {
      const d = await res.json().catch(() => null);
      setError(d?.error ?? "Gagal mengirim RSVP. Silakan coba lagi.");
    }
  }

  return { name, setName, attendance, setAttendance, count, setCount, sent, error, submit };
}

export function useWish({ onSubmit }: UseWishOptions = {}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent, invitationId: string) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationId, name, message }),
    });
    if (res.ok) {
      const w = await res.json();
      setName("");
      setMessage("");
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      onSubmit?.(w);
    } else {
      const d = await res.json().catch(() => null);
      setError(d?.error ?? "Gagal mengirim ucapan. Silakan coba lagi.");
    }
  }

  return { name, setName, message, setMessage, sent, error, submit };
}

export function useMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggleMusic() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch((err) => {
        console.warn("Music play failed:", err);
      });
    }
  }

  return { audioRef, playing, setPlaying, toggleMusic };
}
