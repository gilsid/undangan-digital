import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { isRateLimited } from "@/lib/rateLimit";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
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
    if (!file) {
      return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF." },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Ukuran file terlalu besar. Maksimum 5 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return NextResponse.json({ url: `${process.env.R2_PUBLIC_URL}/${key}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengunggah file" }, { status: 500 });
  }
}
