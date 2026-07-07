"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Invitation, Guest } from "@prisma/client";
import Link from "next/link";
import { FileEdit, Users, MessageSquareHeart, ExternalLink, XCircle, Send, Eye, MailOpen, MoreVertical } from "lucide-react";
import { generateWaLink, generateInviteMessage } from "@/lib/whatsapp";
import Papa from "papaparse";

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
const [openDropdown, setOpenDropdown] = useState<string | null>(null);
const [importMsg, setImportMsg] = useState("");
const [search, setSearch] = useState("");
const [selectedGroup, setSelectedGroup] = useState("");
const [selectedStatus, setSelectedStatus] = useState("");
const fileRef = useRef<HTMLInputElement>(null);

const baseUrl =
typeof window !== "undefined" ? window.location.origin : "";

const uniqueGroups = Array.from(new Set(guests.map((g) => g.group).filter(Boolean))) as string[];

const filteredGuests = guests.filter((g) => {
const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
const matchesGroup = !selectedGroup || g.group === selectedGroup;
let matchesStatus = true;
if (selectedStatus === "sent") matchesStatus = g.isSent;
else if (selectedStatus === "unsent") matchesStatus = !g.isSent;
else if (selectedStatus === "opened") matchesStatus = !!g.openedAt;
else if (selectedStatus === "unopened") matchesStatus = !g.openedAt;

return matchesSearch && matchesGroup && matchesStatus;
});

function exportGuestsToCsv() {
const headers = ["Nama Tamu", "No. WA", "Grup", "Link Disiapkan", "Dibuka At"];
const rows = filteredGuests.map((g) => [
g.name,
g.phone ?? "",
g.group ?? "",
g.isSent ? "Ya" : "Tidak",
g.openedAt ? new Date(g.openedAt).toLocaleString("id-ID") : "",
]);

const csvContent =
"data:text/csv;charset=utf-8," +
[headers.join(","), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

const encodedUri = encodeURI(csvContent);
const link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", `tamu_${invitation.slug}.csv`);
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
}

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

Papa.parse(file, {
header: true,
skipEmptyLines: true,
complete: async (results) => {
const parsedGuests = (results.data as Record<string, string>[]).map((row) => {
const keys = Object.keys(row);
const nameKey = keys.find((k) => k.toLowerCase() === "name");
const phoneKey = keys.find((k) => k.toLowerCase() === "phone");
const groupKey = keys.find((k) => k.toLowerCase() === "group");

return {
name: nameKey ? row[nameKey] : "",
phone: phoneKey ? row[phoneKey] : "",
group: groupKey ? row[groupKey] : "",
};
}).filter((g) => g.name);

if (parsedGuests.length === 0) {
setImportMsg("Kolom 'name' tidak ditemukan atau file kosong.");
return;
}

const res = await fetch("/api/guests/import", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ guests: parsedGuests, invitationId: invitation.id }),
});

const d = await res.json();
if (res.ok) {
setImportMsg(d.message ?? "Selesai.");
router.refresh();
} else {
setImportMsg(d.error ?? "Gagal mengimpor.");
}
},
error: (err) => {
setImportMsg("Gagal membaca file: " + err.message);
},
});
}

const pathname = usePathname();

const navClass =
"px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2";

function isActive(path: string) {
return pathname === path;
}

return (
<div className="min-h-screen bg-[var(--admin-bg)]">
<header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
<h1
className="text-xl font-light"
style={{ fontFamily: "'Cormorant Garamond', serif" }}
>
Undangan Digital
</h1>
<nav className="flex gap-2">
<Link
href="/admin/dashboard"
className={`${navClass} ${isActive("/admin/dashboard") ? "bg-[var(--admin-brand-light)] text-[var(--admin-brand)] font-semibold" : "text-gray-600 hover:bg-[var(--admin-brand-light)]/50 hover:text-[var(--admin-brand)]"}`}
>
<FileEdit size={16} />
Konten
</Link>
<Link
href="/admin/dashboard/guests"
className={`${navClass} ${isActive("/admin/dashboard/guests") ? "bg-[var(--admin-brand-light)] text-[var(--admin-brand)] font-semibold" : "text-gray-600 hover:bg-[var(--admin-brand-light)]/50 hover:text-[var(--admin-brand)]"}`}
>
<Users size={16} />
Tamu
</Link>
<Link
href="/admin/dashboard/rsvp"
className={`${navClass} ${isActive("/admin/dashboard/rsvp") ? "bg-[var(--admin-brand-light)] text-[var(--admin-brand)] font-semibold" : "text-gray-600 hover:bg-[var(--admin-brand-light)]/50 hover:text-[var(--admin-brand)]"}`}
>
<MessageSquareHeart size={16} />
RSVP
</Link>
<Link
href={`/${invitation.slug}`}
target="_blank"
className={`${navClass} text-gray-600 hover:bg-[var(--admin-brand-light)]/50 hover:text-[var(--admin-brand)]`}
>
<ExternalLink size={16} />
Preview ↗
</Link>
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
className="flex-1 min-w-[150px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
<input
value={newPhone}
onChange={(e) => setNewPhone(e.target.value)}
placeholder="No. WA (misal: 08123...)"
className="flex-1 min-w-[150px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
<input
value={newGroup}
onChange={(e) => setNewGroup(e.target.value)}
placeholder="Grup (opsional)"
className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
<button
type="submit"
disabled={adding}
className="px-5 py-2 rounded-lg text-white text-sm transition-all duration-150 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)]"
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
className="px-4 py-2 rounded-lg border-2 border-[var(--admin-primary)] text-[var(--admin-primary)] text-sm font-medium transition-colors hover:bg-[var(--admin-primary)] hover:text-white"
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
<div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
<div>
<h2 className="font-medium">
Daftar Tamu ({filteredGuests.length})
</h2>
</div>
<div className="flex flex-wrap gap-2 items-center">
<input
value={search}
onChange={(e) => setSearch(e.target.value)}
placeholder="Cari nama..."
className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
<select
value={selectedGroup}
onChange={(e) => setSelectedGroup(e.target.value)}
className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2 bg-white"
>
<option value="">Semua Grup</option>
{uniqueGroups.map((g) => (
<option key={g} value={g}>{g}</option>
))}
</select>
<select
value={selectedStatus}
onChange={(e) => setSelectedStatus(e.target.value)}
className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2 bg-white"
>
<option value="">Semua Status</option>
<option value="sent">Link Disiapkan</option>
<option value="unsent">Belum Disiapkan</option>
<option value="opened">Sudah Dibuka</option>
<option value="unopened">Belum Dibuka</option>
</select>
{filteredGuests.length > 0 && (
<button
onClick={exportGuestsToCsv}
className="px-3 py-1.5 rounded-lg border-2 border-[var(--admin-primary)] text-[var(--admin-primary)] text-xs font-medium transition-colors hover:bg-[var(--admin-primary)] hover:text-white"
>
Unduh CSV
</button>
)}
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-sm">
<thead className="bg-gray-50 border-b border-gray-100">
<tr>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">Nama</th>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">No. WA</th>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">Grup</th>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">Status</th>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">Aksi</th>
</tr>
</thead>
<tbody className="divide-y divide-gray-100">
{filteredGuests.map((g) => (
<tr key={g.id} className="hover:bg-gray-50 transition-colors">
<td className="px-4 py-3 font-medium">{g.name}</td>
<td className="px-4 py-3 text-[#6b6560]">{g.phone ?? "-"}</td>
<td className="px-4 py-3 text-[#6b6560]">{g.group ?? "-"}</td>
<td className="px-4 py-3">
<div className="flex flex-col gap-1">
<span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full w-fit ${
g.isSent
? "bg-blue-50 text-blue-700 border border-blue-200"
: "bg-gray-50 text-gray-500 border border-gray-200"
}`}>
{g.isSent ? <Send size={12} /> : <XCircle size={12} />}
{g.isSent ? "Link disiapkan" : "Belum disiapkan"}
</span>
<span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full w-fit ${
g.openedAt
? "bg-green-50 text-green-700 border border-green-200"
: "bg-gray-50 text-gray-500 border border-gray-200"
}`}>
{g.openedAt ? <Eye size={12} /> : <MailOpen size={12} />}
{g.openedAt ? `Dibuka ${new Date(g.openedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}` : "Belum dibuka"}
</span>
</div>
</td>
<td className="px-4 py-3">
<div className="relative">
<button
onClick={() => setOpenDropdown(openDropdown === g.id ? null : g.id)}
className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
>
<MoreVertical size={16} />
</button>
{openDropdown === g.id && (
<>
<div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
<div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[140px]">
{g.phone && (
<a
href={waLink(g)}
target="_blank"
rel="noopener noreferrer"
onClick={() => { markSent(g.id); setOpenDropdown(null); }}
className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
>
<Send size={14} className="text-green-600" />
Kirim WA
</a>
)}
<button
onClick={() => {
navigator.clipboard.writeText(inviteUrl(g.uniqueCode));
setOpenDropdown(null);
}}
className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
>
<FileEdit size={14} className="text-blue-600" />
Copy Link
</button>
<button
onClick={() => { deleteGuest(g.id); setOpenDropdown(null); }}
className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
>
<XCircle size={14} />
Hapus
</button>
</div>
</>
)}
</div>
</td>
</tr>
))}
{filteredGuests.length === 0 && (
<tr>
<td colSpan={5} className="px-4 py-12 text-center">
<div className="flex flex-col items-center gap-2 text-[#6b6560]">
<Users size={32} className="text-gray-300" />
<p className="text-sm">Belum ada tamu. Tambahkan satu per satu atau import CSV.</p>
</div>
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
