"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SCOOTER, BIKE_CROP, type PartId } from "@/lib/intro/scooter";
import { LOGO_WORD } from "@/lib/intro/logo";
import { COLORS, containedRect, finishLoader, preloadImages } from "@/lib/intro/loader";

gsap.registerPlugin(useGSAP);

/**
 * The homepage Assembly (concept v7, Scenes 1–3): a pen draws the scooter's outline,
 * the parts dock into it, a scan develops the real photo, then the showroom light opens
 * and the scooter flies onto the hero image, which takes over seamlessly.
 */

const { W, H, parts: PARTS, lamps: LAMPS, led: LED, outline: OUTLINE, ground: GROUND } = SCOOTER;
const PART = Object.fromEntries(PARTS.map((p) => [p.id, p])) as Record<PartId, (typeof PARTS)[number]>;

// Paint order, back to front.
const PART_Z: PartId[] = ["rearWheel", "body", "seat", "frontWheel", "fork", "fender", "apron", "headlamps", "bars", "cowl"];

// When each part docks (seconds). The base is drawn in place, everything else glides in.
const TIMELINE: { id: PartId; start: number; dur: number; ease: string }[] = [
  { id: "body", start: 1.05, dur: 0.3, ease: "none" },
  { id: "rearWheel", start: 1.3, dur: 0.45, ease: "power3.out" },
  { id: "frontWheel", start: 1.4, dur: 0.45, ease: "power3.out" },
  { id: "fork", start: 1.55, dur: 0.35, ease: "back.out(1.8)" },
  { id: "fender", start: 1.66, dur: 0.35, ease: "back.out(1.8)" },
  { id: "apron", start: 1.77, dur: 0.4, ease: "back.out(1.5)" },
  { id: "seat", start: 1.88, dur: 0.35, ease: "back.out(1.8)" },
  { id: "bars", start: 1.98, dur: 0.32, ease: "back.out(2)" },
  { id: "cowl", start: 2.07, dur: 0.32, ease: "back.out(2)" },
  { id: "headlamps", start: 2.16, dur: 0.32, ease: "back.out(2.2)" },
];

// Where each part starts, as [x, y, rotation] on a 1600 x 900 stage with a 520 px tall scooter.
const SCATTER_STAGE: Record<PartId, [number, number, number]> = {
  body: [0, 0, 0],
  rearWheel: [330, 0, 0],
  frontWheel: [-330, 0, 0],
  fork: [-150, -40, -12],
  fender: [-170, -30, 10],
  apron: [-190, -80, -5],
  seat: [170, -120, -8],
  bars: [60, -150, 8],
  cowl: [0, -190, 0],
  headlamps: [-170, -150, 0],
};
const STAGE_SCALE = 520 / H;

const IMAGES = [...PARTS.map((p) => `/intro/${p.id}.webp`), "/intro/full.webp"];
const AXIS_X = PART.cowl.cx;
const [LAMP_A, LAMP_B] = LAMPS;

const IRIS_MASK = "radial-gradient(circle at var(--ix) var(--iy), transparent var(--r), #000 calc(var(--r) + 1px))";
const IRIS_STYLE = {
  "--ix": "50%",
  "--iy": "50%",
  "--r": "0px",
  background: `radial-gradient(ellipse 60% 70% at 50% 48%, rgb(255 255 255 / 0.07), transparent 70%), ${COLORS.night}`,
  maskImage: IRIS_MASK,
  WebkitMaskImage: IRIS_MASK,
} as CSSProperties;

export function AssemblyIntro({ onDone }: { onDone: () => void }) {
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
      const chrome = qa<HTMLElement>("[data-chrome]");
      const wordmark = q<SVGSVGElement>("[data-wordmark]");
      const count = q<HTMLDivElement>("[data-count]");
      const countN = q<HTMLSpanElement>("[data-count-n]");
      const rig = q<HTMLDivElement>("[data-rig]");
      const rigInner = q("[data-rig-inner]");
      const partsG = q("[data-parts]");
      const outline = q<SVGPathElement>("[data-outline]");
      const pen = q("[data-pen]");
      const guides = qa<SVGLineElement>("[data-guide]");
      const lines = q("[data-lines]");
      const scanRect = q("[data-scan-rect]");
      const scanBar = q("[data-scan-bar]");
      const glow = q("[data-glow]");
      const beam = q("[data-beam]");
      const partEls = Object.fromEntries(qa("[data-part]").map((p) => [p.getAttribute("data-part"), p])) as Record<PartId, SVGGElement>;
      const blur = {
        rig: q("#ai-mb-rig feGaussianBlur"),
        rearWheel: q("#ai-mb-rw feGaussianBlur"),
        frontWheel: q("#ai-mb-fw feGaussianBlur"),
      };

      // ---------- layout (screen px) ----------
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 768;
      const loaderH = Math.min(vh * (mobile ? 0.5 : 0.58), (vw * 0.8 * H) / W);
      const loaderS = loaderH / H;
      const loader = { x: vw / 2 - (W * loaderS) / 2, y: vh * (mobile ? 0.72 : 0.8) - loaderH, s: loaderS };
      // Parts travel shorter distances on a phone.
      const travel = (mobile ? 0.6 : 1) / STAGE_SCALE;
      const scatter = (id: PartId) => {
        const [x, y, r] = SCATTER_STAGE[id];
        return { x: x * travel, y: y * travel, rotation: r };
      };
      // the showroom light opens from the scooter's centre
      const irisX = loader.x + (W * loaderS) / 2;
      const irisY = loader.y + (H * loaderS) / 2;
      const irisR = Math.hypot(Math.max(irisX, vw - irisX), Math.max(irisY, vh - irisY)) + 40;
      gsap.set(dark, { "--ix": `${irisX}px`, "--iy": `${irisY}px`, "--r": "0px" });

      // The hero image the scooter hands over to, measured when the flight starts.
      const heroTarget = () => {
        const img = document.querySelector("img[data-hero-scooter]");
        if (!img) return null;
        const r = containedRect(img, BIKE_CROP.imgW, BIKE_CROP.imgH);
        const s = (BIKE_CROP.h * r.s) / H;
        return { x: r.x + BIKE_CROP.x * r.s, y: r.y + BIKE_CROP.y * r.s, s };
      };

      const nav = document.querySelector("[data-intro='nav']");
      const heroUi = [...document.querySelectorAll("[data-intro='hero']")];

      // ---------- initial state ----------
      gsap.set(rig, { x: loader.x, y: loader.y, scale: loader.s, transformOrigin: "0 0" });
      gsap.set(wordmark, { autoAlpha: 0, y: 10 });
      gsap.set(count, { autoAlpha: 0 });
      guides.forEach((g) => gsap.set(g, { attr: { "stroke-dashoffset": Number(g.getAttribute("stroke-dasharray")) } }));
      gsap.set(outline, { attr: { "stroke-dashoffset": OUTLINE.len } });
      gsap.set(pen, { opacity: 0 });
      PART_Z.forEach((id) => gsap.set(partEls[id], { ...scatter(id), transformOrigin: "50% 50%", autoAlpha: 0 }));
      if (nav) gsap.set(nav, { autoAlpha: 0, y: -24 });
      gsap.set(heroUi, { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({ paused: true });
      (window as unknown as Record<string, unknown>).__TEST_TL = tl; // TEMP

      // wordmark + counter
      tl.to(wordmark, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0).to(count, { autoAlpha: 1, duration: 0.3 }, 0.1);
      const c = { v: 0 };
      tl.to(c, {
        v: 100,
        duration: 2.18,
        ease: "power1.inOut",
        onUpdate: () => {
          countN.textContent = String(Math.round(c.v)).padStart(3, "0");
        },
      }, 0.3);

      // 1) construction lines, 2) the pen traces the whole silhouette in one stroke
      guides.forEach((g, k) => tl.to(g, { attr: { "stroke-dashoffset": 0 }, duration: 0.3, ease: "power2.out" }, 0.15 + k * 0.08));
      const drawn = { f: 0 };
      tl.set(pen, { opacity: 1 }, 0.35)
        .to(drawn, {
          f: 1,
          duration: 0.9,
          ease: "power1.inOut",
          onUpdate() {
            outline.setAttribute("stroke-dashoffset", (OUTLINE.len * (1 - drawn.f)).toFixed(1));
            const p = outline.getPointAtLength(drawn.f * outline.getTotalLength());
            pen.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
          },
        }, 0.35)
        .to(pen, { opacity: 0, duration: 0.2 }, 1.25);

      // 3) the base fills in place, 4) every other part docks and locks with a ring pulse
      const lockFx = (id: PartId) => {
        const ring = el.querySelector(`[data-lock="${id}"]`);
        gsap.fromTo(ring, { attr: { r: 6 }, opacity: 1 }, { attr: { r: 60 }, opacity: 0, duration: 0.55, ease: "power2.out" });
        gsap.fromTo(partsG, { y: 0 }, { y: 3, duration: 0.07, yoyo: true, repeat: 1, ease: "power1.out" });
      };
      TIMELINE.forEach((p) => {
        const part = partEls[p.id];
        if (p.id === "body") {
          tl.to(part, { autoAlpha: 1, duration: p.dur, ease: "power1.out" }, p.start);
          return;
        }
        tl.to(part, { autoAlpha: 1, duration: 0.12 }, p.start)
          .to(part, { x: 0, y: 0, rotation: 0, duration: p.dur, ease: p.ease }, p.start)
          .call(lockFx, [p.id], p.start + p.dur * 0.7);
        if (p.id === "rearWheel" || p.id === "frontWheel") {
          tl.add(motionBlur(part, blur[p.id], `ai-mb-${p.id === "rearWheel" ? "rw" : "fw"}`, 30, 0, p.dur * 0.85, "power2.out"), p.start);
        }
      });

      // scan: the real photo develops over the blueprint, top to bottom
      tl.to(scanRect, { attr: { height: H + 120 }, duration: 0.7, ease: "power1.inOut" }, 2.55)
        .fromTo(scanBar, { y: -60, opacity: 1 }, { y: H + 60, duration: 0.7, ease: "power1.inOut", immediateRender: false }, 2.55)
        .to(scanBar, { opacity: 0, duration: 0.2 }, 3.22)
        .to(lines, { opacity: 0, duration: 0.45 }, 2.9);

      // the headlamps flick on, hold: "it just built itself"
      tl.fromTo(glow, { opacity: 0 }, { opacity: 1, duration: 0.08, repeat: 1, yoyo: true, immediateRender: false }, 3.3)
        .to(glow, { opacity: 1, duration: 0.15 }, 3.47)
        .to(beam, { opacity: 1, duration: 0.3 }, 3.47);

      // hand-off: the showroom light opens from the scooter and it flies onto the hero image
      tl.to(dark, { "--r": `${irisR}px`, duration: 1.3, ease: "power2.in" }, 3.75)
        .to(chrome, { autoAlpha: 0, duration: 0.5 }, 3.75)
        .to(glow, { opacity: 0, duration: 0.8 }, 3.95)
        .to(beam, { opacity: 0, duration: 0.6 }, 3.85);
      const target = heroTarget();
      if (target && target.y + (H * target.s) / 2 < vh) {
        const land = () => heroTarget() ?? target;
        tl.to(rig, { x: () => land().x, y: () => land().y, scale: () => land().s, duration: 1.2, ease: "power3.inOut" }, 3.75)
          .add(motionBlur(rigInner, blur.rig, "ai-mb-rig", 0, 7, 0.6, "power2.in"), 3.75)
          .add(motionBlur(rigInner, blur.rig, "ai-mb-rig", 7, 0, 0.6, "power2.out"), 4.35)
          // the hero image floats, so re-measure right before handing over
          .to(rig, { x: () => land().x, y: () => land().y, scale: () => land().s, duration: 0.2, ease: "power1.out" }, 4.95);
      } else {
        // Stacked layouts put the hero scooter below the fold: bow out in place instead.
        tl.to(rig, { autoAlpha: 0, scale: loader.s * 0.92, x: loader.x + W * loader.s * 0.04, y: loader.y + H * loader.s * 0.08, duration: 0.7, ease: "power2.in" }, 3.75);
      }
      if (nav) tl.to(nav, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 3.95);
      tl.to(heroUi, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.25, ease: "power3.out" }, 4.25);

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        finishLoader(); // the hero image becomes visible under the rig
        gsap.set([nav, ...heroUi].filter(Boolean), { clearProps: "all" });
        gsap.to(el, { autoAlpha: 0, duration: 0.35, ease: "power1.out", onComplete: onDone });
      };
      tl.call(finish, [], 5.15);

      skip.current = () => {
        if (!finished) tl.progress(1);
      };

      let alive = true;
      preloadImages(IMAGES).then(() => {
        if (alive) tl.play();
      });
      return () => {
        alive = false;
      };
    },
    { scope: root },
  );

  const lampGlow = LAMPS.map(([cx, cy, rx, ry]) => (
    <ellipse key={cx} cx={cx} cy={cy} rx={rx * 1.25} ry={ry * 1.25} fill="url(#ai-lamp)" />
  ));

  return (
    <div ref={root} className="fixed inset-0 z-[101] overflow-hidden">
      {/* the dark stage, with a hole that grows into the showroom */}
      <div data-dark className="absolute inset-0" style={IRIS_STYLE} />

      {/* the scooter rig: W x H scooter units, positioned and scaled by GSAP */}
      <div data-rig className="absolute left-0 top-0" style={{ width: W, height: H }} aria-hidden="true">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="visible" className="block">
          <defs>
            <radialGradient id="ai-lamp">
              <stop offset="0" stopColor="#fff" stopOpacity=".95" />
              <stop offset=".4" stopColor="#F4FFE9" stopOpacity=".45" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ai-beam" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F6FFEE" stopOpacity=".42" />
              <stop offset="1" stopColor="#F6FFEE" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ai-scan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={COLORS.volt} stopOpacity="0" />
              <stop offset=".5" stopColor={COLORS.volt} stopOpacity=".45" />
              <stop offset="1" stopColor={COLORS.volt} stopOpacity="0" />
            </linearGradient>
            <clipPath id="ai-scan-clip">
              <rect data-scan-rect x="-60" y="-60" width={W + 120} height="0" />
            </clipPath>
            <filter id="ai-mb-rig" x="-25%" y="-5%" width="150%" height="110%">
              <feGaussianBlur stdDeviation="0 0" />
            </filter>
            <filter id="ai-mb-rw" x="-70%" y="-5%" width="240%" height="110%">
              <feGaussianBlur stdDeviation="0 0" />
            </filter>
            <filter id="ai-mb-fw" x="-70%" y="-5%" width="240%" height="110%">
              <feGaussianBlur stdDeviation="0 0" />
            </filter>
          </defs>

          <g data-rig-inner>
            <path
              data-beam
              opacity="0"
              fill="url(#ai-beam)"
              d={`M${LAMP_A[0]} ${LAMP_A[1]}L${LAMP_A[0] - 620} ${LAMP_A[1] + 420}L${LAMP_A[0] - 260} ${LAMP_A[1] + 700}L${LAMP_B[0]} ${LAMP_B[1]}Z`}
            />

            <g data-lines>
              <g stroke={COLORS.volt} strokeOpacity=".35" strokeWidth="2" fill="none">
                <line data-guide x1="-120" y1={GROUND} x2={W + 120} y2={GROUND} strokeDasharray={W + 240} />
                <line data-guide x1={AXIS_X} y1="-60" x2={AXIS_X} y2={GROUND + 30} strokeDasharray={GROUND + 90} />
              </g>
              <path
                data-outline
                d={OUTLINE.d}
                fill="none"
                stroke={COLORS.volt}
                strokeWidth="3"
                strokeLinejoin="round"
                strokeDasharray={OUTLINE.len}
              />
              <g data-parts>
                {PART_Z.map((id) => {
                  const p = PART[id];
                  return (
                    <g key={id} data-part={id}>
                      <image href={`/intro/${id}.webp`} x={p.x} y={p.y} width={p.w} height={p.h} />
                    </g>
                  );
                })}
              </g>
            </g>

            {/* the uncut photo, revealed by the scan */}
            <g clipPath="url(#ai-scan-clip)">
              <image href="/intro/full.webp" x="0" y="0" width={W} height={H} />
            </g>
            <g data-scan-bar opacity="0">
              <rect x="-60" y="-26" width={W + 120} height="52" fill="url(#ai-scan)" />
              <rect x="-60" y="-2" width={W + 120} height="4" fill={COLORS.volt} />
            </g>

            <g data-glow opacity="0">
              {lampGlow}
              <path
                d={`M${LED.map((p) => p.join(" ")).join("L")}`}
                stroke="#fff"
                strokeWidth="12"
                strokeOpacity=".35"
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>

            {PART_Z.map((id) => (
              <circle key={id} data-lock={id} cx={PART[id].cx} cy={PART[id].cy} r="4" fill="none" stroke={COLORS.volt} strokeWidth="4" opacity="0" />
            ))}

            <g data-pen opacity="0">
              <circle r="26" fill="url(#ai-lamp)" />
              <circle r="5" fill="#fff" />
            </g>
          </g>
        </svg>
      </div>

      {/* loader chrome */}
      <svg
        aria-hidden="true"
        data-chrome
        data-wordmark
        viewBox="1190 305 2275 330"
        className="absolute left-1/2 top-[86%] w-[max(150px,15vw)] -translate-x-1/2"
      >
        <path d={LOGO_WORD[0]} fill="#fff" />
        <path d={LOGO_WORD[1]} fill={COLORS.volt} />
      </svg>
      <div
        aria-hidden="true"
        data-chrome
        data-count
        className="absolute bottom-[3vw] right-[4vw] font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8E85] sm:text-xs"
      >
        Assembling · <span data-count-n className="tabular-nums" style={{ color: COLORS.volt }}>000</span>%
      </div>
      <button
        data-chrome
        type="button"
        onClick={() => skip.current()}
        className="absolute right-[4vw] top-[3vw] border-b border-[#3a3d38] pb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8E85] transition-colors hover:text-white sm:text-xs"
      >
        Skip intro
      </button>
    </div>
  );
}

/** Horizontal motion blur: attach a filter, tween its stdDeviation, detach when it reaches 0. */
function motionBlur(target: Element, fe: Element, filterId: string, from: number, to: number, duration: number, ease: string) {
  return gsap.fromTo(
    fe,
    { attr: { stdDeviation: `${from} 0` } },
    {
      attr: { stdDeviation: `${to} 0` },
      duration,
      ease,
      immediateRender: false,
      onStart: () => target.setAttribute("filter", `url(#${filterId})`),
      onComplete: () => {
        if (!to) target.removeAttribute("filter");
      },
    },
  );
}
