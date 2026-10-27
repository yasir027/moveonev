"use client";

import { useEffect, useState, type PointerEvent } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { LUXURY_EASE, type Model } from "@/lib/heroModels";
import { useIsCompact } from "@/lib/motion";

interface ScooterStageProps {
  model: Model;
  colorIndex: number;
  /** Where the image box sits inside the stage (the image is `object-contain` inside it). */
  boxClassName: string;
  /** The first hero on the page: the homepage Assembly lands on this image (see AssemblyIntro). */
  primary?: boolean;
  showHotspots?: boolean;
}

/** The scooter faces left, so it rides out to the left and the next arrives from the right. */
const RIDE_OUT = { duration: 0.6, ease: [0.45, 0, 0.9, 0.55] as const };
const RIDE_IN = { duration: 0.75, delay: 0.32, ease: LUXURY_EASE };
const RIDE_MS = 1150;
/** Changing colour fades the new photo in over the old one. */
const COLOR_FADE = 0.45;

/**
 * The hero scooter. Changing model rides the old one out and the new one in; changing
 * colour cross-fades to that colour's photo. Also handles the idle float, cursor tilt and
 * hotspots.
 */
export function ScooterStage({
  model,
  colorIndex,
  boxClassName,
  primary = false,
  showHotspots = true,
}: ScooterStageProps) {
  const [openHotspot, setOpenHotspot] = useState<number | null>(null);
  const [riding, setRiding] = useState(false);
  const [shownId, setShownId] = useState(model.id);
  const reducedMotion = useReducedMotion();
  // Phones: a smaller idle float. The ride itself is in % of the box, so it already scales.
  const compact = useIsCompact();

  if (model.id !== shownId) {
    setShownId(model.id);
    setOpenHotspot(null);
    if (!reducedMotion) setRiding(true);
  }

  useEffect(() => {
    if (!riding) return;
    const timer = setTimeout(() => setRiding(false), RIDE_MS);
    return () => clearTimeout(timer);
  }, [riding]);

  // Cursor position over the stage, -0.5..0.5 on each axis.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 120, damping: 20, mass: 0.6 });
  const springY = useSpring(pointerY, { stiffness: 120, damping: 20, mass: 0.6 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const shiftX = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || riding || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className="absolute inset-0 [perspective:1400px]"
    >
      {/* Ground streaks, only while something is riding */}
      <AnimatePresence>
        {riding && !reducedMotion && (
          <motion.div
            aria-hidden
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {[70, 78, 85, 91].map((top, index) => (
              <motion.span
                key={top}
                className="absolute h-px rounded-full bg-gradient-to-l from-transparent via-carbon/20 to-transparent"
                style={{ top: `${top}%`, width: `${26 + index * 8}%` }}
                initial={{ x: "120%", opacity: 0 }}
                animate={{ x: "-140%", opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, ease: "easeIn", repeat: Infinity, delay: index * 0.08 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tilt layer: wraps the ride and the float so they keep working */}
      <motion.div
        className="absolute inset-0"
        style={reducedMotion ? undefined : { rotateX, rotateY, x: shiftX, transformStyle: "preserve-3d" }}
      >
        {/* initial={false}: the first scooter is already parked — it must not ride in on
            load, both because the page opens on it and because the intro hands over to it. */}
        <AnimatePresence mode="popLayout" initial={false}>
          <Rider
            key={model.id}
            model={model}
            colorIndex={colorIndex}
            boxClassName={boxClassName}
            primary={primary}
            reducedMotion={!!reducedMotion}
            compact={compact}
            riding={riding}
            showHotspots={showHotspots}
            openHotspot={openHotspot}
            setOpenHotspot={setOpenHotspot}
          />
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/** One scooter: rides in, sits still, rides out. */
function Rider({
  model,
  colorIndex,
  boxClassName,
  primary,
  reducedMotion,
  compact,
  riding,
  showHotspots,
  openHotspot,
  setOpenHotspot,
}: {
  model: Model;
  colorIndex: number;
  boxClassName: string;
  primary: boolean;
  reducedMotion: boolean;
  compact: boolean;
  riding: boolean;
  showHotspots: boolean;
  openHotspot: number | null;
  setOpenHotspot: (index: number | null) => void;
}) {
  return (
    <motion.div
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: "100%" }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: "0%" }}
      exit={
        reducedMotion
          ? { opacity: 0, transition: { duration: 0.3 } }
          : { opacity: 0, x: "-105%", transition: { ...RIDE_OUT, opacity: { duration: 0.45, delay: 0.15 } } }
      }
      transition={reducedMotion ? { duration: 0.3 } : { ...RIDE_IN, opacity: { duration: 0.2, delay: 0.32 } }}
      className={`absolute ${boxClassName}`}
    >
      <motion.div
        // Squats on the way out, dips its nose as it settles — pivoting on the rear wheel.
        animate={
          reducedMotion
            ? { y: 0, rotate: 0 }
            : riding
              ? { y: [0, -4, 0], rotate: [-1.6, -0.6, 0] }
              : { y: [0, compact ? -5 : -10, 0], rotate: 0 }
        }
        transition={
          reducedMotion
            ? undefined
            : riding
              ? { duration: 0.9, ease: LUXURY_EASE }
              : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ transformOrigin: "78% 85%" }}
        className="relative h-full w-full"
      >
        {/* Every colour's photo is stacked and loaded up front, so a swap never waits on
            the network. The chosen one fades in on top; the old one stays solid underneath
            until it has, so the scooter never goes see-through halfway. */}
        {model.colors.map((color, index) => {
          const active = index === colorIndex;
          return (
            <motion.div
              key={color.image}
              aria-hidden={!active}
              className="absolute inset-0"
              style={{ zIndex: active ? 1 : 0 }}
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={
                active || reducedMotion
                  ? { duration: reducedMotion ? 0 : COLOR_FADE, ease: LUXURY_EASE }
                  : { duration: 0, delay: COLOR_FADE }
              }
            >
              <Image
                src={color.image}
                alt={active ? `${model.name} in ${color.name}` : ""}
                fill
                priority={primary && index === 0}
                loading={primary && index === 0 ? undefined : "eager"}
                data-hero-scooter={primary && active ? "" : undefined}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="select-none object-contain"
              />
            </motion.div>
          );
        })}

        {/* Box matching the contained image, so the hotspots line up with it. */}
        <div className="pointer-events-none absolute inset-0 z-[2] flex justify-center">
          <div className="relative h-full max-w-full" style={{ aspectRatio: model.imageAspect }}>
            {showHotspots &&
              model.hotspots.map((spot, index) => {
                const open = openHotspot === index;
                return (
                  <motion.div
                    key={spot.label}
                    // Not on phones: at that size the dots read as smudges on a small scooter.
                    className="pointer-events-auto absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
                    style={{ left: spot.x, top: spot.y }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: riding ? 0 : 1, scale: 1 }}
                    transition={{ delay: riding ? 0 : 1, duration: 0.4, ease: LUXURY_EASE }}
                  >
                    {/* A 44px tap target around the 28px dot, so it's easy to hit with a finger. */}
                    <button
                      type="button"
                      aria-label={spot.label}
                      aria-expanded={open}
                      onMouseEnter={() => setOpenHotspot(index)}
                      onMouseLeave={() => setOpenHotspot(null)}
                      onFocus={() => setOpenHotspot(index)}
                      onBlur={() => setOpenHotspot(null)}
                      onClick={() => setOpenHotspot(open ? null : index)}
                      className="group flex h-11 w-11 items-center justify-center rounded-full"
                    >
                      <span className="glass-liquid flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                        <span className="h-1.5 w-1.5 rounded-full bg-carbon" />
                      </span>
                    </button>
                    <AnimatePresence>
                      {open && (
                        <motion.span
                          role="tooltip"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.25, ease: LUXURY_EASE }}
                          className="glass-frost pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium text-carbon"
                        >
                          {spot.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
