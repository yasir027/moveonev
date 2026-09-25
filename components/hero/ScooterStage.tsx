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
  type MotionValue,
} from "framer-motion";
import { LUXURY_EASE, isNeutral, type Model } from "@/lib/heroModels";

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
/** One wheel turn per ~1.3 box widths is true to life but reads as slow, so wind it on. */
const SPIN_GAIN = 2.6;

/**
 * The hero scooter. Changing model rides the old one out and the new one in, with the
 * wheels actually turning — they are separate layers cut from the photo (see
 * scripts/build-wheel-sprites.mjs) that spin in their own tilted plane, behind the fender,
 * fork and housing. Also handles the idle float, cursor tilt, paint tint and hotspots.
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

  const color = model.colors[colorIndex];
  const tinted = colorIndex !== 0;
  const neutralPaint = isNeutral(color.hex);

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
            tinted={tinted}
            neutralPaint={neutralPaint}
            boxClassName={boxClassName}
            primary={primary}
            reducedMotion={!!reducedMotion}
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

/** One scooter: rides in, sits still, rides out — wheels turning with the distance covered. */
function Rider({
  model,
  colorIndex,
  tinted,
  neutralPaint,
  boxClassName,
  primary,
  reducedMotion,
  riding,
  showHotspots,
  openHotspot,
  setOpenHotspot,
}: {
  model: Model;
  colorIndex: number;
  tinted: boolean;
  neutralPaint: boolean;
  boxClassName: string;
  primary: boolean;
  reducedMotion: boolean;
  riding: boolean;
  showHotspots: boolean;
  openHotspot: number | null;
  setOpenHotspot: (index: number | null) => void;
}) {
  const color = model.colors[colorIndex];
  // How far along the box this scooter has moved, in percent — the wheels read this.
  const travel = useMotionValue(reducedMotion ? 0 : 100);
  // The photo's own pixel width, so travel and wheel radius are in the same units.
  const photoWidth = Number(model.imageAspect.split("/")[0]);

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
      onUpdate={(latest) => {
        const x = latest.x;
        if (typeof x === "string") travel.set(parseFloat(x));
      }}
      className={`absolute ${boxClassName}`}
    >
      <motion.div
        // Squats on the way out, dips its nose as it settles — pivoting on the rear wheel.
        animate={
          reducedMotion
            ? { y: 0, rotate: 0 }
            : riding
              ? { y: [0, -4, 0], rotate: [-1.6, -0.6, 0] }
              : { y: [0, -10, 0], rotate: 0 }
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
        <Image
          src={model.image}
          alt={model.name}
          fill
          priority={primary}
          data-hero-scooter={primary ? "" : undefined}
          sizes="(min-width: 1024px) 55vw, 100vw"
          // Cut out with its own soft floor shadow baked in, so it needs no drop-shadow.
          className="select-none object-contain"
        />

        {/* Box matching the contained image, so wheels, tint and hotspots line up with it.
            Centred with flex, not a transform: a transform would isolate the tint's blend. */}
        <div className="pointer-events-none absolute inset-0 flex justify-center">
          <div className="relative h-full max-w-full" style={{ aspectRatio: model.imageAspect }}>
            {!reducedMotion &&
              model.wheels.map((wheel) => (
                <Wheel
                  // Both wheels draw the same sprite, so the cover is what tells them apart.
                  key={wheel.cover}
                  wheel={wheel}
                  travel={travel}
                  riding={riding}
                  photoWidth={photoWidth}
                />
              ))}

            {/* Paint tint, masked to the photo. `hue` only shifts saturated paint (tyres
                and seat stay neutral); greys need `color`. */}
            <motion.div
              aria-hidden
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: tinted ? 0.9 : 0, backgroundColor: color.hex }}
              transition={{ duration: 0.6, ease: LUXURY_EASE }}
              style={{
                mixBlendMode: neutralPaint ? "color" : "hue",
                maskImage: `url(${model.image})`,
                WebkitMaskImage: `url(${model.image})`,
                maskSize: "100% 100%",
                WebkitMaskSize: "100% 100%",
              }}
            />

            {showHotspots &&
              model.hotspots.map((spot, index) => {
                const open = openHotspot === index;
                return (
                  <motion.div
                    key={spot.label}
                    className="pointer-events-auto absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: spot.x, top: spot.y }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: riding ? 0 : 1, scale: 1 }}
                    transition={{ delay: riding ? 0 : 1, duration: 0.4, ease: LUXURY_EASE }}
                  >
                    <button
                      type="button"
                      aria-label={spot.label}
                      aria-expanded={open}
                      onMouseEnter={() => setOpenHotspot(index)}
                      onMouseLeave={() => setOpenHotspot(null)}
                      onFocus={() => setOpenHotspot(index)}
                      onBlur={() => setOpenHotspot(null)}
                      onClick={() => setOpenHotspot(open ? null : index)}
                      className="glass-liquid flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-carbon" />
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

/**
 * One wheel, in three layers: the photo underneath, a whole rebuilt wheel on top of it that
 * spins, and the parts that cover it here — mudguard and fork, or motor housing — laid back
 * over both, which is what makes it look like the wheel turns *behind* them.
 *
 * The outer element carries the fixed foreshortening (rotate, then squash), so the wheel
 * spins plainly inside its own plane and the silhouette never changes shape.
 */
function Wheel({
  wheel,
  travel,
  riding,
  photoWidth,
}: {
  wheel: Model["wheels"][number];
  travel: MotionValue<number>;
  riding: boolean;
  photoWidth: number;
}) {
  /*
   * Travel is a percentage of the photo's width, so distance in photo pixels divided by
   * the wheel's radius in photo pixels gives the turn in radians — the wheel rolls with
   * the scooter rather than spinning to its own clock. Negative: moving left rolls
   * anticlockwise on screen.
   */
  const spin = useTransform(travel, (pct) => {
    const travelled = ((100 - pct) / 100) * photoWidth;
    return -(travelled / wheel.radiusPx) * (180 / Math.PI) * SPIN_GAIN;
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute"
        style={{
          left: wheel.cx,
          top: wheel.cy,
          width: wheel.size,
          aspectRatio: "1",
          translate: "-50% -50%",
          rotate: `${wheel.tilt}deg`,
          scale: `1 ${wheel.squash}`,
        }}
      >
        <motion.img
          src={wheel.sprite}
          alt=""
          className="h-full w-full select-none"
          style={{ rotate: spin, filter: wheel.dim ? `brightness(${wheel.dim})` : undefined }}
          initial={false}
          animate={{ opacity: riding ? 1 : 0 }}
          transition={{ duration: 0.12 }}
        />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- a fixed-size sprite, already sized */}
      <img
        src={wheel.cover}
        alt=""
        className="absolute select-none"
        style={{
          left: wheel.cx,
          top: wheel.cy,
          width: wheel.coverSize,
          aspectRatio: "1",
          translate: "-50% -50%",
        }}
      />
    </div>
  );
}
