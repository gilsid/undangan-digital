"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Mail, Plus, List, Users, MessageSquareHeart, CheckCircle2, XCircle, Trash2, Archive, RotateCcw, MoreVertical, Search, Pencil } from "lucide-react";
import Toast from "@/components/Toast";
import Sidebar from "@/components/admin/Sidebar";
import type { SidebarNavItem } from "@/components/admin/Sidebar";
import { LedgerCard } from "@/components/ui/ledger-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusStamp } from "@/components/ui/status-stamp";
import { IconBadge } from "@/components/ui/icon-badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface Invitation {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  isPublished: boolean;
  isArchived: boolean;
  createdAt: Date;
  owner: { email: string };
  _count: { guests: number; rsvps: number };
}

interface Props {
  invitations: Invitation[];
  accountEmail?: string;
}

export default function SuperadminClient({ invitations: initialInvitations, accountEmail }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [invitations, setInvitations] = useState(initialInvitations);
  const [creating, setCreating] = useState(false);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    slug: string;
    groomName: string;
    brideName: string;
    guestCount: number;
    rsvpCount: number;
  } | null>(null);
  const [confirmSlugInput, setConfirmSlugInput] = useState("");
  const [editTarget, setEditTarget] = useState<Invitation | null>(null);
  const [editForm, setEditForm] = useState({ groomName: "", brideName: "", slug: "" });
  const [editSaving, setEditSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
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

  async function toggleArchive(id: string, archive: boolean) {
    setArchivingId(id);
    const res = await fetch(`/api/superadmin/invitations/${id}/archive`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: archive }),
    });
    if (res.ok) {
      const updated = await res.json();
      setInvitations((p) => p.map((i) => (i.id === id ? { ...i, ...updated } : i)));
      setToast({ message: archive ? "Invitation dinonaktifkan." : "Invitation diaktifkan kembali.", type: "success" });
    } else {
      const data = await res.json().catch(() => null);
      setToast({ message: data?.error ?? "Gagal mengubah status.", type: "error" });
    }
    setArchivingId(null);
  }

  async function deleteInvitation() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/superadmin/invitations/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      setInvitations((p) => p.filter((i) => i.id !== deleteTarget.id));
      setToast({ message: "Invitation berhasil dihapus.", type: "success" });
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setToast({ message: data?.error ?? "Gagal menghapus invitation.", type: "error" });
    }
    setDeleteTarget(null);
    setConfirmSlugInput("");
  }

  const filteredInvitations = invitations.filter((inv) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || inv.groomName.toLowerCase().includes(q) || inv.brideName.toLowerCase().includes(q) || inv.slug.toLowerCase().includes(q) || inv.owner.email.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || statusFilter === "all" || (statusFilter === "published" && inv.isPublished && !inv.isArchived) || (statusFilter === "draft" && !inv.isPublished && !inv.isArchived) || (statusFilter === "archived" && inv.isArchived);
    return matchesSearch && matchesStatus;
  });

  function openEdit(inv: Invitation) {
    setEditTarget(inv);
    setEditForm({ groomName: inv.groomName, brideName: inv.brideName, slug: inv.slug });
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;
    setEditSaving(true);
    const res = await fetch(`/api/invitations/${editTarget.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const updated = await res.json();
      setInvitations((p) => p.map((i) => (i.id === updated.id ? { ...i, ...updated } : i)));
      setEditTarget(null);
      setToast({ message: "Invitation berhasil diperbarui.", type: "success" });
    } else {
      const data = await res.json().catch(() => null);
      setToast({ message: data?.error ?? "Gagal memperbarui invitation.", type: "error" });
    }
    setEditSaving(false);
  }

  const navItems: SidebarNavItem[] = [
    { href: "/superadmin", label: "Kelola Klien", icon: Mail },
  ];

  const stats = [
    { label: "Total Undangan", value: invitations.length, icon: Mail, color: "text-[var(--foil-gold)]" },
    { label: "Total Tamu", value: invitations.reduce((s, i) => s + i._count.guests, 0), icon: Users, color: "text-[var(--text-primary)]" },
    { label: "Total RSVP", value: invitations.reduce((s, i) => s + i._count.rsvps, 0), icon: MessageSquareHeart, color: "text-[var(--dusty-rose)]" },
    { label: "Terpublikasi", value: invitations.filter((i) => i.isPublished && !i.isArchived).length, icon: CheckCircle2, color: "text-[var(--status-success)]" },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--ink-bg)]">
      <Sidebar navItems={navItems} activePath={pathname} accountEmail={accountEmail} />

      <main className="flex-1 min-w-0">
        <header className="px-10 py-6 border-b border-[var(--ink-border)] bg-[var(--ink-surface)]">
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl text-[var(--text-primary)]"
          >
            Kelola Klien
          </h1>
        </header>

        <div className="px-10 py-8 space-y-8">
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <LedgerCard key={stat.label} className="flex items-center gap-4">
                  <IconBadge className={`h-10 w-10 bg-transparent border-current/60 ${stat.color}`}>
                    <Icon size={20} />
                  </IconBadge>
                  <div>
                    <p className={`text-2xl font-semibold text-[var(--text-primary)]`} style={{ fontFamily: "var(--font-mono)" }}>{stat.value}</p>
                    <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
                  </div>
                </LedgerCard>
              );
            })}
          </div>

          {/* Create invitation */}
          <LedgerCard>
            <div className="flex items-center gap-3 mb-4">
              <IconBadge>
                <Plus size={18} />
              </IconBadge>
              <h2 className="font-semibold text-[var(--text-primary)]">Buat Invitation Baru</h2>
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
              ].map(([name, lbl]) => (
                <div key={name} className={name === "venueAddress" ? "col-span-2" : ""}>
                  <Label className="text-xs text-[var(--text-muted)] mb-1 block">{lbl}</Label>
                  <Input
                    name={name}
                    type={name === "weddingDate" ? "date" : name === "email" ? "email" : "text"}
                    value={(form as unknown as Record<string, string>)[name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              <Toast toast={toast} onClose={() => setToast(null)} />
              <Button
                type="submit"
                disabled={creating}
                className="col-span-2"
              >
                {creating ? "Membuat..." : "Buat Invitation"}
              </Button>
            </form>
          </LedgerCard>

          {/* Invitation list */}
          <LedgerCard className="p-0">
            <div className="px-6 py-4 border-b border-[var(--ink-border)]">
              <div className="flex items-center gap-3 mb-3">
                <IconBadge className="border-[var(--dusty-rose)]/60 text-[var(--dusty-rose)]">
                  <List size={18} />
                </IconBadge>
                <h2 className="font-semibold text-[var(--text-primary)]">Semua Invitation ({filteredInvitations.length})</h2>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1 max-w-xs">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama/slug/email..." className="pl-7 text-xs" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs border border-[var(--ink-border)] rounded-md px-2.5 py-1.5 bg-[var(--ink-surface)] text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--foil-gold)]"
                >
                  <option value="">Semua Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Diarsipkan</option>
                </select>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[var(--ink-border)] hover:bg-transparent">
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Mempelai</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Slug</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Email</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs text-center">Tamu</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs text-center">RSVP</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Status</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs w-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvitations.map((inv) => (
                  <TableRow key={inv.id} className="border-b border-[var(--ink-border)]">
                    <TableCell className="font-medium text-[var(--text-primary)]">
                      {inv.groomName} & {inv.brideName}
                    </TableCell>
                    <TableCell className="text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>/{inv.slug}</TableCell>
                    <TableCell className="text-[var(--text-secondary)]">{inv.owner.email}</TableCell>
                    <TableCell className="text-center" style={{ fontFamily: "var(--font-mono)" }}>{inv._count.guests}</TableCell>
                    <TableCell className="text-center" style={{ fontFamily: "var(--font-mono)" }}>{inv._count.rsvps}</TableCell>
                    <TableCell>
                      <StatusStamp
                        tone={inv.isArchived ? "warning" : inv.isPublished ? "success" : "neutral"}
                        icon={inv.isArchived ? <Archive size={10} /> : inv.isPublished ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                      >
                        {inv.isArchived ? "Diarsipkan" : inv.isPublished ? "Published" : "Draft"}
                      </StatusStamp>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <button
                              aria-label="Aksi invitation"
                              className="p-1.5 rounded-lg hover:bg-[var(--ink-surface-raised)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            />
                          }
                        >
                          <MoreVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" align="end" sideOffset={4}>
                          <DropdownMenuItem onClick={() => openEdit(inv)}>
                            <Pencil size={14} className="text-[var(--foil-gold)]" />
                            Edit
                          </DropdownMenuItem>
                          {inv.isArchived ? (
                            <DropdownMenuItem onClick={() => toggleArchive(inv.id, false)} disabled={archivingId === inv.id}>
                              <RotateCcw size={14} className="text-[var(--status-success)]" />
                              Aktifkan Kembali
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => toggleArchive(inv.id, true)} disabled={archivingId === inv.id}>
                              <Archive size={14} className="text-[var(--status-warning)]" />
                              Nonaktifkan
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => setTimeout(() => setDeleteTarget({
                              id: inv.id,
                              slug: inv.slug,
                              groomName: inv.groomName,
                              brideName: inv.brideName,
                              guestCount: inv._count.guests,
                              rsvpCount: inv._count.rsvps,
                            }), 0)}
                            className="text-[var(--status-danger)] focus:text-[var(--status-danger)]"
                          >
                            <Trash2 size={14} />
                            Hapus Permanen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </LedgerCard>
        </div>
      </main>

      <Toast toast={toast} onClose={() => setToast(null)} />

      <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) setEditTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Invitation</DialogTitle>
            <DialogDescription>
              Ubah data <span className="font-medium text-[var(--text-primary)]">{editTarget?.groomName} & {editTarget?.brideName}</span>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={saveEdit} className="space-y-4 py-2">
            <div>
              <Label className="text-xs text-[var(--text-muted)] mb-1 block">Nama Pria</Label>
              <Input value={editForm.groomName} onChange={(e) => setEditForm((p) => ({ ...p, groomName: e.target.value }))} required />
            </div>
            <div>
              <Label className="text-xs text-[var(--text-muted)] mb-1 block">Nama Wanita</Label>
              <Input value={editForm.brideName} onChange={(e) => setEditForm((p) => ({ ...p, brideName: e.target.value }))} required />
            </div>
            <div>
              <Label className="text-xs text-[var(--text-muted)] mb-1 block">Slug</Label>
              <Input value={editForm.slug} onChange={(e) => setEditForm((p) => ({ ...p, slug: e.target.value }))} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditTarget(null)}>Batal</Button>
              <Button type="submit" disabled={editSaving}>{editSaving ? "Menyimpan..." : "Simpan"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setConfirmSlugInput(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Invitation</DialogTitle>
            <DialogDescription>
              Menghapus <span className="font-medium text-[var(--text-primary)]">{deleteTarget?.groomName} & {deleteTarget?.brideName}</span> ({deleteTarget?.slug}) akan menghapus PERMANEN:
            </DialogDescription>
          </DialogHeader>
          <ul className="list-disc list-inside -mt-2 space-y-1 px-1 text-sm text-muted-foreground">
            <li>{deleteTarget?.guestCount} data tamu</li>
            <li>{deleteTarget?.rsvpCount} data RSVP & ucapan</li>
            <li>Halaman undangan publik di /{deleteTarget?.slug}</li>
          </ul>
          <p className="text-sm text-muted-foreground px-1 -mt-1">Tindakan ini tidak dapat dibatalkan.</p>
          <Input
            placeholder={`Ketik "${deleteTarget?.slug}" untuk konfirmasi`}
            value={confirmSlugInput}
            onChange={(e) => setConfirmSlugInput(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteTarget(null); setConfirmSlugInput(""); }}>Batal</Button>
            <Button
              variant="destructive"
              disabled={confirmSlugInput !== deleteTarget?.slug}
              onClick={deleteInvitation}
            >
              Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
