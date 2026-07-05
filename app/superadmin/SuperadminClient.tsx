"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Invitation {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  isPublished: boolean;
  createdAt: Date;
  owner: { email: string };
  _count: { guests: number; rsvps: number };
}

interface User {
  id: string;
  email: string;
}

interface Props {
  invitations: Invitation[];
  users: User[];
}

export default function SuperadminClient({ invitations, users }: Props) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    slug: "",
    groomName: "",
    brideName: "",
    weddingDate: "",
    venueName: "",
    venueAddress: "",
  });
  const [msg, setMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function createInvitation(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setMsg("");

    // Create user then invitation
    const res = await fetch("/api/superadmin/create-invitation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const d = await res.json();
    if (res.ok) {
      setMsg(`Berhasil! Login: ${form.email} / ${form.password}`);
      setForm({ email: "", password: "", slug: "", groomName: "", brideName: "", weddingDate: "", venueName: "", venueAddress: "" });
      router.refresh();
    } else {
      setMsg(d.error ?? "Gagal membuat invitation.");
    }
    setCreating(false);
  }

  return (
    <div className="min-h-screen bg-[#f8f4ef]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <h1
          className="text-2xl font-light"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Superadmin — Undangan Digital
        </h1>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Create invitation */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-medium mb-4">Buat Invitation Baru</h2>
          <form onSubmit={createInvitation} className="grid grid-cols-2 gap-4">
            {[
              ["email", "Email mempelai"],
              ["password", "Password awal"],
              ["slug", "Slug (contoh: budi-ani)"],
              ["groomName", "Nama pria"],
              ["brideName", "Nama wanita"],
              ["weddingDate", "Tanggal pernikahan"],
              ["venueName", "Nama venue"],
              ["venueAddress", "Alamat venue"],
            ].map(([name, label]) => (
              <div key={name} className={name === "venueAddress" ? "col-span-2" : ""}>
                <label className="block text-xs text-[#6b6560] mb-1">{label}</label>
                <input
                  name={name}
                  type={name === "weddingDate" ? "date" : name === "email" ? "email" : "text"}
                  value={(form as unknown as Record<string, string>)[name]}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a9e8a]"
                />
              </div>
            ))}
            {msg && (
              <p className={`col-span-2 text-sm ${msg.startsWith("Berhasil") ? "text-green-600" : "text-red-500"}`}>
                {msg}
              </p>
            )}
            <button
              type="submit"
              disabled={creating}
              className="col-span-2 py-2 rounded-lg text-white text-sm disabled:opacity-60"
              style={{ background: "#8a9e8a" }}
            >
              {creating ? "Membuat..." : "Buat Invitation"}
            </button>
          </form>
        </section>

        {/* Invitation list */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-medium">Semua Invitation ({invitations.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">Mempelai</th>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">Slug</th>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">Tamu</th>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">RSVP</th>
                  <th className="text-left px-4 py-3 text-xs text-[#6b6560] font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium">
                      {inv.groomName} & {inv.brideName}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#6b6560]">/{inv.slug}</td>
                    <td className="px-4 py-3 text-[#6b6560]">{inv.owner.email}</td>
                    <td className="px-4 py-3 text-center">{inv._count.guests}</td>
                    <td className="px-4 py-3 text-center">{inv._count.rsvps}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          inv.isPublished
                            ? "bg-green-50 text-green-700"
                            : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {inv.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
