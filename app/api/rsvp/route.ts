import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rateLimit";
import { rsvpSchema } from "@/lib/validations";

// POST /api/rsvp
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";
    if (await isRateLimited(`${ip}:rsvp`, 5, 60000)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Silakan coba lagi nanti." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = rsvpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    }

    // Verify invitation exists & is published
    const inv = await prisma.invitation.findUnique({
      where: { id: parsed.data.invitationId },
    });
    if (!inv || !inv.isPublished || inv.isArchived) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        invitationId: parsed.data.invitationId,
        guestName: parsed.data.guestName,
        attendance: parsed.data.attendance,
        guestCount: parsed.data.guestCount,
      },
    });

    return NextResponse.json(rsvp, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengirim konfirmasi RSVP" }, { status: 500 });
  }
}
