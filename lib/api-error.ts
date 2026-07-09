import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export function handlePrismaError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Data tidak ditemukan. Mungkin sudah dihapus atau diubah dari tempat lain — coba muat ulang halaman." },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Data serupa sudah ada." },
        { status: 409 }
      );
    }
  }
  console.error("Unhandled API error:", error);
  return NextResponse.json(
    { error: "Terjadi kesalahan pada server. Silakan coba lagi." },
    { status: 500 }
  );
}
