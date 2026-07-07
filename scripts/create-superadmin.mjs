import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@undangan.local"; // ganti sesuai mau kamu
  const password = "GantiPasswordIni123"; // ganti dengan password kuat

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed, role: "SUPERADMIN" },
  });

  console.log("Superadmin dibuat:", user.email);
}

main().finally(() => prisma.$disconnect());
