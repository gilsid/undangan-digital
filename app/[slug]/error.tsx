"use client";

export default function InvitationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f4ef] px-6">
      <div className="text-center max-w-md">
        <p
          className="text-4xl font-light mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2c2c2c" }}
        >
          Maaf, Terjadi Kesalahan
        </p>
        <p className="text-sm text-[#6b6560] mb-8">
          Undangan tidak dapat ditampilkan. Silakan coba kembali.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 rounded-full text-sm border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-white transition-colors"
        >
          Muat Ulang
        </button>
      </div>
    </div>
  );
}
