/**
 * The scooter photo the site intro reveals, and where the logo's M sits on its face.
 *
 * Swapping the photo is a data change only: prepare the new shot with
 * `node scripts/prepare-hero-photo.mjs <source> <name>` (move the output to
 * /public/intro/), then update the size and re-tune `m` until the M lies on the cowl
 * and headlamps.
 *
 * TODO: stand-in (a three-quarter view of bike.png). Replace with a straight front-view
 * shot, where the symmetric M can line up exactly.
 */
export const INTRO_PHOTO = {
  src: "/intro/scooter-front.webp",
  /** Natural size, px. */
  w: 766,
  h: 1244,
  /** The M's box (logo units x 534–936, y 300–742) on the photo: top-left and width, px. */
  m: { x: 150, y: 70, w: 390 },
} as const;
