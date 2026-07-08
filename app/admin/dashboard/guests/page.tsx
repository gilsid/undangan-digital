import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import GuestsClient from "./GuestsClient";

export default async function GuestsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const invitation = await prisma.invitation.findFirst({
    where: { ownerId: session.user.id },
    include: { guests: { orderBy: { createdAt: "desc" } } },
  });

  if (!invitation) redirect("/admin/dashboard");

  return (
    <GuestsClient
      invitation={invitation}
      guests={invitation.guests}
      accountEmail={session.user.email ?? undefined}
    />
  );
}
