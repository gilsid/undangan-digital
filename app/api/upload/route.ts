import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { isRateLimited } from "@/lib/rateLimit";

const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg",
];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (await isRateLimited(`upload:${session.user.id}`, 10, 60000)) {
      return NextResponse.json({ error: "Terlalu banyak upload. Silakan coba lagi nanti." }, { status: 429 });
    }

    const fd = await req.formData();
    const file = fd.get("file") as File;
    if (!file) return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Tipe file tidak didukung. Gunakan JPEG, PNG, WebP, GIF, atau MP3." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Ukuran file terlalu besar. Maksimum 5 MB." }, { status: 400 });
    }

    const folder = (fd.get("folder") as string) || "undangan-digital";

    const buffer = Buffer.from(await file.arrayBuffer());
    const b64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "auto",
    });

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengunggah file" }, { status: 500 });
  }
}
