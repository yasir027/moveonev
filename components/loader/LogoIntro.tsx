"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LOGO_MARK, LOGO_MARK_CENTER, LOGO_SUB, LOGO_SUB_DOT, LOGO_VIEWBOX, LOGO_VIEWBOX_STR, LOGO_WORD } from "@/lib/intro/logo";
import { COLORS, finishLoader } from "@/lib/intro/loader";
import { LOGO_MARK_SUBPATHS } from "@/components/brand/Logo";

gsap.registerPlugin(useGSAP);

/**
 * The Logo Assembly (concept v7, Scene 6), for a first visit that lands on any page
 * other than the homepage: the pen draws the mark, the bolt charges like a battery,
 * the wordmark writes out, then the logo docks into the header as the light opens.
 */

const IRIS_MASK = "radial-gradient(circle at var(--ix) var(--iy), transparent var(--r), #000 calc(var(--r) + 1px))";
const IRIS_STYLE = {
  "--ix": "50%",
  "--iy": "50%",
  "--r": "0px",
  background: `radial-gradient(ellipse 60% 70% at 50% 48%, rgb(255 255 255 / 0.07), transparent 70%), ${COLORS.night}`,
  maskImage: IRIS_MASK,
  WebkitMaskImage: IRIS_MASK,
} as CSSProperties;

const LOGO_RATIO = LOGO_VIEWBOX.h / LOGO_VIEWBOX.w;

export function LogoIntro({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = <T extends Element = SVGElement>(s: string) => el.querySelector<T>(s)!;

      document.querySelector<HTMLElement>(".brand-cover")?.style.setProperty("display", "none");

      const dark = q<HTMLDivElement>("[data-dark]");
      const lock = q<SVGSVGElement>("[data-lock]");
      const strokes = [...el.querySelectorAll<SVGPathElement>("[data-stroke]")];
      const pen = q("[data-pen]");
      const charge = q("[data-charge]");
      const write = q("[data-write]");
      const move = q("[data-move]");
      const sub = q("[data-sub]");
      const ring = q("[data-ring]");
      const count = q<HTMLDivElement>("[data-count]");
      const countN = q<HTMLSpanElement>("[data-count-n]");

      const nav = document.querySelector("[data-intro='nav']");
      const headerLogo = document.querySelector<SVGSVGElement>("svg[data-brand-logo]");
      const page = [...document.querySelectorAll("[data-intro='page']")];

      // ---------- layout (screen px) ----------
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = Math.min(vw * 0.8, Math.max(320, vw * 0.475));
      const centre = { x: vw / 2 - w / 2, y: vh * 0.467 - (w * LOGO_RATIO) / 2, s: 1 };
      // Measured before the header is nudged out of place for its entrance.
      const hr = headerLogo?.getBoundingClientRect();
      const dock = hr && hr.width ? { x: hr.left, y: hr.top, s: hr.width / w } : null;
      const markC = {
        x: centre.x + ((LOGO_MARK_CENTER[0] - LOGO_VIEWBOX.x) / LOGO_VIEWBOX.w) * w,
        y: centre.y + ((LOGO_MARK_CENTER[1] - LOGO_VIEWBOX.y) / LOGO_VIEWBOX.w) * w,
      };
      const irisR = Math.hypot(Math.max(markC.x, vw - markC.x), Math.max(markC.y, vh - markC.y)) + 40;

      // ---------- initial state ----------
      gsap.set(lock, { width: w, height: w * LOGO_RATIO, x: centre.x, y: centre.y, transformOrigin: "0 0" });
      gsap.set(dark, { "--ix": `${markC.x}px`, "--iy": `${markC.y}px`, "--r": "0px" });
      const lens = strokes.map((p) => p.getTotalLength());
      const total = lens.reduce((a, b) => a + b, 0);
      strokes.forEach((p, i) => gsap.set(p, { attr: { "stroke-dasharray": lens[i], "stroke-dashoffset": lens[i] } }));
      gsap.set(pen, { opacity: 0 });
      gsap.set(sub, { opacity: 0 });
      if (nav) gsap.set(nav, { autoAlpha: 0, y: -20 });
      if (headerLogo) gsap.set(headerLogo, { opacity: 0 });
      gsap.set(page, { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline();
      (window as unknown as Record<string, unknown>).__TEST_TL = tl; // TEMP

      // 1) one pen draws the ring, then the bolt
      let t = 0.05;
      strokes.forEach((p, i) => {
        const d = (0.65 * lens[i]) / total;
        const o = { f: 0 };
        tl.to(o, {
          f: 1,
          duration: d,
          ease: "none",
          onUpdate() {
            p.setAttribute("stroke-dashoffset", (lens[i] * (1 - o.f)).toFixed(1));
            const pt = p.getPointAtLength(o.f * lens[i]);
            pen.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
          },
        }, t);
        t += d;
      });
      tl.set(pen, { opacity: 1 }, 0.05).to(pen, { opacity: 0, duration: 0.15 }, 0.7);

      // 2) the bolt charges like a battery, 0 -> 100%
      const ch = { h: 0 };
      tl.to(ch, {
        h: 770,
        duration: 0.5,
        ease: "power1.in",
        onUpdate() {
          charge.setAttribute("y", (910 - ch.h).toFixed(1));
          charge.setAttribute("height", ch.h.toFixed(1));
          countN.textContent = String(Math.round(ch.h / 7.7)).padStart(3, "0") + "%";
        },
      }, 0.6);
      tl.fromTo(ring, { attr: { r: 20 }, opacity: 1 }, { attr: { r: 560 }, opacity: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, 1.1);

      // 3) the wordmark writes out
      tl.to(write, { attr: { width: 2300 }, duration: 0.4, ease: "power2.inOut" }, 1.0).to(sub, { opacity: 1, duration: 0.25 }, 1.3);

      // 4) dock into the header while the light opens the page
      tl.to(count, { autoAlpha: 0, duration: 0.2 }, 1.55)
        .to(dark, { "--r": `${irisR}px`, duration: 0.8, ease: "power2.in" }, 1.6)
        // the lockup was drawn for the dark stage; it lands in the light header
        .to(move, { attr: { fill: "#111310" }, duration: 0.5 }, 1.7);
      if (dock) tl.to(lock, { x: dock.x, y: dock.y, scale: dock.s, duration: 0.7, ease: "power3.inOut" }, 1.6);
      if (nav) tl.to(nav, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, 2.0);
      if (headerLogo) tl.to(headerLogo, { opacity: 1, duration: 0.2 }, 2.2);
      tl.to(lock, { opacity: 0, duration: 0.2 }, dock ? 2.25 : 1.9)
        .to(page, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06, ease: "power3.out" }, 2.15)
        .call(() => {
          finishLoader();
          gsap.set([nav, headerLogo, ...page].filter(Boolean), { clearProps: "all" });
          onDone();
        }, [], 2.7);
    },
    { scope: root },
  );

  return (
    <div ref={root} className="fixed inset-0 z-[101] overflow-hidden" aria-hidden="true">
      <div data-dark className="absolute inset-0" style={IRIS_STYLE} />

      <svg data-lock viewBox={LOGO_VIEWBOX_STR} overflow="visible" className="absolute left-0 top-0">
        <defs>
          <radialGradient id="li-lamp">
            <stop offset="0" stopColor="#fff" stopOpacity=".95" />
            <stop offset=".4" stopColor="#F4FFE9" stopOpacity=".45" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <clipPath id="li-charge">
            <rect data-charge x="350" y="910" width="770" height="0" />
          </clipPath>
          <clipPath id="li-write">
            <rect data-write x="1180" y="290" width="0" height="360" />
          </clipPath>
        </defs>

        <g fill="none" stroke={COLORS.volt} strokeWidth="9" strokeLinejoin="round">
          {LOGO_MARK_SUBPATHS.map((d) => (
            <path key={d.slice(0, 24)} data-stroke d={d} />
          ))}
        </g>
        <g clipPath="url(#li-charge)">
          <path d={LOGO_MARK} fill={COLORS.volt} />
        </g>
        <g clipPath="url(#li-write)">
          <path data-move d={LOGO_WORD[0]} fill="#FFFFFF" />
          <path d={LOGO_WORD[1]} fill={COLORS.volt} />
        </g>
        <g data-sub>
          <path d={LOGO_SUB[0]} fill={COLORS.volt} stroke={COLORS.volt} strokeWidth="4" />
          <path d={LOGO_SUB[1]} fill="#CECECE" stroke="#CECECE" strokeWidth="3" />
          <circle cx={LOGO_SUB_DOT.cx} cy={LOGO_SUB_DOT.cy} r={LOGO_SUB_DOT.r} fill={COLORS.volt} />
        </g>
        <g data-pen opacity="0">
          <circle r="70" fill="url(#li-lamp)" />
          <circle r="14" fill="#fff" />
        </g>
        <circle data-ring cx={LOGO_MARK_CENTER[0]} cy={LOGO_MARK_CENTER[1]} r="20" fill="none" stroke={COLORS.volt} strokeWidth="8" opacity="0" />
      </svg>

      <div
        data-count
        className="absolute bottom-[3vw] right-[4vw] font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8E85] sm:text-xs"
      >
        Charging ·{" "}
        <span data-count-n className="tabular-nums" style={{ color: COLORS.volt }}>
          000%
        </span>
      </div>
    </div>
  );
}
