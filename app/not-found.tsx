import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f4ef] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div
          className="text-8xl font-light text-[#c9a84c] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          404
        </div>
        <h1
          className="text-2xl font-light text-[#2a2520] mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Maaf, undangan tidak ditemukan
        </h1>
        <p className="text-sm text-[#6b6560] mb-8">
          Halaman yang Anda cari mungkin telah dihapus atau tautan yang diberikan tidak valid.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-[#8a9e8a] text-white rounded-lg text-sm font-medium hover:bg-[#7a8e7a] transition-colors"
        >
          Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}
