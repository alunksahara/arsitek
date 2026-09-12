export const DEFAULT_WHATSAPP_NUMBER = "6285736149999";

export function getWhatsAppNumber() {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || DEFAULT_WHATSAPP_NUMBER
  ).replace(/\D/g, "");
}

export function buildWhatsAppUrl(message: string) {
  const number = getWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
