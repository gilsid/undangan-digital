import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/rsvp
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.invitationId || !body.guestName || !body.attendance) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const validAttendances = ["HADIR", "TIDAK_HADIR", "RAGU"];
    if (!validAttendances.includes(body.attendance)) {
      return NextResponse.json({ error: "Status kehadiran tidak valid" }, { status: 400 });
    }

    // Verify invitation exists & is published
    const inv = await prisma.invitation.findUnique({
      where: { id: body.invitationId },
    });
    if (!inv || !inv.isPublished) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        invitationId: body.invitationId,
        guestName: body.guestName.trim(),
        attendance: body.attendance,
        guestCount: Number(body.guestCount) || 1,
      },
    });

    return NextResponse.json(rsvp, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengirim konfirmasi RSVP" }, { status: 500 });
  }
}
