"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { EASE_PREMIUM, usePrefersReducedMotion } from "@/lib/motion";

/*
 * The /models header, set like a magazine cover: the headline runs edge to edge and the
 * lineup stands in the middle of it.
 *
 * The headline is drawn twice in the same box. The solid copy sits behind the scooters,
 * so the bikes cover its middle letters; a volt outline copy sits in front, masked to the bikes'
 * silhouette, so those letters trace across the paint in green. The two copies share
 * one layout and one animation, which is what keeps them registered.
 *
 * models-lineup.webp is ModelsBg.png trimmed to its content, bottom-aligned and lifted
 * by --lift off the floor.
 */

const LINES = [
  { text: "Eight models.", size: "text-[11.5vw]", drift: -1 },
  { text: "No licence, no RTO.", size: "text-[8.4vw]", drift: 1 },
];

const NUMBERS = [
  { value: "25 km/h", label: "Top speed" },
  { value: "70–120 km", label: "Range" },
  { value: "150 kg", label: "Load" },
];

/* Line mask: rises from below, the same move as RevealHeading. */
const rise = {
  hidden: { y: "110%" },
  shown: { y: "0%" },
};

function Headline({ tint = false }: { tint?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const Tag = tint ? motion.div : motion.h1;

  return (
    <Tag
      aria-hidden={tint || undefined}
      initial="hidden"
      animate="shown"
      transition={{ staggerChildren: 0.09 }}
      className={[
        "pointer-events-none absolute inset-x-0 top-[6%] select-none text-center font-display font-bold uppercase leading-[0.84] tracking-[-0.045em]",
        tint
          ? "text-transparent [-webkit-text-stroke:2.5px_var(--color-volt)]"
          : "z-0 text-carbon",
      ].join(" ")}
    >
      {LINES.map((line) => (
        /* Outer span drifts with scroll, inner span rises on load: two owners, two nodes. */
        <span
          key={line.text}
          className="block whitespace-nowrap"
          style={{
            transform: `translateX(calc(var(--spill, 0) * ${line.drift * 8}vw))`,
          }}
        >
          <span className="-mb-[0.06em] block overflow-hidden pb-[0.06em]">
            <motion.span
              className={`block ${line.size}`}
              variants={reduced ? { hidden: { opacity: 0 }, shown: { opacity: 1 } } : rise}
              transition={{ duration: reduced ? 0.3 : 0.85, ease: EASE_PREMIUM }}
            >
              {line.text}
            </motion.span>
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function LineupShowcase() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /*
   * --spill runs 0 → 1 as the header scrolls away: the two lines pull apart and the
   * scooters grow a touch. A plain listener writing a CSS variable, not framer's
   * useScroll — see the note in WhoIsItFor — so scrolling costs no React render.
   */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    function update() {
      const p = Math.min(1, Math.max(0, window.scrollY / section!.offsetHeight));
      section!.style.setProperty("--spill", p.toFixed(4));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-white pt-28 lg:pt-32">
      {/* Stage: solid headline, scooters, tinted headline. */}
      {/* --lift raises the scooters off the floor; the tint mask reads it too. */}
      <div className="relative h-[340px] w-full [--lift:1.25rem] sm:h-[480px] sm:[--lift:2rem] lg:h-[min(66vh,640px)] lg:[--lift:3.5rem]">
        <Headline />

        <div
          className="absolute inset-x-0 z-10 flex h-full justify-center"
          style={{
            bottom: "var(--lift)",
            transform: "scale(calc(1 + var(--spill, 0) * 0.06))",
            transformOrigin: "50% 100%",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_PREMIUM, delay: 0.15 }}
            className="relative aspect-[1400/1659] h-full"
          >
            <Image
              src="/models-lineup.webp"
              alt="The MOVE ON lineup, five scooters side by side"
              fill
              priority
              sizes="(min-width: 1024px) 560px, 80vw"
              className="object-contain object-bottom"
            />
          </motion.div>
        </div>

        {/* Tint: a volt copy of the headline, masked by the scooter photo itself, so it
            shows only where the letters cross the bikes. Same size and anchor as the image
            (height = stage, bottom = --lift, grows with --spill). It fades in once the
            bikes have landed, since the mask doesn't follow their rise. */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE_PREMIUM, delay: reduced ? 0.3 : 1 }}
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            WebkitMaskImage: "url(/models-lineup.webp)",
            maskImage: "url(/models-lineup.webp)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center calc(100% - var(--lift))",
            maskPosition: "center calc(100% - var(--lift))",
            WebkitMaskSize: "auto calc(100% * (1 + var(--spill, 0) * 0.06))",
            maskSize: "auto calc(100% * (1 + var(--spill, 0) * 0.06))",
          }}
        >
          <Headline tint />
        </motion.div>

        {/* Desktop: copy and numbers flank the wheels. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.45 }}
          className="absolute inset-x-0 bottom-10 z-30 mx-auto hidden w-full max-w-[1400px] items-end justify-between px-8 lg:flex"
        >
          <Copy />
          <Numbers />
        </motion.div>

        {/* Floor */}
        <span aria-hidden className="absolute inset-x-0 bottom-0 z-0 h-px bg-carbon/10" />
      </div>

      {/* Mobile and tablet: the same two blocks, stacked under the stage. */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:hidden">
        <Copy />
        <Numbers />
      </div>
    </section>
  );
}

function Copy() {
  return (
    <p className="max-w-[340px] text-[15px] leading-relaxed text-carbon/65 lg:w-[24%] lg:max-w-[300px]">
      Every model runs the same platform — 25 km/h, 100+ km of range and a 150 kg load
      rating. Pick the one that looks right, then choose your finish and battery.
    </p>
  );
}

function Numbers() {
  return (
    <dl className="w-full divide-y divide-carbon/10 border-y border-carbon/10 sm:w-[240px]">
      {NUMBERS.map((n) => (
        <div key={n.label} className="flex items-baseline justify-between gap-6 py-2.5">
          <dt className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-carbon/45">
            {n.label}
          </dt>
          <dd className="font-display text-[18px] font-bold tracking-tight text-carbon">
            {n.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
