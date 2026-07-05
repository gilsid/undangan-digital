import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/invitations — create new invitation (for users who don't have one yet)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Only one invitation per user
  const existing = await prisma.invitation.findFirst({
    where: { ownerId: session.user.id },
  });
  if (existing) {
    return NextResponse.json({ error: "Already has invitation" }, { status: 400 });
  }

  const inv = await prisma.invitation.create({
    data: {
      ownerId: session.user.id,
      slug: body.slug ?? `undangan-${Date.now()}`,
      groomName: body.groomName ?? "",
      groomFullName: body.groomFullName,
      brideName: body.brideName ?? "",
      brideFullName: body.brideFullName,
      weddingDate: body.weddingDate ? new Date(body.weddingDate) : new Date(),
      akadTime: body.akadTime,
      resepsiTime: body.resepsiTime,
      venueName: body.venueName ?? "",
      venueAddress: body.venueAddress ?? "",
      mapsEmbedUrl: body.mapsEmbedUrl,
      theme: body.theme ?? "elegant",
      heroImage: body.heroImage,
      loveStory: body.loveStory,
    },
  });

  return NextResponse.json(inv, { status: 201 });
}
