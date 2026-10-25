import { FINISH, formatPrice, getModel } from "@/lib/models";

export interface Model {
  id: string;
  /** Its page: /models/<slug> (a slug from lib/models.ts). */
  slug: string;
  code: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  /** The photo's own aspect ratio, so overlays can match the contained image. */
  imageAspect: string;
  accent: string;
  range: string;
  topSpeed: string;
  priceFrom: string;
  costPerKm: string;
  // `inPhoto`: the photo's own paint, shown untinted. Every other colour is tinted on.
  colors: { name: string; hex: string; inPhoto: boolean }[];
  // Positions are % of the image itself (not the stage).
  hotspots: { x: string; y: string; label: string }[];
}

// TODO: replace the placeholders below with real business details.
export const WHATSAPP_NUMBER = "917893620380"; // international format (91 = India), no "+" or spaces
export const RIDER_COUNT = "2,400+";
export const GOOGLE_RATING = "4.9";
export const PETROL_COST_PER_KM = "RS 12";

// Photos prepared by scripts/prepare-hero-photo.mjs, which pads every one to this canvas.
const HERO_IMAGE_ASPECT = "1065/1123";

const HOTSPOT_LABELS = [
  "Full-LED projector headlamps",
  "Swappable battery under the seat",
  "Disc brake with regen braking",
] as const;

/** Headlamp, battery, brake — in that order — measured on each model's own photo. */
const hotspots = (...spots: [string, string][]): Model["hotspots"] =>
  spots.map(([x, y], index) => ({ x, y, label: HOTSPOT_LABELS[index] }));

/*
 * Colours, figures and price come from lib/models.ts (the XIDAA catalogue), so the hero
 * can't drift from the rest of the site. `photoFinish` is the paint in the photo: it goes
 * first and shows untinted. Leave it out when the photo isn't a catalogue colour.
 */
function catalogue(slug: string, photoFinish?: string) {
  const model = getModel(slug);
  if (!model) throw new Error(`No model "${slug}" in lib/models.ts`);
  const finishes = photoFinish
    ? [photoFinish, ...model.finishes.filter((name) => name !== photoFinish)]
    : model.finishes;
  return {
    slug,
    colors: finishes.map((name) => ({ name, hex: FINISH[name], inPhoto: name === photoFinish })),
    // "Up to 170 km" → "170 KM"
    range: model.range.replace(/^up to\s*/i, "").toUpperCase(),
    topSpeed: model.topSpeed.toUpperCase(),
    priceFrom: formatPrice(model.price),
  };
}

export const MODELS: Model[] = [
  {
    id: "double-light",
    ...catalogue("x-double-light", "Glossy Red"),
    code: "DOUBLE LIGHT",
    name: "X-DOUBLE LIGHT",
    tagline: "Smooth. Comfortable. Reliable.",
    description: "Designed with advanced technology and premium styling to deliver a smooth, comfortable and reliable riding experience.",
    image: "/Hero/Xdoublelight.webp",
    imageAspect: HERO_IMAGE_ASPECT,
    accent: "#42CE00",
    costPerKm: "RS 2",
    hotspots: hotspots(["20%", "46%"], ["66%", "41%"], ["24%", "74%"]),
  },
  {
    id: "torvo",
    // The photo is olive, which the catalogue doesn't list, so every colour is a tint
    // until a photo in a catalogue colour arrives.
    ...catalogue("x-torvo"),
    code: "TORVO",
    name: "X-TORVO",
    tagline: "Performance. Comfort. Smart.",
    description: "A perfect combination of performance, comfort and smart features for modern urban mobility.",
    // A new name, not the old file overwritten: browsers keep serving a cached photo at the
    // same address while the tint mask loads the new one, and the two stop lining up.
    image: "/Hero/XtorvoOlive.webp",
    imageAspect: HERO_IMAGE_ASPECT,
    accent: "#00A86B",
    costPerKm: "RS 2.2",
    hotspots: hotspots(["30%", "60%"], ["75%", "63%"], ["22%", "86%"]),
  },
  {
    id: "robox",
    ...catalogue("x-robox", "Golden Yellow"),
    code: "ROBOX",
    name: "X-ROBOX",
    tagline: "Comfort. Performance. Function.",
    description: "Designed to redefine urban commuting with comfort, performance and advanced functionality.",
    image: "/Hero/Xrobox.webp",
    imageAspect: HERO_IMAGE_ASPECT,
    accent: "#7DFF40",
    costPerKm: "RS 2.5",
    hotspots: hotspots(["29%", "45%"], ["72%", "38%"], ["24%", "82%"]),
  },
];

export const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export function whatsappUrl(model?: Model) {
  const text = `Hi MOVE ON, I'd like to book a free test ride${model ? ` of the ${model.name}` : ""}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// Greys and near-blacks have no usable hue.
export function isNeutral(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max < 60 || (max - min) / max < 0.25;
}
