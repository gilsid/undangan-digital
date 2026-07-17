import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("suami123", 12);

  const user = await prisma.user.upsert({
    where: { email: "suami@gmail.com" },
    update: {},
    create: {
      email: "suami@gmail.com",
      password,
      role: "COUPLE",
    },
  });

  console.log(`Seeded user: ${user.email} (${user.role})`);

  // Create a sample invitation for the user
  const existing = await prisma.invitation.findFirst({
    where: { ownerId: user.id },
  });

  if (!existing) {
    const inv = await prisma.invitation.create({
      data: {
        slug: "test-undangan",
        ownerId: user.id,
        groomName: "Ahmad",
        groomFullName: "Ahmad Fauzi",
        brideName: "Siti",
        brideFullName: "Siti Nurhaliza",
        weddingDate: new Date("2026-08-17"),
        venueName: "Gedung Serbaguna",
        venueAddress: "Jl. Merdeka No. 1, Jakarta",
        theme: "elegant",
        isPublished: true,
      },
    });
    console.log(`Seeded invitation: ${inv.slug}`);
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
