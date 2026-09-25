/**
 * Turns the intro's cut-out scooter photo into blueprint line art: volt edges on
 * transparency, the same pixel size as the photo so INTRO_PHOTO's alignment still holds.
 *
 * How it works:
 *   1. Greyscale + a light blur, so paint texture and noise don't read as edges.
 *   2. Sobel gradient magnitude, kept only where the photo is opaque.
 *   3. The (thresholded) alpha channel's edge is added, so the silhouette is always a
 *      clean line and the translucent floor shadow is ignored.
 *   4. Magnitude -> alpha over a ramp (LOW..HIGH), with a gamma to keep fine lines faint.
 *
 * Usage: node scripts/prepare-intro-blueprint.mjs [source] [out]
 * defaults: public/intro/scooter-front.webp -> public/intro/scooter-blueprint.webp
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const [, , source = path.join(root, "public/intro/scooter-front.webp"), out = path.join(root, "public/intro/scooter-blueprint.webp")] =
  process.argv;

// Gradient magnitudes (0-255 scale) mapped to line alpha.
const LOW = 12;
const HIGH = 55;
const GAMMA = 1.15;
const BLUR = 1.1;
const VOLT = [125, 255, 64];

const { width, height } = await sharp(source).metadata();
const grey = await sharp(source).flatten({ background: "#000" }).greyscale().blur(BLUR).raw().toBuffer();
// Solid parts only: the cut-out's soft floor shadow would otherwise draw as speckle.
const alpha = await sharp(source).ensureAlpha().extractChannel(3).threshold(225).blur(0.5).raw().toBuffer();

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

await sharp(rgba, { raw: { width, height, channels: 4 } }).webp({ quality: 90, alphaQuality: 90 }).toFile(out);
console.log(`wrote ${path.relative(root, out)} — ${width}x${height}`);
