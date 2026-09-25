"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/** Share of the cursor's offset from centre the element follows, and the most it may move. */
const PULL = 0.25;
const MAX = 8;

const clamp = (n: number) => Math.max(-MAX, Math.min(MAX, n));

/**
 * Nudges its child a few pixels toward the cursor and springs back on leave.
 *
 * Fine pointers only: touch has no hover to follow, and reduced motion gets no drift at all.
 * For auto-width controls — a sideways drift on a full-width bar just looks broken.
 */
export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 18, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 18, mass: 0.6 });

  function onPointerMove(e: React.PointerEvent) {
    if (reducedMotion || e.pointerType !== "mouse" || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    x.set(clamp((e.clientX - (box.left + box.width / 2)) * PULL));
    y.set(clamp((e.clientY - (box.top + box.height / 2)) * PULL));
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}
