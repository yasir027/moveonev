/*
 * Model data. No "use client" on purpose: the /models/[slug] page is a server component
 * and can't read anything exported from a client file.
 *
 * Two kinds of data live here, kept apart on purpose:
 *   - per-model: what actually differs between scooters (name, motor, finishes, photos).
 *   - shared:    everything else on the XIDAA sheet, written once. Every model runs the
 *                same platform, so eight copies would just be eight chances to drift.
 *
 * Icons are string keys, not components: a component can't cross the server → client
 * boundary as a prop, and models get passed to both.
 */

/* The two packs XIDAA ships. Price is a function of this, so it's a type, not a string. */
export type BatteryId = "30ah" | "45ah";

export type IconKey =
  | "key"
  | "remote"
  | "card"
  | "watch"
  | "wrench"
  | "fire"
  | "water"
  | "laser"
  | "nickel"
  | "app"
  | "balancer"
  | "fast"
  | "cycle";

/* ---------------------------------------------------------------------------------
   PER-MODEL
--------------------------------------------------------------------------------- */

export interface Model {
  /** Hand-written, so a URL doesn't change when someone edits the display name. */
  slug: string;
  name: string;
  blurb: string;
  /** Per battery pack: the list price, and the offer price the customer actually pays. */
  pricing: Record<BatteryId, { mrp: number; offer: number }>;
  /** Lowest offer price, filled in by define(). Cards and the price filter read this. */
  price: number;
  /** Platform values, filled in by define(). The cards read these. */
  range: string;
  topSpeed: string;
  load: string;
  /** The one spec the sheet varies by model. */
  motor: string;
  finishes: string[];
  image: string | null;
  /** Extra photos. Falls back to `image` alone when absent. */
  gallery?: string[];
  /** One photo per finish name. A finish with no entry falls back to `image`, so the
      picker still works before every colour has been shot. */
  colorImages?: Record<string, string>;
}

type ModelInput = Pick<
  Model,
  "slug" | "name" | "blurb" | "pricing" | "motor" | "finishes" | "image"
> & { gallery?: string[]; colorImages?: Record<string, string> };

/* The range is the span across both packs: 30AH starts at 70, 45AH tops out at 120.
   Saying "100+ km" would only be true of the bigger pack. */
const PLATFORM = {
  range: "70–120 km",
  topSpeed: "25 km/h",
  load: "150 kg",
} as const;

const define = (m: ModelInput): Model => ({
  ...PLATFORM,
  ...m,
  price: Math.min(...Object.values(m.pricing).map((p) => p.offer)),
});

/* One model for now. To add another, copy this shape — it needs a unique slug, a blurb
   and a price, or TypeScript will say so. */
export const models: Model[] = [
  define({
    slug: "x-double-light",
    name: "X Double Light",
    blurb:
      "Designed with advanced technology and premium styling to deliver a smooth, comfortable and reliable riding experience.",
    pricing: {
      "30ah": { mrp: 66000, offer: 61999 },
      "45ah": { mrp: 90000, offer: 85999 },
    },
    motor: "1000 W",
    finishes: [
      "Glossy Red",
      "Glossy Black",
      "Glossy Grey",
      "Matte Blue",
      "Ivory White",
    ],
    image: "/Lineup/xdoublelight.png",
  }),

  /*
   * Next up. Copy one, fill the TODOs, move it above this comment.
   * The sheet only says "1200/1500 W" for everything except Double Light, so each
   * motor below needs confirming per model.
   *
   * X-Torvo     — "A perfect combination of performance, comfort and smart features for modern urban mobility."
   *               motor: TODO · finishes: Creme, Light Blue, Ivory White, Glossy Red, Dark Blue
   * X-Robox     — "Designed to redefine urban commuting with comfort, performance and advanced functionality."
   *               motor: TODO · finishes: Golden Yellow, Aqua Blue, Beige Gold · image: /Lineup/xrobox.png
   * X-Lambretta — blurb TODO · motor: TODO · finishes: Glacier Blue, Rose Pearl, Glossy Green
   * X-ORL Cheetah — blurb TODO · motor: TODO · image: /Lineup/xorlcheetah.png
   *               finishes: Glossy Red, Glossy Black, Glossy Grey, Matte Green, Matte Beige, Glossy Blue
   * X-E4        — blurb TODO · motor: TODO
   *               finishes: Glossy Red, Glossy Black, Glossy Grey, Matte Blue, Ivory White, Matte Green
   * X-FH        — blurb TODO · motor: TODO · same finishes as X-E4
   * X-Ozone     — blurb TODO · motor: TODO · image: /Lineup/xozone.png
   *               finishes: Ice Blue, Orange, Matte Green, Matte Blue, Ivory White
   */
];

export const getModel = (slug: string) => models.find((m) => m.slug === slug);

export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* Named finishes, as they appear on the price list. */
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

/* ---------------------------------------------------------------------------------
   SHARED — straight from the XIDAA sheet
--------------------------------------------------------------------------------- */

/* The four ways to start. The most distinctive thing on the sheet, so it leads. */
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

/* Two packs only. The sheet's battery graphic prints 110–130 km for the 45AH while its
   own tables say 110–120; the tables are used here. */
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
    id: "45ah",
    label: "60V / 45AH",
    range: "110–120 km",
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
  },
  {
    icon: "key",
    title: "Scooty key set",
    body: "Keys, remote fobs, NFC smart cards and the NFC smart watch — every way to start it, in one set.",
  },
];

export const WARRANTY = [
  { part: "Motor", cover: "2 years" },
  { part: "Controller", cover: "2 years" },
  { part: "Battery", cover: "2+1 years / 40,000 km" },
  { part: "Charger", cover: "1 year" },
];

/* The sheet prints this in red. Hiding it only moves the argument to the counter. */
export const WARRANTY_NOTE = "No battery warranty in case of deep discharge.";

/* The full spec table: the sheet's key highlights, with this model's own motor. */
export function specRows(m: Model): [string, string][] {
  return [
    ["Net weight", "90 kg (with battery)"],
    ["Top speed", m.topSpeed],
    ["Range", "70–80 km (30AH) · 110–120 km (45AH)"],
    ["Motor type", "BLDC heavy duty"],
    ["Motor power", m.motor],
    ["Brake", "Front disc"],
    ["Load capacity", m.load],
    ["Tyres", "90/100-12 tubeless"],
    ["Speedometer", "Digital coloured display"],
    ["Head and tail light", "LED with DRL"],
    [
      "Suspension",
      "Front hydraulic telescopic, rear auto-adjustable shocker with dual tube technology",
    ],
    ["Body", "Plastic"],
    ["Ground clearance", "270 mm"],
    ["Seat height", "750 mm"],
    ["Wheels", "Alloy"],
  ];
}