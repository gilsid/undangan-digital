"use client";

import type { Invitation, Wish } from "@prisma/client";
import ThemeLayout from "@/components/themes/template/ThemeLayout";
import { bohoConfig } from "@/components/themes/config/boho";
import BohoCoverSection from "@/components/themes/sections/BohoCoverSection";
import BohoHeroSection from "@/components/themes/sections/BohoHeroSection";
import QuoteSection from "@/components/themes/sections/QuoteSection";
import BohoCoupleSection from "@/components/themes/sections/BohoCoupleSection";
import BohoEventSection from "@/components/themes/sections/BohoEventSection";
import LoveStorySection from "@/components/themes/sections/LoveStorySection";
import GallerySection from "@/components/themes/sections/GallerySection";
import CountdownSection from "@/components/themes/sections/CountdownSection";
import RSVPSection from "@/components/themes/sections/RSVPSection";
import GiftSection from "@/components/themes/sections/GiftSection";
import BohoWishesSection from "@/components/themes/sections/BohoWishesSection";
import FooterSection from "@/components/themes/sections/FooterSection";

interface Props {
  invitation: Invitation;
  guestName?: string;
  wishes: Wish[];
}

export default function BohoTheme({ invitation, guestName, wishes }: Props) {
  return (
    <ThemeLayout
      invitation={invitation}
      themeConfig={bohoConfig}
      cover={<BohoCoverSection invitation={invitation} guestName={guestName} />}
    >
      <BohoHeroSection invitation={invitation} />
      <QuoteSection invitation={invitation} />
      <BohoCoupleSection invitation={invitation} />
      <BohoEventSection invitation={invitation} />
      <LoveStorySection invitation={invitation} />
      <GallerySection invitation={invitation} />
      <CountdownSection invitation={invitation} />
      <RSVPSection invitation={invitation} guestName={guestName} />
      <GiftSection invitation={invitation} />
      <BohoWishesSection invitation={invitation} initialWishes={wishes} />
      <FooterSection invitation={invitation} />
    </ThemeLayout>
  );
}
