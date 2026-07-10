import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rateLimit";

// GET /api/track/[code] — update openedAt once
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const forwarded = _req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0] ?? "127.0.0.1";
    if (await isRateLimited(`track:${ip}`, 30, 60000)) {
      return NextResponse.json({ ok: false });
    }

    const { code } = await params;

    const guest = await prisma.guest.findUnique({ where: { uniqueCode: code } });
    if (guest && !guest.openedAt) {
      await prisma.guest.update({
        where: { uniqueCode: code },
        data: { openedAt: new Date() },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    // Public endpoint — never expose errors to the guest
    return NextResponse.json({ ok: false });
  }
}
