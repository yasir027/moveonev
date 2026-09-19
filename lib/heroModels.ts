export interface Model {
  id: string;
  code: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
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

const HERO_IMAGE = "/Hero/bike.png";
// The hero photo's pixel size, so overlays can match the contained image.
export const HERO_IMAGE_ASPECT = "768/1365";

const SHARED_HOTSPOTS: Model["hotspots"] = [
  { x: "22%", y: "45%", label: "Full-LED projector headlamps" },
  { x: "77%", y: "34%", label: "Swappable battery under the seat" },
  { x: "31%", y: "80%", label: "Disc brake with regen braking" },
];

export const MODELS: Model[] = [
  {
    id: "x1",
    code: "X1",
    name: "MOVE ON X1",
    tagline: "Urban. Agile. Effortless.",
    description: "Designed for everyday city riding with effortless handling and confident performance. A perfect blend of agility and efficiency for the daily commuter.",
    image: HERO_IMAGE,
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
