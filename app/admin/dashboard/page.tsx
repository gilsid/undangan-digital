import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const invitation = await prisma.invitation.findFirst({
    where: { ownerId: session.user.id },
  });

  return <DashboardClient invitation={invitation} />;
}
