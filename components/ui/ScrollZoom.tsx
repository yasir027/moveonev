"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/** How far (px) the child drifts down by the time it has scrolled away: a touch of parallax. */
const DRIFT = 40;

/**
 * Starts its child slightly zoomed in and eases it back to 1 as the page scrolls it away,
 * with a little parallax drift.
 *
 * `--p` (0 at the top of the page, 1 once the wrapper has scrolled out) is the only thing that
 * moves, written straight to the node by a rAF-throttled scroll listener like ExpandPanel. A
 * transform, so nothing re-lays out. Keep glass (backdrop-filter) out of this wrapper: a
 * transform on an ancestor kills the blur. Reduced motion: no zoom at all.
 */
export function ScrollZoom({
  from = 1.08,
  className = "",
  children,
}: {
  from?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion) return;

    let frame = 0;

    function update() {
      frame = 0;
      const box = node!.getBoundingClientRect();
      const end = box.top + window.scrollY + box.height; // scrolled out once scrollY passes this
      const p = Math.min(1, Math.max(0, window.scrollY / end));
      node!.style.setProperty("--p", p.toFixed(4));
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className={className}
      style={
        reducedMotion
          ? undefined
          : {
              transform: `translate3d(0, calc(var(--p, 0) * ${DRIFT}px), 0) scale(calc(${from} - ${from - 1} * var(--p, 0)))`,
              willChange: "transform",
            }
      }
    >
      {children}
    </div>
  );
}
