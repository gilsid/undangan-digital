import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rateLimit";

// POST /api/wishes
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";
    if (await isRateLimited(`${ip}:wishes`, 5, 60000)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Silakan coba lagi nanti." },
        { status: 429 }
      );
    }

    const body = await req.json();

    if (!body.invitationId || !body.name || !body.message) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const inv = await prisma.invitation.findUnique({
      where: { id: body.invitationId },
    });
    if (!inv || !inv.isPublished || inv.isArchived) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    const wish = await prisma.wish.create({
      data: {
        invitationId: body.invitationId,
        name: body.name.trim(),
        message: body.message.trim(),
      },
    });

    return NextResponse.json(wish, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengirim ucapan" }, { status: 500 });
  }
}

// GET /api/wishes?invitationId=xxx
export async function GET(req: NextRequest) {
  try {
    const invitationId = req.nextUrl.searchParams.get("invitationId");
    if (!invitationId) return NextResponse.json([]);

    const wishes = await prisma.wish.findMany({
      where: { invitationId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(wishes);
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}
