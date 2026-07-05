import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/wishes
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.invitationId || !body.name || !body.message) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  const inv = await prisma.invitation.findUnique({
    where: { id: body.invitationId },
  });
  if (!inv || !inv.isPublished) {
    return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
  }

  const wish = await prisma.wish.create({
    data: {
      invitationId: body.invitationId,
      name: body.name,
      message: body.message,
    },
  });

  return NextResponse.json(wish, { status: 201 });
}

// GET /api/wishes?invitationId=xxx
export async function GET(req: NextRequest) {
  const invitationId = req.nextUrl.searchParams.get("invitationId");
  if (!invitationId) return NextResponse.json([]);

  const wishes = await prisma.wish.findMany({
    where: { invitationId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(wishes);
}
