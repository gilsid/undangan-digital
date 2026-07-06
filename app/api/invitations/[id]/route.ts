import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT /api/invitations/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Ownership check
  const inv = await prisma.invitation.findUnique({ where: { id } });
  if (!inv || inv.ownerId !== session.user.id) {
    // Allow superadmin
    if (session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const body = await req.json();

  const updated = await prisma.invitation.update({
    where: { id },
    data: {
      groomName: body.groomName,
      groomFullName: body.groomFullName || null,
      groomImage: body.groomImage || null,
      brideName: body.brideName,
      brideFullName: body.brideFullName || null,
      brideImage: body.brideImage || null,
      weddingDate: body.weddingDate ? new Date(body.weddingDate) : undefined,
      akadTime: body.akadTime || null,
      resepsiTime: body.resepsiTime || null,
      venueName: body.venueName,
      venueAddress: body.venueAddress,
      mapsEmbedUrl: body.mapsEmbedUrl || null,
      theme: body.theme,
      heroImage: body.heroImage || null,
      loveStory: body.loveStory || null,
      isPublished: body.isPublished,
    },
  });

  return NextResponse.json(updated);
}
