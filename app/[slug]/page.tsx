import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import ElegantTheme from "@/components/themes/Elegant";
import BohoTheme from "@/components/themes/Boho";
import TropicalTheme from "@/components/themes/Tropical";
import FoilBlueprintTheme from "@/components/themes/FoilBlueprint";
import TrackOpened from "./TrackOpened";
import type { Wish } from "@prisma/client";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const inv = await prisma.invitation.findUnique({ where: { slug } });
  if (!inv) return { title: "Undangan tidak ditemukan" };
  return {
    title: `Undangan ${inv.groomName} & ${inv.brideName}`,
    description: `Bergabunglah dalam perayaan pernikahan ${inv.groomName} & ${inv.brideName}`,
    robots: { index: false, follow: false },
    openGraph: {
      title: `Undangan ${inv.groomName} & ${inv.brideName}`,
      description: `Bergabunglah dalam perayaan pernikahan ${inv.groomName} & ${inv.brideName}`,
      images: [inv.heroImage ?? "/placeholders/hero.png"],
    },
  };
}

export default async function InvitationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { to } = await searchParams;

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
  });

  if (!invitation) notFound();
  if (!invitation.isPublished || invitation.isArchived) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f4ef]">
        <div className="text-center px-6">
          <p
            className="text-4xl font-light text-[#2c2c2c] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Undangan Belum Tersedia
          </p>
          <p className="text-[#6b6560] text-sm">
            Mohon tunggu, kami sedang mempersiapkan undangan ini.
          </p>
        </div>
      </div>
    );
  }

  let guestName: string | undefined;
  let guestCode: string | undefined;

  if (to) {
    const guest = await prisma.guest.findUnique({
      where: { uniqueCode: to, invitationId: invitation.id },
    });
    if (guest) {
      guestName = guest.name;
      guestCode = guest.uniqueCode;
    }
  }

  const wishes = await prisma.wish.findMany({
    where: { invitationId: invitation.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const ThemeComponent = resolveTheme(invitation.theme);

  return (
    <>
      {guestCode && <TrackOpened code={guestCode} />}
      <ThemeComponent
        invitation={invitation}
        guestName={guestName}
        wishes={wishes as Wish[]}
      />
    </>
  );
}

const themes: Record<string, typeof ElegantTheme> = {
  elegant: ElegantTheme,
  boho: BohoTheme,
  tropical: TropicalTheme,
  "foil-blueprint": FoilBlueprintTheme,
};

function resolveTheme(theme: string) {
  return themes[theme] ?? ElegantTheme;
}
