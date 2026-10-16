/**
 * Blueprint line art from a cut-out photo: volt edges on transparency, the same pixel size
 * as the input. Shared by prepare-intro-blueprint.mjs and prepare-footer-blueprint.mjs.
 *
 * How it works:
 *   1. Greyscale + a light blur, so paint texture and noise don't read as edges.
 *   2. Sobel gradient magnitude, kept only where the photo is opaque.
 *   3. The (thresholded) alpha channel's edge is added, so the silhouette is always a
 *      clean line and the translucent floor shadow is ignored.
 *   4. Magnitude -> alpha over a ramp (LOW..HIGH), with a gamma to keep fine lines faint.
 */
import sharp from "sharp";

// Gradient magnitudes (0-255 scale) mapped to line alpha.
const LOW = 12;
const HIGH = 55;
const GAMMA = 1.15;
const BLUR = 1.1;
const VOLT = [125, 255, 64];

/**
 * `colour` and `mask` are sharp inputs of the same size: the photo the inner detail is
 * read from, and the image whose alpha says where the scooter is. Usually the same file.
 */
export async function toBlueprint(colour, mask = colour) {
  const { width, height } = await sharp(colour).metadata();
  const grey = await sharp(colour).flatten({ background: "#000" }).greyscale().blur(BLUR).raw().toBuffer();
  // Solid parts only: the cut-out's soft floor shadow would otherwise draw as speckle.
  const alpha = await sharp(mask).ensureAlpha().extractChannel(3).threshold(225).blur(0.5).raw().toBuffer();

  /** Sobel magnitude of a single-channel image, at (x, y). */
  function sobel(src, x, y) {
    const p = (dx, dy) => src[Math.min(height - 1, Math.max(0, y + dy)) * width + Math.min(width - 1, Math.max(0, x + dx))];
    const gx = -p(-1, -1) - 2 * p(-1, 0) - p(-1, 1) + p(1, -1) + 2 * p(1, 0) + p(1, 1);
    const gy = -p(-1, -1) - 2 * p(0, -1) - p(1, -1) + p(-1, 1) + 2 * p(0, 1) + p(1, 1);
    return Math.hypot(gx, gy) / 4;
  }

  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      // Inner detail only where the scooter is; its outline comes from the alpha edge.
      const inner = alpha[i] > 200 ? sobel(grey, x, y) : 0;
      const edge = Math.max(inner, sobel(alpha, x, y));
      const a = Math.min(1, Math.max(0, (edge - LOW) / (HIGH - LOW))) ** GAMMA;
      rgba[i * 4] = VOLT[0];
      rgba[i * 4 + 1] = VOLT[1];
      rgba[i * 4 + 2] = VOLT[2];
      rgba[i * 4 + 3] = Math.round(a * 255);
    }
  }
  return { rgba, width, height };
}

export function writeBlueprint({ rgba, width, height }, out) {
  return sharp(rgba, { raw: { width, height, channels: 4 } }).webp({ quality: 90, alphaQuality: 90 }).toFile(out);
}
