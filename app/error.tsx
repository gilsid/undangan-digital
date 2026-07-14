"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--ink-bg)" }}>
      <div className="text-center max-w-sm">
        <p className="text-5xl font-light mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--foil-gold)" }}>
          Oops!
        </p>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Terjadi kesalahan. Silakan coba lagi.
        </p>
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
