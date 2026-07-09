import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const invitation = await prisma.invitation.findFirst({
    where: { ownerId: session.user.id },
  });

  if (invitation?.isArchived) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--ink-bg)" }}>
        <div className="ledger-card max-w-md text-center">
          <p className="font-display text-lg text-[var(--text-primary)] mb-2">Akun sedang tidak aktif</p>
          <p className="text-sm text-[var(--text-secondary)]">
            Akses ke dashboard undangan ini sedang dinonaktifkan sementara.
            Silakan hubungi admin untuk informasi lebih lanjut atau perpanjangan masa aktif.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
