/**
 * The scooter the site intro draws as a blueprint, and where the logo's M lies on its face.
 *
 * Swapping the scooter is a data change only:
 *   1. `node scripts/prepare-hero-photo.mjs <source> scooter-front`, then move the output
 *      to /public/intro/ (the cut-out photo);
 *   2. `node scripts/prepare-intro-blueprint.mjs` (the blueprint line art, same size);
 *   3. update the size below;
 *   4. redraw the M over the new blueprint (open intro-m-fit.svg, move its points) and
 *      re-run `scripts/import-intro-m.mjs` to regenerate lib/intro/mOnFace.ts.
 *
 * The M is not fitted by code: it is drawn by hand onto the blueprint, then the intro
 * traces that drawing and morphs it into the real logo as it rises to the centre.
 */
export const INTRO_PHOTO = {
  src: "/intro/scooter-front.webp",
  /** Edge line art generated from `src`: what the intro actually shows. */
  blueprint: "/intro/scooter-blueprint.webp",
  /** Natural size, px. */
  w: 844,
  h: 1500,
} as const;
