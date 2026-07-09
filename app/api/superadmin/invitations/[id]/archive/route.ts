import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/api-error";

// PATCH /api/superadmin/invitations/[id]/archive
// body: { archived: boolean }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { archived } = await req.json();

    const invitation = await prisma.invitation.findUnique({ where: { id } });
    if (!invitation) {
      return NextResponse.json({ error: "Invitation tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.invitation.update({
      where: { id },
      data: {
        isArchived: !!archived,
        archivedAt: archived ? new Date() : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handlePrismaError(error);
  }
}
