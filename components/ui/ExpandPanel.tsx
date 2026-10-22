"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/** Side gutter and top-corner radius of the panel before it opens. */
const INSET = "clamp(12px, 3vw, 48px)";
const RADIUS = "48px";

/**
 * Lets a dark section arrive as an inset, rounded panel that opens to full bleed as it scrolls
 * in, so the hard mist -> carbon cut reads as a section opening rather than a jump.
 *
 * `--p` (0 closed, 1 open) is the only thing that moves. It defaults to 1 in the markup, so
 * server render, no-JS and reduced motion all get the finished full-bleed section.
 *
 * Inset and radius only, drawn as a clip-path — no scale or margin, either of which would
 * resize or rewrap the text inside the panel. A plain scroll
 * listener writes the variable straight to the node, like ScrollCurtain: framer's useScroll did
 * not track targets on this page.
 */
export function ExpandPanel({
  children,
  gutterClassName = "bg-mist",
}: {
  children: ReactNode;
  /** The side gutters' ground: match the section above (the model page is white). */
  gutterClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const wrap = ref.current;
    if (!wrap || reducedMotion) return;

    let frame = 0;

    function update() {
      frame = 0;
      const vh = window.innerHeight;
      const top = wrap!.getBoundingClientRect().top;
      /* Closed while the top edge is still near the viewport bottom, fully open by the time it
         has climbed to 15% of the way down. */
      const p = Math.min(1, Math.max(0, 1 - (top - 0.15 * vh) / (0.75 * vh)));
      wrap!.style.setProperty("--p", p.toFixed(4));
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
      wrap.style.removeProperty("--p");
    };
  }, [reducedMotion]);

  /* Clipped, not margined: a margin narrows the content box, so the text inside rewrapped on
     every frame and the section's height (and everything below it) jumped while scrolling.
     The clip leaves layout alone. */
  const inset = `calc((1 - var(--p, 1)) * ${INSET})`;
  const radius = `calc((1 - var(--p, 1)) * ${RADIUS})`;
  const panel: CSSProperties = {
    clipPath: `inset(0 ${inset} 0 ${inset} round ${radius} ${radius} 0 0)`,
  };

  return (
    /* The gutters match the section above, so they read as page, not as a gap. */
    <div ref={ref} className={gutterClassName}>
      <div style={panel}>{children}</div>
    </div>
  );
}
