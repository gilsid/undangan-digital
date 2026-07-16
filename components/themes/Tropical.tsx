"use client";

import type { Invitation, Wish } from "@prisma/client";
import ThemeLayout from "@/components/themes/template/ThemeLayout";
import { tropicalConfig } from "@/components/themes/config/tropical";
import TropicalCoverSection from "@/components/themes/sections/TropicalCoverSection";
import TropicalHeroSection from "@/components/themes/sections/TropicalHeroSection";
import TropicalQuoteSection from "@/components/themes/sections/TropicalQuoteSection";
import TropicalCoupleSection from "@/components/themes/sections/TropicalCoupleSection";
import TropicalEventSection from "@/components/themes/sections/TropicalEventSection";
import TropicalLoveStorySection from "@/components/themes/sections/TropicalLoveStorySection";
import TropicalGallerySection from "@/components/themes/sections/TropicalGallerySection";
import TropicalCountdownSection from "@/components/themes/sections/TropicalCountdownSection";
import TropicalRSVPSection from "@/components/themes/sections/TropicalRSVPSection";
import TropicalGiftSection from "@/components/themes/sections/TropicalGiftSection";
import TropicalWishesSection from "@/components/themes/sections/TropicalWishesSection";
import TropicalFooterSection from "@/components/themes/sections/TropicalFooterSection";

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
      <TropicalQuoteSection invitation={invitation} />
      <TropicalCoupleSection invitation={invitation} />
      <TropicalEventSection invitation={invitation} />
      <TropicalLoveStorySection invitation={invitation} />
      <TropicalGallerySection invitation={invitation} />
      <TropicalCountdownSection invitation={invitation} />
      <TropicalRSVPSection invitation={invitation} guestName={guestName} />
      <TropicalGiftSection invitation={invitation} />
      <TropicalWishesSection invitation={invitation} initialWishes={wishes} />
      <TropicalFooterSection invitation={invitation} />
    </ThemeLayout>
  );
}
