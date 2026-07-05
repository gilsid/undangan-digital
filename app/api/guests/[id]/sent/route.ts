import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/guests/[id]/sent — mark as sent
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const guest = await prisma.guest.findUnique({
    where: { id },
    include: { invitation: true },
  });

  if (!guest || guest.invitation.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.guest.update({
    where: { id },
    data: { isSent: true, sentAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
