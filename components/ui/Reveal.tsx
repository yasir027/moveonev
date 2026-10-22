"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_PREMIUM, usePrefersReducedMotion } from "@/lib/motion";

/**
 * The home page's card reveal, shared: fades up 20px the first time it scrolls into view.
 * `index` staggers siblings (capped, so a long list doesn't keep the last one waiting);
 * `delay` holds copy back until its heading has risen. Reduced motion: opacity only.
 *
 * `replay` plays it again every time it comes back into view (hiding as it leaves), like
 * ExpandPanel, instead of only the first time.
 *
 * `fade` drops the rise and keeps the fade, for glass: a transform on the element (or any
 * ancestor) kills its backdrop blur.
 *
 * Keep CSS hover transforms off this element: framer leaves an inline `transform` behind,
 * which beats a hover lift. Put the hover on a child.
 */
export function Reveal({
  as = "div",
  index = 0,
  delay = 0,
  replay = false,
  fade = false,
  className,
  children,
}: {
  as?: "div" | "li" | "p";
  index?: number;
  delay?: number;
  replay?: boolean;
  fade?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reducedMotion || fade ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: !replay, margin: "-10%" }}
      transition={{
        duration: 0.6,
        ease: EASE_PREMIUM,
        delay: delay + Math.min(index * 0.06, 0.36),
      }}
    >
      {children}
    </Tag>
  );
}
