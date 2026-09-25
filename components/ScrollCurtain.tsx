"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/** How dark the pinned section gets by the time it is fully covered. */
const MAX_DIM = 0.55;

interface ScrollCurtainProps {
  /** Pinned underneath while `children` slides up over it. */
  pinned: ReactNode;
  /** Must paint opaque — it is what covers the pinned content. */
  children: ReactNode;
}

/**
 * Pins one section and lets the next rise over it, so a hard colour change between the two
 * arrives as a panel sliding into place instead of a cut.
 *
 * Desktop only. The heroes are taller than a phone viewport, and `position: sticky` on
 * something taller than the viewport doesn't hold — it just scrolls away — so small screens
 * keep plain stacking.
 *
 * Requires `body { overflow-x: clip }`, not `hidden`: `hidden` makes the body a scroll
 * container and sticky descendants stop sticking.
 */
export function ScrollCurtain({ pinned, children }: ScrollCurtainProps) {
  const ref = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  /*
   * A plain scroll listener writing the style directly, rather than framer-motion's
   * useScroll: that samples on animation frames and did not track this target at all here.
   * One getBoundingClientRect per scroll on a single element is cheap, and writing straight
   * to the node keeps the whole thing out of React's render path.
   */
  useEffect(() => {
    const curtain = ref.current;
    const overlay = overlayRef.current;
    if (!curtain || !overlay || reducedMotion) return;

    function update() {
      const box = curtain!.getBoundingClientRect();
      /* 0 when the curtain's top reaches the viewport top, 1 when its bottom does. */
      const progress = Math.min(1, Math.max(0, -box.top / box.height));
      overlay!.style.opacity = String(progress * MAX_DIM);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reducedMotion]);

  return (
    <div ref={ref} className="relative">
      <div className="lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden">
        {pinned}

        {/*
          The dim is an overlay rather than opacity or scale on the hero itself. Either of
          those would make the hero a backdrop root, and every .glass-liquid chip inside it
          would lose its blur. A sibling overlay leaves the hero untouched — and fading
          toward carbon happens to pre-mix the colour of the section arriving over it.
        */}
        <div
          ref={overlayRef}
          aria-hidden
          style={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 hidden bg-carbon lg:block"
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
