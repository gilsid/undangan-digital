"use client";

import { useEffect } from "react";

// Tracks that a guest opened their personal link — called once on mount
// Uses separate API route so Server Component render doesn't trigger it
export default function TrackOpened({ code }: { code: string }) {
  useEffect(() => {
    fetch(`/api/track/${code}`).catch(() => {});
  }, [code]);
  return null;
}
