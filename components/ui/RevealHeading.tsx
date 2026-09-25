"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_PREMIUM, usePrefersReducedMotion } from "@/lib/motion";

/** The h2 style every section heading shares. */
export const SECTION_HEADING =
  "font-display text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em]";

interface RevealHeadingProps {
  /** One entry per visual line; each slides up out of its own mask. */
  lines: ReactNode[];
  /** Colour and anything else on top of SECTION_HEADING. */
  className?: string;
  as?: "h1" | "h2" | "h3";
}

/**
 * Section heading that reveals line by line, each line rising out of a clipped mask.
 *
 * Still a single real heading: the lines are block spans inside it, so screen readers and
 * SEO see the same text as before. Reduced motion swaps the slide for a plain fade.
 */
export function RevealHeading({ lines, className = "", as = "h2" }: RevealHeadingProps) {
  const reducedMotion = usePrefersReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={`${SECTION_HEADING} ${className}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-10%" }}
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
            transition={{ duration: reducedMotion ? 0.3 : 0.75, ease: EASE_PREMIUM }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
