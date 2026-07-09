"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Invitation } from "@prisma/client";
import Image from "next/image";
import { Users, Calendar, Palette, FileEdit, MessageSquareHeart, ExternalLink, ImageIcon, Banknote, CalendarIcon } from "lucide-react";
import Toast from "@/components/Toast";
import Sidebar from "@/components/admin/Sidebar";
import type { SidebarNavItem } from "@/components/admin/Sidebar";
import { extractMapsEmbedSrc } from "@/lib/maps";
import { LedgerCard } from "@/components/ui/ledger-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/ui/icon-badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface Props {
  invitation: Invitation | null;
  accountEmail?: string;
}

export default function DashboardClient({ invitation, accountEmail }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [mapsError, setMapsError] = useState("");
  const [confirmUnpublish, setConfirmUnpublish] = useState(false);
  const [gallery, setGallery] = useState<string[]>(invitation?.gallery ?? []);
  const [bankAccounts, setBankAccounts] = useState<{ bank: string; accountNumber: string; accountName: string }[]>(
    (invitation?.bankAccounts as { bank: string; accountNumber: string; accountName: string }[] | null) ?? []
  );

  const [form, setForm] = useState({
    groomName: invitation?.groomName ?? "",
    groomFullName: invitation?.groomFullName ?? "",
    groomImage: invitation?.groomImage ?? "",
    brideName: invitation?.brideName ?? "",
    brideFullName: invitation?.brideFullName ?? "",
    brideImage: invitation?.brideImage ?? "",
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
    musicUrl: invitation?.musicUrl ?? "",
    quoteText: invitation?.quoteText ?? "",
    quoteSource: invitation?.quoteSource ?? "",
    isPublished: invitation?.isPublished ?? false,
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    if (name === "mapsEmbedUrl") {
      setMapsError("");
      const extracted = extractMapsEmbedSrc(value);
      if (value && extracted) {
        setForm((prev) => ({ ...prev, mapsEmbedUrl: extracted }));
        return;
      }
    }
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!invitation) return;

    if (form.mapsEmbedUrl && !extractMapsEmbedSrc(form.mapsEmbedUrl)) {
      setMapsError("URL embed tidak valid. Tempel URL embed atau kode <iframe> dari Google Maps.");
      setToast({ message: "Perbaiki error di form sebelum menyimpan.", type: "error" });
      return;
    }
    setMapsError("");
    setSaving(true);
    setToast(null);

    const res = await fetch(`/api/invitations/${invitation.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        gallery,
        bankAccounts,
      }),
    });

    if (res.ok) {
      setToast({ message: "Tersimpan!", type: "success" });
      router.refresh();
    } else {
      const d = await res.json();
      setToast({ message: d.error ?? "Gagal menyimpan.", type: "error" });
    }
    setSaving(false);
  }

  async function togglePublish() {
    if (!invitation) return;
    setSaving(true);
    await fetch(`/api/invitations/${invitation.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, gallery, bankAccounts, isPublished: !form.isPublished }),
    });
    setForm((p) => ({ ...p, isPublished: !p.isPublished }));
    setSaving(false);
    router.refresh();
  }

  function addGalleryItem() {
    setGallery((p) => [...p, ""]);
  }

  async function uploadFile(file: File): Promise<string | null> {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        const d = await res.json();
        return d.url;
      }
      return null;
    } finally {
      setUploading(false);
    }
  }

  function removeGalleryItem(index: number) {
    setGallery((p) => p.filter((_, i) => i !== index));
  }

  function handleGalleryChange(index: number, val: string) {
    setGallery((p) => p.map((item, i) => (i === index ? val : item)));
  }

  function addBankAccount() {
    setBankAccounts((p) => [...p, { bank: "", accountNumber: "", accountName: "" }]);
  }

  function removeBankAccount(index: number) {
    setBankAccounts((p) => p.filter((_, i) => i !== index));
  }

  function handleBankChange(index: number, field: string, val: string) {
    setBankAccounts((p) =>
      p.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  }

  const navItems: SidebarNavItem[] = [
    { href: "/admin/dashboard", label: "Konten", icon: FileEdit },
    { href: "/admin/dashboard/guests", label: "Tamu", icon: Users },
    { href: "/admin/dashboard/rsvp", label: "RSVP", icon: MessageSquareHeart },
    ...(invitation ? [{ href: `/${invitation.slug}`, label: "Preview ↗", icon: ExternalLink as SidebarNavItem["icon"], external: true }] : []),
  ];

  if (!invitation) {
    return (
      <div className="min-h-screen flex bg-[var(--ink-bg)]">
        <Sidebar navItems={navItems} activePath={pathname} accountEmail={accountEmail} />
        <main className="flex-1 min-w-0 flex items-center justify-center">
          <LedgerCard className="max-w-md text-center p-8">
            <p
              className="text-2xl font-medium mb-3 text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Belum Ada Undangan Aktif
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Anda belum memiliki undangan yang aktif. Silakan hubungi admin untuk membuatkan akun undangan Anda.
            </p>
          </LedgerCard>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--ink-bg)]">
      <Sidebar navItems={navItems} activePath={pathname} accountEmail={accountEmail} />

      <main className="flex-1 min-w-0">
        <header className="px-10 py-6 border-b border-[var(--ink-border)] bg-[var(--ink-surface)]">
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl text-[var(--text-primary)]"
          >
            Konten Undangan
          </h1>
        </header>

        <div className="px-10 py-8">
          {/* Publish toggle */}
          {invitation && (
            <div className="mb-6 rounded-lg p-5 flex items-center justify-between bg-[var(--ink-surface)] border border-[var(--ink-border)]">
              <div>
                <p className="font-medium text-sm text-[var(--text-secondary)]">
                  Status:{" "}
                  <span
                    className={
                      form.isPublished ? "font-semibold text-[var(--status-success)]" : "font-semibold text-[var(--status-warning)]"
                    }
                  >
                    {form.isPublished ? "Terpublikasi" : "Draft"}
                  </span>
                </p>
                {invitation && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Link:{" "}
                    <span className="font-[var(--font-mono)] text-[var(--text-secondary)]">/{invitation.slug}</span>
                  </p>
                )}
              </div>
              <Button
                onClick={() => {
                  if (form.isPublished) {
                    setConfirmUnpublish(true);
                  } else {
                    togglePublish();
                  }
                }}
                disabled={saving}
                variant={form.isPublished ? "destructive" : "default"}
              >
                {form.isPublished ? "Unpublish" : "Publish"}
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <LedgerCard>
              <div className="flex items-center gap-3 mb-4">
                <IconBadge>
                  <Users size={18} />
                </IconBadge>
                <h2 className="font-semibold text-[var(--text-primary)]">Mempelai</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["groomName", "Nama panggilan pria"],
                  ["groomFullName", "Nama lengkap pria"],
                  ["brideName", "Nama panggilan wanita"],
                  ["brideFullName", "Nama lengkap wanita"],
                ].map(([name, lbl]) => (
                  <div key={name}>
                    <Label className="text-xs text-[var(--text-muted)] mb-1 block">
                      {lbl}
                    </Label>
                    <Input
                      name={name}
                      value={(form as unknown as Record<string, string>)[name]}
                      onChange={handleChange}
                      required={name === "groomName" || name === "brideName"}
                    />
                  </div>
                ))}
              </div>
            </LedgerCard>

            <LedgerCard>
              <div className="flex items-center gap-3 mb-4">
                <IconBadge className="border-[var(--dusty-rose)]/60 text-[var(--dusty-rose)]">
                  <Calendar size={18} />
                </IconBadge>
                <h2 className="font-semibold text-[var(--text-primary)]">Acara</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-xs text-[var(--text-muted)] mb-1 block">
                    Tanggal pernikahan
                  </Label>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <button
                          type="button"
                          className="w-full flex items-center justify-between border border-[var(--ink-border)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)] bg-[var(--ink-surface)] hover:bg-[var(--ink-surface-raised)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--foil-gold)]"
                        />
                      }
                    >
                      {form.weddingDate
                        ? new Date(form.weddingDate + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                        : "Pilih tanggal"}
                      <CalendarIcon size={16} className="text-[var(--text-muted)]" />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" side="bottom" align="start">
                      <CalendarPicker
                        mode="single"
                        selected={form.weddingDate ? new Date(form.weddingDate + "T00:00:00") : undefined}
                        onSelect={(day) => {
                          if (day) {
                            const iso = day.toISOString().slice(0, 10);
                            setForm((prev) => ({ ...prev, weddingDate: iso }));
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {[
                  ["akadTime", "Waktu akad (misal: 08.00 WIB)"],
                  ["resepsiTime", "Waktu resepsi (misal: 11.00 WIB)"],
                  ["venueName", "Nama venue"],
                  ["venueAddress", "Alamat venue"],
                ].map(([name, lbl]) => (
                  <div key={name} className={name === "venueAddress" ? "col-span-2" : ""}>
                    <Label className="text-xs text-[var(--text-muted)] mb-1 block">
                      {lbl}
                    </Label>
                    <Input
                      name={name}
                      value={(form as unknown as Record<string, string>)[name]}
                      onChange={handleChange}
                      required={name === "venueName" || name === "venueAddress"}
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <Label className="text-xs text-[var(--text-muted)] mb-1 block">
                    URL embed Google Maps (opsional)
                  </Label>
                  <Input
                    name="mapsEmbedUrl"
                    value={form.mapsEmbedUrl}
                    onChange={handleChange}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className={mapsError ? "border-[var(--status-danger)]" : ""}
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Tempel URL embed atau seluruh kode <code className="text-[10px] bg-[var(--ink-surface-raised)] px-1.5 py-0.5 rounded">{'<iframe src="...">'}</code> — URL akan otomatis diekstrak.
                  </p>
                  {mapsError && (
                    <p className="text-xs text-[var(--status-danger)] mt-1">{mapsError}</p>
                  )}
                </div>
              </div>
            </LedgerCard>

            <LedgerCard>
              <div className="flex items-center gap-3 mb-4">
                <IconBadge>
                  <Palette size={18} />
                </IconBadge>
                <h2 className="font-semibold text-[var(--text-primary)]">Tampilan & Konten</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <Label className="text-xs font-medium text-[var(--text-muted)] mb-2 block">
                    Tema Undangan
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "elegant", name: "Elegant", desc: "Dusty Sage & Gold", img: "/placeholders/elegant/hero.png" },
                      { id: "rustic", name: "Rustic", desc: "Earthy Terracotta", img: "/placeholders/rustic/hero.png" },
                      { id: "minimalist", name: "Minimalist", desc: "Clean Monochrome", img: "/placeholders/minimalist/hero.png" },
                      { id: "foil-blueprint", name: "Foil Blueprint", desc: "Navy & Champagne", img: "/placeholders/elegant/hero.png" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, theme: t.id }))}
                        className={`ledger-card text-left overflow-hidden transition-all p-1 ${
                          form.theme === t.id
                            ? "border-[var(--ink-border-strong)] ring-1 ring-[var(--foil-gold)]/20"
                            : "hover:border-[var(--ink-border-strong)]"
                        }`}
                      >
                        <div className="aspect-video bg-[var(--ink-surface-raised)] rounded overflow-hidden mb-2 relative">
                          <Image src={t.img} alt={t.name} fill className="object-cover" unoptimized />
                        </div>
                        <div className="px-1.5 pb-1.5">
                          <p className="text-xs font-semibold text-[var(--text-primary)]">{t.name}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">{t.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-[var(--text-muted)] mb-1 block">
                    Foto Hero / Latar Belakang
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      name="heroImage"
                      value={form.heroImage}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="flex-1"
                    />
                    <label className={`cursor-pointer px-3 py-2 text-xs rounded-md border font-medium transition-colors ${uploading ? "opacity-50 pointer-events-none" : "bg-[var(--ink-surface-raised)] hover:bg-[var(--ink-surface-raised)]/80 border-[var(--ink-border)] text-[var(--text-secondary)]"}`}>
                      {uploading ? "..." : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadFile(file);
                            if (url) setForm((p) => ({ ...p, heroImage: url }));
                          }
                        }}
                      />
                    </label>
                  </div>
                  {form.heroImage && (
                    <Image src={form.heroImage} alt="Hero Preview" width={96} height={64} className="object-cover rounded-lg mt-2 border border-[var(--ink-border)]" unoptimized />
                  )}
                  {form.heroImage.startsWith("/placeholders/") && (
                    <Badge variant="outline" className="mt-1 bg-[var(--status-warning)]/15 text-[var(--status-warning)] border-[var(--status-warning)]/30 w-fit">
                      Foto contoh — silakan ganti dengan foto Anda sebelum dipublikasi.
                    </Badge>
                  )}
                </div>

                <div>
                  <Label className="text-xs text-[var(--text-muted)] mb-1 block">
                    Foto Profil Pria (Groom)
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      name="groomImage"
                      value={form.groomImage}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="flex-1"
                    />
                    <label className={`cursor-pointer px-3 py-2 text-xs rounded-md border font-medium transition-colors ${uploading ? "opacity-50 pointer-events-none" : "bg-[var(--ink-surface-raised)] hover:bg-[var(--ink-surface-raised)]/80 border-[var(--ink-border)] text-[var(--text-secondary)]"}`}>
                      {uploading ? "..." : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadFile(file);
                            if (url) setForm((p) => ({ ...p, groomImage: url }));
                          }
                        }}
                      />
                    </label>
                  </div>
                  {form.groomImage && (
                    <Image src={form.groomImage} alt="Groom Preview" width={64} height={64} className="object-cover rounded-full mt-2 border border-[var(--ink-border)]" unoptimized />
                  )}
                  {form.groomImage.startsWith("/placeholders/") && (
                    <Badge variant="outline" className="mt-1 bg-[var(--status-warning)]/15 text-[var(--status-warning)] border-[var(--status-warning)]/30 w-fit">
                      Foto contoh — silakan ganti dengan foto Anda sebelum dipublikasi.
                    </Badge>
                  )}
                </div>

                <div>
                  <Label className="text-xs text-[var(--text-muted)] mb-1 block">
                    Foto Profil Wanita (Bride)
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      name="brideImage"
                      value={form.brideImage}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="flex-1"
                    />
                    <label className={`cursor-pointer px-3 py-2 text-xs rounded-md border font-medium transition-colors ${uploading ? "opacity-50 pointer-events-none" : "bg-[var(--ink-surface-raised)] hover:bg-[var(--ink-surface-raised)]/80 border-[var(--ink-border)] text-[var(--text-secondary)]"}`}>
                      {uploading ? "..." : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadFile(file);
                            if (url) setForm((p) => ({ ...p, brideImage: url }));
                          }
                        }}
                      />
                    </label>
                  </div>
                  {form.brideImage && (
                    <Image src={form.brideImage} alt="Bride Preview" width={64} height={64} className="object-cover rounded-full mt-2 border border-[var(--ink-border)]" unoptimized />
                  )}
                  {form.brideImage.startsWith("/placeholders/") && (
                    <Badge variant="outline" className="mt-1 bg-[var(--status-warning)]/15 text-[var(--status-warning)] border-[var(--status-warning)]/30 w-fit">
                      Foto contoh — silakan ganti dengan foto Anda sebelum dipublikasi.
                    </Badge>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-[var(--text-muted)] mb-1 block">
                    Cerita cinta (opsional)
                  </Label>
                  <Textarea
                    name="loveStory"
                    value={form.loveStory}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
                <div>
                  <Label className="text-xs text-[var(--text-muted)] mb-1 block">
                    URL Musik Latar (opsional)
                  </Label>
                  <Input
                    name="musicUrl"
                    value={form.musicUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/song.mp3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-[var(--text-muted)] mb-1 block">
                      Kutipan Ayat/Kata Mutiara (opsional)
                    </Label>
                    <Textarea
                      name="quoteText"
                      value={form.quoteText}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-[var(--text-muted)] mb-1 block">
                      Sumber Kutipan (opsional, misal: QS. Ar-Rum: 21)
                    </Label>
                    <Input
                      name="quoteSource"
                      value={form.quoteSource}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-xs font-medium text-[var(--text-muted)]">
                      Galeri Foto
                    </Label>
                    <button
                      type="button"
                      onClick={addGalleryItem}
                      className="text-xs text-[var(--foil-gold)] hover:underline"
                    >
                      + Tambah Foto
                    </button>
                  </div>
                  <div className="space-y-2">
                    {gallery.map((url, i) => (
                      <div key={i} className="space-y-2 border border-[var(--ink-border)] p-2.5 rounded-lg bg-[var(--ink-surface-raised)]/50">
                        <div className="flex gap-2">
                          <Input
                            value={url}
                            onChange={(e) => handleGalleryChange(i, e.target.value)}
                            placeholder="https://..."
                            className="flex-1"
                          />
                          <label className={`cursor-pointer px-3 py-2 text-xs rounded-md border font-medium flex items-center transition-colors ${uploading ? "opacity-50 pointer-events-none" : "bg-[var(--ink-surface-raised)] hover:bg-[var(--ink-surface-raised)]/80 border-[var(--ink-border)] text-[var(--text-secondary)]"}`}>
                            {uploading ? "..." : "Upload"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await uploadFile(file);
                                  if (url) handleGalleryChange(i, url);
                                }
                              }}
                            />
                          </label>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeGalleryItem(i)}
                          >
                            Hapus
                          </Button>
                        </div>
                        {url && (
                          <Image src={url} alt={`Gallery Preview ${i+1}`} width={64} height={64} className="object-cover rounded-lg border border-[var(--ink-border)]" unoptimized />
                        )}
                      </div>
                    ))}
                    {gallery.length === 0 && (
                      <div className="flex flex-col items-center gap-2 py-6 text-[var(--text-muted)]">
                        <ImageIcon size={32} className="text-[var(--text-muted)]" />
                        <p className="text-xs">Belum ada foto galeri.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-xs font-medium text-[var(--text-muted)]">
                      Amplop Digital / Info Rekening
                    </Label>
                    <button
                      type="button"
                      onClick={addBankAccount}
                      className="text-xs text-[var(--foil-gold)] hover:underline"
                    >
                      + Tambah Rekening
                    </button>
                  </div>
                  <div className="space-y-3">
                    {bankAccounts.map((acc, i) => (
                      <div key={i} className="flex gap-2 items-end border border-[var(--ink-border)] p-3 rounded-lg bg-[var(--ink-surface-raised)]/50">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-[10px] text-[var(--text-muted)] mb-0.5 block">Nama Bank</Label>
                            <Input
                              value={acc.bank}
                              onChange={(e) => handleBankChange(i, "bank", e.target.value)}
                              placeholder="BCA / Mandiri / GoPay"
                              className="text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-[10px] text-[var(--text-muted)] mb-0.5 block">No. Rekening / No. HP</Label>
                            <Input
                              value={acc.accountNumber}
                              onChange={(e) => handleBankChange(i, "accountNumber", e.target.value)}
                              placeholder="12345678"
                              className="text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-[10px] text-[var(--text-muted)] mb-0.5 block">Atas Nama</Label>
                            <Input
                              value={acc.accountName}
                              onChange={(e) => handleBankChange(i, "accountName", e.target.value)}
                              placeholder="Budi"
                              className="text-xs"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeBankAccount(i)}
                        >
                          Hapus
                        </Button>
                      </div>
                    ))}
                    {bankAccounts.length === 0 && (
                      <div className="flex flex-col items-center gap-2 py-6 text-[var(--text-muted)]">
                        <Banknote size={32} className="text-[var(--text-muted)]" />
                        <p className="text-xs">Belum ada rekening / amplop digital.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </LedgerCard>

            <Toast toast={toast} onClose={() => setToast(null)} />

            <Button
              type="submit"
              disabled={saving}
              className="w-full py-3 text-sm"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        </div>
      </main>

      <Dialog open={confirmUnpublish} onOpenChange={(open) => { if (!open) setConfirmUnpublish(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unpublish Undangan</DialogTitle>
            <DialogDescription>
              Undangan akan disembunyikan dari publik. Tamu tidak akan bisa mengakses halaman undangan Anda. Yakin ingin unpublish?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmUnpublish(false)}>Batal</Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmUnpublish(false);
                togglePublish();
              }}
            >
              Unpublish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
