import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/api-error";
import { guestUpdateSchema } from "@/lib/validations";

async function getVerifiedGuest(id: string, userId: string) {
  const guest = await prisma.guest.findUnique({
    where: { id },
    include: { invitation: true },
  });
  if (!guest || guest.invitation.ownerId !== userId) return null;
  return guest;
}

// GET /api/guests/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const guest = await getVerifiedGuest(id, session.user.id);
    if (!guest) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json(guest);
  } catch (error) {
    return handlePrismaError(error);
  }
}

// PUT /api/guests/[id] — update guest name/phone/group
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const guest = await getVerifiedGuest(id, session.user.id);
    if (!guest) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = guestUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const updated = await prisma.guest.update({
      where: { id },
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        group: parsed.data.group || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handlePrismaError(error);
  }
}

// DELETE /api/guests/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const guest = await getVerifiedGuest(id, session.user.id);
    if (!guest) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.guest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handlePrismaError(error);
  }
}
