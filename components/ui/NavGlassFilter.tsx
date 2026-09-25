"use client";

import { useEffect, useRef, type RefObject } from "react";
import { CHANNEL_MATRIX, buildPillDisplacementMap, foldFreeScale } from "@/lib/glass";

/**
 * How far in from the rim the bend reaches. The scrolled pill is ~68px tall, so 16px leaves
 * a 36px undisturbed core down the middle — enough to clear the h-9 logo and the links.
 */
const BAND = 16;

/**
 * How the bend is distributed across that band. Lower than the lens sphere's 6: at this band
 * width a steep profile collapses the refraction into a hairline, and the pill is meant to
 * read as thick glass.
 */
const PROFILE = 3;

/**
 * Fold-free ceiling (see lib/glass.ts). The band is the extent the profile runs across, the
 * way a radius is for the sphere.
 *
 * A pill has a second bound the sphere doesn't: at the end caps the inward normals converge
 * on the arc centre, which folds once the displacement reaches the corner radius — `rr /
 * DISPLACEMENT_UNIT`, about 68px here. It never binds while BAND < PROFILE * rr, so it is
 * not computed; don't "fix" its absence.
 */
const SCALE = foldFreeScale(BAND, PROFILE);

/**
 * Per-channel spread. Reduce-only, so every pass stays at or under the ceiling above — and
 * blue bends hardest, which is the way a real edge disperses.
 */
const SPREAD = 0.22;

const CHANNEL_FALLOFF = { B: 1, G: 1 - SPREAD, R: 1 - SPREAD * 2 } as const;

interface NavGlassFilterProps {
  /** The pill whose size the displacement map is built for. */
  targetRef: RefObject<HTMLElement | null>;
}

/**
 * The SVG filter behind the header pill's refraction, plus the map it runs on.
 *
 * Separate from GlassFilter's `#liquid-glass` on purpose: that one is turbulence tuned for
 * 28px chips, and its own doc comment warns it smears anything larger — the pill is 920px.
 * This is a pill-shaped lens instead, undisturbed through the middle and magnifying at the
 * rim, with the bend run three times at different strengths to put real colour in the fringe.
 *
 * Only Chromium applies SVG filters in `backdrop-filter`; everywhere else `.glass-nav` keeps
 * its plain blur and the painted rim carries the fringe. The map is built regardless, rather
 * than gated on html[data-liquid] — that attribute is set by another component's effect, and
 * a few milliseconds of canvas is cheaper than a mount-order dependency between them.
 */
export function NavGlassFilter({ targetRef }: NavGlassFilterProps) {
  const mapNode = useRef<SVGFEImageElement>(null);
  const built = useRef("");
  const frame = useRef(0);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      /*
       * The border box, for two separate reasons.
       *
       * Not contentRect: that excludes the pill's padding, and feImage stretches the map
       * across the whole filter region — the border box. A content-box map comes out
       * anisotropic, with the band wider on the axis that had more padding (here 28px of
       * vertical padding against 48px horizontal, so the top and bottom edges would bend
       * over twice the depth the end caps do) and the caps no longer circular.
       *
       * Not getBoundingClientRect: that carries framer's layout scale, so mid-morph we
       * would be building maps for sizes that last a single frame.
       */
      const box = entries[0].borderBoxSize?.[0];
      const w = Math.round(box ? box.inlineSize : entries[0].contentRect.width);
      const h = Math.round(box ? box.blockSize : entries[0].contentRect.height);
      const key = `${w}x${h}`;
      if (key === built.current || w < 2 || h < 2) return;

      /* The morph fires this every frame for half a second. Rounding plus the key guard
         means each distinct size builds once, and the rAF collapses a burst into one. */
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        built.current = key;
        mapNode.current?.setAttribute("href", buildPillDisplacementMap(w, h, BAND, PROFILE));
        /* Only now is the filter safe to use: until the map lands, feDisplacementMap has no
           in2 and Chrome paints the pass as transparent black — a hole through the pill.
           The CSS chain keys off this attribute. */
        el.dataset.refract = "";
      });
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [targetRef]);

  /* Deliberately a copy of GlassLens's helper rather than a shared one: the two differ in
     region and in how they spread the channels, and sharing it would put JSX in lib/. */
  const pass = (channel: keyof typeof CHANNEL_MATRIX) => (
    <>
      <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        scale={SCALE * CHANNEL_FALLOFF[channel]}
        xChannelSelector="R"
        yChannelSelector="G"
        result={`d${channel}`}
      />
      <feColorMatrix
        in={`d${channel}`}
        type="matrix"
        values={CHANNEL_MATRIX[channel]}
        result={`c${channel}`}
      />
    </>
  );

  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      {/* The region stays at the element box — unlike the lens, which needs 160%. Every
          offset here points inward, so no pass ever samples outside it, and a 920x68
          filter surface is less than half the work of a padded one. */}
      <filter
        id="nav-glass"
        x="0"
        y="0"
        width="100%"
        height="100%"
        colorInterpolationFilters="sRGB"
      >
        <feImage
          ref={mapNode}
          result="map"
          preserveAspectRatio="none"
          x="0"
          y="0"
          width="100%"
          height="100%"
        />
        {pass("R")}
        {pass("G")}
        {pass("B")}
        <feBlend in="cR" in2="cG" mode="screen" result="rg" />
        <feBlend in="rg" in2="cB" mode="screen" />
      </filter>
    </svg>
  );
}
