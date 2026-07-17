import { useState, useRef, type FormEvent } from "react";
import type { Wish } from "@prisma/client";

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
