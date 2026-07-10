"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Invitation, Guest } from "@prisma/client";
import { FileEdit, Users, MessageSquareHeart, ExternalLink, XCircle, Send, Eye, MailOpen, MoreVertical, Download } from "lucide-react";
import { generateWaLink, generateInviteMessage } from "@/lib/whatsapp";
import Papa from "papaparse";
import Sidebar from "@/components/admin/Sidebar";
import type { SidebarNavItem } from "@/components/admin/Sidebar";
import { LedgerCard } from "@/components/ui/ledger-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { StatusStamp } from "@/components/ui/status-stamp";
import Toast from "@/components/Toast";

interface Props {
  invitation: Invitation;
  guests: Guest[];
  accountEmail?: string;
}

export default function GuestsClient({ invitation, guests: initialGuests, accountEmail }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [adding, setAdding] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const uniqueGroups = Array.from(new Set(guests.map((g) => g.group).filter(Boolean))) as string[];

  const filteredGuests = guests.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = !selectedGroup || selectedGroup === "all" || g.group === selectedGroup;
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
    } else {
      const data = await res.json().catch(() => null);
      setToast({ message: data?.error ?? "Gagal menambahkan tamu.", type: "error" });
    }
    setAdding(false);
  }

  async function deleteGuest(id: string) {
    const res = await fetch(`/api/guests/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 404) {
      const data = await res.json().catch(() => null);
      setToast({ message: data?.error ?? "Gagal menghapus tamu.", type: "error" });
      return;
    }
    setGuests((p) => p.filter((g) => g.id !== id));
  }

  async function markSent(id: string) {
    const res = await fetch(`/api/guests/${id}/sent`, { method: "POST" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setToast({ message: data?.error ?? "Gagal menandai tamu.", type: "error" });
      if (res.status === 404) {
        setGuests((p) => p.filter((g) => g.id !== id));
      }
      return;
    }
    setGuests((p) =>
      p.map((g) => (g.id === id ? { ...g, isSent: true, sentAt: new Date() } : g))
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
        const parsedGuests = (results.data as Record<string, string>[])
          .map((row) => {
            const keys = Object.keys(row);
            const nameKey = keys.find((k) => k.toLowerCase() === "name");
            const phoneKey = keys.find((k) => k.toLowerCase() === "phone");
            const groupKey = keys.find((k) => k.toLowerCase() === "group");
            return {
              name: nameKey ? row[nameKey] : "",
              phone: phoneKey ? row[phoneKey] : "",
              group: groupKey ? row[groupKey] : "",
            };
          })
          .filter((g) => g.name);

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

  const navItems: SidebarNavItem[] = [
    { href: "/admin/dashboard", label: "Konten", icon: FileEdit },
    { href: "/admin/dashboard/guests", label: "Tamu", icon: Users },
    { href: "/admin/dashboard/rsvp", label: "RSVP", icon: MessageSquareHeart },
    { href: `/${invitation.slug}`, label: "Preview ↗", icon: ExternalLink, external: true },
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
            Daftar Tamu
          </h1>
        </header>

        <div className="px-10 py-8 space-y-6">
          {/* Add guest */}
          <LedgerCard>
            <h2 className="font-medium mb-4 text-[var(--text-primary)]">Tambah Tamu</h2>
            <form onSubmit={addGuest} className="flex gap-3 flex-wrap">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nama tamu"
                required
                className="flex-1 min-w-[150px]"
              />
              <Input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="No. WA (misal: 08123...)"
                className="flex-1 min-w-[150px]"
              />
              <Input
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                placeholder="Grup (opsional)"
                className="w-32"
              />
              <Button type="submit" disabled={adding}>
                {adding ? "..." : "Tambah"}
              </Button>
            </form>
          </LedgerCard>

          {/* Import CSV */}
          <LedgerCard>
            <h2 className="font-medium mb-2 text-[var(--text-primary)]">Import Bulk via CSV</h2>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              Format: <code className="font-[var(--font-mono)] bg-[var(--ink-surface-raised)] px-1.5 py-0.5 rounded">name,phone,group</code> (header wajib ada, group opsional)
            </p>
            <div className="flex gap-3 items-center">
              <Button
                variant="outline"
                onClick={() => fileRef.current?.click()}
              >
                Pilih file CSV
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                onChange={importCSV}
                className="hidden"
              />
              {importMsg && (
                <span className="text-sm text-[var(--text-secondary)]">{importMsg}</span>
              )}
            </div>
          </LedgerCard>

          {/* Guest table */}
          <LedgerCard className="p-0">
            <div className="px-6 py-4 border-b border-[var(--ink-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-medium text-[var(--text-primary)]">Daftar Tamu ({filteredGuests.length})</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Total: {guests.length} tamu
                </p>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama..."
                  className="w-48"
                />
                <Select value={selectedGroup} onValueChange={(v) => setSelectedGroup(v ?? "")}>
                  <SelectTrigger className="w-[140px]" size="sm">
                    <SelectValue placeholder="Semua Grup" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Grup</SelectItem>
                    {uniqueGroups.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v ?? "")}>
                  <SelectTrigger className="w-[160px]" size="sm">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="sent">Link Disiapkan</SelectItem>
                    <SelectItem value="unsent">Belum Disiapkan</SelectItem>
                    <SelectItem value="opened">Sudah Dibuka</SelectItem>
                    <SelectItem value="unopened">Belum Dibuka</SelectItem>
                  </SelectContent>
                </Select>
                {filteredGuests.length > 0 && (
                  <Button variant="outline" size="sm" onClick={exportGuestsToCsv}>
                    <Download size={14} />
                    Unduh CSV
                  </Button>
                )}
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-b border-[var(--ink-border)] hover:bg-transparent">
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Nama</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">No. WA</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Grup</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs">Status</TableHead>
                  <TableHead className="text-[var(--text-muted)] uppercase tracking-wide text-xs w-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.map((g) => (
                  <TableRow key={g.id} className="border-b border-[var(--ink-border)]">
                    <TableCell className="font-medium text-[var(--text-primary)]">{g.name}</TableCell>
                    <TableCell className="text-[var(--text-secondary)]" style={{ fontFamily: "var(--font-mono)" }}>{g.phone ?? "-"}</TableCell>
                    <TableCell className="text-[var(--text-secondary)]">{g.group ?? "-"}</TableCell>
                    <TableCell className="py-2.5 align-top">
                      <div className="flex flex-col items-start gap-1.5">
                          <StatusStamp
                            tone={g.isSent ? "success" : "warning"}
                            icon={g.isSent ? <Send size={10} /> : <XCircle size={10} />}
                          >
                            {g.isSent ? "Link disiapkan" : "Belum disiapkan"}
                          </StatusStamp>
                          <StatusStamp
                            tone={g.openedAt ? "success" : "neutral"}
                            icon={g.openedAt ? <Eye size={10} /> : <MailOpen size={10} />}
                          >
                            {g.openedAt
                              ? `Dibuka ${new Date(g.openedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`
                              : "Belum dibuka"
                            }
                          </StatusStamp>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <button
                              aria-label="Aksi tamu"
                              className="p-1.5 rounded-lg hover:bg-[var(--ink-surface-raised)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            />
                          }
                        >
                          <MoreVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" align="end" sideOffset={4}>
                          {g.phone && (
                            <DropdownMenuItem
                              onClick={() => {
                                markSent(g.id);
                                const win = window.open(waLink(g), "_blank");
                                if (!win) {
                                  setToast({ message: "Popup diblokir. Izinkan popup untuk situs ini atau klik ulang.", type: "error" });
                                }
                              }}
                            >
                              <Send size={14} className="text-[var(--status-success)]" />
                              Kirim WA
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(inviteUrl(g.uniqueCode));
                                setToast({ message: "Link disalin!", type: "success" });
                              } catch (err) {
                                console.error("Clipboard write failed:", err);
                                setToast({ message: "Gagal menyalin link. Coba salin manual.", type: "error" });
                              }
                            }}
                          >
                            <FileEdit size={14} className="text-[var(--foil-gold)]" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setTimeout(() => setDeleteTarget({ id: g.id, name: g.name }), 0)}
                            className="text-[var(--status-danger)] focus:text-[var(--status-danger)]"
                          >
                            <XCircle size={14} />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredGuests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
                        <Users size={32} className="text-[var(--text-muted)]" />
                        <p className="text-sm">Belum ada tamu. Tambahkan satu per satu atau import CSV.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </LedgerCard>
        </div>
      </main>

      <Toast toast={toast} onClose={() => setToast(null)} />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Tamu</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus <span className="font-medium text-[var(--text-primary)]">{deleteTarget?.name}</span>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) deleteGuest(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
