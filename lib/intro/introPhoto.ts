/**
 * The scooter the site intro draws as a blueprint, and where the logo's M lies on its face.
 *
 * Swapping the scooter is a data change only:
 *   1. `node scripts/prepare-hero-photo.mjs <source> scooter-front`, then move the output
 *      to /public/intro/ (the cut-out photo);
 *   2. `node scripts/prepare-intro-blueprint.mjs` (the blueprint line art, same size);
 *   3. update the size below and re-pick the four `face` points.
 *
 * The M is laid on the face in perspective, through its four corners, so it can lie on a
 * scooter shot from any angle: foreshortened on a three-quarter view, or square on a front
 * view. The intro then straightens it as it rises to the centre.
 */
export const INTRO_PHOTO = {
  src: "/intro/scooter-front.webp",
  /** Edge line art generated from `src`: what the intro actually shows. */
  blueprint: "/intro/scooter-blueprint.webp",
  /** Natural size, px. */
  w: 844,
  h: 1500,
  /**
   * Where the M's corners land on the photo, px: its horn tips on the front panel's two
   * top corners, its bolt tips where the headlamps' LED strips end. The M's legs then run
   * down the LED strips and its V follows the nose.
   */
  face: {
    leftHorn: [250, 410],
    rightHorn: [585, 408],
    leftTip: [315, 775],
    rightTip: [538, 775],
  },
} as const;
