/**
 * The showroom, in one place: the home page's lead-in to the footer (ShowroomLead in
 * SiteFooter), the footer's Visit column and the contact section (GetInTouch) read from here.
 */
import { WHATSAPP_NUMBER } from "@/lib/heroModels";

// WHATSAPP_NUMBER carries the country code; the local number is what follows it.
const LOCAL = WHATSAPP_NUMBER.replace(/^91/, "");

export const SHOWROOM = {
  name: "MOVE ON Showroom",
  addressLines: ["Shabbir Medical Hall building", "Afzal Gunj, Hyderabad"],
  area: "Afzal Gunj",
  city: "Hyderabad",
  /** Indian mobile, the same line as WhatsApp. */
  phone: { display: `+91 ${LOCAL.slice(0, 5)} ${LOCAL.slice(5)}`, tel: `+${WHATSAPP_NUMBER}` },
  hours: { label: "Mon–Sat, 10am – 8pm" },
  /** Google share link for the building; opens Maps / Search on the place. */
  mapsUrl: "https://share.google/kqXIeEfAfQR2Vq3ru",
} as const;
