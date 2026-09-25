/**
 * Refraction maths shared by the glass surfaces that bend their backdrop through an SVG
 * filter: the cursor sphere (GlassLens) and the header pill (NavGlassFilter).
 *
 * Both work the same way — a canvas displacement map where R encodes horizontal offset and
 * G vertical, 128 meaning "don't move", with the offsets pointing inward so the surface
 * magnifies rather than shrinking what is under it. They differ only in the shape the
 * profile runs across: a radius for the sphere, an edge band for the pill.
 */

/**
 * How much of `scale` a fully-saturated channel actually spends.
 *
 * feDisplacementMap samples at `P + scale·(C/255 − 0.5)`. With `C = 128 + u·127`, that
 * factor is `(0.5 + 127u)/255`, i.e. `0.498·u`. Every fold-free bound below is derived
 * from it, which is why it lives here rather than as a bare number in two files.
 */
export const DISPLACEMENT_UNIT = 0.498;

/**
 * The largest `scale` that keeps the mapping monotonic.
 *
 * The sampled depth is `d + scale·DISPLACEMENT_UNIT·k(d)`. If that stops increasing with
 * `d`, the surface starts sampling past itself and the image mirrors — which reads as a
 * bug, not as glass. For `k = t^p` the steepest slope is `p` over the extent, so the
 * ceiling is `extent / (DISPLACEMENT_UNIT · p)`.
 *
 * `extent` is the distance over which the profile falls to zero: a radius for a sphere,
 * a band width for a pill.
 */
export function foldFreeScale(extent: number, profile: number): number {
  return Math.floor(extent / (DISPLACEMENT_UNIT * profile));
}

/** Keeps one channel and drops the other two, so the three passes can be recombined. */
export const CHANNEL_MATRIX = {
  R: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
  G: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
  B: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
} as const;

/** Writes one inward offset into the RGBA buffer at `i`, in the 128-is-neutral encoding. */
function encode(data: Uint8ClampedArray, i: number, dx: number, dy: number) {
  data[i] = Math.max(0, Math.min(255, 128 + dx * 127));
  data[i + 1] = Math.max(0, Math.min(255, 128 + dy * 127));
  data[i + 2] = 128;
  data[i + 3] = 255;
}

/**
 * A sphere's map: the bend grows as r^profile from the centre out, so a high profile keeps
 * the middle almost undisturbed and packs the refraction into the rim — which is where a
 * real sphere bends hardest anyway.
 */
export function buildRadialDisplacementMap(size: number, profile: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const image = ctx.createImageData(size, size);
  const data = image.data;
  const half = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const nx = (x - half) / half;
      const ny = (y - half) / half;
      const r = Math.hypot(nx, ny);

      let dx = 0;
      let dy = 0;
      if (r > 0 && r < 1) {
        const k = Math.pow(r, profile);
        dx = -(nx / r) * k;
        dy = -(ny / r) * k;
      }

      encode(data, i, dx, dy);
    }
  }

  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL();
}

/** Ceiling on a pill map's dimensions. The header pill maxes out at 920x68; this is a guard. */
const PILL_MAP_LIMIT = { width: 960, height: 96 };

/**
 * A pill's map: a rounded-rect signed distance field, so the lens hugs the rim at a constant
 * pixel width and leaves a clean core stripe down the middle for the content to sit in.
 *
 * Unlike the radial map this is built at 1:1 CSS pixels rather than a fixed size — the band
 * is measured in pixels, so a stretched map would make it anisotropic and the corner arcs
 * would stop being arcs. Rebuild it when the element resizes.
 */
export function buildPillDisplacementMap(
  width: number,
  height: number,
  band: number,
  profile: number,
): string {
  const w = Math.min(Math.ceil(width), PILL_MAP_LIMIT.width);
  const h = Math.min(Math.ceil(height), PILL_MAP_LIMIT.height);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const image = ctx.createImageData(w, h);
  const data = image.data;

  const hx = w / 2;
  const hy = h / 2;
  /* A capsule: the corner radius is half the shorter side, so the end caps are semicircles. */
  const rr = Math.min(hx, hy);
  /* The straight run each half-extent has left once the corner radius is taken out. */
  const ex = hx - rr;
  const ey = hy - rr;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const px = x + 0.5 - hx;
      const py = y + 0.5 - hy;

      const qx = Math.abs(px) - ex;
      const qy = Math.abs(py) - ey;

      /* Standard rounded-rect SDF: negative inside, zero on the rim. */
      const sd =
        Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - rr;

      const depth = -sd;
      if (depth >= band) {
        /* Past the band, in the undisturbed core. */
        encode(data, i, 0, 0);
        continue;
      }

      const t = depth <= 0 ? 1 : 1 - depth / band;
      const k = Math.pow(t, profile);

      /* Outward normal = the SDF's gradient, analytic rather than sampled. */
      const sx = px < 0 ? -1 : 1;
      const sy = py < 0 ? -1 : 1;
      let nx: number;
      let ny: number;
      if (qx > 0 && qy > 0) {
        /* On a corner arc, where both axes are outside their straight run. */
        const len = Math.hypot(qx, qy) || 1;
        nx = (sx * qx) / len;
        ny = (sy * qy) / len;
      } else if (qx > qy) {
        nx = sx;
        ny = 0;
      } else {
        nx = 0;
        ny = sy;
      }

      /* Negated: inward offsets make the rim sample from further in, which magnifies. */
      encode(data, i, -nx * k, -ny * k);
    }
  }

  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL();
}
