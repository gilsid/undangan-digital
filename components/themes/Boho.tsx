"use client";

import type { Invitation, Wish } from "@prisma/client";
import ThemeLayout from "@/components/themes/template/ThemeLayout";
import { bohoConfig } from "@/components/themes/config/boho";
import BohoCoverSection from "@/components/themes/sections/BohoCoverSection";
import BohoHeroSection from "@/components/themes/sections/BohoHeroSection";
import BohoQuoteSection from "@/components/themes/sections/BohoQuoteSection";
import BohoCoupleSection from "@/components/themes/sections/BohoCoupleSection";
import BohoEventSection from "@/components/themes/sections/BohoEventSection";
import BohoLoveStorySection from "@/components/themes/sections/BohoLoveStorySection";
import BohoGallerySection from "@/components/themes/sections/BohoGallerySection";
import BohoCountdownSection from "@/components/themes/sections/BohoCountdownSection";
import BohoRSVPSection from "@/components/themes/sections/BohoRSVPSection";
import BohoGiftSection from "@/components/themes/sections/BohoGiftSection";
import BohoWishesSection from "@/components/themes/sections/BohoWishesSection";
import BohoFooterSection from "@/components/themes/sections/BohoFooterSection";

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
      <BohoQuoteSection invitation={invitation} />
      <BohoCoupleSection invitation={invitation} />
      <BohoEventSection invitation={invitation} />
      <BohoLoveStorySection invitation={invitation} />
      <BohoGallerySection invitation={invitation} />
      <BohoCountdownSection invitation={invitation} />
      <BohoRSVPSection invitation={invitation} guestName={guestName} />
      <BohoGiftSection invitation={invitation} />
      <BohoWishesSection invitation={invitation} initialWishes={wishes} />
      <BohoFooterSection invitation={invitation} />
    </ThemeLayout>
  );
}
