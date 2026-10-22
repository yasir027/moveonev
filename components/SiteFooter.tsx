"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { rechargeLogo, TransitionLink } from "@/components/loader/RouteTransition";
import { Magnetic } from "@/components/ui/Magnetic";
import { FOOTER_BLUEPRINT as BP } from "@/lib/footerBlueprint";
import { COLORS } from "@/lib/intro/loader";
import { whatsappUrl } from "@/lib/heroModels";
import { models } from "@/lib/models";
import { EASE_PREMIUM } from "@/lib/motion";
import { SHOWROOM } from "@/lib/showroom";

/**
 * The site footer: a plain layout of lockup and links, with the intro's blueprint picked
 * up again as a faint side elevation of the scooter behind it, standing on the bar's rule.
 * On the home page, ShowroomLead (below) runs straight on into it.
 *
 * Motion, all of it off under reduced motion:
 *   - the drawing develops behind a scan bar every time it comes into view
 *   - as the footer scrolls up, the scooter rolls forward into place, its wheels turning
 *     at the true rate for the distance covered
 *   - the cursor is a torch: the lines under it light up
 */

const W = BP.width;
const H = BP.height;
const GROUND = BP.ground * H;
const AXLE_Y = BP.rearAxle.y * H;
const REAR_X = BP.rearAxle.x * W;
const FRONT_X = BP.frontAxle.x * W;
const WHEEL_R = BP.wheelRadius * W;
const TOP = BP.top * H;
const REARMOST = BP.rearmost * W;
const FRONTMOST = BP.frontmost * W;

// The drawing's viewBox: mirror tops to the ground, so the element's bottom edge IS the ground.
const VB = { x: REARMOST - 30, y: TOP - 30, w: FRONTMOST - REARMOST + 60, h: GROUND - TOP + 30 };

const LINE = 3.4; // construction line width, in image pixels
// How far back the scooter starts, as a share of its own width, and the wheel turn that
// distance makes (rolling without slipping: distance / circumference).
const DRIVE = 0.18;
const WHEEL_TURN = ((DRIVE * VB.w) / (2 * Math.PI * WHEEL_R)) * 360;
const TORCH_PX = 220; // the torch's radius on screen

// Fades the drawing out toward the lockup on the left and toward the top. How much of it
// stays solid is --wm-solid: on the home page globals.css raises it, so the mirrors show
// where the scooter rises into ShowroomLead.
const WATERMARK_MASK =
  "linear-gradient(to right, transparent, #000 35%), linear-gradient(to top, #000 var(--wm-solid, 55%), transparent)";

const MONO = "font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A8E85] sm:text-[11px]";
const HEADING = "font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40";
// A volt hairline draws in under the link on hover.
const UNDERLINE =
  "bg-[linear-gradient(#7DFF40,#7DFF40)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[color,background-size] duration-300 ease-premium hover:bg-[length:100%_1px]";
const LINK = `text-[15px] text-white/70 hover:text-white ${UNDERLINE}`;
const NUDGE = "transition-transform duration-300 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5";

const EXPLORE = [
  { label: "The lineup", href: "/#lineup" },
  { label: "Batteries", href: "/#batteries" },
  { label: "FAQ", href: "/#faq" },
  { label: "Book a test ride", href: "/#book" },
  { label: "Contact us", href: "/contact" },
];

export function SiteFooter() {
  const footer = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const torch = useRef<SVGCircleElement>(null);
  const torchLayer = useRef<SVGGElement>(null);
  const reduced = !!useReducedMotion();
  // The footer outlives page changes (it's in the root layout); keying the content on the
  // path gives every page its own entrance.
  const pathname = usePathname();

  // 0 as the footer's top meets the viewport bottom, 1 once the page has bottomed out.
  const { scrollYProgress } = useScroll({ target: footer, offset: ["start end", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [`${-DRIVE * 100}%`, "0%"]);
  const turn = useTransform(scrollYProgress, [0, 1], [0, WHEEL_TURN]);

  // The torch listens on the page wrapper, not the footer: on the home page the scooter
  // rises out of the footer into ShowroomLead, and its mirrors should light up too. It only
  // ever lights the drawing, so a wider listener costs nothing elsewhere.
  useEffect(() => {
    const host = footer.current?.parentElement;
    if (!host || reduced) return;
    function moveTorch(e: globalThis.PointerEvent) {
      const s = svg.current;
      const ctm = s?.getScreenCTM();
      if (e.pointerType !== "mouse" || !s || !ctm || !torch.current || !torchLayer.current) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      torch.current.setAttribute("cx", p.x.toFixed(1));
      torch.current.setAttribute("cy", p.y.toFixed(1));
      torch.current.setAttribute("r", ((TORCH_PX * VB.w) / s.clientWidth).toFixed(1));
      torchLayer.current.style.opacity = "1";
    }
    function hideTorch() {
      if (torchLayer.current) torchLayer.current.style.opacity = "0";
    }
    host.addEventListener("pointermove", moveTorch, { passive: true });
    host.addEventListener("pointerleave", hideTorch);
    return () => {
      host.removeEventListener("pointermove", moveTorch);
      host.removeEventListener("pointerleave", hideTorch);
    };
  }, [reduced]);

  return (
    <footer
      ref={footer}
      data-theme="dark"
      data-site-footer
      className="relative overflow-hidden text-white"
      style={{ background: COLORS.night }}
    >
      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-8 sm:pb-16 sm:pt-20">
        {/* the drawing's ground is its bottom edge, so it stands on the bar's rule */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 w-[130%] max-w-none -translate-x-1/2 lg:left-auto lg:right-[-4%] lg:w-[64%] lg:max-w-[860px] lg:translate-x-0"
          style={{
            maskImage: WATERMARK_MASK,
            maskComposite: "intersect",
            WebkitMaskImage: WATERMARK_MASK,
            WebkitMaskComposite: "source-in",
          }}
        >
          <motion.div style={reduced ? undefined : { x }}>
            <ScooterBlueprint svgRef={svg} torchRef={torch} torchLayerRef={torchLayer} turn={reduced ? undefined : turn} />
          </motion.div>
        </div>

        <div key={pathname} className="relative grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Rise index={0} className="lg:col-span-5">
            <FooterBrand />
          </Rise>
          <FooterLinks className="lg:col-span-7" />
        </div>
      </div>
      <FooterBar />
    </footer>
  );
}

/**
 * The home page's last section, written as the footer's opening: the same night ground,
 * the same column, no rule between them, so the invitation runs straight on into the
 * lockup below. It lives here to share the footer's type and motion.
 *
 * The details are the links: the number calls, the address opens directions.
 */
export function ShowroomLead() {
  return (
    // data-footer-lead lets the footer's scooter rise up into this section (globals.css).
    // The shadow fills under the join: on a fractional boundary at non-integer zoom both
    // grounds anti-alias their shared edge, and the white page behind showed as a hairline.
    <section
      data-theme="dark"
      data-footer-lead
      className="text-white"
      style={{ background: COLORS.night, boxShadow: `0 2px 0 ${COLORS.night}` }}
    >
      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-8 sm:pt-24">
        <Rise index={0}>
          <h2 className="text-4xl text-white lg:text-5xl">Come ride one.</h2>
        </Rise>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:max-w-4xl">
          <Rise index={1}>
            <ContactLink href={`tel:${SHOWROOM.phone.tel}`} label="Call">
              {SHOWROOM.phone.display}
            </ContactLink>
          </Rise>
          <Rise index={2}>
            <ContactLink href={SHOWROOM.mapsUrl} external label="Directions">
              {/* broken where a person would say it, not wherever the column runs out */}
              {SHOWROOM.addressLines[0]},<br />
              {SHOWROOM.addressLines[1]}
            </ContactLink>
          </Rise>
        </div>
      </div>
    </section>
  );
}

/** A detail set as large type that is itself the link; a volt hairline draws in on hover. */
function ContactLink({ href, label, external, children }: { href: string; label: string; external?: boolean; children: ReactNode }) {
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group block max-w-md">
      <span className="font-display text-xl font-semibold leading-snug tracking-[-0.01em] text-white/90 transition-colors duration-300 group-hover:text-white lg:text-2xl">
        {/* clone: the hairline runs under each line of a wrapped address, not just the last */}
        <span className={`${UNDERLINE} [box-decoration-break:clone] group-hover:bg-[length:100%_1px]`}>{children}</span>
        <ArrowUpRight size={20} className={`ml-1.5 inline-block align-[-0.1em] text-volt ${NUDGE}`} aria-hidden />
      </span>
      <span className={`mt-3 block ${MONO}`}>— {label}</span>
    </a>
  );
}

/** Fades its children up into place the first time they're seen, in a short stagger. */
function Rise({ index, className = "", children }: { index: number; className?: string; children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: EASE_PREMIUM }}
    >
      {children}
    </motion.div>
  );
}

function FooterBrand() {
  const reduced = useReducedMotion();
  const charging = useRef(false);

  /** The logo recharges on hover, as the header's does between pages. */
  function recharge(e: PointerEvent<HTMLElement>) {
    const logo = e.currentTarget.querySelector("svg");
    if (reduced || charging.current || !logo) return;
    charging.current = true;
    rechargeLogo(logo).eventCallback("onComplete", () => {
      charging.current = false;
    });
  }

  return (
    <div>
      <TransitionLink href="/" aria-label="MoveOn home" className="inline-block" onPointerEnter={recharge}>
        <Logo tone="dark" className="h-12 w-auto sm:h-14" />
      </TransitionLink>
      <p className="mt-6 max-w-sm font-display text-2xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[26px]">
        Made for the road ahead.
      </p>
      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/50">
        Electric scooters drawn for the city. Quiet, light and ready when you are.
      </p>
      <Magnetic className="mt-7">
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full bg-volt px-6 py-3 font-display text-[15px] font-semibold text-carbon transition-colors duration-300 hover:bg-[#6ee62f]"
        >
          Book a test ride
          <ArrowUpRight size={17} className={NUDGE} />
        </a>
      </Magnetic>
    </div>
  );
}

function FooterLinks({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Footer" className={`grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 ${className}`}>
      <Rise index={1}>
        <h2 className={HEADING}>Models</h2>
        <ul className="mt-5 space-y-3">
          {models.map((m) => (
            <li key={m.slug}>
              <TransitionLink href={`/models/${m.slug}`} className={LINK}>
                {m.name}
              </TransitionLink>
            </li>
          ))}
          <li>
            <TransitionLink href="/models" className={`group inline-flex items-center gap-1.5 text-[15px] text-volt/80 hover:text-volt ${UNDERLINE}`}>
              All models <ArrowUpRight size={14} className={NUDGE} />
            </TransitionLink>
          </li>
        </ul>
      </Rise>
      <Rise index={2}>
        <h2 className={HEADING}>Explore</h2>
        <ul className="mt-5 space-y-3">
          {EXPLORE.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={LINK}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </Rise>
      <Rise index={3} className="col-span-2 sm:col-span-1">
        <h2 className={HEADING}>Visit</h2>
        <ul className="mt-5 space-y-3 text-[15px] text-white/70">
          <li>
            <span className="block text-white/40">Showroom hours</span>
            {SHOWROOM.hours.label}
          </li>
          <li>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={`group inline-flex items-center gap-1.5 ${LINK}`}>
              Chat on WhatsApp <ArrowUpRight size={14} className={NUDGE} />
            </a>
          </li>
        </ul>
      </Rise>
    </nav>
  );
}

/** The last line of the page; its top rule is the ground the drawing stands on. */
function FooterBar() {
  const reduced = useReducedMotion();
  return (
    <div className="border-t" style={{ borderColor: "rgb(125 255 64 / 0.4)" }}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 sm:px-8 ${MONO}`}>
        <span>© {new Date().getFullYear()} MOVE ON</span>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
          }}
          className="group transition-colors hover:text-white"
        >
          Back to top{" "}
          <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-premium group-hover:-translate-y-1">
            ↑
          </span>
        </a>
      </div>
    </div>
  );
}

interface BlueprintProps {
  svgRef: RefObject<SVGSVGElement | null>;
  torchRef: RefObject<SVGCircleElement | null>;
  torchLayerRef: RefObject<SVGGElement | null>;
  /** Wheel rotation in degrees, from the roll-in; absent under reduced motion. */
  turn?: MotionValue<number>;
}

/**
 * The side elevation, sized like an image. Every animated part is driven by the svg's
 * `hidden` / `shown` variant, so leaving view snaps it back to blank and the next entry
 * develops it again.
 */
function ScooterBlueprint({ svgRef, torchRef, torchLayerRef, turn }: BlueprintProps) {
  const inView = useInView(svgRef, { amount: 0.35 });
  const reduced = !!useReducedMotion();
  const state = inView || reduced ? "shown" : "hidden";

  const at = (delay: number, duration = 0.7) => (reduced ? { duration: 0 } : { delay, duration, ease: EASE_PREMIUM });
  const draw = (delay: number, duration?: number): Variants => ({
    hidden: { pathLength: 0, opacity: 0, transition: { duration: 0 } },
    shown: { pathLength: 1, opacity: 1, transition: { pathLength: at(delay, duration), opacity: at(delay, 0.01) } },
  });
  // pathLength works by rewriting stroke-dasharray, so dashed lines fade in instead —
  // which also keeps the wheel circles' dashes, the only thing showing them turn.
  const appear = (delay: number, duration = 0.6): Variants => ({
    hidden: { opacity: 0, transition: { duration: 0 } },
    shown: { opacity: 1, transition: at(delay, duration) },
  });

  return (
    <motion.svg
      ref={svgRef}
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      overflow="visible"
      className="block h-auto w-full"
      initial="hidden"
      animate={state}
    >
      <defs>
        <clipPath id="ft-scan">
          <motion.rect
            y={VB.y}
            height={VB.h + 4}
            variants={{
              hidden: { attrX: VB.x + VB.w, width: 0, transition: { duration: 0 } },
              shown: { attrX: VB.x, width: VB.w, transition: at(0.25, 1.2) },
            }}
          />
        </clipPath>
        <linearGradient id="ft-bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={COLORS.volt} stopOpacity=".18" />
          <stop offset="1" stopColor={COLORS.volt} stopOpacity="0" />
        </linearGradient>
        <filter id="ft-glow" x="-5%" y="-5%" width="110%" height="110%">
          {/* a soft halo at 40%, so the lines read as lit rather than neon */}
          <feGaussianBlur stdDeviation="5" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .4 0" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="ft-torch-fade">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".45" stopColor="#fff" stopOpacity=".6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="ft-torch" maskUnits="userSpaceOnUse" x={VB.x - W} y={VB.y - H} width={W * 3} height={H * 3}>
          <circle ref={torchRef} cx="-9999" cy="-9999" r="600" fill="url(#ft-torch-fade)" />
        </mask>
      </defs>

      {/* the watermark proper: faint, a touch fainter on small screens */}
      <g className="opacity-[0.13] lg:opacity-[0.2]">
        {/* construction: axle verticals, then each wheel's circle and hub cross, which
            turn as the scooter rolls in */}
        <g fill="none" stroke={COLORS.volt} strokeWidth={LINE}>
          <g strokeOpacity=".22" strokeDasharray="14 12">
            <motion.line variants={appear(0.1)} x1={REAR_X} y1={GROUND} x2={REAR_X} y2={AXLE_Y - WHEEL_R - 120} />
            <motion.line variants={appear(0.15)} x1={FRONT_X} y1={GROUND} x2={FRONT_X} y2={AXLE_Y - WHEEL_R - 120} />
          </g>
          {[REAR_X, FRONT_X].map((cx, i) => (
            <motion.g key={cx} style={{ rotate: turn, transformBox: "fill-box", transformOrigin: "center" }}>
              <motion.circle
                variants={appear(0.7 + i * 0.05, 0.9)}
                cx={cx}
                cy={AXLE_Y}
                r={WHEEL_R + 14}
                strokeOpacity=".3"
                strokeDasharray="10 14"
              />
              <motion.path
                variants={draw(0.9, 0.4)}
                d={`M${cx - 34} ${AXLE_Y}H${cx + 34}M${cx} ${AXLE_Y - 34}V${AXLE_Y + 34}`}
                strokeOpacity=".6"
              />
            </motion.g>
          ))}
        </g>

        {/* the side elevation itself, developed front to back behind the scan bar */}
        <g clipPath="url(#ft-scan)">
          <image href={BP.src} x="0" y="0" width={W} height={H} filter="url(#ft-glow)" />
        </g>
        {!reduced && (
          <motion.g
            variants={{
              hidden: { x: VB.x + VB.w, opacity: 0, transition: { duration: 0 } },
              shown: {
                x: VB.x,
                opacity: [0, 1, 1, 0],
                transition: { ...at(0.25, 1.2), opacity: { delay: 0.25, duration: 1.2, times: [0, 0.08, 0.85, 1] } },
              },
            }}
          >
            <rect x="0" y={TOP - 20} width="70" height={GROUND - TOP + 20} fill="url(#ft-bar)" />
            <rect x="-1.5" y={TOP - 20} width="3" height={GROUND - TOP + 20} fill={COLORS.volt} fillOpacity=".85" />
          </motion.g>
        )}
      </g>

      {/* the torch: the same drawing at full strength, seen only through the cursor's
          pool of light (moved by SiteFooter, straight on the DOM) */}
      <g
        ref={torchLayerRef}
        clipPath="url(#ft-scan)"
        mask="url(#ft-torch)"
        style={{ opacity: 0, transition: "opacity 400ms cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        <image href={BP.src} x="0" y="0" width={W} height={H} filter="url(#ft-glow)" opacity=".85" />
      </g>
    </motion.svg>
  );
}
