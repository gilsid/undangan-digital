import { useState, useRef, type FormEvent } from "react";
import type { Wish } from "@prisma/client";

interface RsvpForm {
  guestName: string;
  attendance: string;
  guestCount: number;
}

interface WishForm {
  name: string;
  message: string;
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

  async function submit(e: FormEvent) {
    e.preventDefault();
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
    }
  }

  return { name, setName, attendance, setAttendance, count, setCount, sent, submit };
}

export function useWish({ onSubmit }: UseWishOptions = {}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(e: FormEvent, invitationId: string) {
    e.preventDefault();
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
    }
  }

  return { name, setName, message, setMessage, sent, submit };
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
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  return { audioRef, playing, setPlaying, toggleMusic };
}
