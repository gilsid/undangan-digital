import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RsvpClient from "./RsvpClient";
import type { Rsvp, Wish } from "@prisma/client";

export default async function RSVPPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const invitation = await prisma.invitation.findFirst({
    where: { ownerId: session.user.id },
    include: {
      rsvps: { orderBy: { createdAt: "desc" } },
      wishes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!invitation) redirect("/admin/dashboard");

  return (
    <RsvpClient
      invitation={invitation}
      rsvps={invitation.rsvps as Rsvp[]}
      wishes={invitation.wishes as Wish[]}
    />
  );
}
