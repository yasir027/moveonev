/**
 * Background blueprints: the footer's lime line art, made from the other scooter cut-outs
 * (different models, different angles) for pages that have no hero image. See BlueprintBg.
 *
 * Each cut-out is cropped to the solid scooter (the soft floor shadow and stray specks fall
 * outside), drawn with the shared toBlueprint, and scaled down so it is at most MAX_H tall.
 * Prints each file's size for lib/blueprints.ts.
 *
 * Usage: node scripts/prepare-blueprints.mjs
 * writes public/blueprints/<name>.webp
 */
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { toBlueprint } from "./lib/blueprint.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "public/blueprints");
const PAD = 24;
const MAX_H = 900;

const SOURCES = {
  doublelight: "public/Lineup/xdoublelight.png",
  ozone: "public/Lineup/xozone.png",
  cheetah: "public/Lineup/xorlcheetah.png",
  robox: "public/Lineup/xrobox.png",
  torvo: "public/Lineup/xtorvo.png",
  e4: "public/Lineup/xe4.png",
  fh: "public/Lineup/xfh.png",
  lambretta: "public/Lineup/xlambretta.png",
  rear: "public/CTABike.png",
};

await mkdir(OUT, { recursive: true });
const sizes = {};

for (const [name, src] of Object.entries(SOURCES)) {
  const file = path.join(root, src);
  const { width: W, height: H } = await sharp(file).metadata();
  const alpha = await sharp(file).ensureAlpha().extractChannel(3).raw().toBuffer();

  // Crop to the solid scooter.
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (alpha[y * W + x] > 225) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  const left = Math.max(0, x0 - PAD);
  const top = Math.max(0, y0 - PAD);
  const crop = { left, top, width: Math.min(W, x1 + PAD + 1) - left, height: Math.min(H, y1 + PAD + 1) - top };
  const cut = await sharp(file).extract(crop).png().toBuffer();

  // Lines are found at full size (sharper), then the art is scaled down.
  const { rgba, width, height } = await toBlueprint(cut);
  const scale = Math.min(1, MAX_H / height);
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const out = path.join(OUT, `${name}.webp`);
  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .resize(w, h, { kernel: "lanczos3" })
    .webp({ quality: 80, alphaQuality: 80 })
    .toFile(out);

  sizes[name] = { src: `/blueprints/${name}.webp`, width: w, height: h };
  console.log(`wrote ${path.relative(root, out)} — ${w}x${h}`);
}

console.log(JSON.stringify(sizes, null, 2));
