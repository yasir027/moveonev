"use client";

import { useEffect } from "react";

/**
 * The SVG filter behind `.glass-liquid`'s refraction. Rendered once in the root layout.
 * Only Chromium applies SVG filters in `backdrop-filter`, so the refraction is switched on
 * there (html[data-liquid]); other browsers keep the plain blur.
 */
export function GlassFilter() {
  useEffect(() => {
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } })
      .userAgentData?.brands;
    if (brands?.some((b) => b.brand === "Chromium")) {
      document.documentElement.dataset.liquid = "";
    }
  }, []);

  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <filter id="liquid-glass" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="2" seed="7" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="22" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
