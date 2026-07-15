"use client";

import type { Invitation, Wish } from "@prisma/client";
import ThemeLayout from "@/components/themes/template/ThemeLayout";
import { minimalistConfig } from "@/components/themes/config/minimalist";
import CoverSection from "@/components/themes/sections/CoverSection";
import HeroSection from "@/components/themes/sections/HeroSection";
import QuoteSection from "@/components/themes/sections/QuoteSection";
import CoupleSection from "@/components/themes/sections/CoupleSection";
import EventSection from "@/components/themes/sections/EventSection";
import LoveStorySection from "@/components/themes/sections/LoveStorySection";
import GallerySection from "@/components/themes/sections/GallerySection";
import CountdownSection from "@/components/themes/sections/CountdownSection";
import RSVPSection from "@/components/themes/sections/RSVPSection";
import GiftSection from "@/components/themes/sections/GiftSection";
import WishesSection from "@/components/themes/sections/WishesSection";
import FooterSection from "@/components/themes/sections/FooterSection";

interface Props {
  invitation: Invitation;
  guestName?: string;
  wishes: Wish[];
}

export default function MinimalistTheme({ invitation, guestName, wishes }: Props) {
  return (
    <ThemeLayout
      invitation={invitation}
      themeConfig={minimalistConfig}
      cover={<CoverSection invitation={invitation} guestName={guestName} />}
    >
      <HeroSection invitation={invitation} />
      <QuoteSection invitation={invitation} />
      <CoupleSection invitation={invitation} />
      <EventSection invitation={invitation} />
      <LoveStorySection invitation={invitation} />
      <GallerySection invitation={invitation} />
      <CountdownSection invitation={invitation} />
      <RSVPSection invitation={invitation} guestName={guestName} />
      <GiftSection invitation={invitation} />
      <WishesSection invitation={invitation} initialWishes={wishes} />
      <FooterSection invitation={invitation} />
    </ThemeLayout>
  );
}
