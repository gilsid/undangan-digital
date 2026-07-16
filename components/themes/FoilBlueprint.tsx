"use client";

import type { Invitation, Wish } from "@prisma/client";
import ThemeLayout from "@/components/themes/template/ThemeLayout";
import { foilBlueprintConfig } from "@/components/themes/config/foil-blueprint";
import FoilCoverSection from "@/components/themes/sections/FoilCoverSection";
import FoilHeroSection from "@/components/themes/sections/FoilHeroSection";
import FoilQuoteSection from "@/components/themes/sections/FoilQuoteSection";
import FoilCoupleSection from "@/components/themes/sections/FoilCoupleSection";
import FoilEventSection from "@/components/themes/sections/FoilEventSection";
import FoilLoveStorySection from "@/components/themes/sections/FoilLoveStorySection";
import FoilGallerySection from "@/components/themes/sections/FoilGallerySection";
import FoilCountdownSection from "@/components/themes/sections/FoilCountdownSection";
import FoilRSVPSection from "@/components/themes/sections/FoilRSVPSection";
import FoilGiftSection from "@/components/themes/sections/FoilGiftSection";
import FoilWishesSection from "@/components/themes/sections/FoilWishesSection";
import FoilFooterSection from "@/components/themes/sections/FoilFooterSection";

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
      <FoilQuoteSection invitation={invitation} />
      <FoilCoupleSection invitation={invitation} />
      <FoilEventSection invitation={invitation} />
      <FoilLoveStorySection invitation={invitation} />
      <FoilGallerySection invitation={invitation} />
      <FoilCountdownSection invitation={invitation} />
      <FoilRSVPSection invitation={invitation} guestName={guestName} />
      <FoilGiftSection invitation={invitation} />
      <FoilWishesSection invitation={invitation} initialWishes={wishes} />
      <FoilFooterSection invitation={invitation} />
    </ThemeLayout>
  );
}