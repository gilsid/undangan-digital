"use client";

export default function RsvpError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--ink-bg)" }}>
      <div className="ledger-card max-w-sm text-center p-8">
        <p className="font-display text-lg text-[var(--text-primary)] mb-2">Gagal Memuat RSVP</p>
        <p className="text-sm text-[var(--text-secondary)] mb-6">Data RSVP dan ucapan tidak dapat dimuat.</p>
        <button
          onClick={reset}
          className="px-6 py-2 rounded-md text-sm font-medium bg-[var(--foil-gold)] text-[var(--ink-bg)] hover:bg-[var(--foil-gold-muted)] transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
