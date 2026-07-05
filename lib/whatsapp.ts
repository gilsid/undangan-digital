export function generateWaLink(phone: string, message: string): string {
  // Normalize phone: strip non-digits, replace leading 0 with 62
  const normalized = phone
    .replace(/\D/g, "")
    .replace(/^0/, "62");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function generateInviteMessage(
  guestName: string,
  groomName: string,
  brideName: string,
  inviteUrl: string
): string {
  return `Kepada Yth. ${guestName},\n\nDengan penuh kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami:\n\n💑 ${groomName} & ${brideName}\n\nSilakan buka undangan digital Anda di:\n${inviteUrl}\n\nMerupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir. 🙏`;
}
