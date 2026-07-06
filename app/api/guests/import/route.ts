import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/guests/import — bulk import guests
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { guests, invitationId } = await req.json();

    if (!invitationId || !Array.isArray(guests)) {
      return NextResponse.json({ error: "Format data tidak valid" }, { status: 400 });
    }

    // Ownership check
    const inv = await prisma.invitation.findUnique({ where: { id: invitationId } });
    if (!inv || inv.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    interface GuestInput {
      name?: string;
      phone?: string;
      group?: string;
    }

    const data = (guests as GuestInput[])
      .filter((g) => g && typeof g.name === "string" && g.name.trim())
      .map((g) => ({
        invitationId,
        name: g.name!.trim(),
        phone: g.phone ? String(g.phone).trim() : null,
        group: g.group ? String(g.group).trim() : null,
      }));

    if (data.length === 0) {
      return NextResponse.json({ error: "Tidak ada data tamu yang valid untuk diimpor" }, { status: 400 });
    }

    await prisma.guest.createMany({ data });

    return NextResponse.json({ message: `${data.length} tamu berhasil diimpor.` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan server saat mengimpor data" }, { status: 500 });
  }
}
