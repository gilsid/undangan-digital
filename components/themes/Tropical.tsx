"use client";

import type { Invitation, Wish } from "@prisma/client";
import ThemeLayout from "@/components/themes/template/ThemeLayout";
import { tropicalConfig } from "@/components/themes/config/tropical";
import TropicalCoverSection from "@/components/themes/sections/TropicalCoverSection";
import TropicalHeroSection from "@/components/themes/sections/TropicalHeroSection";
import QuoteSection from "@/components/themes/sections/QuoteSection";
import TropicalCoupleSection from "@/components/themes/sections/TropicalCoupleSection";
import TropicalEventSection from "@/components/themes/sections/TropicalEventSection";
import TropicalLoveStorySection from "@/components/themes/sections/TropicalLoveStorySection";
import GallerySection from "@/components/themes/sections/GallerySection";
import CountdownSection from "@/components/themes/sections/CountdownSection";
import RSVPSection from "@/components/themes/sections/RSVPSection";
import GiftSection from "@/components/themes/sections/GiftSection";
import TropicalWishesSection from "@/components/themes/sections/TropicalWishesSection";
import FooterSection from "@/components/themes/sections/FooterSection";

interface Props {
  invitation: Invitation;
  guestName?: string;
  wishes: Wish[];
}

export default function TropicalTheme({ invitation, guestName, wishes }: Props) {
  return (
    <ThemeLayout
      invitation={invitation}
      themeConfig={tropicalConfig}
      cover={<TropicalCoverSection invitation={invitation} guestName={guestName} />}
    >
      <TropicalHeroSection invitation={invitation} />
      <QuoteSection invitation={invitation} />
      <TropicalCoupleSection invitation={invitation} />
      <TropicalEventSection invitation={invitation} />
      <TropicalLoveStorySection invitation={invitation} />
      <GallerySection invitation={invitation} />
      <CountdownSection invitation={invitation} />
      <RSVPSection invitation={invitation} guestName={guestName} />
      <GiftSection invitation={invitation} />
      <TropicalWishesSection invitation={invitation} initialWishes={wishes} />
      <FooterSection invitation={invitation} />
    </ThemeLayout>
  );
}
