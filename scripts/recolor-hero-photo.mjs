/**
 * Makes one hero photo per catalogue colour from a single prepared hero photo, until real
 * photos of every colour exist.
 *
 * A CSS tint can only shift hue over the whole scooter, so black came out dark red and
 * white came out grey. This recolours the painted panels only, in Lab space:
 *   1. Mask the paint: pixels near the photo's own paint hue and saturation (seat, tyres,
 *      chrome, lights and decals fall outside it). Feathered so edges don't step.
 *   2. Take the paint's typical lightness and chroma as the reference.
 *   3. Move each paint pixel to the target colour, keeping its shading relative to the
 *      reference: shadows scale toward black, highlights toward white, so creases and
 *      glare survive whether the target is lighter or darker than the photo.
 *
 * Colour values come from FINISH in lib/models.ts, so swatches and photos agree.
 *
 * Usage: node scripts/recolor-hero-photo.mjs <model>
 *   e.g. node scripts/recolor-hero-photo.mjs x-torvo
 * Writes public/Hero/colors/<model>-<finish>.webp for every finish but the photo's own.
 */
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/*
 * Per photo: which finish it already shows, and how to recognise its paint. Hue in degrees
 * (a range may wrap past 360), saturation and value 0–1. Measured on each photo; a new
 * photo needs its own numbers.
 */
const PHOTOS = {
  "x-double-light": {
    src: "public/Hero/XdoublelightRed.webp",
    own: "Glossy Red",
    // Low saturation floor: the glossy reflections on the cowl are pale red.
    paint: { hue: [335, 15], minSat: 0.15, minVal: 0.12 },
  },
  "x-torvo": {
    src: "public/Hero/XtorvoCreme.webp",
    own: "Creme",
    paint: { hue: [25, 55], minSat: 0.08, maxSat: 0.45, minVal: 0.35 },
  },
  "x-robox": {
    src: "public/Hero/XroboxYellow.webp",
    own: "Golden Yellow",
    // Reaches into pale highlights and dark gold shading; the amber reflectors sit below
    // hue 30, so the edge is feathered over 4° only to leave them orange.
    paint: { hue: [34, 62], minSat: 0.2, minVal: 0.1, feather: 4 },
  },
};

// The model's finishes and their swatch colours, read from lib/models.ts.
function catalogue(slug) {
  const ts = readFileSync(path.join(root, "lib/models.ts"), "utf8");
  const block = ts.slice(ts.indexOf(`slug: "${slug}"`));
  const finishes = JSON.parse(block.match(/finishes:\s*(\[[^\]]*\])/)[1]);
  const table = ts.slice(ts.indexOf("export const FINISH"));
  const hex = (name) => {
    const key = /^\w+$/.test(name) ? name : `"${name}"`;
    const found = table.match(new RegExp(`(?:^|\\s)${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:\\s*"(#[0-9A-Fa-f]{6})"`));
    if (!found) throw new Error(`No FINISH colour for "${name}" in lib/models.ts`);
    return found[1];
  };
  return finishes.map((name) => ({ name, hex: hex(name) }));
}

// sRGB (0–255) ↔ CIE Lab (D65).
const toLinear = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c) => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
const fInv = (t) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) / (24389 / 27));
function rgbToLab(r, g, b) {
  const [R, G, B] = [toLinear(r), toLinear(g), toLinear(b)];
  const x = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047;
  const y = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  const z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}
function labToRgb(L, a, b) {
  const fy = (L + 16) / 116;
  const x = 0.95047 * fInv(fy + a / 500);
  const y = fInv(fy);
  const z = 1.08883 * fInv(fy - b / 200);
  const R = 3.2406 * x - 1.5372 * y - 0.4986 * z;
  const G = -0.9689 * x + 1.8758 * y + 0.0415 * z;
  const B = 0.0557 * x - 0.204 * y + 1.057 * z;
  return [R, G, B].map((c) => Math.max(0, Math.min(255, Math.round(fromLinear(Math.max(0, c))))));
}

const smooth = (lo, hi, v) => Math.max(0, Math.min(1, (v - lo) / (hi - lo)));

// How much a pixel is paint, 0–1.
function paintWeight(r, g, b, paint) {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const d = max - min;
  const sat = max ? d / max : 0;
  let h = 0;
  if (d) {
    const [R, G, B] = [r / 255, g / 255, b / 255];
    h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  const [h0, h1] = paint.hue;
  const span = (h1 - h0 + 360) % 360;
  const into = (h - h0 + 360) % 360;
  // Distance outside the hue range, in degrees; feathered over 8° unless a photo says less.
  const out = into <= span ? 0 : Math.min(into - span, 360 - into);
  const hueW = 1 - smooth(0, paint.feather ?? 8, out);
  const satW = smooth(paint.minSat - 0.04, paint.minSat + 0.04, sat) *
    (paint.maxSat ? 1 - smooth(paint.maxSat - 0.04, paint.maxSat + 0.04, sat) : 1);
  const valW = smooth(paint.minVal - 0.04, paint.minVal + 0.04, max);
  return hueW * satW * valW;
}

const slug = process.argv[2];
const photo = PHOTOS[slug];
if (!photo) {
  console.error(`Usage: node scripts/recolor-hero-photo.mjs <${Object.keys(PHOTOS).join("|")}>`);
  process.exit(1);
}

const { data, info } = await sharp(path.join(root, photo.src)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const count = width * height;

// 1. Paint mask, softened by a pixel so it doesn't speckle.
const rawMask = Buffer.alloc(count);
for (let i = 0; i < count; i++) {
  const p = i * 4;
  rawMask[i] = data[p + 3] < 8 ? 0 : Math.round(255 * paintWeight(data[p], data[p + 1], data[p + 2], photo.paint));
}
const mask = await sharp(rawMask, { raw: { width, height, channels: 1 } }).blur(0.8).extractChannel(0).raw().toBuffer();

// 2. Reference: median lightness and chroma of solid paint.
const lab = new Float32Array(count * 3);
const Ls = [];
const Cs = [];
for (let i = 0; i < count; i++) {
  const p = i * 4;
  const [L, a, b] = rgbToLab(data[p], data[p + 1], data[p + 2]);
  lab[i * 3] = L;
  lab[i * 3 + 1] = a;
  lab[i * 3 + 2] = b;
  if (mask[i] > 230) {
    Ls.push(L);
    Cs.push(Math.hypot(a, b));
  }
}
const median = (arr) => arr.sort((x, y) => x - y)[Math.floor(arr.length / 2)];
const refL = median(Ls);
const refC = median(Cs);
console.log(`${slug}: paint ${(Ls.length / count * 100).toFixed(1)}% of frame, reference L ${refL.toFixed(1)} C ${refC.toFixed(1)}`);

// 3. One file per finish.
const outDir = path.join(root, "public/Hero/colors");
mkdirSync(outDir, { recursive: true });
const file = (name) => `${slug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.webp`;

for (const { name, hex } of catalogue(slug)) {
  if (name === photo.own) continue;
  const [Lt, at, bt] = rgbToLab(...[1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16)));
  const Ct = Math.hypot(at, bt);
  const out = Buffer.from(data);
  for (let i = 0; i < count; i++) {
    const w = mask[i] / 255;
    if (w === 0) continue;
    const L = lab[i * 3];
    const C = Math.hypot(lab[i * 3 + 1], lab[i * 3 + 2]);
    // Shading relative to the paint: below the reference scales toward black, above it
    // scales into the room left above the target.
    const Ln = L <= refL ? Lt * (L / refL) : Lt + (L - refL) * ((100 - Lt) / (100 - refL));
    // Keep some of the photo's chroma variation, and let glare wash colour out as it does.
    let c = refC > 1 ? Math.max(0, Math.min(1.25, 0.5 + 0.5 * (C / refC))) : 1;
    if (Ln > Lt) c *= Math.max(0, (100 - Ln) / Math.max(1, 100 - Lt));
    const scale = Ct > 0 ? c : 0;
    const [r, g, b] = labToRgb(Ln, at * scale, bt * scale);
    const p = i * 4;
    out[p] = Math.round(data[p] + (r - data[p]) * w);
    out[p + 1] = Math.round(data[p + 1] + (g - data[p + 1]) * w);
    out[p + 2] = Math.round(data[p + 2] + (b - data[p + 2]) * w);
  }
  await sharp(out, { raw: { width, height, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(path.join(outDir, file(name)));
  console.log(`  ${name} ${hex} → public/Hero/colors/${file(name)}`);
}
