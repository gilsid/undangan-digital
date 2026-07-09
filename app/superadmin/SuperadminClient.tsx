"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Mail, Plus, List, Users, MessageSquareHeart, CheckCircle2, XCircle } from "lucide-react";
import Toast from "@/components/Toast";
import Sidebar from "@/components/admin/Sidebar";
import type { SidebarNavItem } from "@/components/admin/Sidebar";
import { LedgerCard } from "@/components/ui/ledger-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

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

  const stats = [
    { label: "Total Undangan", value: invitations.length, icon: Mail, color: "text-[var(--foil-gold)]" },
    { label: "Total Tamu", value: invitations.reduce((s, i) => s + i._count.guests, 0), icon: Users, color: "text-[var(--text-primary)]" },
    { label: "Total RSVP", value: invitations.reduce((s, i) => s + i._count.rsvps, 0), icon: MessageSquareHeart, color: "text-[var(--dusty-rose)]" },
    { label: "Terpublikasi", value: invitations.filter((i) => i.isPublished).length, icon: CheckCircle2, color: "text-[var(--status-success)]" },
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
                  <div className={`w-10 h-10 rounded-lg bg-[var(--ink-surface-raised)] flex items-center justify-center ${stat.color}`}>
                    <Icon size={20} />
                  </div>
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
              <div className="w-9 h-9 rounded-lg bg-[var(--foil-gold)]/10 flex items-center justify-center">
                <Plus size={18} className="text-[var(--foil-gold)]" />
              </div>
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
          <LedgerCard className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--ink-border)] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--dusty-rose)]/10 flex items-center justify-center">
                <List size={18} className="text-[var(--dusty-rose)]" />
              </div>
              <h2 className="font-semibold text-[var(--text-primary)]">Semua Invitation ({invitations.length})</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[var(--ink-border)] hover:bg-transparent">
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Mempelai</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Slug</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Email</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Tamu</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">RSVP</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((inv) => (
                  <TableRow key={inv.id} className="border-b border-[var(--ink-border)]">
                    <TableCell className="font-medium text-[var(--text-primary)]">
                      {inv.groomName} & {inv.brideName}
                    </TableCell>
                    <TableCell className="text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>/{inv.slug}</TableCell>
                    <TableCell className="text-[var(--text-secondary)]">{inv.owner.email}</TableCell>
                    <TableCell className="text-center" style={{ fontFamily: "var(--font-mono)" }}>{inv._count.guests}</TableCell>
                    <TableCell className="text-center" style={{ fontFamily: "var(--font-mono)" }}>{inv._count.rsvps}</TableCell>
                    <TableCell>
                      <Badge
                        variant={inv.isPublished ? "default" : "outline"}
                        className={
                          inv.isPublished
                            ? "bg-[var(--status-success)]/15 text-[var(--status-success)] border-[var(--status-success)]/30 w-fit"
                            : "bg-[var(--status-warning)]/15 text-[var(--status-warning)] border-[var(--status-warning)]/30 w-fit"
                        }
                      >
                        {inv.isPublished ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {inv.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </LedgerCard>
        </div>
      </main>
    </div>
  );
}
