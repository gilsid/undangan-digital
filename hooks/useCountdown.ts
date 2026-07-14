import { useState, useEffect } from "react";

export function useCountdown(target: Date) {
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
