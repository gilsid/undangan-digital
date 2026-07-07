import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
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

    if (password.length < 8) {
      return NextResponse.json({ error: "Password minimal 8 karakter" }, { status: 400 });
    }

    // Validate slug regex (lowercase, numbers, dash only)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)" }, { status: 400 });
    }

    // Check user unique
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
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

    const theme = "elegant";
    const heroImage = `/placeholders/${theme}/hero.png`;
    const groomImage = `/placeholders/${theme}/groom.png`;
    const brideImage = `/placeholders/${theme}/bride.png`;
    const gallery = [
      `/placeholders/${theme}/gallery1.png`,
      `/placeholders/${theme}/gallery2.png`,
      `/placeholders/${theme}/gallery3.png`,
      `/placeholders/${theme}/gallery4.png`,
    ];

    const invitation = await prisma.invitation.create({
      data: {
        ownerId: user.id,
        slug,
        groomName,
        brideName,
        groomImage,
        brideImage,
        weddingDate: new Date(weddingDate),
        venueName: venueName ?? "",
        venueAddress: venueAddress ?? "",
        theme,
        heroImage,
        gallery,
      },
    });

    return NextResponse.json({ user: { id: user.id, email }, invitation });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan server saat membuat undangan" }, { status: 500 });
  }
}
