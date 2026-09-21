"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";
import { CHANNEL_MATRIX, buildRadialDisplacementMap, foldFreeScale } from "@/lib/glass";

const RADIUS = 60;
/* Roughly 1:1 with the rendered size — a bigger map buys nothing at this diameter. */
const MAP_SIZE = 128;

/**
 * How the bend is distributed across the sphere. r^6 keeps the middle of the lens almost
 * undisturbed — so text under it stays readable — and packs the refraction into the rim,
 * which is where a real sphere bends hardest anyway.
 */
const PROFILE = 6;

/**
 * Fold-free ceiling on the displacement (derived in lib/glass.ts). For a sphere the extent
 * the profile runs across is the radius.
 */
const SCALE = foldFreeScale(RADIUS, PROFILE);

/** Per-channel spread. ±12% is a fringe; much past that reads as a broken RGB split. */
const SPREAD = 0.12;

/**
 * Whether this machine has a real cursor. useSyncExternalStore rather than an effect: it
 * subscribes to the media query directly, and returns false on the server so the markup
 * matches before hydration.
 */
function useFinePointer(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(pointer: fine)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
}

interface GlassLensProps {
  /**
   * Confine the lens to one element — it then only exists while the pointer is inside it.
   * Omit it and the lens follows the pointer across the whole page, which is how the root
   * layout mounts it.
   */
  boundsRef?: RefObject<HTMLElement | null>;
}

/**
 * A refracting sphere that follows the cursor, site-wide unless `boundsRef` narrows it.
 * Chromium bends the real backdrop through the filter below; everywhere else `.glass-lens`
 * falls back to a plain blur with the same rim.
 *
 * Mounted once in the root layout. It is `position: fixed`, so it needs no positioning
 * parent and refracts whatever the page has composited beneath it.
 */
export function GlassLens({ boundsRef }: GlassLensProps) {
  const reducedMotion = usePrefersReducedMotion();
  const fine = useFinePointer();
  const [active, setActive] = useState(false);
  const mapNode = useRef<SVGFEImageElement>(null);

  const x = useMotionValue(-999);
  const y = useMotionValue(-999);
  const springX = useSpring(x, { stiffness: 300, damping: 30, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 30, mass: 0.5 });

  /* Built once and written straight onto the node. Painting a 256x256 map into React state
     would re-render the component for a value only the DOM ever reads. */
  useEffect(() => {
    if (!fine || reducedMotion) return;
    mapNode.current?.setAttribute("href", buildRadialDisplacementMap(MAP_SIZE, PROFILE));
  }, [fine, reducedMotion]);

  const placed = useRef(false);

  useEffect(() => {
    if (!fine || reducedMotion) return;

    /*
     * Scoped to one element when given one, otherwise the whole viewport. `window` has no
     * usable pointerenter/pointerleave pair, so in viewport mode the first move is what
     * raises the lens, and documentElement's pointerleave — which fires when the cursor
     * exits the browser window — is what drops it again.
     */
    const scoped = boundsRef !== undefined;
    const bounds: EventTarget | null = scoped ? boundsRef.current : window;
    if (!bounds) return;

    function move(event: PointerEvent) {
      /*
       * First sighting jumps rather than springing in from wherever the cursor was last
       * seen. The springs have to be jumped too, not just their source: a follower value
       * re-`set`s itself on every source change, jump included, so jumping only the source
       * would still animate the travel — which, now that the lens spans the whole site,
       * would be a visible slide in from the corner every time the cursor re-enters.
       */
      if (!placed.current) {
        x.jump(event.clientX - RADIUS);
        y.jump(event.clientY - RADIUS);
        springX.jump(event.clientX - RADIUS);
        springY.jump(event.clientY - RADIUS);
        placed.current = true;
        if (!scoped) setActive(true);
      }
      x.set(event.clientX - RADIUS);
      y.set(event.clientY - RADIUS);
    }

    function enter() {
      setActive(true);
    }

    function leave() {
      setActive(false);
      placed.current = false;
    }

    bounds.addEventListener("pointermove", move as EventListener);
    if (scoped) {
      bounds.addEventListener("pointerenter", enter);
      bounds.addEventListener("pointerleave", leave);
    } else {
      document.documentElement.addEventListener("pointerleave", leave);
    }

    return () => {
      bounds.removeEventListener("pointermove", move as EventListener);
      if (scoped) {
        bounds.removeEventListener("pointerenter", enter);
        bounds.removeEventListener("pointerleave", leave);
      } else {
        document.documentElement.removeEventListener("pointerleave", leave);
      }
    };
  }, [boundsRef, fine, reducedMotion, x, y, springX, springY]);

  if (!fine || reducedMotion) return null;

  /* NavGlassFilter carries a copy of this: the two differ in region and in how they
     spread the channels, and sharing it would put JSX in lib/. */
  const pass = (channel: keyof typeof CHANNEL_MATRIX, multiplier: number) => (
    <>
      <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        scale={SCALE * multiplier}
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
    <>
      <svg aria-hidden width="0" height="0" className="absolute">
        {/*
          Dispersion: the same bend run three times at slightly different strengths, one per
          channel, then recombined additively. That is what puts real colour in the fringe
          instead of painting a coloured ring on top.
        */}
        <filter
          id="glass-lens"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
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
          {pass("R", 1 + SPREAD)}
          {pass("G", 1)}
          {pass("B", 1 - SPREAD)}
          <feBlend in="cR" in2="cG" mode="screen" result="rg" />
          <feBlend in="rg" in2="cB" mode="screen" />
        </filter>
      </svg>

      <motion.div
        aria-hidden
        style={{ x: springX, y: springY, width: RADIUS * 2, height: RADIUS * 2 }}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.8 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="glass-lens pointer-events-none fixed left-0 top-0 z-30 rounded-full"
      />
    </>
  );
}
