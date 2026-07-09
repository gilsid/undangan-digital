import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/api-error";

// POST /api/guests — add single guest
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // Verify invitation ownership
    const inv = await prisma.invitation.findUnique({
      where: { id: body.invitationId },
    });
    if (!inv || inv.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const guest = await prisma.guest.create({
      data: {
        invitationId: body.invitationId,
        name: body.name,
        phone: body.phone || null,
        group: body.group || null,
      },
    });

    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}
