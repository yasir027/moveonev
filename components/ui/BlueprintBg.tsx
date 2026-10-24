"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView, useReducedMotion } from "framer-motion";
import { BLUEPRINTS, type BlueprintName } from "@/lib/blueprints";
import { EASE_PREMIUM } from "@/lib/motion";

/** Fades toward the text on the left and toward the bottom, so no copy sits on a hard line. */
const MASK = "linear-gradient(to right, transparent, #000 45%), linear-gradient(to top, transparent, #000 40%)";

/**
 * A faint scooter blueprint as background art, for pages without a hero image: the footer's
 * drawing style, in a different model and angle per page. Never the focus.
 *
 * Big and light: it is the page's background. Put it in the page wrapper (`main`, or the
 * page's root), which must be `relative isolate overflow-x-clip`. It sits at -z-10: above
 * the wrapper's own background, behind the copy, and under any section or card that has a
 * background of its own, so it shows on the open white areas and hides behind the rest.
 * Sections it should show through must not paint their own white. `className` sets position
 * and height; the width follows the drawing.
 *
 * Each time it scrolls into view it develops left to right, like the footer's scan, and it
 * resets when it leaves so the reveal replays. Reduced motion: it simply shows.
 */
export function BlueprintBg({
  name,
  className = "",
  flip = false,
}: {
  name: BlueprintName;
  className?: string;
  /** Mirror it, so an angle can face the other way. */
  flip?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reduced = useReducedMotion();
  const bp = BLUEPRINTS[name];
  const shown = inView || !!reduced;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute -z-10 select-none opacity-40 lg:opacity-65 ${className}`}
      // The box takes the drawing's proportions, so its width follows the height the parent
      // sets; without it, an absolute box sized only by height can stretch across the section.
      style={{
        aspectRatio: `${bp.width} / ${bp.height}`,
        maskImage: MASK,
        maskComposite: "intersect",
        WebkitMaskImage: MASK,
        WebkitMaskComposite: "source-in",
      }}
    >
      <div
        className="h-full w-full"
        style={{
          clipPath: shown ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          transition: reduced ? "none" : `clip-path 1.3s cubic-bezier(${EASE_PREMIUM.join(",")}) 0.15s`,
          transform: flip ? "scaleX(-1)" : undefined,
        }}
      >
        <Image
          src={bp.src}
          alt=""
          width={bp.width}
          height={bp.height}
          sizes="(min-width: 1024px) 34vw, 70vw"
          // Always near the top of its page: load it straight away, not lazily.
          loading="eager"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
