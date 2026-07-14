import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createInvitationSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createInvitationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { email, password, groomName, brideName, weddingDate, venueName, venueAddress, theme } = parsed.data;

    // Generate slug from groom+bride names
    const slug = `${groomName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${brideName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`.replace(/-+/g, "-").replace(/^-|-$/g, "");

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
