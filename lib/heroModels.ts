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
  // Each colour has its own photo; the first is the model's own (`image`).
  colors: { name: string; hex: string; image: string }[];
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
 * can't drift from the rest of the site. `photo` shows `photoFinish` and goes first; every
 * other colour's photo is made from it by scripts/recolor-hero-photo.mjs, into
 * public/Hero/colors/<slug>-<finish>.webp, until real photos of each colour exist.
 */
function catalogue(slug: string, photo: string, photoFinish: string) {
  const model = getModel(slug);
  if (!model) throw new Error(`No model "${slug}" in lib/models.ts`);
  const finishes = [photoFinish, ...model.finishes.filter((name) => name !== photoFinish)];
  const recolored = (name: string) =>
    `/Hero/colors/${slug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.webp`;
  return {
    slug,
    image: photo,
    colors: finishes.map((name) => ({
      name,
      hex: FINISH[name],
      image: name === photoFinish ? photo : recolored(name),
    })),
    // "Up to 170 km" → "170 KM"
    range: model.range.replace(/^up to\s*/i, "").toUpperCase(),
    topSpeed: model.topSpeed.toUpperCase(),
    priceFrom: formatPrice(model.price),
  };
}

export const MODELS: Model[] = [
  {
    id: "double-light",
    // Photos get a new name rather than overwriting the old file, or browsers keep showing
    // the cached one.
    ...catalogue("x-double-light", "/Hero/XdoublelightRed.webp", "Glossy Red"),
    code: "DOUBLE LIGHT",
    name: "X-DOUBLE LIGHT",
    tagline: "Smooth. Comfortable. Reliable.",
    description: "Designed with advanced technology and premium styling to deliver a smooth, comfortable and reliable riding experience.",
    imageAspect: HERO_IMAGE_ASPECT,
    accent: "#42CE00",
    costPerKm: "RS 2",
    hotspots: hotspots(["22%", "52%"], ["57%", "60%"], ["13%", "84%"]),
  },
  {
    id: "torvo",
    ...catalogue("x-torvo", "/Hero/XtorvoCreme.webp", "Creme"),
    code: "TORVO",
    name: "X-TORVO",
    tagline: "Performance. Comfort. Smart.",
    description: "A perfect combination of performance, comfort and smart features for modern urban mobility.",
    imageAspect: HERO_IMAGE_ASPECT,
    accent: "#00A86B",
    costPerKm: "RS 2.2",
    hotspots: hotspots(["28%", "53%"], ["64%", "59%"], ["16%", "85%"]),
  },
  {
    id: "robox",
    ...catalogue("x-robox", "/Hero/XroboxYellow.webp", "Golden Yellow"),
    code: "ROBOX",
    name: "X-ROBOX",
    tagline: "Comfort. Performance. Function.",
    description: "Designed to redefine urban commuting with comfort, performance and advanced functionality.",
    imageAspect: HERO_IMAGE_ASPECT,
    accent: "#7DFF40",
    costPerKm: "RS 2.5",
    hotspots: hotspots(["21%", "53%"], ["80%", "52%"], ["18%", "87%"]),
  },
];

export const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export function whatsappUrl(model?: Model) {
  const text = `Hi MOVE ON, I'd like to book a free test ride${model ? ` of the ${model.name}` : ""}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
