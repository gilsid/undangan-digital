"use client";

import type { Invitation, Wish } from "@prisma/client";
import ThemeLayout from "@/components/themes/template/ThemeLayout";
import { foilBlueprintConfig } from "@/components/themes/config/foil-blueprint";
import FoilCoverSection from "@/components/themes/sections/FoilCoverSection";
import FoilHeroSection from "@/components/themes/sections/FoilHeroSection";
import QuoteSection from "@/components/themes/sections/QuoteSection";
import FoilCoupleSection from "@/components/themes/sections/FoilCoupleSection";
import FoilEventSection from "@/components/themes/sections/FoilEventSection";
import LoveStorySection from "@/components/themes/sections/LoveStorySection";
import GallerySection from "@/components/themes/sections/GallerySection";
import CountdownSection from "@/components/themes/sections/CountdownSection";
import RSVPSection from "@/components/themes/sections/RSVPSection";
import GiftSection from "@/components/themes/sections/GiftSection";
import FoilWishesSection from "@/components/themes/sections/FoilWishesSection";
import FooterSection from "@/components/themes/sections/FooterSection";

interface Props {
  invitation: Invitation;
  guestName?: string;
  wishes: Wish[];
}

export default function FoilBlueprintTheme({ invitation, guestName, wishes }: Props) {
  return (
    <ThemeLayout
      invitation={invitation}
      themeConfig={foilBlueprintConfig}
      cover={<FoilCoverSection invitation={invitation} guestName={guestName} />}
      musicToggle={(playing, toggle) => (
        <button
          onClick={toggle}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:border-[var(--foil-gold)]"
          style={{ background: "#1a1e27", border: "1px solid rgba(216,185,120,0.35)" }}
          aria-label={playing ? "Matikan musik" : "Putar musik"}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d8b978" strokeWidth="1.5">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d8b978" strokeWidth="1.5">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
      )}
    >
      <FoilHeroSection invitation={invitation} />
      <QuoteSection invitation={invitation} />
      <FoilCoupleSection invitation={invitation} />
      <FoilEventSection invitation={invitation} />
      <LoveStorySection invitation={invitation} />
      <GallerySection invitation={invitation} />
      <CountdownSection invitation={invitation} />
      <RSVPSection invitation={invitation} guestName={guestName} />
      <GiftSection invitation={invitation} />
      <FoilWishesSection invitation={invitation} initialWishes={wishes} />
      <FooterSection invitation={invitation} />
    </ThemeLayout>
  );
}