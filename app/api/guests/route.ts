import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/api-error";
import { guestSchema } from "@/lib/validations";

// POST /api/guests — add single guest
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = guestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    // Verify invitation ownership
    const inv = await prisma.invitation.findUnique({
      where: { id: parsed.data.invitationId },
    });
    if (!inv || inv.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const guest = await prisma.guest.create({
      data: {
        invitationId: parsed.data.invitationId,
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        group: parsed.data.group || null,
      },
    });

    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}
