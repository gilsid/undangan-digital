"use client";

import { useState, useRef, cloneElement, isValidElement, type ReactNode } from "react";
import type { Invitation } from "@prisma/client";
import type { ThemeConfig } from "@/types/theme";
import { ThemeProvider } from "./ThemeProvider";

interface Props {
  invitation: Invitation;
  themeConfig: ThemeConfig;
  cover: ReactNode;
  children: ReactNode;
  musicToggle?: (playing: boolean, toggleMusic: () => void) => ReactNode;
}

export default function ThemeLayout({ invitation, themeConfig, cover, children, musicToggle }: Props) {
  const [opened, setOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function openInvitation() {
    setOpened(true);
    if (invitation.musicUrl && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch((err) => {
        console.warn("Music play failed:", err);
      });
    }
  }

  function toggleMusic() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch((err) => {
        console.warn("Music play toggle failed:", err);
      });
    }
  }

  if (!opened) {
    return (
      <ThemeProvider config={themeConfig}>
        {isValidElement(cover)
          ? cloneElement(cover as React.ReactElement<{ onOpen?: () => void }>, { onOpen: openInvitation })
          : cover}
      </ThemeProvider>
    );
  }

  const isMinimalist = themeConfig.id === "minimalist";

  return (
    <ThemeProvider config={themeConfig}>
      {invitation.musicUrl && <audio ref={audioRef} src={invitation.musicUrl} loop />}

      {invitation.musicUrl && (
        musicToggle ? (
          musicToggle(playing, toggleMusic)
        ) : (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          style={
            isMinimalist
              ? { background: "#ffffff", border: "1px solid #111111" }
              : { background: themeConfig.colors.accent }
          }
          aria-label={playing ? "Matikan musik" : "Putar musik"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isMinimalist ? "#111111" : "white"}>
            {playing ? (
              <>
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </>
            ) : (
              <polygon points="5,3 19,12 5,21" />
            )}
          </svg>
        </button>
        )
      )}

      {children}
    </ThemeProvider>
  );
}
