/**
 * Cuts the hero photo into layers so both wheels can really turn.
 *
 * Each wheel becomes a sandwich: the photo, one complete wheel on top of it that spins,
 * and a cut-out of whatever covers that wheel on top of both — mudguard and fork at the
 * front, motor housing, shock and linkage at the rear.
 *
 * A wheel seen at an angle is an ellipse, so it cannot just be rotated in 2D — it would
 * wobble like an egg. The wheel is un-foreshortened into a true circle ("flat space"),
 * which the page rotates plainly and squashes back with a CSS transform.
 *
 * The complete wheel is built from the FRONT wheel, the only one fully in view; its hidden
 * angles are rebuilt by repeating a clean slice around the circle. The same image serves
 * the rear, which on a scooter is the same wheel — just smaller and deeper in shade.
 *
 * Usage: node scripts/build-wheel-sprites.mjs
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(root, "public", "Hero", "veloce-l.webp");
const OUT = (name) => path.join(root, "public", "Hero", `veloce-l-${name}.webp`);
/** The photo the hero actually draws: same as the source, with the spoke gaps opened up. */
const BODY_OUT = OUT("body");

/**
 * Every wheel ellipse measured against the photo (fitted to the tyre's silhouette):
 *   cx, cy      centre of the wheel, in photo pixels
 *   major/minor semi-axes of the ellipse it projects to
 *   tilt        rotation of the major axis, degrees
 * Both wheels lie in the same plane, so they share a tilt and squash; the rear is smaller
 * only because it is further from the camera.
 */
const FRONT = { cx: 205, cy: 882, major: 203, minor: 165, tilt: 121.9 };
const REAR = { cx: 885, cy: 835, major: 118, minor: 118 * 0.8128, tilt: 121.9 };

/**
 * The wheel every position draws, rebuilt from the front one.
 *   band         which radii to take — the whole wheel, rim and tread alike
 *   clean/period optional overrides; by default the clean arc and repeat are measured
 *   occluders    capsules over dark things in front that colour cannot tell from the tyre
 *   angularBlur  smear around the axis: what a turning wheel looks like, and what hides
 *                the seams where rebuilt slices meet
 */
const WHEEL = {
  ...FRONT,
  band: [0, 1],
  blend: 8,
  angularBlur: 6,
  occluders: [
    { from: [262, 690], to: [226, 888], width: 30 }, // fork leg
    { from: [226, 884], to: [234, 910], width: 34 }, // axle bolt
  ],
};

/**
 * Where the wheel is drawn, and what covers it there.
 *   cover.mode "colour": keep the coloured bodywork (the red mudguard) plus the capsules.
 *              "sector": keep everything inside the ellipse EXCEPT an exposed crescent —
 *              the only way to lift the rear housing off, since it is as dark as the tyre.
 */
const POSITIONS = [
  {
    name: "front",
    ...FRONT,
    // Everything except the mudguard's wedge (measured: it spans 95°–168°). Cut by shape,
    // not colour: a colour test nibbles holes out of the mudguard's shadowed edge, and it
    // also wrongly lifts the bodywork seen *through* the spokes, which sits behind.
    cover: { mode: "sector", exposed: { from: 172, to: 92, inner: 0 }, occluders: WHEEL.occluders },
  },
  {
    name: "rear",
    ...REAR,
    // Flat-space angles of the tyre crescent left in view below the housing.
    cover: { mode: "sector", exposed: { from: 268, to: 43, inner: 0.45 } },
  },
];

const FEATHER = 2; // px of soft edge on the disc

const { data: src, info } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const rad = (deg) => (deg * Math.PI) / 180;

/** Photo pixel -> flat-space radius for this wheel (1 = the tyre's outer edge). */
function flatRadius(wheel, px, py) {
  const t = rad(-wheel.tilt);
  const dx = px - wheel.cx;
  const dy = py - wheel.cy;
  const u = (dx * Math.cos(t) - dy * Math.sin(t)) / wheel.major;
  const v = (dx * Math.sin(t) + dy * Math.cos(t)) / wheel.minor;
  return Math.hypot(u, v);
}

/**
 * The gaps between the spokes are enclosed by the wheel, so the background cut-out never
 * reached them and they stayed white. Open them up, or the panel behind would never show
 * through the wheel — and the rotating sprite would carry white wedges around with it.
 * Confined to the wheels, because bright pixels elsewhere (headlight, chrome) are real.
 */
for (const wheel of POSITIONS) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (flatRadius(wheel, x, y) > 1.02) continue;
      const i = (y * W + x) * 4;
      if (src[i + 3] === 0) continue;
      const [r, g, b] = [src[i], src[i + 1], src[i + 2]];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (max === 0 || (max - min) / max > 0.12) continue; // coloured: real bodywork
      const luma = r * 0.3 + g * 0.59 + b * 0.11;
      if (luma < 216) continue;
      // Ramp out over 216..238 so the spoke edges keep a soft border.
      src[i + 3] = Math.min(src[i + 3], Math.round(clamp((238 - luma) / 22, 0, 1) * 255));
    }
  }
}

await sharp(src, { raw: { width: W, height: H, channels: 4 } })
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(BODY_OUT);

/** Bilinear sample of the source photo; returns [r,g,b,a], transparent outside. */
function sample(x, y) {
  if (x < 0 || y < 0 || x > W - 1 || y > H - 1) return [0, 0, 0, 0];
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, W - 1);
  const y1 = Math.min(y0 + 1, H - 1);
  const fx = x - x0;
  const fy = y - y0;
  const out = [0, 0, 0, 0];
  for (let c = 0; c < 4; c++) {
    const p00 = src[(y0 * W + x0) * 4 + c];
    const p10 = src[(y0 * W + x1) * 4 + c];
    const p01 = src[(y1 * W + x0) * 4 + c];
    const p11 = src[(y1 * W + x1) * 4 + c];
    out[c] = p00 * (1 - fx) * (1 - fy) + p10 * fx * (1 - fy) + p01 * (1 - fx) * fy + p11 * fx * fy;
  }
  return out;
}

/** Flat-space (unit circle) point -> photo pixel. */
function toPhoto(wheel, u, v) {
  const t = rad(wheel.tilt);
  const px = u * wheel.major;
  const py = v * wheel.minor;
  return [wheel.cx + px * Math.cos(t) - py * Math.sin(t), wheel.cy + px * Math.sin(t) + py * Math.cos(t)];
}

/** Distance in degrees from `angle` into the clean range (0 when inside it). */
function outsideBy(angle, [from, to]) {
  const span = (to - from + 360) % 360;
  const rel = (angle - from + 360) % 360;
  if (rel <= span) return 0;
  return Math.min(rel - span, 360 - rel);
}

/** Rotate `angle` by whole periods until it lands inside the clean range, if it can. */
function intoClean(angle, wheel) {
  const [from, to] = wheel.clean;
  const span = (to - from + 360) % 360;
  const steps = Math.round(360 / wheel.period);
  let best = angle;
  let bestRel = Infinity;
  for (let k = 0; k < steps; k++) {
    const a = (angle + k * wheel.period) % 360;
    const rel = (a - from + 360) % 360;
    // prefer angles well inside the clean range, away from its edges
    const score = rel <= span ? Math.abs(rel - span / 2) : Infinity;
    if (score < bestRel) {
      bestRel = score;
      best = a;
    }
  }
  return best;
}

/** True where the photo shows something that is not wheel: bodywork, trim, or a capsule. */
function notWheel(px, py) {
  if (px < 0 || py < 0 || px >= W || py >= H) return true;
  const s = (Math.round(py) * W + Math.round(px)) * 4;
  // Transparent pixels inside the wheel are the gaps between the spokes — those are part
  // of the wheel and rotate with it, so they don't count as blocked.
  if (src[s + 3] < 60) return false;
  const [r, g, b] = [src[s], src[s + 1], src[s + 2]];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  // Colour separates panels from wheel: tyre, rim and brake disc are grey (the disc is
  // bright grey, so brightness alone would wrongly flag it), the panels are red. Very dark
  // pixels are excluded because hue is meaningless down there — tyre black reads as noise.
  return saturation > 0.3 && r * 0.3 + g * 0.59 + b * 0.11 > 60;
}

/**
 * How much of each flat-space angle is blocked by something in front. Sampled across the
 * spoke band only — the hub and the outermost tyre edge are not representative.
 */
function contaminationByAngle(wheel) {
  const out = new Float32Array(360);
  for (let a = 0; a < 360; a++) {
    const t = rad(a);
    let bad = 0;
    let total = 0;
    for (let r = wheel.band[0] + 0.05; r <= wheel.band[1] - 0.03; r += 0.02) {
      const [px, py] = toPhoto(wheel, r * Math.cos(t), r * Math.sin(t));
      const blocked =
        notWheel(px, py) || wheel.occluders.some((cap) => capsuleDistance(px, py, cap) <= cap.width / 2);
      if (blocked) bad++;
      total++;
    }
    out[a] = bad / total;
  }
  return out;
}

/** The widest run of angles clean enough to copy from. */
function widestCleanArc(contamination, limit = 0.08) {
  let best = { from: 0, span: 0 };
  for (let start = 0; start < 360; start++) {
    if (contamination[start] > limit) continue;
    let span = 0;
    while (span < 360 && contamination[(start + span) % 360] <= limit) span++;
    if (span > best.span) best = { from: start, span };
  }
  return best;
}

/**
 * The angle the wheel repeats after, measured directly: rotate the clean arc by each
 * candidate and keep the one whose pixels match themselves best. More reliable than
 * counting spokes from a frequency peak, which confuses spokes with pairs of spokes.
 */
function spokePeriod(wheel, arc) {
  const ring = (a) => {
    const t = rad(a);
    const out = [];
    for (let r = wheel.band[0] + 0.05; r <= wheel.band[1] - 0.03; r += 0.03) {
      const c = sample(...toPhoto(wheel, r * Math.cos(t), r * Math.sin(t)));
      out.push(c[3] < 60 ? -1 : c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11);
    }
    return out;
  };

  const results = [];
  for (let spokes = 5; spokes <= 16; spokes++) {
    const period = 360 / spokes;
    if (period > arc.span - 20) continue;
    let error = 0;
    let n = 0;
    for (let i = 0; i + period < arc.span; i += 2) {
      const a = ring(arc.from + i);
      const b = ring(arc.from + i + period);
      for (let k = 0; k < a.length; k++) {
        // A gap facing solid metal is the worst kind of mismatch, so weight it heavily.
        if (a[k] < 0 !== b[k] < 0) error += 120;
        else if (a[k] >= 0) error += Math.abs(a[k] - b[k]);
        n++;
      }
    }
    results.push({ spokes, period, error: error / Math.max(n, 1) });
  }
  results.sort((x, y) => x.error - y.error);
  return { spokes: results[0].spokes, period: results[0].period, ranked: results.slice(0, 3) };
}

function buildSprite(wheel) {
  const R = wheel.major;
  const size = Math.round(R * 2);
  const out = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x + 0.5 - size / 2) / R;
      const v = (y + 0.5 - size / 2) / R;
      const r = Math.hypot(u, v);
      const i = (y * size + x) * 4;
      const [inner, outer] = wheel.band;
      if (r > outer || r < inner) continue; // only the band we rotate

      const base = (((Math.atan2(v, u) * 180) / Math.PI) + 360) % 360;

      /*
       * Smeared around the axis, the way a turning wheel really looks. It also dissolves
       * the seams where rebuilt slices meet, which no choice of repeat angle can avoid:
       * this wheel's spokes are not evenly readable enough to lock onto.
       */
      const steps = 9;
      const colour = [0, 0, 0, 0];
      for (let s = 0; s < steps; s++) {
        const angle = (base + ((s / (steps - 1) - 0.5) * wheel.angularBlur) + 360) % 360;
        const gap = outsideBy(angle, wheel.clean);
        const at = rad(gap === 0 ? angle : intoClean(angle, wheel));
        let c = sample(...toPhoto(wheel, r * Math.cos(at), r * Math.sin(at)));
        if (gap > 0 && gap < wheel.blend) {
          const real = sample(...toPhoto(wheel, r * Math.cos(rad(angle)), r * Math.sin(rad(angle))));
          const t = gap / wheel.blend;
          c = c.map((v2, k) => real[k] * (1 - t) + v2 * t);
        }
        for (let k = 0; k < 4; k++) colour[k] += c[k] / steps;
      }

      // Feather both edges so the rotating band melts into the photo around it.
      const edge = Math.min(
        clamp(((outer - r) * R) / FEATHER, 0, 1),
        inner > 0 ? clamp(((r - inner) * R) / FEATHER, 0, 1) : 1,
      );
      out[i] = colour[0];
      out[i + 1] = colour[1];
      out[i + 2] = colour[2];
      out[i + 3] = colour[3] * edge;
    }
  }

  return { buffer: out, size };
}

/** Distance from a point to a capsule (thick line segment). */
function capsuleDistance(px, py, { from, to }) {
  const [ax, ay] = from;
  const [bx, by] = to;
  const vx = bx - ax;
  const vy = by - ay;
  const len2 = vx * vx + vy * vy || 1;
  const t = clamp(((px - ax) * vx + (py - ay) * vy) / len2, 0, 1);
  return Math.hypot(px - (ax + vx * t), py - (ay + vy * t));
}

/** Flat-space angle of a photo pixel for this wheel. */
function flatAngle(wheel, px, py) {
  const t = rad(-wheel.tilt);
  const dx = px - wheel.cx;
  const dy = py - wheel.cy;
  const u = (dx * Math.cos(t) - dy * Math.sin(t)) / wheel.major;
  const v = (dx * Math.sin(t) + dy * Math.cos(t)) / wheel.minor;
  return (((Math.atan2(v, u) * 180) / Math.PI) + 360) % 360;
}

/**
 * Everything at this position that sits in front of the wheel, which the page draws back
 * on top of the spinning one.
 *
 * "colour" reads the bodywork off the photo — the mudguard is red where the wheel is grey —
 * with capsules for the dark fork. "sector" keeps everything inside the ellipse except the
 * crescent of tyre left in view: the only way to lift the rear housing off, since housing
 * and tyre are the same black.
 */
function buildCover(wheel) {
  const half = Math.round(wheel.major + 6);
  const size = half * 2;
  const left = Math.round(wheel.cx) - half;
  const top = Math.round(wheel.cy) - half;
  const out = Buffer.alloc(size * size * 4);
  const { mode, occluders = [], exposed } = wheel.cover;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const sx = left + x;
      const sy = top + y;
      if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
      const s = (sy * W + sx) * 4;
      const a = src[s + 3];
      if (a < 8) continue;

      const capsule = occluders.some((cap) => capsuleDistance(sx, sy, cap) <= cap.width / 2);
      const radius = flatRadius(wheel, sx, sy);
      let keep;
      if (capsule) {
        keep = true;
      } else if (radius > 1.02) {
        // Outside the tyre the base photo already shows everything; repeating the floor
        // shadow here would double it up.
        keep = false;
      } else if (mode === "sector") {
        const gap = outsideBy(flatAngle(wheel, sx, sy), [exposed.from, exposed.to]);
        keep = gap > 0 || radius < exposed.inner;
      } else {
        keep = notWheel(sx, sy);
      }
      if (!keep) continue;

      const i = (y * size + x) * 4;
      out[i] = src[s];
      out[i + 1] = src[s + 1];
      out[i + 2] = src[s + 2];
      out[i + 3] = a;
    }
  }

  return { buffer: out, size, left, top };
}

// ---- the one wheel every position draws ----------------------------------------------
{
  const wheel = WHEEL;
  const contamination = contaminationByAngle(wheel);
  const found = wheel.clean
    ? { from: wheel.clean[0], span: (wheel.clean[1] - wheel.clean[0] + 360) % 360 }
    : widestCleanArc(contamination);
  // Keep away from the ends of the clean run: a degree or two of fender or fork there
  // would be copied all the way around the wheel.
  const TRIM = 7;
  const arc = { from: (found.from + TRIM) % 360, span: Math.max(found.span - TRIM * 2, 10) };
  if (process.env.DEBUG_WHEELS) {
    const row = [];
    for (let a = 0; a < 360; a += 10) row.push(`${a}:${contamination[a].toFixed(2)}`);
    console.log(`  profile  ${row.join(" ")}`);

    // Paint what the script treats as "not wheel" over the photo, to check the test.
    const size = Math.round(wheel.major * 2.4);
    const left = Math.round(wheel.cx - size / 2);
    const top = Math.round(wheel.cy - size / 2);
    const dbg = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const sx = left + x;
        const sy = top + y;
        const i = (y * size + x) * 4;
        if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
        const s = (sy * W + sx) * 4;
        dbg[i] = src[s];
        dbg[i + 1] = src[s + 1];
        dbg[i + 2] = src[s + 2];
        dbg[i + 3] = src[s + 3] ? 255 : 40;
        const blocked =
          notWheel(sx, sy) || wheel.occluders.some((cap) => capsuleDistance(sx, sy, cap) <= cap.width / 2);
        if (blocked) {
          dbg[i] = 255;
          dbg[i + 1] = 0;
          dbg[i + 2] = 200;
          dbg[i + 3] = 255;
        }
      }
    }
    await sharp(dbg, { raw: { width: size, height: size, channels: 4 } })
      .webp({ quality: 85 })
      .toFile(OUT("wheel-debug"));
  }
  const spokes = spokePeriod(wheel, arc);
  wheel.clean = [arc.from, (arc.from + arc.span) % 360];
  wheel.period = wheel.period ?? spokes.period;

  const sprite = buildSprite(wheel);
  await sharp(sprite.buffer, { raw: { width: sprite.size, height: sprite.size, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(OUT("wheel"));

  console.log(`wheel (rebuilt from the front):`);
  console.log(
    `  clean    ${arc.from}° for ${arc.span}°   repeat ${wheel.period.toFixed(1)}° ` +
      `(${spokes.ranked.map((r) => `${r.spokes}:${r.error.toFixed(1)}`).join(" ")})`,
  );
  console.log(`  sprite   ${sprite.size}x${sprite.size}`);
}

// ---- where it is drawn, and what covers it there --------------------------------------
for (const position of POSITIONS) {
  const cover = buildCover(position);
  await sharp(cover.buffer, { raw: { width: cover.size, height: cover.size, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(OUT(`cover-${position.name}`));

  const pct = (v) => `${((v / W) * 100).toFixed(3)}%`;
  console.log(`${position.name}:`);
  console.log(`  cover    ${cover.size}x${cover.size} at ${cover.left},${cover.top}`);
  console.log(
    `  runtime  cx ${pct(position.cx)}  cy ${((position.cy / H) * 100).toFixed(3)}%  ` +
      `size ${pct(position.major * 2)}  coverSize ${pct(cover.size)}  ` +
      `tilt ${position.tilt}  squash ${(position.minor / position.major).toFixed(4)}  ` +
      `radiusPx ${position.major}`,
  );
}
