import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function RSVPPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const invitation = await prisma.invitation.findFirst({
    where: { ownerId: session.user.id },
    include: {
      rsvps: { orderBy: { createdAt: "desc" } },
      wishes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!invitation) redirect("/admin/dashboard");

  const hadir = invitation.rsvps.filter((r) => r.attendance === "HADIR");
  const tidakHadir = invitation.rsvps.filter(
    (r) => r.attendance === "TIDAK_HADIR"
  );
  const ragu = invitation.rsvps.filter((r) => r.attendance === "RAGU");
  const totalTamu = hadir.reduce((sum, r) => sum + r.guestCount, 0);

  const navClass =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#8a9e8a]/10";

  return (
    <div className="min-h-screen bg-[#f8f4ef]">
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <h1
          className="text-xl font-light"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Undangan Digital
        </h1>
        <nav className="flex gap-2">
          <Link href="/admin/dashboard" className={navClass}>Konten</Link>
          <Link href="/admin/dashboard/guests" className={navClass}>Tamu</Link>
          <Link href="/admin/dashboard/rsvp" className={`${navClass} bg-[#8a9e8a]/10`}>RSVP</Link>
          <Link href={`/${invitation.slug}`} target="_blank" className={navClass}>Preview ↗</Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Hadir", count: hadir.length, sub: `${totalTamu} tamu`, color: "text-green-600" },
            { label: "Tidak Hadir", count: tidakHadir.length, sub: "", color: "text-red-500" },
            { label: "Ragu-ragu", count: ragu.length, sub: "", color: "text-orange-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className={`text-3xl font-light ${s.color}`}>{s.count}</p>
              <p className="text-sm font-medium mt-1">{s.label}</p>
              {s.sub && <p className="text-xs text-[#6b6560]">{s.sub}</p>}
            </div>
          ))}
        </div>

        {/* RSVP list */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-medium">Konfirmasi Kehadiran ({invitation.rsvps.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">Nama</th>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">Jml Tamu</th>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invitation.rsvps.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-medium">{r.guestName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          r.attendance === "HADIR"
                            ? "bg-green-50 text-green-700"
                            : r.attendance === "TIDAK_HADIR"
                            ? "bg-red-50 text-red-600"
                            : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {r.attendance === "HADIR"
                          ? "Hadir"
                          : r.attendance === "TIDAK_HADIR"
                          ? "Tidak Hadir"
                          : "Ragu-ragu"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{r.guestCount}</td>
                    <td className="px-4 py-3 text-[#6b6560] text-xs">
                      {new Date(r.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
                {invitation.rsvps.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[#6b6560] text-sm">
                      Belum ada RSVP masuk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Wishes */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-medium">Ucapan & Doa ({invitation.wishes.length})</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {invitation.wishes.map((w) => (
              <div key={w.id} className="px-6 py-4">
                <p className="font-medium text-sm">{w.name}</p>
                <p className="text-sm text-[#6b6560] mt-1">{w.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(w.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
            {invitation.wishes.length === 0 && (
              <p className="px-6 py-8 text-center text-[#6b6560] text-sm">
                Belum ada ucapan masuk.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
