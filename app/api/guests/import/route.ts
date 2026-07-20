import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { guestImportSchema } from "@/lib/validations";

const MAX_IMPORT_ROWS = 1000;

// POST /api/guests/import — bulk import guests
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = guestImportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Format data tidak valid" }, { status: 400 });
    }

    // Ownership check
    const inv = await prisma.invitation.findUnique({ where: { id: parsed.data.invitationId } });
    if (!inv || inv.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const data = parsed.data.guests.map((g) => ({
      invitationId: parsed.data.invitationId,
      name: g.name,
      phone: g.phone || null,
      group: g.group || null,
    }));

    if (data.length === 0) {
      return NextResponse.json({ error: "Tidak ada data tamu yang valid untuk diimpor" }, { status: 400 });
    }

    if (data.length > MAX_IMPORT_ROWS) {
      return NextResponse.json(
        { error: `Maksimum ${MAX_IMPORT_ROWS} tamu per-import. File kamu berisi ${data.length} baris.` },
        { status: 400 }
      );
    }

    const created = await prisma.guest.createManyAndReturn({ data });

    return NextResponse.json({ message: `${data.length} tamu berhasil diimpor.`, guests: created });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan server saat mengimpor data" }, { status: 500 });
  }
}
