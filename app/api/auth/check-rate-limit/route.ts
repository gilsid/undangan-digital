import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
  }

  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0] ?? "127.0.0.1";

  if (isRateLimited(`login:${ip}:${email}`, 10, 60000)) {
    return NextResponse.json(
      { limited: true, message: "Terlalu banyak percobaan login. Silakan coba lagi nanti." },
      { status: 429 }
    );
  }

  return NextResponse.json({ limited: false });
}
