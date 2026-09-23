"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LOGO_MARK_CENTER, LOGO_SUB, LOGO_SUB_DOT, LOGO_VIEWBOX, LOGO_VIEWBOX_STR, LOGO_WORD } from "@/lib/intro/logo";
import { INTRO_PHOTO } from "@/lib/intro/introPhoto";
import { M_ON_FACE, M_ON_FACE_BOX } from "@/lib/intro/mOnFace";
import { COLORS, finishLoader, preloadImages } from "@/lib/intro/loader";
import { LOGO_MARK_SUBPATHS } from "@/components/brand/Logo";

gsap.registerPlugin(useGSAP);

/**
 * The site intro, played on the first page of a visit: construction lines draw in, a
 * scan develops a blueprint front elevation of the scooter, a hairline forms the M out
 * of its face, the drawing recedes and the M stays, the ring closes into the icon, the
 * wordmark writes out, and the lockup docks into the header as the page opens behind it.
 */

// Seconds. Slow, even eases; each beat lands before the next begins.
const T = {
  guides: 0.15, // construction lines and grid
  scan: 0.6, // the blueprint develops top to bottom
  scanDur: 1.1,
  dims: 1.3, // dimension lines
  trace: 1.75, // the hairline finds the M in the scooter's face
  traceDur: 1.0,
  rise: 2.85, // the M lifts off the drawing, straightening, into the centre
  riseDur: 1.1,
  fill: 3.75, // the M fills with light
  fillDur: 0.8,
  ring: 4.5, // the ring closes: the icon
  ringDur: 0.7,
  lockup: 5.4, // the wordmark writes out
  dock: 6.6, // into the header, page opens
  done: 7.5,
};

const [RING, M_RIGHT, M_LEFT] = LOGO_MARK_SUBPATHS;
const M_HALVES = [M_LEFT, M_RIGHT];
// The M's axis: its halves are exact mirrors about x = 734.84.
const M_AXIS = 734.84;

/** Mirrors an absolute path (M/L/C/H/V/Z) about x = M_AXIS. */
function mirrorPath(d: string) {
  return d.replace(/([MLCHVZ])([^MLCHVZ]*)/g, (_, cmd: string, args: string) => {
    const n = args.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
    const out = cmd === "V" ? n : n.map((v, i) => (cmd === "H" || i % 2 === 0 ? 2 * M_AXIS - v : v));
    return cmd + out.map((v) => +v.toFixed(3)).join(" ");
  });
}
// The hairline traces the left half and its mirror, so both halves grow symmetrically.
const M_TRACE = [M_LEFT, mirrorPath(M_LEFT)];
// The M's box in logo units, for the fill wipe and framing.
const M_BOX = { x: 534, y: 300, w: 402, h: 442 };
const M_CENTER_Y = M_BOX.y + M_BOX.h / 2;

type Pt = readonly [number, number];
/** The flat M's vertical span, logo units: horn tops to bolt tips. */
const M_SPAN = { top: 305, bottom: 739 };

/**
 * An absolute path (M/L/C/H/V/Z) as a template plus its points, with H/V expanded to L,
 * so the same shape can be redrawn from any set of moved points.
 */
function pathPoints(d: string) {
  const cmds: [string, number][] = [];
  const pts: Pt[] = [];
  let cur: Pt = [0, 0];
  for (const [, cmd, args] of d.matchAll(/([MLCHVZ])([^MLCHVZ]*)/g)) {
    const n = args.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
    const seg: Pt[] = cmd === "H" ? [[n[0], cur[1]]] : cmd === "V" ? [[cur[0], n[0]]] : [];
    if (cmd !== "H" && cmd !== "V") for (let i = 0; i < n.length; i += 2) seg.push([n[i], n[i + 1]]);
    if (seg.length) cur = seg[seg.length - 1];
    cmds.push([cmd === "H" || cmd === "V" ? "L" : cmd, seg.length]);
    pts.push(...seg);
  }
  return { cmds, pts };
}

function drawPath({ cmds }: ReturnType<typeof pathPoints>, pts: Pt[]) {
  let i = 0;
  return cmds.map(([cmd, count]) => cmd + pts.slice(i, (i += count)).map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ")).join("");
}

// The photo in logo units, so it shares one coordinate system with the M and the lockup.
// Scaled so the drawn M is as tall as the flat one, and placed below where the flat M
// ends up: the M rises into the centre.
const BOX = M_ON_FACE_BOX;
const S = (M_SPAN.bottom - M_SPAN.top) / BOX.h;
const RISE = 0.3 * M_BOX.h;
const PHOTO = {
  x: M_AXIS - S * (BOX.x + BOX.w / 2),
  y: (M_SPAN.top + M_SPAN.bottom) / 2 + RISE - S * (BOX.y + BOX.h / 2),
  w: INTRO_PHOTO.w * S,
  h: INTRO_PHOTO.h * S,
};
const onPhoto = ([x, y]: Pt): Pt => [PHOTO.x + S * x, PHOTO.y + S * y];
/** The drawn M, in logo units: what the hairline traces before it rises. */
const FACE_PATHS = M_ON_FACE.map((d) => {
  const shape = pathPoints(d);
  return drawPath(shape, shape.pts.map(onPhoto));
});
const HORN_Y = onPhoto([0, BOX.y])[1];
const TIPS: Pt = [M_AXIS, onPhoto([0, BOX.y + BOX.h])[1]];
/** The drawn M's top corners, for the width dimension. */
const FACE_U: Pt[] = [onPhoto([BOX.x, BOX.y]), onPhoto([BOX.x + BOX.w, BOX.y])];

// The lower scooter dissolves into the dark below the face.
const FADE_FROM = TIPS[1] + 60;
const FADE_TO = FADE_FROM + 420;

// Drafting furniture, in logo units, measured off the scooter's face.
const GRID = { x: PHOTO.x - 500, y: PHOTO.y - 200, w: PHOTO.w + 1000, h: FADE_TO - PHOTO.y + 300, cell: 40 };
const DIM_Y = PHOTO.y - 40; // width dimension, above the drawing
const DIM_X = PHOTO.x + PHOTO.w + 40; // height dimension, right of the drawing
const TICK = 14;
const GUIDES = {
  axis: { x1: TIPS[0], y1: PHOTO.y - 110, x2: TIPS[0], y2: FADE_TO },
  datum: { x1: PHOTO.x - 60, y1: HORN_Y, x2: PHOTO.x + PHOTO.w + 60, y2: HORN_Y },
};
const DIMS = {
  width: { x1: FACE_U[0][0], y1: DIM_Y, x2: FACE_U[1][0], y2: DIM_Y },
  height: { x1: DIM_X, y1: HORN_Y, x2: DIM_X, y2: TIPS[1] },
};
const TICKS = [
  { x1: DIMS.width.x1, y1: DIM_Y - TICK, x2: DIMS.width.x1, y2: DIM_Y + TICK },
  { x1: DIMS.width.x2, y1: DIM_Y - TICK, x2: DIMS.width.x2, y2: DIM_Y + TICK },
  { x1: DIM_X - TICK, y1: DIMS.height.y1, x2: DIM_X + TICK, y2: DIMS.height.y1 },
  { x1: DIM_X - TICK, y1: DIMS.height.y2, x2: DIM_X + TICK, y2: DIMS.height.y2 },
];
const LABEL = "font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A8E85] sm:text-[11px]";

const IRIS_MASK = "radial-gradient(circle at var(--ix) var(--iy), transparent var(--r), #000 calc(var(--r) + 1px))";
const IRIS_STYLE = {
  "--ix": "50%",
  "--iy": "50%",
  "--r": "0px",
  background: COLORS.night,
  maskImage: IRIS_MASK,
  WebkitMaskImage: IRIS_MASK,
} as CSSProperties;

const LOGO_RATIO = LOGO_VIEWBOX.h / LOGO_VIEWBOX.w;
/** Hairline width, screen px. */
const HAIRLINE = 1.5;
const PHOTO_BOX = { x: PHOTO.x, y: PHOTO.y, width: PHOTO.w, height: PHOTO.h };
const GRID_BOX = { x: GRID.x, y: GRID.y, width: GRID.w, height: GRID.h };

export function BrandIntro({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const skip = useRef<() => void>(() => {});

  useGSAP(
    () => {
      const el = root.current!;
      const q = <T extends Element = SVGElement>(s: string) => el.querySelector<T>(s)!;
      const qa = <T extends Element = SVGElement>(s: string) => [...el.querySelectorAll<T>(s)];

      // Our own dark layer takes over from the pre-paint cover.
      document.querySelector<HTMLElement>(".brand-cover")?.style.setProperty("display", "none");

      const dark = q<HTMLDivElement>("[data-dark]");
      const lock = q<SVGSVGElement>("[data-lock]");
      const drawing = q("[data-drawing]");
      const blueprint = q("[data-blueprint]");
      const grid = q("[data-grid]");
      const gridLines = q("[data-grid-line]");
      const guides = qa<SVGLineElement>("[data-guide]");
      const dims = qa<SVGLineElement>("[data-dim]");
      const ticks = qa("[data-tick]");
      const scanClip = q("[data-scan-clip]");
      const scanBar = q("[data-scan-bar]");
      const labels = qa<HTMLElement>("[data-label]");
      const mStroke = qa<SVGPathElement>("[data-m-stroke]");
      const charge = q("[data-charge]");
      const ringStroke = q<SVGPathElement>("[data-ring-stroke]");
      const ringFill = q("[data-ring-fill]");
      const write = q("[data-write]");
      const move = q("[data-move]");
      const sub = q("[data-sub]");
      const skipBtn = q<HTMLButtonElement>("[data-skip]");

      const nav = document.querySelector("[data-intro='nav']");
      const headerLogo = document.querySelector<SVGSVGElement>("svg[data-brand-logo]");
      // The homepage brings its hero in piece by piece; any other page comes in whole.
      const heroUi = [...document.querySelectorAll("[data-intro='hero']")];
      const content = heroUi.length ? heroUi : [...document.querySelectorAll("[data-intro='page']")];

      // ---------- layout (screen px) ----------
      // The lockup svg is w px wide; one logo unit is k px at scale 1.
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = Math.min(vw * 0.8, Math.max(320, vw * 0.475));
      const k = w / LOGO_VIEWBOX.w;
      /** Where the lock goes so logo point (ux, uy) lands on screen point (sx, sy) at scale s. */
      const place = (ux: number, uy: number, sx: number, sy: number, s: number) => ({
        x: sx - (ux - LOGO_VIEWBOX.x) * k * s,
        y: sy - (uy - LOGO_VIEWBOX.y) * k * s,
        scale: s,
      });
      // Close on the scooter's face: the M fills about 40% of the screen height.
      // On narrow screens leave room for the M lying tilted on the face, which is wider.
      const big = Math.min((vh * 0.4) / (M_BOX.h * k), (vw * 0.58) / (M_BOX.w * k));
      const face = place(LOGO_MARK_CENTER[0], M_CENTER_Y, vw / 2, vh * 0.46, big);
      const lockup = { x: vw / 2 - w / 2, y: vh * 0.467 - (w * LOGO_RATIO) / 2, scale: 1 };
      // Measured before the header is nudged out of place for its entrance.
      const hr = headerLogo?.getBoundingClientRect();
      const dock = hr && hr.width ? { x: hr.left, y: hr.top, scale: hr.width / w } : null;
      /** Screen position of the mark's centre for a given lock placement. */
      const markAt = (p: { x: number; y: number; scale: number }) => ({
        x: p.x + (LOGO_MARK_CENTER[0] - LOGO_VIEWBOX.x) * k * p.scale,
        y: p.y + (LOGO_MARK_CENTER[1] - LOGO_VIEWBOX.y) * k * p.scale,
      });
      const markC = markAt(lockup);
      // The light follows the logo into the header, so it must reach the far corner from there too.
      const markEnd = dock ? markAt(dock) : markC;
      const irisR = Math.hypot(Math.max(markEnd.x, vw - markEnd.x), Math.max(markEnd.y, vh - markEnd.y)) + 40;

      // ---------- initial state ----------
      gsap.set(lock, { width: w, height: w * LOGO_RATIO, transformOrigin: "0 0", ...face });
      gsap.set(dark, { "--ix": `${markC.x}px`, "--iy": `${markC.y}px`, "--r": "0px" });
      // Hairlines are drawn at the close-up scale, so size them for it.
      const hairline = HAIRLINE / (k * big);
      [...mStroke, ringStroke].forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { attr: { "stroke-width": hairline, "stroke-dasharray": len, "stroke-dashoffset": len } });
      });
      [...guides, ...dims].forEach((l) => {
        const len = Math.hypot(+l.getAttribute("x2")! - +l.getAttribute("x1")!, +l.getAttribute("y2")! - +l.getAttribute("y1")!);
        gsap.set(l, { attr: { "stroke-width": hairline * 0.8, "stroke-dasharray": len, "stroke-dashoffset": len } });
      });
      gsap.set(ticks, { attr: { "stroke-width": hairline * 0.8 }, opacity: 0 });
      gsap.set(gridLines, { attr: { "stroke-width": hairline * 0.5 } });
      gsap.set(grid, { opacity: 0 });
      gsap.set(scanBar, { opacity: 0 });
      gsap.set(blueprint, { opacity: 0.85 });
      gsap.set(labels, { autoAlpha: 0 });
      gsap.set(ringFill, { opacity: 0 });
      gsap.set(sub, { opacity: 0 });
      gsap.set(skipBtn, { autoAlpha: 0 });
      if (nav) gsap.set(nav, { autoAlpha: 0, y: -20 });
      if (headerLogo) gsap.set(headerLogo, { opacity: 0 });
      gsap.set(content, { autoAlpha: 0, y: 24 });

      // The drawn outline and the logo are the same M drawn differently, so the rise pairs
      // them up before morphing: walking both outlines in step, never backwards, and
      // choosing the pairing with the least total travel. Corners then meet corners and no
      // point has to cross the shape, which is what made the logo look like it flipped.
      const WALK = 300;
      const BUDGET = 320;
      const BAND = 70; // how far the two walks may drift apart, in samples
      const scratch = document.createElementNS("http://www.w3.org/2000/svg", "path");
      lock.appendChild(scratch);
      const measure = (d: string) => {
        scratch.setAttribute("d", d);
        return scratch.getTotalLength();
      };
      /** The outline itself: the longest subpath, since an export can leave stray snippets. */
      const outline = (d: string) => d.split(/(?=M)/).filter(Boolean).sort((x, y) => measure(y) - measure(x))[0];
      const walk = (d: string, count: number): Pt[] => {
        const len = measure(d);
        return Array.from({ length: count }, (_, i) => {
          const { x, y } = scratch.getPointAtLength((i / count) * len);
          return [x, y] as Pt;
        });
      };
      const wrap = (i: number, n: number) => ((i % n) + n) % n;
      const at = (pts: Pt[], i: number) => pts[wrap(i, pts.length)];
      const area = (pts: Pt[]) => pts.reduce((sum, [x, y], i) => {
        const [nx, ny] = at(pts, i + 1);
        return sum + (x * ny - nx * y);
      }, 0);
      const centre = (pts: Pt[]): Pt => [
        pts.reduce((sum, p) => sum + p[0], 0) / pts.length,
        pts.reduce((sum, p) => sum + p[1], 0) / pts.length,
      ];

      const morphs = FACE_PATHS.map((faceD, index) => {
        const logo = walk(outline(M_TRACE[index]), WALK);
        let face = walk(outline(faceD), WALK);
        // Both loops must run the same way round, or every point crosses the shape.
        if (Math.sign(area(face)) !== Math.sign(area(logo))) face = [...face].reverse();

        // Compare shapes, not where they sit: the drawing is lower down the screen.
        const [fcx, fcy] = centre(face);
        const [lcx, lcy] = centre(logo);
        const gap = (i: number, j: number) =>
          Math.hypot(at(face, i)[0] - fcx - (logo[j][0] - lcx), at(face, i)[1] - fcy - (logo[j][1] - lcy));

        // Where on the drawing does the logo's outline begin? Take the cheapest start.
        let start = 0;
        let cheapest = Infinity;
        for (let offset = 0; offset < WALK; offset += 2) {
          let sum = 0;
          for (let i = 0; i < WALK; i += 5) sum += gap(i + offset, i);
          if (sum < cheapest) [cheapest, start] = [sum, offset];
        }

        // Walk both outlines together, never going backwards, for the least total travel.
        const cost: number[][] = Array.from({ length: WALK }, () => new Array(WALK).fill(Infinity));
        const step: number[][] = Array.from({ length: WALK }, () => new Array(WALK).fill(0));
        cost[0][0] = gap(start, 0);
        for (let i = 0; i < WALK; i++) {
          for (let j = Math.max(0, i - BAND); j < Math.min(WALK, i + BAND); j++) {
            const here = cost[i][j];
            if (here === Infinity) continue;
            const moves: [number, number, number][] = [
              [i + 1, j + 1, 1],
              [i + 1, j, 2],
              [i, j + 1, 3],
            ];
            moves.forEach(([ni, nj, mark]) => {
              if (ni >= WALK || nj >= WALK) return;
              const next = here + gap(start + ni, nj);
              if (next < cost[ni][nj]) {
                cost[ni][nj] = next;
                step[ni][nj] = mark;
              }
            });
          }
        }

        // Read the pairing back, then thin it to an even number of points.
        const pairs: [number, number][] = [];
        for (let i = WALK - 1, j = WALK - 1; i > 0 || j > 0; ) {
          pairs.push([i, j]);
          const mark = step[i][j];
          if (mark === 1) {
            i--;
            j--;
          } else if (mark === 2) i--;
          else if (mark === 3) j--;
          else break;
        }
        pairs.push([0, 0]);
        pairs.reverse();
        const picked = Array.from({ length: BUDGET }, (_, k) => pairs[Math.round((k * (pairs.length - 1)) / BUDGET)]);
        return {
          from: picked.map(([i]) => at(face, start + i)),
          to: picked.map(([, j]) => logo[j]),
        };
      });
      lock.removeChild(scratch);

      (window as unknown as { __morphs: unknown }).__morphs = morphs; // DEBUG-REMOVE
      (window as unknown as { __lock: unknown }).__lock = lock; // DEBUG-REMOVE
      const tl = gsap.timeline({ paused: true });
      (window as unknown as { __tl: gsap.core.Timeline }).__tl = tl; // DEBUG-REMOVE
      /** Draws a path's stroke from start to end. */
      const draw = (p: Element, at: number, dur: number) =>
        tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: dur, ease: "power2.inOut" }, at);

      tl.to(skipBtn, { autoAlpha: 1, duration: 0.6 }, 0.4);

      // 1) the drafting frame: grid, centre axis, datum line, labels
      tl.to(grid, { opacity: 1, duration: 1.2, ease: "power1.inOut" }, T.guides)
        .to(labels, { autoAlpha: 1, duration: 0.6, stagger: 0.15 }, T.guides + 0.3);
      guides.forEach((l, i) => draw(l, T.guides + i * 0.15, 0.9));

      // 2) a scan develops the blueprint, top to bottom
      const scanFrom = PHOTO.y - 20;
      const scanTo = FADE_TO;
      const scan = { y: scanFrom };
      tl.set(scanBar, { opacity: 1 }, T.scan)
        .to(scan, {
          y: scanTo,
          duration: T.scanDur,
          ease: "power1.inOut",
          onUpdate() {
            scanClip.setAttribute("height", (scan.y - scanFrom).toFixed(1));
            scanBar.setAttribute("transform", `translate(0 ${scan.y.toFixed(1)})`);
          },
        }, T.scan)
        .to(scanBar, { opacity: 0, duration: 0.25 }, T.scan + T.scanDur - 0.2);

      // then it gets dimensioned: the face's width and height
      dims.forEach((l) => draw(l, T.dims, 0.6));
      tl.to(ticks, { opacity: 1, duration: 0.3, stagger: 0.05 }, T.dims + 0.1);

      // 3) a hairline finds the M in the scooter's face, lying on it at the drawing's angle;
      //    the drawing steps back so the M reads over it
      mStroke.forEach((p) => draw(p, T.trace, T.traceDur));
      tl.to(blueprint, { opacity: 0.45, duration: 0.8, ease: "power1.inOut" }, T.trace);

      // 4) the M lifts off the drawing and straightens as it rises into the centre,
      //    while the drawing recedes into the dark. The dashes were sized for the traced
      //    outline; drop them before it changes length.
      tl.set(mStroke, { attr: { "stroke-dasharray": "none" } }, T.rise);
      const lift = { t: 0 };
      tl.to(lift, {
        t: 1,
        duration: T.riseDur,
        ease: "power3.inOut",
        onUpdate() {
          morphs.forEach(({ from, to }, i) => {
            const pts = from.map(([x, y], j) => `${(x + (to[j][0] - x) * lift.t).toFixed(1)} ${(y + (to[j][1] - y) * lift.t).toFixed(1)}`);
            mStroke[i].setAttribute("d", `M${pts.join("L")}Z`);
          });
        },
        // land on the real logo, not the sampled outline
        onComplete: () => mStroke.forEach((p, i) => p.setAttribute("d", M_TRACE[i])),
      }, T.rise)
        .to(drawing, { opacity: 0, duration: T.riseDur, ease: "power2.inOut" }, T.rise)
        .to(labels, { autoAlpha: 0, duration: 0.6 }, T.rise);

      // then it fills with light
      const fill = { f: 0 };
      tl.to(fill, {
        f: 1,
        duration: T.fillDur,
        ease: "power2.inOut",
        onUpdate() {
          const h = M_BOX.h * fill.f;
          charge.setAttribute("y", (M_BOX.y + M_BOX.h - h).toFixed(1));
          charge.setAttribute("height", h.toFixed(1));
        },
      }, T.fill);
      tl.to(mStroke, { opacity: 0, duration: 0.4 }, T.fill + T.fillDur - 0.1);

      // 5) the ring closes around it: the icon
      draw(ringStroke, T.ring, T.ringDur);
      tl.to(ringFill, { opacity: 1, duration: 0.4, ease: "power1.inOut" }, T.ring + T.ringDur - 0.1)
        .to(ringStroke, { opacity: 0, duration: 0.3 }, T.ring + T.ringDur + 0.2);

      // 6) the icon settles into the lockup as the wordmark writes out
      tl.to(lock, { ...lockup, duration: 1, ease: "power3.inOut" }, T.lockup)
        .to(write, { attr: { width: 2300 }, duration: 0.75, ease: "power2.inOut" }, T.lockup + 0.4)
        .to(sub, { opacity: 1, duration: 0.5 }, T.lockup + 0.95);

      // 7) dock into the header while the light opens the page
      tl.to(skipBtn, { autoAlpha: 0, duration: 0.3 }, T.dock - 0.2)
        .to(dark, { "--r": `${irisR}px`, duration: 1, ease: "power2.in" }, T.dock)
        // the lockup was drawn for the dark stage; it lands in the light header
        .to(move, { attr: { fill: "#111310" }, duration: 0.6 }, T.dock + 0.15);
      if (dock) {
        tl.to(lock, {
          ...dock,
          duration: 0.9,
          ease: "power3.inOut",
          // the light opens from the logo wherever it is on its way to the header
          onUpdate() {
            const c = markAt({ x: gsap.getProperty(lock, "x") as number, y: gsap.getProperty(lock, "y") as number, scale: gsap.getProperty(lock, "scale") as number });
            dark.style.setProperty("--ix", `${c.x}px`);
            dark.style.setProperty("--iy", `${c.y}px`);
          },
        }, T.dock);
      }
      if (nav) tl.to(nav, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, T.dock + 0.5);
      if (headerLogo) tl.to(headerLogo, { opacity: 1, duration: 0.25 }, T.dock + 0.75);
      tl.to(lock, { opacity: 0, duration: 0.25 }, dock ? T.dock + 0.85 : T.dock + 0.4)
        .to(content, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }, T.dock + 0.6);

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        finishLoader();
        gsap.set([nav, headerLogo, ...content].filter(Boolean), { clearProps: "all" });
        // Unmount after this tick: reverting the timeline from inside its own render
        // would re-apply the page's hidden start state.
        setTimeout(onDone, 0);
      };
      // after the last element has landed, however many the page brings in
      tl.call(finish, [], Math.max(T.done, tl.duration()));

      skip.current = () => {
        if (!finished) tl.progress(1);
      };

      let alive = true;
      preloadImages([INTRO_PHOTO.blueprint]).then(() => {
        if (alive) tl.play();
      });
      return () => {
        alive = false;
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="fixed inset-0 z-[101] overflow-hidden">
      <div data-dark className="absolute inset-0" style={IRIS_STYLE} />

      <svg data-lock aria-hidden="true" viewBox={LOGO_VIEWBOX_STR} overflow="visible" className="absolute left-0 top-0">
        <defs>
          <linearGradient id="bi-fade" gradientUnits="userSpaceOnUse" x1="0" y1={FADE_FROM} x2="0" y2={FADE_TO}>
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id="bi-fade-mask" maskUnits="userSpaceOnUse" {...GRID_BOX}>
            <rect {...GRID_BOX} fill="url(#bi-fade)" />
          </mask>
          {/* the grid is only drafted around the scooter, fading out to the edges */}
          <radialGradient id="bi-grid-fade" gradientUnits="userSpaceOnUse" cx={TIPS[0]} cy={(HORN_Y + TIPS[1]) / 2} r={PHOTO.w * 0.75}>
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id="bi-grid-mask" maskUnits="userSpaceOnUse" {...GRID_BOX}>
            <rect {...GRID_BOX} fill="url(#bi-grid-fade)" />
          </mask>
          <pattern id="bi-grid" patternUnits="userSpaceOnUse" x={M_AXIS} y={M_BOX.y} width={GRID.cell} height={GRID.cell}>
            <path data-grid-line d={`M${GRID.cell} 0H0V${GRID.cell}`} fill="none" stroke={COLORS.volt} strokeOpacity=".12" />
          </pattern>
          <linearGradient id="bi-scan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={COLORS.volt} stopOpacity="0" />
            <stop offset="1" stopColor={COLORS.volt} stopOpacity=".16" />
          </linearGradient>
          <clipPath id="bi-scan-clip">
            <rect data-scan-clip x={GRID.x} y={PHOTO.y - 20} width={GRID.w} height="0" />
          </clipPath>
          <clipPath id="bi-charge">
            <rect data-charge x={M_BOX.x - 10} y={M_BOX.y + M_BOX.h} width={M_BOX.w + 20} height="0" />
          </clipPath>
          <clipPath id="bi-write">
            <rect data-write x="1180" y="290" width="0" height="360" />
          </clipPath>
        </defs>

        {/* the blueprint: drafting grid, construction lines, the scooter's front elevation */}
        <g data-drawing mask="url(#bi-fade-mask)">
          <rect data-grid {...GRID_BOX} fill="url(#bi-grid)" mask="url(#bi-grid-mask)" />
          <g fill="none" stroke={COLORS.volt} strokeOpacity=".4">
            <line data-guide {...GUIDES.axis} />
            <line data-guide {...GUIDES.datum} />
            <line data-dim {...DIMS.width} />
            <line data-dim {...DIMS.height} />
            {TICKS.map((t) => (
              <line key={`${t.x1} ${t.y1}`} data-tick {...t} />
            ))}
          </g>
          <image data-blueprint href={INTRO_PHOTO.blueprint} {...PHOTO_BOX} clipPath="url(#bi-scan-clip)" />
          <g data-scan-bar>
            <rect x={PHOTO.x - 60} y="-28" width={PHOTO.w + 120} height="28" fill="url(#bi-scan)" />
            <rect data-scan-line x={PHOTO.x - 60} y="-1" width={PHOTO.w + 120} height="2" fill={COLORS.volt} fillOpacity=".8" />
          </g>
        </g>

        {/* the M fills once it has risen flat */}
        <g clipPath="url(#bi-charge)">
          {M_HALVES.map((d) => (
            <path key={d.slice(0, 24)} d={d} fill={COLORS.volt} />
          ))}
        </g>
        {/* its outline starts laid on the scooter's face, in perspective */}
        <g fill="none" stroke={COLORS.volt} strokeLinejoin="round">
          {FACE_PATHS.map((d, i) => (
            <path key={i} data-m-stroke d={d} />
          ))}
        </g>

        <path data-ring-stroke d={RING} fill="none" stroke={COLORS.volt} strokeLinejoin="round" />
        <path data-ring-fill d={RING} fill={COLORS.volt} stroke={COLORS.volt} />

        <g clipPath="url(#bi-write)">
          <path data-move d={LOGO_WORD[0]} fill="#FFFFFF" />
          <path d={LOGO_WORD[1]} fill={COLORS.volt} />
        </g>
        <g data-sub>
          <path d={LOGO_SUB[0]} fill={COLORS.volt} stroke={COLORS.volt} strokeWidth="4" />
          <path d={LOGO_SUB[1]} fill="#CECECE" stroke="#CECECE" strokeWidth="3" />
          <circle cx={LOGO_SUB_DOT.cx} cy={LOGO_SUB_DOT.cy} r={LOGO_SUB_DOT.r} fill={COLORS.volt} />
        </g>
      </svg>

      <div data-label aria-hidden="true" className={`absolute bottom-[3vw] left-[4vw] ${LABEL}`}>
        Front elevation <span className="text-[#4d5149]">·</span> Scale 1:10
      </div>
      <div data-label aria-hidden="true" className={`absolute bottom-[3vw] right-[4vw] hidden sm:block ${LABEL}`}>
        MoveOn <span style={{ color: COLORS.volt }}>EV</span> <span className="text-[#4d5149]">·</span> Drawing 01
      </div>
      <button
        data-skip
        type="button"
        onClick={() => skip.current()}
        className="absolute right-[4vw] top-[3vw] border-b border-[#3a3d38] pb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8E85] transition-colors hover:text-white sm:text-xs"
      >
        Skip intro
      </button>
    </div>
  );
}
