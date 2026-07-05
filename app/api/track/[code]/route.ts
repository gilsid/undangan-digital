import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/track/[code] — update openedAt once
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const guest = await prisma.guest.findUnique({ where: { uniqueCode: code } });
  if (guest && !guest.openedAt) {
    await prisma.guest.update({
      where: { uniqueCode: code },
      data: { openedAt: new Date() },
    });
  }

  return NextResponse.json({ ok: true });
}
