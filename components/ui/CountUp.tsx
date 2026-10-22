"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { EASE_PREMIUM, usePrefersReducedMotion } from "@/lib/motion";

/**
 * A number that counts up from 0 the first time it scrolls into view.
 *
 * The server HTML carries the real value (SEO, no-JS). The client drops it to 0 on mount,
 * which is only invisible if the number sits inside something that fades in on view (a
 * Reveal), so keep it there. Writes the text straight to the node: no re-render per frame.
 * Reduced motion keeps the final value.
 */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // The reduced-motion flag settles a frame after mount, so put the real value back.
    if (reducedMotion) {
      node.textContent = `${value}${suffix}`;
      return;
    }
    if (!inView) {
      node.textContent = `0${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.2,
      ease: EASE_PREMIUM,
      onUpdate: (n) => {
        node.textContent = `${Math.round(n)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, reducedMotion]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
