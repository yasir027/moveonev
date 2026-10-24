"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_PREMIUM, useIsCompact, usePrefersReducedMotion } from "@/lib/motion";

/** The h2 style every section heading shares. 30px on phones; from ~1000px up 4vw is past
    40px, so desktop sizes are the same as before. */
export const SECTION_HEADING =
  "font-display text-[clamp(1.875rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em]";

interface RevealHeadingProps {
  /** One entry per visual line; each slides up out of its own mask. */
  lines: ReactNode[];
  /** Colour and anything else on top of SECTION_HEADING. */
  className?: string;
  as?: "h1" | "h2" | "h3";
  /** The type style, for headings that aren't section-sized. Defaults to SECTION_HEADING. */
  base?: string;
  /** Rise again every time it comes back into view, rather than only the first time. */
  replay?: boolean;
}

/**
 * Section heading that reveals line by line, each line rising out of a clipped mask.
 *
 * Still a single real heading: the lines are block spans inside it, so screen readers and
 * SEO see the same text as before. Reduced motion swaps the slide for a plain fade.
 */
export function RevealHeading({
  lines,
  className = "",
  as = "h2",
  base = SECTION_HEADING,
  replay = false,
}: RevealHeadingProps) {
  const reducedMotion = usePrefersReducedMotion();
  // Phones: same mask rise, a touch quicker.
  const compact = useIsCompact();
  const Tag = motion[as];

  return (
    <Tag
      className={`${base} ${className}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: !replay, margin: "-10%" }}
      transition={{ staggerChildren: 0.08 }}
    >
      {lines.map((line, i) => (
        /* The mask pads below and pulls the padding back with a negative margin, so
           descenders aren't clipped at this leading without moving the layout. */
        <span key={i} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
          <motion.span
            className="block"
            variants={
              reducedMotion
                ? { hidden: { opacity: 0 }, shown: { opacity: 1 } }
                : { hidden: { y: "110%" }, shown: { y: "0%" } }
            }
            transition={{
              duration: reducedMotion ? 0.3 : compact ? 0.6 : 0.75,
              ease: EASE_PREMIUM,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
