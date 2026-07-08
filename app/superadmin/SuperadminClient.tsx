"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Mail, Plus, List, Users, MessageSquareHeart, CheckCircle2, XCircle } from "lucide-react";
import Toast from "@/components/Toast";
import Sidebar from "@/components/admin/Sidebar";
import type { SidebarNavItem } from "@/components/admin/Sidebar";

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

interface Props {
invitations: Invitation[];
accountEmail?: string;
}

export default function SuperadminClient({ invitations, accountEmail }: Props) {
const router = useRouter();
const pathname = usePathname();
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
const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
}

async function createInvitation(e: React.FormEvent) {
e.preventDefault();
setCreating(true);
setToast(null);

// Create user then invitation
const res = await fetch("/api/superadmin/create-invitation", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(form),
});

const d = await res.json();
if (res.ok) {
setToast({ message: `Berhasil! Login: ${form.email} / ${form.password}`, type: "success" });
setForm({ email: "", password: "", slug: "", groomName: "", brideName: "", weddingDate: "", venueName: "", venueAddress: "" });
router.refresh();
} else {
setToast({ message: d.error ?? "Gagal membuat invitation.", type: "error" });
}
setCreating(false);
}

const navItems: SidebarNavItem[] = [
  { href: "/superadmin", label: "Kelola Klien", icon: Mail },
];

return (
<div className="min-h-screen flex bg-[var(--admin-bg)]">
<Sidebar navItems={navItems} activePath={pathname} accountEmail={accountEmail} />

<main className="flex-1 min-w-0">
<header className="px-10 py-6 border-b border-[var(--admin-border)] bg-[var(--admin-surface)]">
<h1
style={{ fontFamily: "'Cormorant Garamond', serif" }}
className="text-2xl text-[var(--admin-ink)]"
>
Kelola Klien
</h1>
</header>

<div className="px-10 py-8 space-y-8">
{/* Stats cards */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
{[
{ label: "Total Undangan", value: invitations.length, icon: Mail, color: "bg-[var(--admin-brand-light)] text-[var(--admin-brand)]", border: "border-t-[var(--admin-brand)]" },
{ label: "Total Tamu", value: invitations.reduce((s, i) => s + i._count.guests, 0), icon: Users, color: "bg-blue-50 text-blue-600", border: "border-t-blue-500" },
{ label: "Total RSVP", value: invitations.reduce((s, i) => s + i._count.rsvps, 0), icon: MessageSquareHeart, color: "bg-purple-50 text-purple-600", border: "border-t-purple-500" },
{ label: "Terpublikasi", value: invitations.filter((i) => i.isPublished).length, icon: CheckCircle2, color: "bg-green-50 text-green-600", border: "border-t-green-500" },
].map((stat) => {
const Icon = stat.icon;
return (
<div key={stat.label} className={`bg-white rounded-xl p-5 border-t-2 ${stat.border} flex items-center gap-4`}>
<div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
<Icon size={20} />
</div>
<div>
<p className="text-2xl font-semibold text-[var(--admin-ink)]">{stat.value}</p>
<p className="text-xs text-[#6b6560]">{stat.label}</p>
</div>
</div>
);
})}
</div>

{/* Create invitation */}
<section className="bg-white rounded-xl p-6 border border-[var(--admin-border)]">
<div className="flex items-center gap-3 mb-4">
<div className="w-9 h-9 rounded-lg bg-[var(--admin-brand-light)] flex items-center justify-center">
<Plus size={18} className="text-[var(--admin-brand)]" />
</div>
<h2 className="font-semibold text-[var(--admin-ink)]">Buat Invitation Baru</h2>
</div>
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
className="w-full border border-[var(--admin-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
/>
</div>
))}
<Toast toast={toast} onClose={() => setToast(null)} />
<button
type="submit"
disabled={creating}
className="col-span-2 py-2 rounded-lg text-white text-sm transition-all duration-150 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)]"
>
{creating ? "Membuat..." : "Buat Invitation"}
</button>
</form>
</section>

{/* Invitation list */}
<section className="bg-white rounded-xl border border-[var(--admin-border)] overflow-hidden">
<div className="px-6 py-4 border-b border-[var(--admin-border)] flex items-center gap-3">
<div className="w-9 h-9 rounded-lg bg-[var(--admin-accent)]/10 flex items-center justify-center">
<List size={18} className="text-[var(--admin-accent)]" />
</div>
<h2 className="font-semibold text-[var(--admin-ink)]">Semua Invitation ({invitations.length})</h2>
</div>
<div className="overflow-x-auto">
<table className="w-full text-sm">
<thead className="bg-[var(--admin-surface-alt)] border-b border-[var(--admin-border)]">
<tr>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">Mempelai</th>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">Slug</th>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">Email</th>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">Tamu</th>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">RSVP</th>
<th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-gray-500 font-medium">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-[var(--admin-border)]">
{invitations.map((inv) => (
<tr key={inv.id} className="hover:bg-[var(--admin-surface-alt)] transition-colors">
<td className="px-4 py-3 font-medium">
{inv.groomName} & {inv.brideName}
</td>
<td className="px-4 py-3 font-mono text-xs text-[#6b6560]">/{inv.slug}</td>
<td className="px-4 py-3 text-[#6b6560]">{inv.owner.email}</td>
<td className="px-4 py-3 text-center">{inv._count.guests}</td>
<td className="px-4 py-3 text-center">{inv._count.rsvps}</td>
<td className="px-4 py-3">
<span
className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium border ${
inv.isPublished
? "bg-green-50 text-green-700 border-green-200"
: "bg-orange-50 text-orange-600 border-orange-200"
}`}
>
{inv.isPublished ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
{inv.isPublished ? "Published" : "Draft"}
</span>
</td>
</tr>
))}
</tbody>
</table>
</div>
</section>
</div>
</main>
</div>
);
}
