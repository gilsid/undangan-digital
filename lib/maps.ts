export function extractMapsEmbedSrc(input?: string | null): string | null {
if (!input) return null;
const iframeMatch = input.match(/src=["']([^"']+)["']/i);
const url = iframeMatch ? iframeMatch[1] : input.trim();
if (/^https:\/\/(www\.)?google\.com\/maps\/embed/i.test(url)) return url;
if (/^https:\/\/(www\.)?google\.com\/maps\//i.test(url)) return url;
return null;
}
