/**
 * The footer's side elevation: the same blueprint line art as the intro, from the side
 * profile photo.
 *
 * Hero/bike_1.png is the sharp one, but its "transparent" checkerboard is baked into the
 * pixels. Hero/bike_2.png is the same shot properly cut out, at a quarter of the size. So
 * the colour (inner detail) comes from bike_1 and the silhouette from bike_2's alpha,
 * upscaled onto it; the two line up to within a pixel.
 *
 * Prints the measurements lib/footerBlueprint.ts needs: the image size and the wheel
 * axles and ground line as fractions of it.
 *
 * Usage: node scripts/prepare-footer-blueprint.mjs [out] [--debug overlay.png]
 * default: public/footer/scooter-side.webp
 */
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { toBlueprint, writeBlueprint } from "./lib/blueprint.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const debugAt = args.indexOf("--debug");
const debug = debugAt >= 0 ? args.splice(debugAt, 2)[1] : null;
const out = args[0] ?? path.join(root, "public/footer/scooter-side.webp");

const COLOUR = path.join(root, "public/Hero/bike_1.png");
const CUTOUT = path.join(root, "public/Hero/bike_2.png");
const PAD = 24;

const { width: W, height: H } = await sharp(COLOUR).metadata();
const alpha = await sharp(CUTOUT).resize(W, H, { kernel: "lanczos3", fit: "fill" }).ensureAlpha().extractChannel(3).raw().toBuffer();
const rgb = await sharp(COLOUR).removeAlpha().raw().toBuffer();

// The photo with the cut-out's alpha: the checkerboard becomes transparent.
const rgba = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  rgba[i * 4] = rgb[i * 3];
  rgba[i * 4 + 1] = rgb[i * 3 + 1];
  rgba[i * 4 + 2] = rgb[i * 3 + 2];
  rgba[i * 4 + 3] = alpha[i];
}

// Crop to the solid scooter (the floor shadow is semi-transparent and falls outside).
const solid = (x, y) => alpha[y * W + x] > 225;
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++)
    if (solid(x, y)) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
const crop = {
  left: Math.max(0, x0 - PAD),
  top: Math.max(0, y0 - PAD),
  width: Math.min(W, x1 + PAD + 1) - Math.max(0, x0 - PAD),
  height: Math.min(H, y1 + PAD + 1) - Math.max(0, y0 - PAD),
};
const cut = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).extract(crop).png().toBuffer();

const art = await toBlueprint(cut);
await mkdir(path.dirname(out), { recursive: true });
await writeBlueprint(art, out);

// --- Measurements, in the cropped image's pixels -------------------------------------
const cw = crop.width, ch = crop.height;
const at = (x, y) => solid(x + crop.left, y + crop.top);
const ground = y1 - crop.top;

// The tyres' contact patches: the solid runs a few px above the lowest solid row.
const probe = ground - 6;
const runs = [];
for (let x = 0, start = -1; x <= cw; x++) {
  const on = x < cw && at(x, probe);
  if (on && start < 0) start = x;
  if (!on && start >= 0) {
    runs.push({ a: start, b: x - 1 });
    start = -1;
  }
}
runs.sort((p, q) => q.b - q.a - (p.b - p.a));
const [rear, front] = runs.slice(0, 2).map((r) => (r.a + r.b) / 2).sort((p, q) => p - q);

// Each wheel's circle, from the tyre's chords close to the ground: down there nothing else
// is in the way, and the spoke gaps (transparent in the cut-out) are far above. A chord of
// half-width c at height h above the contact point gives r = (c² + h²) / 2h.
function wheel(contactX) {
  const reach = cw * 0.2;
  const rs = [], xs = [];
  for (let h = 40; h <= 150; h += 2) {
    const y = ground - h;
    let a = -1, b = -1;
    for (let x = Math.max(0, Math.round(contactX - reach)); x <= Math.min(cw - 1, contactX + reach); x++)
      if (at(x, y)) {
        if (a < 0) a = x;
        b = x;
      }
    if (a < 0) continue;
    const c = (b - a) / 2;
    rs.push((c * c + h * h) / (2 * h));
    xs.push((a + b) / 2);
  }
  const median = (v) => [...v].sort((p, q) => p - q)[v.length >> 1];
  const r = median(rs);
  return { x: median(xs), y: ground - r, r };
}
const rw = wheel(rear);
const fw = wheel(front);
const radius = (rw.r + fw.r) / 2;
const axleY = ground - radius;
const rearX = rw.x;
const frontX = fw.x;

const f = (n, d) => +(n / d).toFixed(4);
console.log(`wrote ${path.relative(root, out)} — ${cw}x${ch}`);
console.log(
  JSON.stringify(
    {
      width: cw,
      height: ch,
      rearAxle: { x: f(rearX, cw), y: f(axleY, ch) },
      frontAxle: { x: f(frontX, cw), y: f(axleY, ch) },
      wheelRadius: f(radius, cw),
      ground: f(ground, ch),
      top: f(y0 - crop.top, ch),
      rearmost: f(x0 - crop.left, cw),
      frontmost: f(x1 - crop.left, cw),
    },
    null,
    2,
  ),
);

if (debug) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}">
    <rect width="100%" height="100%" fill="#0B0C0A"/>
    <line x1="0" x2="${cw}" y1="${ground}" y2="${ground}" stroke="red" stroke-width="2"/>
    ${[rearX, frontX].map((x) => `<circle cx="${x}" cy="${axleY}" r="${radius}" fill="none" stroke="red" stroke-width="3"/><circle cx="${x}" cy="${axleY}" r="8" fill="red"/>`).join("")}
  </svg>`;
  await sharp(Buffer.from(svg)).composite([{ input: await sharp(out).png().toBuffer() }]).png().toFile(debug);
  console.log(`debug overlay -> ${debug}`);
}
