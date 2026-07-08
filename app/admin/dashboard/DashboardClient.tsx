"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Invitation } from "@prisma/client";
import Image from "next/image";
import { Users, Calendar, Palette, FileEdit, MessageSquareHeart, ExternalLink, ImageIcon, Banknote } from "lucide-react";
import Toast from "@/components/Toast";
import Sidebar from "@/components/admin/Sidebar";
import type { SidebarNavItem } from "@/components/admin/Sidebar";

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
const [gallery, setGallery] = useState<string[]>(invitation?.gallery ?? []);
const [bankAccounts, setBankAccounts] = useState<{ bank: string; accountNumber: string; accountName: string }[]>(
(invitation?.bankAccounts as { bank: string; accountNumber: string; accountName: string }[] | null) ?? []
);

// form state initialized from existing invitation or empty
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
setForm((prev) => ({
...prev,
[name]:
type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
}));
}

async function handleSubmit(e: React.FormEvent) {
e.preventDefault();
if (!invitation) return;
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
<div className="min-h-screen flex bg-[var(--admin-bg)]">
<Sidebar navItems={navItems} activePath={pathname} accountEmail={accountEmail} />
<main className="flex-1 min-w-0 flex items-center justify-center">
<div className="text-center px-6 bg-white rounded-xl p-8 max-w-md shadow-sm">
<p
className="text-2xl font-light mb-3"
style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2c2c2c" }}
>
Belum Ada Undangan Aktif
</p>
<p className="text-sm text-[#6b6560]">
Anda belum memiliki undangan yang aktif. Silakan hubungi admin untuk membuatkan akun undangan Anda.
</p>
</div>
</main>
</div>
);
}

return (
<div className="min-h-screen flex bg-[var(--admin-bg)]">
<Sidebar navItems={navItems} activePath={pathname} accountEmail={accountEmail} />

<main className="flex-1 min-w-0">
<header className="px-10 py-6 border-b border-[var(--admin-border)] bg-[var(--admin-surface)]">
<h1
style={{ fontFamily: "'Cormorant Garamond', serif" }}
className="text-2xl text-[var(--admin-ink)]"
>
Konten Undangan
</h1>
</header>

<div className="px-10 py-8">
{/* Publish toggle */}
{invitation && (
<div className="mb-6 bg-gradient-to-r from-[var(--admin-brand)] to-[var(--admin-brand)]/80 text-white rounded-xl p-5 flex items-center justify-between">
<div>
<p className="font-medium text-sm text-white/90">
Status:{" "}
<span
className={
form.isPublished ? "text-green-300 font-semibold" : "text-yellow-300 font-semibold"
}
>
{form.isPublished ? "Terpublikasi" : "Draft"}
</span>
</p>
{invitation && (
<p className="text-xs text-white/70 mt-0.5">
Link:{" "}
<span className="font-mono text-white/90">/{invitation.slug}</span>
</p>
)}
</div>
<button
onClick={togglePublish}
disabled={saving}
className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-150 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
form.isPublished
? "bg-[var(--admin-danger)] hover:bg-[var(--admin-danger-hover)]"
: "bg-white/20 hover:bg-white/30"
}`}
>
{form.isPublished ? "Unpublish" : "Publish"}
</button>
</div>
)}

<form onSubmit={handleSubmit} className="space-y-6">
<section className="bg-white rounded-xl p-6 border border-[var(--admin-border)]">
<div className="flex items-center gap-3 mb-4">
<div className="w-9 h-9 rounded-lg bg-[var(--admin-brand-light)] flex items-center justify-center">
<Users size={18} className="text-[var(--admin-brand)]" />
</div>
<h2 className="font-semibold text-gray-800">Mempelai</h2>
</div>
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
required={name === "groomName" || name === "brideName"}
className="w-full border border-[var(--admin-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
</div>
))}
</div>
</section>

<section className="bg-white rounded-xl p-6 border border-[var(--admin-border)]">
<div className="flex items-center gap-3 mb-4">
<div className="w-9 h-9 rounded-lg bg-[var(--admin-accent)]/10 flex items-center justify-center">
<Calendar size={18} className="text-[var(--admin-accent)]" />
</div>
<h2 className="font-semibold text-gray-800">Acara</h2>
</div>
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
className="w-full border border-[var(--admin-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
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
required={name === "venueName" || name === "venueAddress"}
className="w-full border border-[var(--admin-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
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
className="w-full border border-[var(--admin-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
</div>
</div>
</section>

<section className="bg-white rounded-xl p-6 border border-[var(--admin-border)]">
<div className="flex items-center gap-3 mb-4">
<div className="w-9 h-9 rounded-lg bg-[var(--admin-info)]/10 flex items-center justify-center">
<Palette size={18} className="text-[var(--admin-info)]" />
</div>
<h2 className="font-semibold text-gray-800">Tampilan & Konten</h2>
</div>
<div className="space-y-6">
<div>
<label className="block text-xs font-medium text-[#6b6560] mb-2">
Tema Undangan
</label>
<div className="grid grid-cols-3 gap-3">
{[
{ id: "elegant", name: "Elegant", desc: "Dusty Sage & Gold", img: "/placeholders/elegant/hero.png" },
{ id: "rustic", name: "Rustic", desc: "Earthy Terracotta", img: "/placeholders/rustic/hero.png" },
{ id: "minimalist", name: "Minimalist", desc: "Clean Monochrome", img: "/placeholders/minimalist/hero.png" },
].map((t) => (
<button
key={t.id}
type="button"
onClick={() => setForm((prev) => ({ ...prev, theme: t.id }))}
className={`text-left rounded-xl overflow-hidden border-2 transition-all p-1 bg-white ${
form.theme === t.id
? "border-[#8a9e8a] ring-2 ring-[#8a9e8a]/20"
: "border-gray-200 hover:border-gray-300"
}`}
>
<div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-2 relative">
<Image src={t.img} alt={t.name} fill className="object-cover" unoptimized />
</div>
<div className="px-1.5 pb-1.5">
<p className="text-xs font-semibold text-gray-800">{t.name}</p>
<p className="text-[10px] text-gray-500">{t.desc}</p>
</div>
</button>
))}
</div>
</div>

<div>
<label className="block text-xs text-[#6b6560] mb-1">
Foto Hero / Latar Belakang
</label>
<div className="flex gap-2 items-center">
<input
name="heroImage"
value={form.heroImage}
onChange={handleChange}
placeholder="https://..."
className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
<label className={`cursor-pointer px-3 py-2 text-xs rounded-lg border font-medium ${uploading ? "bg-gray-200 text-gray-400 pointer-events-none" : "bg-gray-100 hover:bg-gray-200 border-gray-200"}`}>
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
<Image src={form.heroImage} alt="Hero Preview" width={96} height={64} className="object-cover rounded-lg mt-2 border" unoptimized />
)}
{form.heroImage.startsWith("/placeholders/") && (
<p className="text-xs text-orange-500 font-medium mt-1">
⚠️ Foto contoh — silakan ganti dengan foto Anda sebelum dipublikasi.
</p>
)}
</div>

<div>
<label className="block text-xs text-[#6b6560] mb-1">
Foto Profil Pria (Groom)
</label>
<div className="flex gap-2 items-center">
<input
name="groomImage"
value={form.groomImage}
onChange={handleChange}
placeholder="https://..."
className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
<label className={`cursor-pointer px-3 py-2 text-xs rounded-lg border font-medium ${uploading ? "bg-gray-200 text-gray-400 pointer-events-none" : "bg-gray-100 hover:bg-gray-200 border-gray-200"}`}>
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
<Image src={form.groomImage} alt="Groom Preview" width={64} height={64} className="object-cover rounded-full mt-2 border" unoptimized />
)}
{form.groomImage.startsWith("/placeholders/") && (
<p className="text-xs text-orange-500 font-medium mt-1">
⚠️ Foto contoh — silakan ganti dengan foto Anda sebelum dipublikasi.
</p>
)}
</div>

<div>
<label className="block text-xs text-[#6b6560] mb-1">
Foto Profil Wanita (Bride)
</label>
<div className="flex gap-2 items-center">
<input
name="brideImage"
value={form.brideImage}
onChange={handleChange}
placeholder="https://..."
className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
<label className={`cursor-pointer px-3 py-2 text-xs rounded-lg border font-medium ${uploading ? "bg-gray-200 text-gray-400 pointer-events-none" : "bg-gray-100 hover:bg-gray-200 border-gray-200"}`}>
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
<Image src={form.brideImage} alt="Bride Preview" width={64} height={64} className="object-cover rounded-full mt-2 border" unoptimized />
)}
{form.brideImage.startsWith("/placeholders/") && (
<p className="text-xs text-orange-500 font-medium mt-1">
⚠️ Foto contoh — silakan ganti dengan foto Anda sebelum dipublikasi.
</p>
)}
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
className="w-full border border-[var(--admin-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
</div>
<div>
<label className="block text-xs text-[#6b6560] mb-1">
URL Musik Latar (opsional)
</label>
<input
name="musicUrl"
value={form.musicUrl}
onChange={handleChange}
placeholder="https://example.com/song.mp3"
className="w-full border border-[var(--admin-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-xs text-[#6b6560] mb-1">
Kutipan Ayat/Kata Mutiara (opsional)
</label>
<textarea
name="quoteText"
value={form.quoteText}
onChange={handleChange}
rows={2}
className="w-full border border-[var(--admin-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
</div>
<div>
<label className="block text-xs text-[#6b6560] mb-1">
Sumber Kutipan (opsional, misal: QS. Ar-Rum: 21)
</label>
<input
name="quoteSource"
value={form.quoteSource}
onChange={handleChange}
className="w-full border border-[var(--admin-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
</div>
</div>

<div>
<div className="flex justify-between items-center mb-2">
<label className="block text-xs font-medium text-[#6b6560]">
Galeri Foto
</label>
<button
type="button"
onClick={addGalleryItem}
className="text-xs text-[#8a9e8a] hover:underline"
>
+ Tambah Foto
</button>
</div>
<div className="space-y-2">
{gallery.map((url, i) => (
<div key={i} className="space-y-2 border border-gray-100 p-2.5 rounded-lg bg-gray-50/20">
<div className="flex gap-2">
<input
value={url}
onChange={(e) => handleGalleryChange(i, e.target.value)}
placeholder="https://..."
className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
<label className={`cursor-pointer px-3 py-2 text-xs rounded-lg border font-medium flex items-center ${uploading ? "bg-gray-200 text-gray-400 pointer-events-none" : "bg-gray-100 hover:bg-gray-200 border-gray-200"}`}>
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
<button
type="button"
onClick={() => removeGalleryItem(i)}
className="px-3 py-2 rounded-lg bg-red-50 text-red-500 text-sm hover:bg-red-100 transition-colors"
>
Hapus
</button>
</div>
{url && (
<Image src={url} alt={`Gallery Preview ${i+1}`} width={64} height={64} className="object-cover rounded-lg border" unoptimized />
)}
</div>
))}
{gallery.length === 0 && (
<div className="flex flex-col items-center gap-2 py-6 text-[#6b6560]">
<ImageIcon size={32} className="text-gray-300" />
<p className="text-xs">Belum ada foto galeri.</p>
</div>
)}
</div>
</div>

<div>
<div className="flex justify-between items-center mb-2">
<label className="block text-xs font-medium text-[#6b6560]">
Amplop Digital / Info Rekening
</label>
<button
type="button"
onClick={addBankAccount}
className="text-xs text-[#8a9e8a] hover:underline"
>
+ Tambah Rekening
</button>
</div>
<div className="space-y-3">
{bankAccounts.map((acc, i) => (
<div key={i} className="flex gap-2 items-end border border-gray-100 p-3 rounded-lg bg-gray-50/50">
<div className="flex-1 grid grid-cols-3 gap-2">
<div>
<label className="block text-[10px] text-[#6b6560] mb-0.5">Nama Bank</label>
<input
value={acc.bank}
onChange={(e) => handleBankChange(i, "bank", e.target.value)}
placeholder="BCA / Mandiri / GoPay"
className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2 bg-white"
/>
</div>
<div>
<label className="block text-[10px] text-[#6b6560] mb-0.5">No. Rekening / No. HP</label>
<input
value={acc.accountNumber}
onChange={(e) => handleBankChange(i, "accountNumber", e.target.value)}
placeholder="12345678"
className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2 bg-white"
/>
</div>
<div>
<label className="block text-[10px] text-[#6b6560] mb-0.5">Atas Nama</label>
<input
value={acc.accountName}
onChange={(e) => handleBankChange(i, "accountName", e.target.value)}
placeholder="Budi"
className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2 bg-white"
/>
</div>
</div>
<button
type="button"
onClick={() => removeBankAccount(i)}
className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs hover:bg-red-100 transition-colors"
>
Hapus
</button>
</div>
))}
{bankAccounts.length === 0 && (
<div className="flex flex-col items-center gap-2 py-6 text-[#6b6560]">
<Banknote size={32} className="text-gray-300" />
<p className="text-xs">Belum ada rekening / amplop digital.</p>
</div>
)}
</div>
</div>
</div>
</section>

<Toast toast={toast} onClose={() => setToast(null)} />

<button
type="submit"
disabled={saving}
className="w-full py-3 rounded-xl text-white font-medium transition-all duration-150 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)]"
>
{saving ? "Menyimpan..." : "Simpan"}
</button>
</form>
</div>
</main>
</div>
);
}
