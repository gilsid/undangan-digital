import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/api-error";
import { invitationUpdateSchema } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

// PUT /api/invitations/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Ownership check
    const inv = await prisma.invitation.findUnique({ where: { id } });
    if (!inv || inv.ownerId !== session.user.id) {
      if (session.user.role !== "SUPERADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const body = await req.json();
    const parsed = invitationUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: `${parsed.error.issues[0].path.join(".")}: ${parsed.error.issues[0].message}` }, { status: 400 });
    }

    const data = parsed.data;
    const updated = await prisma.invitation.update({
      where: { id },
      data: {
        ...(data.groomName !== undefined && { groomName: data.groomName }),
        ...(data.groomFullName !== undefined && { groomFullName: data.groomFullName }),
        ...(data.groomImage !== undefined && { groomImage: data.groomImage }),
        ...(data.brideName !== undefined && { brideName: data.brideName }),
        ...(data.brideFullName !== undefined && { brideFullName: data.brideFullName }),
        ...(data.brideImage !== undefined && { brideImage: data.brideImage }),
        ...(data.weddingDate !== undefined && { weddingDate: new Date(data.weddingDate) }),
        ...(data.akadTime !== undefined && { akadTime: data.akadTime }),
        ...(data.resepsiTime !== undefined && { resepsiTime: data.resepsiTime }),
        ...(data.venueName !== undefined && { venueName: data.venueName }),
        ...(data.venueAddress !== undefined && { venueAddress: data.venueAddress }),
        ...(data.mapsEmbedUrl !== undefined && { mapsEmbedUrl: data.mapsEmbedUrl }),
        ...(data.theme !== undefined && { theme: data.theme }),
        ...(data.heroImage !== undefined && { heroImage: data.heroImage }),
        ...(data.gallery !== undefined && { gallery: data.gallery }),
        ...(data.loveStory !== undefined && { loveStory: data.loveStory }),
        ...(data.bankAccounts !== undefined && { bankAccounts: data.bankAccounts as unknown as Prisma.InputJsonValue }),
        ...(data.musicUrl !== undefined && { musicUrl: data.musicUrl }),
        ...(data.quoteText !== undefined && { quoteText: data.quoteText }),
        ...(data.quoteSource !== undefined && { quoteSource: data.quoteSource }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handlePrismaError(error);
  }
}
