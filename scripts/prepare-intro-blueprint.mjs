/**
 * Turns the intro's cut-out scooter photo into blueprint line art: volt edges on
 * transparency, the same pixel size as the photo so INTRO_PHOTO's alignment still holds.
 * The edge pipeline itself lives in scripts/lib/blueprint.mjs.
 *
 * Usage: node scripts/prepare-intro-blueprint.mjs [source] [out]
 * defaults: public/intro/scooter-front.webp -> public/intro/scooter-blueprint.webp
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import { toBlueprint, writeBlueprint } from "./lib/blueprint.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const [, , source = path.join(root, "public/intro/scooter-front.webp"), out = path.join(root, "public/intro/scooter-blueprint.webp")] =
  process.argv;

const art = await toBlueprint(source);
await writeBlueprint(art, out);
console.log(`wrote ${path.relative(root, out)} — ${art.width}x${art.height}`);
