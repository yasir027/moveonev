/**
 * Background blueprints: the footer's lime line art, at different angles so no two pages
 * look alike. The model drawings (all front three-quarter) come from
 * scripts/prepare-blueprints.mjs, sizes as it prints them; `front` is the intro's front-on
 * drawing and `side` the footer's side profile. Shown by components/ui/BlueprintBg.tsx.
 */
export const BLUEPRINTS = {
  doublelight: { src: "/blueprints/doublelight.webp", width: 549, height: 900 },
  ozone: { src: "/blueprints/ozone.webp", width: 605, height: 900 },
  cheetah: { src: "/blueprints/cheetah.webp", width: 587, height: 900 },
  robox: { src: "/blueprints/robox.webp", width: 635, height: 900 },
  torvo: { src: "/blueprints/torvo.webp", width: 550, height: 900 },
  e4: { src: "/blueprints/e4.webp", width: 516, height: 900 },
  fh: { src: "/blueprints/fh.webp", width: 535, height: 900 },
  lambretta: { src: "/blueprints/lambretta.webp", width: 524, height: 900 },
  /** The rear three-quarter view (from CTABike.png). */
  rear: { src: "/blueprints/rear.webp", width: 795, height: 900 },
  /** Straight on from the front: the intro's drawing. */
  front: { src: "/intro/scooter-blueprint.webp", width: 844, height: 1500 },
  /** Side profile: the footer's drawing. Landscape, so give it less height than the rest. */
  side: { src: "/footer/scooter-side.webp", width: 1850, height: 1381 },
} as const;

export type BlueprintName = keyof typeof BLUEPRINTS;

/** Each model page shows its own scooter's outline. */
const MODEL_BLUEPRINT: Record<string, BlueprintName> = {
  "x-double-light": "doublelight",
  "x-ozone": "ozone",
  "x-orl-cheetah": "cheetah",
  "x-robox": "robox",
  "x-torvo": "torvo",
  "x-e4": "e4",
  "x-fh-big-activa": "fh",
  "x-lambretta": "lambretta",
};

export function blueprintForModel(slug: string): BlueprintName {
  return MODEL_BLUEPRINT[slug] ?? "side";
}

/** For blog articles, by the post's place in the list, so neighbouring posts always differ
    in both angle and model (`flip` mirrors a three-quarter view to face the other way). */
const ARTICLE_POOL: { name: BlueprintName; flip?: boolean }[] = [
  { name: "side" },
  { name: "rear" },
  { name: "cheetah", flip: true },
  { name: "front" },
  { name: "e4" },
];

export function blueprintForArticle(index: number) {
  return ARTICLE_POOL[Math.max(0, index) % ARTICLE_POOL.length];
}
