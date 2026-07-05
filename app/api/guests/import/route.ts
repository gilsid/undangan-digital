import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/guests/import — bulk import CSV
// Body: { csv: string, invitationId: string }
// CSV format: name,phone,group (header required)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { csv, invitationId } = await req.json();

  // Ownership check
  const inv = await prisma.invitation.findUnique({ where: { id: invitationId } });
  if (!inv || inv.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const lines = (csv as string).trim().split("\n");
  const header = lines[0].toLowerCase().split(",").map((h: string) => h.trim());
  const nameIdx = header.indexOf("name");
  const phoneIdx = header.indexOf("phone");
  const groupIdx = header.indexOf("group");

  if (nameIdx === -1) {
    return NextResponse.json({ error: "Kolom 'name' tidak ditemukan" }, { status: 400 });
  }

  const rows = lines.slice(1).filter((l) => l.trim());
  const data = rows.map((line) => {
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    return {
      invitationId,
      name: cols[nameIdx] ?? "",
      phone: phoneIdx !== -1 ? cols[phoneIdx] || null : null,
      group: groupIdx !== -1 ? cols[groupIdx] || null : null,
    };
  }).filter((d) => d.name);

  await prisma.guest.createMany({ data });

  return NextResponse.json({ message: `${data.length} tamu berhasil diimpor.` });
}
