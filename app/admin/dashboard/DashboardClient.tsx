"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Invitation } from "@prisma/client";
import Link from "next/link";

interface Props {
  invitation: Invitation | null;
  userId: string;
}

export default function DashboardClient({ invitation, userId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // form state initialized from existing invitation or empty
  const [form, setForm] = useState({
    groomName: invitation?.groomName ?? "",
    groomFullName: invitation?.groomFullName ?? "",
    brideName: invitation?.brideName ?? "",
    brideFullName: invitation?.brideFullName ?? "",
    weddingDate: invitation?.weddingDate
      ? new Date(invitation.weddingDate).toISOString().slice(0, 10)
      : "",
    akadTime: invitation?.akadTime ?? "",
    resepsiTime: invitation?.resepsiTime ?? "",
    venueName: invitation?.venueName ?? "",
    venueAddress: invitation?.venueAddress ?? "",
    mapsEmbedUrl: invitation?.mapsEmbedUrl ?? "",
    loveStory: invitation?.loveStory ?? "",
    heroImage: invitation?.heroImage ?? "",
    theme: invitation?.theme ?? "elegant",
    isPublished: invitation?.isPublished ?? false,
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    const method = invitation ? "PUT" : "POST";
    const url = invitation
      ? `/api/invitations/${invitation.id}`
      : "/api/invitations";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMsg("Tersimpan!");
      router.refresh();
    } else {
      const d = await res.json();
      setMsg(d.error ?? "Gagal menyimpan.");
    }
    setSaving(false);
  }

  async function togglePublish() {
    if (!invitation) return;
    setSaving(true);
    await fetch(`/api/invitations/${invitation.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, isPublished: !form.isPublished }),
    });
    setForm((p) => ({ ...p, isPublished: !p.isPublished }));
    setSaving(false);
    router.refresh();
  }

  const navClass =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#8a9e8a]/10";

  return (
    <div className="min-h-screen bg-[#f8f4ef]">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <h1
          className="text-xl font-light"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Undangan Digital
        </h1>
        <nav className="flex gap-2">
          <Link href="/admin/dashboard" className={navClass}>
            Konten
          </Link>
          <Link href="/admin/dashboard/guests" className={navClass}>
            Tamu
          </Link>
          <Link href="/admin/dashboard/rsvp" className={navClass}>
            RSVP
          </Link>
          {invitation && (
            <Link
              href={`/${invitation.slug}`}
              target="_blank"
              className={navClass}
            >
              Preview ↗
            </Link>
          )}
        </nav>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        {/* Publish toggle */}
        {invitation && (
          <div className="mb-6 flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
            <div>
              <p className="font-medium text-sm">
                Status:{" "}
                <span
                  className={
                    form.isPublished ? "text-green-600" : "text-orange-500"
                  }
                >
                  {form.isPublished ? "Terpublikasi" : "Draft"}
                </span>
              </p>
              {invitation && (
                <p className="text-xs text-[#6b6560] mt-0.5">
                  Link:{" "}
                  <span className="font-mono">/{invitation.slug}</span>
                </p>
              )}
            </div>
            <button
              onClick={togglePublish}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60"
              style={{
                background: form.isPublished ? "#e05c5c" : "#8a9e8a",
              }}
            >
              {form.isPublished ? "Unpublish" : "Publish"}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-medium mb-4">Mempelai</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["groomName", "Nama panggilan pria"],
                ["groomFullName", "Nama lengkap pria"],
                ["brideName", "Nama panggilan wanita"],
                ["brideFullName", "Nama lengkap wanita"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="block text-xs text-[#6b6560] mb-1">
                    {label}
                  </label>
                  <input
                    name={name}
                    value={(form as unknown as Record<string, string>)[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a9e8a]"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-medium mb-4">Acara</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-[#6b6560] mb-1">
                  Tanggal pernikahan
                </label>
                <input
                  type="date"
                  name="weddingDate"
                  value={form.weddingDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a9e8a]"
                />
              </div>
              {[
                ["akadTime", "Waktu akad (misal: 08.00 WIB)"],
                ["resepsiTime", "Waktu resepsi (misal: 11.00 WIB)"],
                ["venueName", "Nama venue"],
                ["venueAddress", "Alamat venue"],
              ].map(([name, label]) => (
                <div key={name} className={name === "venueAddress" ? "col-span-2" : ""}>
                  <label className="block text-xs text-[#6b6560] mb-1">
                    {label}
                  </label>
                  <input
                    name={name}
                    value={(form as unknown as Record<string, string>)[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a9e8a]"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs text-[#6b6560] mb-1">
                  URL embed Google Maps (opsional)
                </label>
                <input
                  name="mapsEmbedUrl"
                  value={form.mapsEmbedUrl}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/maps?..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a9e8a]"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-medium mb-4">Tampilan & Konten</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#6b6560] mb-1">
                  Tema
                </label>
                <select
                  name="theme"
                  value={form.theme}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a9e8a]"
                >
                  <option value="elegant">Elegant</option>
                  <option value="rustic">Rustic</option>
                  <option value="minimalist">Minimalist</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#6b6560] mb-1">
                  URL foto hero/background
                </label>
                <input
                  name="heroImage"
                  value={form.heroImage}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a9e8a]"
                />
                <p className="text-xs text-[#6b6560] mt-1">
                  Upload ke Cloudflare R2 / Supabase Storage / UploadThing lalu tempel URL di sini.
                </p>
              </div>
              <div>
                <label className="block text-xs text-[#6b6560] mb-1">
                  Cerita cinta (opsional)
                </label>
                <textarea
                  name="loveStory"
                  value={form.loveStory}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a9e8a]"
                />
              </div>
            </div>
          </section>

          {msg && (
            <p
              className={`text-sm text-center ${
                msg === "Tersimpan!" ? "text-green-600" : "text-red-500"
              }`}
            >
              {msg}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl text-white font-medium transition-opacity disabled:opacity-60"
            style={{ background: "#8a9e8a" }}
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </main>
    </div>
  );
}
