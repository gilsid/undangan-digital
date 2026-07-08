"use client";

import { extractMapsEmbedSrc } from "@/lib/maps";

interface Props {
mapsEmbedUrl?: string | null;
linkLabel?: string;
linkClassName?: string;
iframeHeight?: number;
iframeClassName?: string;
iframeStyle?: React.CSSProperties;
}

export function isValidMapsUrl(url?: string | null) {
return extractMapsEmbedSrc(url) !== null;
}

export function getMapsSrc(url?: string | null) {
return extractMapsEmbedSrc(url);
}

export default function MapsEmbed({
mapsEmbedUrl,
linkLabel = "Buka Google Maps",
linkClassName = "",
iframeHeight = 240,
iframeClassName = "",
iframeStyle,
}: Props) {
const src = extractMapsEmbedSrc(mapsEmbedUrl);
if (!src) return null;

if (src.includes("/maps/embed")) {
return (
<iframe
src={src}
width="100%"
height={iframeHeight}
style={{ border: 0, ...iframeStyle }}
className={iframeClassName}
allowFullScreen
loading="lazy"
title="Lokasi acara"
/>
);
}

return (
<a
href={src}
target="_blank"
rel="noopener noreferrer"
className={linkClassName}
>
{linkLabel}
</a>
);
}
