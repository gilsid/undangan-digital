import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SuperadminClient from "./SuperadminClient";

export default async function SuperadminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") {
    redirect("/admin/login");
  }

  const invitations = await prisma.invitation.findMany({
    include: {
      owner: { select: { email: true } },
      _count: { select: { guests: true, rsvps: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return <SuperadminClient invitations={invitations} />;
}
