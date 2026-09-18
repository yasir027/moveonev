"use client";

import { useEffect, useState } from "react";

/** The one easing curve used across the whole site. */
export const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DURATION = {
  fast: 0.18, // hover / press feedback
  standard: 0.4, // UI reveals
  product: 0.65, // scooter swap, model selector
  cinematic: 1.0, // hero load-in only
} as const;

/**
 * Respects prefers-reduced-motion. When true, components should
 * swap physical translate/scale transitions for plain opacity fades.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return reduced;
}
