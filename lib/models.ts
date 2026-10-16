/*
 * Model data. No "use client" on purpose: the /models/[slug] page is a server component
 * and can't read anything exported from a client file.
 *
 * Per-model data lives in `models`; shared platform and product details are defined once.
 * Icons are string keys so these values can safely cross the server/client boundary.
 */

export type BatteryId = "30ah" | "55ah";

export type IconKey =
  | "key" | "remote" | "card" | "watch" | "wrench" | "fire" | "water"
  | "laser" | "nickel" | "app" | "balancer" | "fast" | "cycle";

export interface Model {
  /** Hand-written so a URL doesn't change when someone edits the display name. */
  slug: string;
  name: string;
  blurb: string;
  /** List price and offer price for each battery pack. */
  pricing: Record<BatteryId, { mrp: number; offer: number }>;
  /** Lowest offer price across both battery options. */
  price: number;
  range: string;
  topSpeed: string;
  load: string;
  motor: string;
  finishes: string[];
  image: string | null;
  gallery?: string[];
  /** Finish-specific image; falls back to `image` if a finish has no entry. */
  colorImages?: Record<string, string>;
}

type ModelInput = Pick<
  Model,
  "slug" | "name" | "blurb" | "pricing" | "motor" | "finishes" | "image"
> & { gallery?: string[]; colorImages?: Record<string, string> };

/*
 * Shared platform specs. Range varies by battery, so the model cards can advertise
 * the maximum while the battery selector shows the selected pack's range.
 */
const PLATFORM = {
  range: "Up to 170 km",
  topSpeed: "25 km/h",
  load: "150 kg",
} as const;

const define = (m: ModelInput): Model => ({
  ...PLATFORM,
  ...m,
  price: Math.min(...Object.values(m.pricing).map((p) => p.offer)),
});

export const models: Model[] = [
  define({
    slug: "x-double-light",
    name: "X Double Light",
    blurb: "Designed with advanced technology and premium styling to deliver a smooth, comfortable and reliable riding experience.",
    pricing: {
      "30ah": { mrp: 66000, offer: 61999 },
      "55ah": { mrp: 90000, offer: 85999 },
    },
    motor: "1000 W",
    finishes: ["Glossy Red", "Glossy Black", "Glossy Grey", "Matte Blue", "Ivory White"],
    image: "/Lineup/xdoublelight.png",
  }),
  define({
    slug: "x-ozone",
    name: "X-Ozone",
    blurb: "A distinctive electric scooter with smart features and a clean, contemporary design.",
    pricing: {
      "30ah": { mrp: 80000, offer: 73999 },
      "55ah": { mrp: 102000, offer: 97999 },
    },
    motor: "Confirm motor power",
    finishes: ["Ice Blue", "Orange", "Matte Green", "Matte Blue", "Ivory White"],
    image: "/Lineup/xozone.png",
  }),
  define({
    slug: "x-orl-cheetah",
    name: "X-ORL Cheetah",
    blurb: "A sporty electric scooter combining standout styling with comfortable everyday usability.",
    pricing: {
      "30ah": { mrp: 82000, offer: 77999 },
      "55ah": { mrp: 106000, offer: 101999 },
    },
    motor: "Confirm motor power",
    finishes: ["Glossy Red", "Glossy Black", "Glossy Grey", "Matte Green", "Matte Beige", "Glossy Blue"],
    image: "/Lineup/xorlcheetah.png",
  }),
  define({
    slug: "x-robox",
    name: "X-Robox",
    blurb: "Designed to redefine urban commuting with comfort, performance and advanced functionality.",
    pricing: {
      "30ah": { mrp: 90000, offer: 85999 },
      "55ah": { mrp: 115000, offer: 109999 },
    },
    motor: "Confirm motor power",
    finishes: ["Golden Yellow", "Aqua Blue", "Beige Gold"],
    image: "/Lineup/xrobox.png",
  }),
  define({
    slug: "x-torvo",
    name: "X-Torvo",
    blurb: "A perfect combination of performance, comfort and smart features for modern urban mobility.",
    pricing: {
      "30ah": { mrp: 82000, offer: 77999 },
      "55ah": { mrp: 106000, offer: 101999 },
    },
    motor: "Confirm motor power",
    finishes: ["Creme", "Light Blue", "Ivory White", "Glossy Red", "Dark Blue"],
    image: null,
  }),
  define({
    slug: "x-e4",
    name: "X-E4",
    blurb: "A practical, modern electric scooter designed for comfortable everyday mobility.",
    pricing: {
      "30ah": { mrp: 82000, offer: 77999 },
      "55ah": { mrp: 106000, offer: 101999 },
    },
    motor: "Confirm motor power",
    finishes: ["Glossy Red", "Glossy Black", "Glossy Grey", "Matte Blue", "Ivory White", "Matte Green"],
    image: null,
  }),
  define({
    slug: "x-fx-big-activa",
    name: "X-FX Big Activa",
    blurb: "A bold, practical electric scooter built for everyday rides and dependable utility.",
    pricing: {
      "30ah": { mrp: 80000, offer: 73999 },
      "55ah": { mrp: 102000, offer: 97999 },
    },
    motor: "Confirm motor power",
    finishes: ["Glossy Red", "Glossy Black", "Glossy Grey", "Matte Blue", "Ivory White", "Matte Green"],
    image: null,
  }),
  define({
    slug: "x-lambretta",
    name: "X-Lambretta",
    blurb: "A stylish electric scooter with a distinctive silhouette and a refined finish.",
    pricing: {
      "30ah": { mrp: 90000, offer: 85999 },
      "55ah": { mrp: 115000, offer: 109999 },
    },
    motor: "Confirm motor power",
    finishes: ["Glacier Blue", "Rose Pearl", "Glossy Green"],
    image: null,
  }),
];

export const getModel = (slug: string) => models.find((m) => m.slug === slug);

export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Split the series letter from the rest of the model name. */
export const splitName = (name: string): [string, string] => {
  const at = name.indexOf(" ");
  return at === -1 ? ["", name] : [name.slice(0, at), name.slice(at + 1)];
};

/** Named finishes and their swatch colours. */
export const FINISH: Record<string, string> = {
  "Glossy Red": "#C8102E",
  "Glossy Black": "#14181A",
  "Glossy Grey": "#8A9199",
  "Glossy Green": "#1F7A4D",
  "Glossy Blue": "#1E5FA8",
  "Matte Blue": "#2E4A7D",
  "Matte Green": "#4A5D4A",
  "Matte Beige": "#C9BCA6",
  "Ivory White": "#F2EFE6",
  Creme: "#EADFC8",
  "Light Blue": "#9FC7E8",
  "Dark Blue": "#1B2B57",
  "Golden Yellow": "#E8B33A",
  "Aqua Blue": "#4FB8C9",
  "Beige Gold": "#CBB48A",
  "Glacier Blue": "#BCD6E3",
  "Rose Pearl": "#E3BFC4",
  "Ice Blue": "#D6E8EF",
  Orange: "#E8722A",
};

export const START_METHODS: { icon: IconKey; title: string; body: string }[] = [
  { icon: "key", title: "Key start", body: "Turn the key and ride, the way you always have." },
  { icon: "remote", title: "Remote start", body: "Start the scooter from the remote fob." },
  { icon: "card", title: "NFC smart card", body: "Start with the NFC smart card — no key needed." },
  { icon: "watch", title: "NFC smart watch", body: "Start with the NFC smart watch on your wrist." },
];

export const SMART_FEATURES = [
  "Anti-theft alarm",
  "Side stand sensor",
  "Parking switch",
  "Reverse gear",
  "USB charger",
  "In-built Bluetooth speaker",
  "NFC smart card",
  "NFC smart watch",
  "Cruise controller (optional)",
];

export const BATTERIES: {
  id: BatteryId;
  label: string;
  range: string;
  cells: string;
  warranty: string;
}[] = [
  {
    id: "30ah",
    label: "60V / 30AH",
    range: "70–80 km",
    cells: "LFP cells · smart BMS",
    warranty: "2+1 years / 40,000 km",
  },
  {
    id: "55ah",
    label: "60V / 55AH",
    range: "160–170 km",
    cells: "LFP cells · smart BMS",
    warranty: "2+1 years / 40,000 km",
  },
];

export const BATTERY_PROTECTION: { icon: IconKey; label: string }[] = [
  { icon: "fire", label: "Fire and heat proof" },
  { icon: "water", label: "IP67 water proof" },
  { icon: "laser", label: "Laser welding" },
  { icon: "nickel", label: "Pure nickel strips" },
  { icon: "app", label: "Battery health tracker app" },
  { icon: "balancer", label: "J.K. active balancer" },
  { icon: "fast", label: "Fast charging" },
  { icon: "cycle", label: "2,000 charge cycles" },
];

export const BATTERY_APP =
  "Monitor your battery in real time with the JK BMS app. Track charge percentage, cell voltage, temperature, charging status and overall battery health from your phone.";

export const CHARGERS = [
  { label: "60V / 6A", time: "4–5 hours" },
  { label: "60V / 10A", time: "2–3 hours" },
];

export const IN_THE_BOX: { icon: IconKey; title: string; body: string }[] = [
  {
    icon: "wrench",
    title: "All-in-one tool kit",
    body: "Flat wrenches 8, 10 and 15 mm plus 14GE, inner hex keys 2 to 6 mm, socket hex 8, 9 and 10 mm, flathead and Phillips screwdrivers, and a sleeve extension rod.",
  }
];

export const WARRANTY = [
  { part: "Motor", cover: "2 years" },
  { part: "Controller", cover: "2 years" },
  { part: "Battery", cover: "2+1 years / 40,000 km" },
  { part: "Charger", cover: "1 year" },
];

export const WARRANTY_NOTE = "No battery warranty in case of deep discharge.";

export function specRows(m: Model): [string, string][] {
  return [
    ["Net weight", "90 kg (with battery)"],
    ["Top speed", m.topSpeed],
    ["Range", "70–80 km (30AH) · 160–170 km (55AH)"],
    ["Motor type", "BLDC heavy duty"],
    ["Motor power", m.motor],
    ["Brake", "Front disc"],
    ["Load capacity", m.load],
    ["Tyres", "90/100-12 tubeless"],
    ["Speedometer", "Digital coloured display"],
    ["Head and tail light", "LED with DRL"],
    ["Suspension", "Front hydraulic telescopic, rear auto-adjustable shocker with dual tube technology"],
    ["Body", "Plastic"],
    ["Ground clearance", "270 mm"],
    ["Seat height", "750 mm"],
    ["Wheels", "Alloy"],
  ];
}
