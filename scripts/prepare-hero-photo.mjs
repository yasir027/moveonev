/**
 * Prepares a studio product shot for the hero: crops to the subject and cuts out the
 * backdrop, keeping the floor shadow as a translucent one.
 *
 * Blending the backdrop away with `multiply` is not an option: the hero moves and tilts
 * the scooter, and those transforms create stacking contexts that isolate the blend from
 * the panel behind it. So the file needs real alpha.
 *
 * How the cut-out works:
 *   1. Key the near-white backdrop to pure white over a luminance ramp.
 *   2. Flood from the borders across white pixels — that's the backdrop, and interior
 *      whites (headlight, chrome) are never reached, so they stay.
 *   3. Flood one step further across light, near-neutral pixels — that's the floor
 *      shadow. It becomes soft black with alpha from how dark it was.
 *
 * Usage: node scripts/prepare-hero-photo.mjs <source> [outName]
 * e.g.   node scripts/prepare-hero-photo.mjs ./veloce-raw.webp veloce
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const [, , source, outName = "hero-photo"] = process.argv;

if (!source) {
  console.error("Usage: node scripts/prepare-hero-photo.mjs <source> [outName]");
  process.exit(1);
}

// Luminance ramp: at or above WHITE everything becomes pure white, below KEEP nothing changes.
const WHITE = 246;
const KEEP = 236;
// Margin kept around the subject, as a fraction of its size.
const MARGIN = 0.03;
const TARGET_HEIGHT = 1500;

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "Hero");
const outFile = path.join(outDir, `${outName}.webp`);

const luma = (r, g, b) => r * 0.3 + g * 0.59 + b * 0.11;

const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

// 1. Find the subject: anything clearly darker than the backdrop.
let minX = width;
let maxX = 0;
let minY = height;
let maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    if (luma(data[i], data[i + 1], data[i + 2]) < KEEP) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

if (maxX <= minX || maxY <= minY) {
  console.error("Found no subject — is the image blank?");
  process.exit(1);
}

// 2. Key the backdrop to pure white, with a soft ramp so edges stay clean.
for (let i = 0; i < data.length; i += channels) {
  const l = luma(data[i], data[i + 1], data[i + 2]);
  if (l >= WHITE) {
    data[i] = data[i + 1] = data[i + 2] = 255;
  } else if (l > KEEP) {
    const t = (l - KEEP) / (WHITE - KEEP);
    data[i] += (255 - data[i]) * t;
    data[i + 1] += (255 - data[i + 1]) * t;
    data[i + 2] += (255 - data[i + 2]) * t;
  }
}

// 3. Flood from the borders: pure white is backdrop, light neutral next to it is shadow.
const BACKDROP = 1;
const SHADOW = 2;
const region = new Uint8Array(width * height);
const stack = [];

for (let x = 0; x < width; x++) {
  stack.push(x, (height - 1) * width + x);
}
for (let y = 0; y < height; y++) {
  stack.push(y * width, y * width + width - 1);
}

const isWhite = (p) => data[p] === 255 && data[p + 1] === 255 && data[p + 2] === 255;
const isShadow = (p) => {
  const r = data[p];
  const g = data[p + 1];
  const b = data[p + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max - min < 16 && luma(r, g, b) > 165;
};

while (stack.length) {
  const cell = stack.pop();
  if (region[cell]) continue;
  const p = cell * channels;
  const white = isWhite(p);
  if (!white && !isShadow(p)) continue;
  region[cell] = white ? BACKDROP : SHADOW;
  const x = cell % width;
  const y = (cell - x) / width;
  if (x > 0) stack.push(cell - 1);
  if (x < width - 1) stack.push(cell + 1);
  if (y > 0) stack.push(cell - width);
  if (y < height - 1) stack.push(cell + width);
}

// 4. Apply: backdrop disappears, shadow becomes soft black.
for (let cell = 0; cell < region.length; cell++) {
  const p = cell * channels;
  if (region[cell] === BACKDROP) {
    data[p + 3] = 0;
  } else if (region[cell] === SHADOW) {
    const alpha = Math.max(0, Math.min(1, (252 - luma(data[p], data[p + 1], data[p + 2])) / 70));
    data[p] = 34;
    data[p + 1] = 38;
    data[p + 2] = 36;
    data[p + 3] = Math.round(alpha * 190);
  }
}

const marginX = Math.round((maxX - minX) * MARGIN);
const marginY = Math.round((maxY - minY) * MARGIN);
const left = Math.max(0, minX - marginX);
const top = Math.max(0, minY - marginY);
const cropW = Math.min(width - left, maxX - minX + marginX * 2);
const cropH = Math.min(height - top, maxY - minY + marginY * 2);

const out = await sharp(data, { raw: { width, height, channels } })
  .extract({ left, top, width: cropW, height: cropH })
  .resize({ height: TARGET_HEIGHT, withoutEnlargement: true })
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(outFile);

console.log(`subject ${minX},${minY} → ${maxX},${maxY} of ${width}x${height}`);
console.log(`wrote ${outFile} — ${out.width}x${out.height} (aspect ${out.width}/${out.height})`);
