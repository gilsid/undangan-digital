"use client";

import type { Invitation, Rsvp, Wish } from "@prisma/client";
import { usePathname } from "next/navigation";
import { FileEdit, Users, MessageSquareHeart, ExternalLink, CheckCircle2, XCircle, HelpCircle, Inbox, Download } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import type { SidebarNavItem } from "@/components/admin/Sidebar";
import { LedgerCard } from "@/components/ui/ledger-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

interface Props {
  invitation: Invitation;
  rsvps: Rsvp[];
  wishes: Wish[];
  accountEmail?: string;
}

export default function RsvpClient({ invitation, rsvps, wishes, accountEmail }: Props) {
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

  const stats = [
    { label: "Hadir", count: hadir.length, sub: `${totalTamu} tamu`, color: "text-[var(--status-success)]" },
    { label: "Tidak Hadir", count: tidakHadir.length, sub: "", color: "text-[var(--status-danger)]" },
    { label: "Ragu-ragu", count: ragu.length, sub: "", color: "text-[var(--status-warning)]" },
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
            RSVP & Ucapan
          </h1>
        </header>

        <div className="px-10 py-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <LedgerCard key={s.label} className="text-center">
                <p className={`text-3xl font-light ${s.color}`} style={{ fontFamily: "var(--font-mono)" }}>{s.count}</p>
                <p className="text-sm font-medium mt-1 text-[var(--text-primary)]">{s.label}</p>
                {s.sub && <p className="text-xs text-[var(--text-muted)]">{s.sub}</p>}
              </LedgerCard>
            ))}
          </div>

          {/* RSVP list */}
          <LedgerCard className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--ink-border)] flex items-center justify-between">
              <h2 className="font-medium text-[var(--text-primary)]">Konfirmasi Kehadiran ({rsvps.length})</h2>
              {rsvps.length > 0 && (
                <Button variant="outline" size="sm" onClick={exportRsvpToCsv}>
                  <Download size={14} />
                  Unduh CSV
                </Button>
              )}
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[var(--ink-border)] hover:bg-transparent">
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Nama</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Status</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Jml Tamu</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.map((r) => (
                  <TableRow key={r.id} className="border-b border-[var(--ink-border)]">
                    <TableCell className="font-medium text-[var(--text-primary)]">{r.guestName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={r.attendance === "HADIR" ? "default" : "outline"}
                        className={
                          r.attendance === "HADIR"
                            ? "bg-[var(--status-success)]/15 text-[var(--status-success)] border-[var(--status-success)]/30 w-fit"
                            : r.attendance === "TIDAK_HADIR"
                            ? "bg-[var(--status-danger)]/15 text-[var(--status-danger)] border-[var(--status-danger)]/30 w-fit"
                            : "bg-[var(--status-warning)]/15 text-[var(--status-warning)] border-[var(--status-warning)]/30 w-fit"
                        }
                      >
                        {r.attendance === "HADIR" ? <CheckCircle2 size={10} /> : r.attendance === "TIDAK_HADIR" ? <XCircle size={10} /> : <HelpCircle size={10} />}
                        {r.attendance === "HADIR"
                          ? "Hadir"
                          : r.attendance === "TIDAK_HADIR"
                          ? "Tidak Hadir"
                          : "Ragu-ragu"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center" style={{ fontFamily: "var(--font-mono)" }}>{r.guestCount}</TableCell>
                    <TableCell className="text-[var(--text-muted)] text-xs">
                      {new Date(r.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
                {rsvps.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
                        <Inbox size={32} className="text-[var(--text-muted)]" />
                        <p className="text-sm">Belum ada RSVP masuk.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </LedgerCard>

          {/* Wishes */}
          <LedgerCard className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--ink-border)]">
              <h2 className="font-medium text-[var(--text-primary)]">Ucapan & Doa ({wishes.length})</h2>
            </div>
            <div className="divide-y divide-[var(--ink-border)]">
              {wishes.map((w) => (
                <div key={w.id} className="px-6 py-4">
                  <p className="font-medium text-sm text-[var(--text-primary)]">{w.name}</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{w.message}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {new Date(w.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
              {wishes.length === 0 && (
                <div className="px-6 py-12 text-center flex flex-col items-center gap-2 text-[var(--text-muted)]">
                  <MessageSquareHeart size={32} className="text-[var(--text-muted)]" />
                  <p className="text-sm">Belum ada ucapan masuk.</p>
                </div>
              )}
            </div>
          </LedgerCard>
        </div>
      </main>
    </div>
  );
}
