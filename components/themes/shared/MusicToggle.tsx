"use client";

import type { RefObject } from "react";

interface Props {
  audioRef: RefObject<HTMLAudioElement | null>;
  playing: boolean;
  onToggle: () => void;
  className?: string;
}

export default function MusicToggle({ audioRef, playing, onToggle, className = "" }: Props) {
  return (
    <>
      {audioRef.current && <audio ref={audioRef as any} loop />}
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${className}`}
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
    </>
  );
}
