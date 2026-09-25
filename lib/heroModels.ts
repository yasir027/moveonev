export interface Model {
  id: string;
  code: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  /** The photo's own aspect ratio, so overlays can match the contained image. */
  imageAspect: string;
  /** Wheels cut out by scripts/build-wheel-sprites.mjs, so they can really turn. */
  wheels: {
    /** One rebuilt wheel, shared by both positions. */
    sprite: string;
    /** What sits in front of the wheel here — mudguard and fork, or motor housing. */
    cover: string;
    /** Centre of the wheel, in % of the photo. */
    cx: string;
    cy: string;
    /** Box sizes, in % of the photo's width. */
    size: string;
    coverSize: string;
    /** Brightness for a wheel sitting in the bike's shade, so it doesn't look pasted on. */
    dim?: number;
    /** The ellipse the wheel projects to: rotate by `tilt`, then squash. */
    tilt: number;
    squash: number;
    /** Photo pixels, so spin can follow the distance travelled. */
    radiusPx: number;
  }[];
  accent: string;
  range: string;
  topSpeed: string;
  priceFrom: string;
  costPerKm: string;
  // The first colour is the one in the photo and is shown untinted.
  colors: { name: string; hex: string }[];
  // Positions are % of the image itself (not the stage).
  hotspots: { x: string; y: string; label: string }[];
}

// TODO: replace the placeholders below with real business details.
export const WHATSAPP_NUMBER = "923000000000"; // international format, no "+" or spaces
export const RIDER_COUNT = "2,400+";
export const GOOGLE_RATING = "4.9";
export const PETROL_COST_PER_KM = "PKR 12";

// Prepared by scripts/prepare-hero-photo.mjs: cropped to the subject and cut out, with its
// floor shadow kept as a translucent one.
const HERO_IMAGE = "/Hero/veloce-l-body.webp";
const HERO_IMAGE_ASPECT = "1065/1123";

// Printed by scripts/build-wheel-sprites.mjs — re-run it after changing the photo.
const SHARED_WHEELS: Model["wheels"] = [
  {
    sprite: "/Hero/veloce-l-wheel.webp",
    cover: "/Hero/veloce-l-cover-front.webp",
    cx: "19.249%",
    cy: "78.540%",
    size: "38.122%",
    coverSize: "39.249%",
    tilt: 121.9,
    squash: 0.8128,
    radiusPx: 203,
  },
  {
    sprite: "/Hero/veloce-l-wheel.webp",
    cover: "/Hero/veloce-l-cover-rear.webp",
    cx: "83.099%",
    cy: "74.354%",
    size: "22.160%",
    coverSize: "23.286%",
    tilt: 121.9,
    squash: 0.8128,
    radiusPx: 118,
    dim: 0.78,
  },
];

const SHARED_HOTSPOTS: Model["hotspots"] = [
  { x: "20%", y: "46%", label: "Full-LED projector headlamps" },
  { x: "66%", y: "41%", label: "Swappable battery under the seat" },
  { x: "24%", y: "74%", label: "Disc brake with regen braking" },
];

export const MODELS: Model[] = [
  {
    id: "x1",
    code: "X1",
    name: "MOVE ON X1",
    tagline: "Urban. Agile. Effortless.",
    description: "Designed for everyday city riding with effortless handling and confident performance. A perfect blend of agility and efficiency for the daily commuter.",
    image: HERO_IMAGE,
    imageAspect: HERO_IMAGE_ASPECT,
    wheels: SHARED_WHEELS,
    accent: "#42CE00",
    range: "150 KM",
    topSpeed: "80 KM/H",
    priceFrom: "PKR 289,000",
    costPerKm: "PKR 2",
    colors: [
      { name: "Crimson Matte", hex: "#8B1A1F" },
      { name: "Graphite", hex: "#2C2C2C" },
      { name: "Arctic White", hex: "#F5F5F5" },
      { name: "Volt Green", hex: "#42CE00" },
    ],
    hotspots: SHARED_HOTSPOTS,
  },
  {
    id: "x2",
    code: "X2",
    name: "MOVE ON X2",
    tagline: "Bolder. Faster. Further.",
    description: "More range, more power and more presence. Built with an extended chassis and upgraded motor for riders who want more from every journey.",
    image: HERO_IMAGE,
    imageAspect: HERO_IMAGE_ASPECT,
    wheels: SHARED_WHEELS,
    accent: "#00A86B",
    range: "190 KM",
    topSpeed: "95 KM/H",
    priceFrom: "PKR 349,000",
    costPerKm: "PKR 2.2",
    colors: [
      { name: "Crimson", hex: "#8B0000" },
      { name: "Midnight Blue", hex: "#1A2530" },
      { name: "Emerald", hex: "#00A86B" },
    ],
    hotspots: SHARED_HOTSPOTS,
  },
  {
    id: "pro",
    code: "PRO",
    name: "MOVE ON PRO",
    tagline: "Performance. Refined.",
    description: "Our flagship electric scooter. Dual motors, active suspension, and aerospace-grade materials combine for a refined, unmistakably premium ride.",
    image: HERO_IMAGE,
    imageAspect: HERO_IMAGE_ASPECT,
    wheels: SHARED_WHEELS,
    accent: "#7DFF40",
    range: "220 KM",
    topSpeed: "110 KM/H",
    priceFrom: "PKR 429,000",
    costPerKm: "PKR 2.5",
    colors: [
      { name: "Crimson Matte", hex: "#8B1A1F" },
      { name: "Carbon Black", hex: "#111111" },
      { name: "Titanium Silver", hex: "#C0C0C0" },
      { name: "Neon Pulse", hex: "#7DFF40" },
    ],
    hotspots: SHARED_HOTSPOTS,
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
