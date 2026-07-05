import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    email,
    password,
    slug,
    groomName,
    brideName,
    weddingDate,
    venueName,
    venueAddress,
  } = body;

  if (!email || !password || !slug || !groomName || !brideName || !weddingDate) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  // Check slug unique
  const existingSlug = await prisma.invitation.findUnique({ where: { slug } });
  if (existingSlug) {
    return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  const invitation = await prisma.invitation.create({
    data: {
      ownerId: user.id,
      slug,
      groomName,
      brideName,
      weddingDate: new Date(weddingDate),
      venueName: venueName ?? "",
      venueAddress: venueAddress ?? "",
    },
  });

  return NextResponse.json({ user: { id: user.id, email }, invitation });
}
