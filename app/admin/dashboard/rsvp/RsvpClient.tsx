"use client";

import type { Invitation, Rsvp, Wish } from "@prisma/client";
import { usePathname } from "next/navigation";
import { FileEdit, Users, MessageSquareHeart, ExternalLink, CheckCircle2, XCircle, HelpCircle, Inbox } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import type { SidebarNavItem } from "@/components/admin/Sidebar";

interface Props {
invitation: Invitation;
rsvps: Rsvp[];
wishes: Wish[];
}

export default function RsvpClient({ invitation, rsvps, wishes }: Props) {
const hadir = rsvps.filter((r) => r.attendance === "HADIR");
const tidakHadir = rsvps.filter((r) => r.attendance === "TIDAK_HADIR");
const ragu = rsvps.filter((r) => r.attendance === "RAGU");
const totalTamu = hadir.reduce((sum, r) => sum + r.guestCount, 0);

function exportRsvpToCsv() {
const headers = ["Nama Tamu", "Status Kehadiran", "Jumlah Tamu", "Waktu Konfirmasi"];
const rows = rsvps.map((r) => [
r.guestName,
r.attendance === "HADIR" ? "Hadir" : r.attendance === "TIDAK_HADIR" ? "Tidak Hadir" : "Ragu-ragu",
r.guestCount,
new Date(r.createdAt).toLocaleString("id-ID"),
]);

const csvContent =
"data:text/csv;charset=utf-8," +
[headers.join(","), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

const encodedUri = encodeURI(csvContent);
const link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", `rsvp_${invitation.slug}.csv`);
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
}

const pathname = usePathname();

const navItems: SidebarNavItem[] = [
  { href: "/admin/dashboard", label: "Konten", icon: FileEdit },
  { href: "/admin/dashboard/guests", label: "Tamu", icon: Users },
  { href: "/admin/dashboard/rsvp", label: "RSVP", icon: MessageSquareHeart },
  { href: `/${invitation.slug}`, label: "Preview ↗", icon: ExternalLink, external: true },
];

return (
<div className="min-h-screen flex bg-[var(--admin-bg)]">
<Sidebar navItems={navItems} activePath={pathname} />

<main className="flex-1 min-w-0">
<header className="px-10 py-6 border-b border-[var(--admin-border)] bg-[var(--admin-surface)]">
<h1
style={{ fontFamily: "'Cormorant Garamond', serif" }}
className="text-2xl text-[var(--admin-ink)]"
>
RSVP & Ucapan
</h1>
</header>

<div className="px-10 py-8 space-y-6">
{/* Stats */}
<div className="grid grid-cols-3 gap-4">
{[
{ label: "Hadir", count: hadir.length, sub: `${totalTamu} tamu`, color: "text-green-600" },
{ label: "Tidak Hadir", count: tidakHadir.length, sub: "", color: "text-red-500" },
{ label: "Ragu-ragu", count: ragu.length, sub: "", color: "text-orange-500" },
].map((s) => (
<div key={s.label} className="bg-white rounded-xl p-5 border border-[var(--admin-border)] text-center">
<p className={`text-3xl font-light ${s.color}`}>{s.count}</p>
<p className="text-sm font-medium mt-1">{s.label}</p>
{s.sub && <p className="text-xs text-[#6b6560]">{s.sub}</p>}
</div>
))}
</div>

{/* RSVP list */}
<section className="bg-white rounded-xl border border-[var(--admin-border)] overflow-hidden">
<div className="px-6 py-4 border-b border-[var(--admin-border)] flex items-center justify-between">
<h2 className="font-medium">Konfirmasi Kehadiran ({rsvps.length})</h2>
{rsvps.length > 0 && (
<button
onClick={exportRsvpToCsv}
className="px-3 py-1.5 rounded-lg border-2 border-[var(--admin-primary)] text-[var(--admin-primary)] text-xs font-medium transition-colors hover:bg-[var(--admin-primary)] hover:text-white"
>
Unduh CSV
</button>
)}
</div>
<div className="overflow-x-auto">
<table className="w-full text-sm">
<thead className="bg-[var(--admin-surface-alt)] border-b border-[var(--admin-border)]">
<tr>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">Nama</th>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">Status</th>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">Jml Tamu</th>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">Waktu</th>
</tr>
</thead>
<tbody className="divide-y divide-[var(--admin-border)]">
{rsvps.map((r) => (
<tr key={r.id} className="hover:bg-[var(--admin-surface-alt)] transition-colors">
<td className="px-4 py-3 font-medium">{r.guestName}</td>
<td className="px-4 py-3">
<span
className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
r.attendance === "HADIR"
? "bg-green-50 text-green-700 border border-green-200"
: r.attendance === "TIDAK_HADIR"
? "bg-red-50 text-red-600 border border-red-200"
: "bg-orange-50 text-orange-600 border border-orange-200"
}`}
>
{r.attendance === "HADIR" ? <CheckCircle2 size={14} /> : r.attendance === "TIDAK_HADIR" ? <XCircle size={14} /> : <HelpCircle size={14} />}
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
{rsvps.length === 0 && (
<tr>
<td colSpan={4} className="px-4 py-12 text-center">
<div className="flex flex-col items-center gap-2 text-[#6b6560]">
<Inbox size={32} className="text-gray-300" />
<p className="text-sm">Belum ada RSVP masuk.</p>
</div>
</td>
</tr>
)}
</tbody>
</table>
</div>
</section>

{/* Wishes */}
<section className="bg-white rounded-xl border border-[var(--admin-border)] overflow-hidden">
<div className="px-6 py-4 border-b border-[var(--admin-border)]">
<h2 className="font-medium">Ucapan & Doa ({wishes.length})</h2>
</div>
<div className="divide-y divide-gray-50">
{wishes.map((w) => (
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
{wishes.length === 0 && (
<div className="px-6 py-12 text-center flex flex-col items-center gap-2 text-[#6b6560]">
<MessageSquareHeart size={32} className="text-gray-300" />
<p className="text-sm">Belum ada ucapan masuk.</p>
</div>
)}
</div>
</section>
</div>
</main>
</div>
);
}
