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

  const theme = body.theme ?? "elegant";
  const heroImage = body.heroImage ?? `/placeholders/${theme}/hero.png`;
  const groomImage = body.groomImage ?? `/placeholders/${theme}/groom.png`;
  const brideImage = body.brideImage ?? `/placeholders/${theme}/bride.png`;
  const gallery = body.gallery ?? [
    `/placeholders/${theme}/gallery1.png`,
    `/placeholders/${theme}/gallery2.png`,
    `/placeholders/${theme}/gallery3.png`,
    `/placeholders/${theme}/gallery4.png`,
  ];

  const inv = await prisma.invitation.create({
    data: {
      ownerId: session.user.id,
      slug: body.slug ?? `undangan-${Date.now()}`,
      groomName: body.groomName ?? "",
      groomFullName: body.groomFullName,
      groomImage,
      brideName: body.brideName ?? "",
      brideFullName: body.brideFullName,
      brideImage,
      weddingDate: body.weddingDate ? new Date(body.weddingDate) : new Date(),
      akadTime: body.akadTime,
      resepsiTime: body.resepsiTime,
      venueName: body.venueName ?? "",
      venueAddress: body.venueAddress ?? "",
      mapsEmbedUrl: body.mapsEmbedUrl,
      theme,
      heroImage,
      gallery,
      loveStory: body.loveStory,
    },
  });

  return NextResponse.json(inv, { status: 201 });
}
