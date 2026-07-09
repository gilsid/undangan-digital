import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/api-error";

// DELETE /api/superadmin/invitations/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const invitation = await prisma.invitation.findUnique({ where: { id } });
    if (!invitation) {
      return NextResponse.json({ error: "Invitation tidak ditemukan" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.rsvp.deleteMany({ where: { invitationId: id } }),
      prisma.wish.deleteMany({ where: { invitationId: id } }),
      prisma.guest.deleteMany({ where: { invitationId: id } }),
      prisma.invitation.delete({ where: { id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handlePrismaError(error);
  }
}
