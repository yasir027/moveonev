"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LOGO_MARK_CENTER, LOGO_SUB, LOGO_SUB_DOT, LOGO_VIEWBOX, LOGO_VIEWBOX_STR, LOGO_WORD } from "@/lib/intro/logo";
import { INTRO_PHOTO } from "@/lib/intro/introPhoto";
import { COLORS, finishLoader, preloadImages } from "@/lib/intro/loader";
import { LOGO_MARK_SUBPATHS } from "@/components/brand/Logo";

gsap.registerPlugin(useGSAP);

/**
 * The site intro, played on the first page of a visit: a band of light reveals a real
 * scooter out of the dark, a hairline finds the M in its face, the photo recedes and the
 * M stays, the ring closes into the icon, the wordmark writes out, and the lockup docks
 * into the header as the page opens from behind it.
 */

// Seconds. Slow, even eases; each beat lands before the next begins.
const T = {
  sweep: 0.2, // light moves across the scooter
  sweepDur: 1.5,
  trace: 1.55, // the hairline finds the M
  traceDur: 1.2,
  recede: 2.85, // the photo sinks back, the M fills
  fillDur: 0.9,
  ring: 3.8, // the ring closes: the icon
  ringDur: 0.7,
  lockup: 4.7, // the wordmark writes out
  dock: 5.9, // into the header, page opens
  done: 6.8,
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
// The M's box in logo units, for placing the photo and the fill wipe.
const M_BOX = { x: 534, y: 300, w: 402, h: 442 };
const M_CENTER_Y = M_BOX.y + M_BOX.h / 2;

// The photo in logo units, so it shares one coordinate system with the M and the lockup.
const U = M_BOX.w / INTRO_PHOTO.m.w;
const PHOTO = {
  x: M_BOX.x - INTRO_PHOTO.m.x * U,
  y: M_BOX.y - INTRO_PHOTO.m.y * U,
  w: INTRO_PHOTO.w * U,
  h: INTRO_PHOTO.h * U,
};
// The lower scooter dissolves into the dark below the M.
const FADE_FROM = M_BOX.y + M_BOX.h + 40;
const FADE_TO = FADE_FROM + 380;
// The photo stays quiet: a desaturated studio shot, lit only by the sweep.
const PHOTO_FILTER = "grayscale(1) brightness(0.62) contrast(1.15)";

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
// The sweep gradients run diagonally across the photo; GSAP slides them sideways.
const SWEEP_LINE = { x1: PHOTO.x, y1: PHOTO.y, x2: PHOTO.x + PHOTO.w, y2: PHOTO.y + PHOTO.h * 0.35 };
const PHOTO_BOX = { x: PHOTO.x, y: PHOTO.y, width: PHOTO.w, height: PHOTO.h };

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
      const photo = q("[data-photo]");
      const sweeps = qa("[data-sweep]");
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
      const big = Math.min((vh * 0.4) / (M_BOX.h * k), (vw * 0.7) / (M_BOX.w * k));
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
      gsap.set(ringFill, { opacity: 0 });
      gsap.set(sub, { opacity: 0 });
      gsap.set(skipBtn, { autoAlpha: 0 });
      if (nav) gsap.set(nav, { autoAlpha: 0, y: -20 });
      if (headerLogo) gsap.set(headerLogo, { opacity: 0 });
      gsap.set(content, { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({ paused: true });
      /** Draws a path's stroke from start to end. */
      const draw = (p: SVGPathElement, at: number, dur: number) =>
        tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: dur, ease: "power2.inOut" }, at);

      tl.to(skipBtn, { autoAlpha: 1, duration: 0.6 }, 0.4);

      // 1) a band of light crosses the scooter and leaves it standing in the dark
      const sweep = { x: -PHOTO.w };
      tl.to(sweep, {
        x: PHOTO.w,
        duration: T.sweepDur,
        ease: "power1.inOut",
        onUpdate() {
          sweeps.forEach((g) => g.setAttribute("gradientTransform", `translate(${sweep.x.toFixed(1)} 0)`));
        },
      }, T.sweep);

      // 2) a hairline finds the M in its face, both halves at once
      mStroke.forEach((p) => draw(p, T.trace, T.traceDur));

      // 3) the photo sinks back into the dark and the M fills with light
      tl.to(photo, { opacity: 0, scale: 0.98, svgOrigin: `${LOGO_MARK_CENTER[0]} ${M_CENTER_Y}`, duration: 1.1, ease: "power2.inOut" }, T.recede);
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
      }, T.recede + 0.2);
      tl.to(mStroke, { opacity: 0, duration: 0.4 }, T.recede + T.fillDur);

      // 4) the ring closes around it: the icon
      draw(ringStroke, T.ring, T.ringDur);
      tl.to(ringFill, { opacity: 1, duration: 0.4, ease: "power1.inOut" }, T.ring + T.ringDur - 0.1)
        .to(ringStroke, { opacity: 0, duration: 0.3 }, T.ring + T.ringDur + 0.2);

      // 5) the icon settles into the lockup as the wordmark writes out
      tl.to(lock, { ...lockup, duration: 1, ease: "power3.inOut" }, T.lockup)
        .to(write, { attr: { width: 2300 }, duration: 0.75, ease: "power2.inOut" }, T.lockup + 0.4)
        .to(sub, { opacity: 1, duration: 0.5 }, T.lockup + 0.95);

      // 6) dock into the header while the light opens the page
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
      preloadImages([INTRO_PHOTO.src]).then(() => {
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
          {/* behind the band the scooter stays revealed; ahead of it, still dark */}
          <linearGradient id="bi-reveal" data-sweep gradientUnits="userSpaceOnUse" {...SWEEP_LINE}>
            <stop offset="0.42" stopColor="#fff" />
            <stop offset="0.52" stopColor="#000" />
          </linearGradient>
          {/* the band itself: a soft sheen of light */}
          <linearGradient id="bi-sheen" data-sweep gradientUnits="userSpaceOnUse" {...SWEEP_LINE}>
            <stop offset="0.38" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.47" stopColor="#fff" stopOpacity="0.28" />
            <stop offset="0.53" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bi-fade" gradientUnits="userSpaceOnUse" x1="0" y1={FADE_FROM} x2="0" y2={FADE_TO}>
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id="bi-reveal-mask" maskUnits="userSpaceOnUse" {...PHOTO_BOX}>
            <rect {...PHOTO_BOX} fill="url(#bi-reveal)" />
          </mask>
          <mask id="bi-fade-mask" maskUnits="userSpaceOnUse" {...PHOTO_BOX}>
            <rect {...PHOTO_BOX} fill="url(#bi-fade)" />
          </mask>
          {/* the sheen lights only the scooter, not the air around it */}
          <mask id="bi-body" maskUnits="userSpaceOnUse" {...PHOTO_BOX} style={{ maskType: "alpha" }}>
            <image href={INTRO_PHOTO.src} {...PHOTO_BOX} />
          </mask>
          <clipPath id="bi-charge">
            <rect data-charge x={M_BOX.x - 10} y={M_BOX.y + M_BOX.h} width={M_BOX.w + 20} height="0" />
          </clipPath>
          <clipPath id="bi-write">
            <rect data-write x="1180" y="290" width="0" height="360" />
          </clipPath>
        </defs>

        <g data-photo mask="url(#bi-fade-mask)">
          <g mask="url(#bi-reveal-mask)">
            <image href={INTRO_PHOTO.src} {...PHOTO_BOX} style={{ filter: PHOTO_FILTER }} />
          </g>
          <rect {...PHOTO_BOX} fill="url(#bi-sheen)" mask="url(#bi-body)" />
        </g>

        <g clipPath="url(#bi-charge)">
          {M_HALVES.map((d) => (
            <path key={d.slice(0, 24)} d={d} fill={COLORS.volt} />
          ))}
        </g>
        <g fill="none" stroke={COLORS.volt} strokeLinejoin="round">
          {M_TRACE.map((d) => (
            <path key={d.slice(0, 24)} data-m-stroke d={d} />
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
