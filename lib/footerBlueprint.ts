/**
 * The footer's side-elevation drawing (scripts/prepare-footer-blueprint.mjs). The
 * measurements are fractions of the image, as printed by that script — re-run it and
 * paste them back here if the image changes, or the dimension lines drift off the axles.
 */
export const FOOTER_BLUEPRINT = {
  src: "/footer/scooter-side.webp",
  width: 1850,
  height: 1381,
  rearAxle: { x: 0.1641, y: 0.8187 },
  frontAxle: { x: 0.8616, y: 0.8187 },
  wheelRadius: 0.1218, // of the width
  ground: 0.9819,
  top: 0.0174,
  rearmost: 0.013,
  frontmost: 0.9865,
} as const;
