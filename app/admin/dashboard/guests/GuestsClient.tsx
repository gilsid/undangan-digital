"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Invitation, Guest } from "@prisma/client";
import Link from "next/link";
import { generateWaLink, generateInviteMessage } from "@/lib/whatsapp";

interface Props {
  invitation: Invitation;
  guests: Guest[];
}

export default function GuestsClient({ invitation, guests: initialGuests }: Props) {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [adding, setAdding] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  function inviteUrl(code: string) {
    return `${baseUrl}/${invitation.slug}?to=${code}`;
  }

  function waLink(guest: Guest) {
    if (!guest.phone) return "#";
    const msg = generateInviteMessage(
      guest.name,
      invitation.groomName,
      invitation.brideName,
      inviteUrl(guest.uniqueCode)
    );
    return generateWaLink(guest.phone, msg);
  }

  async function addGuest(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    const res = await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        phone: newPhone,
        group: newGroup,
        invitationId: invitation.id,
      }),
    });
    if (res.ok) {
      const g = await res.json();
      setGuests((p) => [g, ...p]);
      setNewName("");
      setNewPhone("");
      setNewGroup("");
    }
    setAdding(false);
  }

  async function deleteGuest(id: string) {
    await fetch(`/api/guests/${id}`, { method: "DELETE" });
    setGuests((p) => p.filter((g) => g.id !== id));
  }

  async function markSent(id: string) {
    await fetch(`/api/guests/${id}/sent`, { method: "POST" });
    setGuests((p) =>
      p.map((g) =>
        g.id === id ? { ...g, isSent: true, sentAt: new Date() } : g
      )
    );
  }

  async function importCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportMsg("Mengimpor...");
    const text = await file.text();
    const res = await fetch("/api/guests/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv: text, invitationId: invitation.id }),
    });
    const d = await res.json();
    setImportMsg(d.message ?? "Selesai.");
    router.refresh();
  }

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
          <Link href="/admin/dashboard/guests" className={`${navClass} bg-[#8a9e8a]/10`}>Tamu</Link>
          <Link href="/admin/dashboard/rsvp" className={navClass}>RSVP</Link>
          <Link href={`/${invitation.slug}`} target="_blank" className={navClass}>Preview ↗</Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Add guest */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-medium mb-4">Tambah Tamu</h2>
          <form onSubmit={addGuest} className="flex gap-3 flex-wrap">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nama tamu"
              required
              className="flex-1 min-w-[150px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a9e8a]"
            />
            <input
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="No. WA (misal: 08123...)"
              className="flex-1 min-w-[150px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a9e8a]"
            />
            <input
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              placeholder="Grup (opsional)"
              className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a9e8a]"
            />
            <button
              type="submit"
              disabled={adding}
              className="px-5 py-2 rounded-lg text-white text-sm disabled:opacity-60"
              style={{ background: "#8a9e8a" }}
            >
              {adding ? "..." : "Tambah"}
            </button>
          </form>
        </section>

        {/* Import CSV */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-medium mb-2">Import Bulk via CSV</h2>
          <p className="text-xs text-[#6b6560] mb-3">
            Format: <code>name,phone,group</code> (header wajib ada, group opsional)
          </p>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-lg border border-[#8a9e8a] text-[#8a9e8a] text-sm hover:bg-[#8a9e8a]/10 transition-colors"
            >
              Pilih file CSV
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={importCSV}
              className="hidden"
            />
            {importMsg && (
              <span className="text-sm text-[#6b6560]">{importMsg}</span>
            )}
          </div>
        </section>

        {/* Guest table */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-medium">
              Daftar Tamu ({guests.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">Nama</th>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">No. WA</th>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">Grup</th>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {guests.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium">{g.name}</td>
                    <td className="px-4 py-3 text-[#6b6560]">{g.phone ?? "-"}</td>
                    <td className="px-4 py-3 text-[#6b6560]">{g.group ?? "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-xs ${g.isSent ? "text-green-600" : "text-gray-400"}`}>
                          {g.isSent ? "Terkirim" : "Belum kirim"}
                        </span>
                        <span className={`text-xs ${g.openedAt ? "text-blue-500" : "text-gray-400"}`}>
                          {g.openedAt ? "Dibuka" : "Belum dibuka"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {g.phone && (
                          <a
                            href={waLink(g)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => markSent(g.id)}
                            className="px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs hover:bg-green-100 transition-colors"
                          >
                            Kirim WA
                          </a>
                        )}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(inviteUrl(g.uniqueCode));
                          }}
                          className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs hover:bg-gray-200 transition-colors"
                        >
                          Copy Link
                        </button>
                        <button
                          onClick={() => deleteGuest(g.id)}
                          className="px-3 py-1 rounded-lg bg-red-50 text-red-500 text-xs hover:bg-red-100 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {guests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[#6b6560] text-sm">
                      Belum ada tamu. Tambahkan satu per satu atau import CSV.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
