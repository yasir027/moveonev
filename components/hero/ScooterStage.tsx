"use client";

import { useState, type PointerEvent } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { HERO_IMAGE_ASPECT, LUXURY_EASE, isNeutral, type Model } from "@/lib/heroModels";

interface ScooterStageProps {
  model: Model;
  colorIndex: number;
  direction: 1 | -1;
  /** Where the image box sits inside the stage (the image is `object-contain` inside it). */
  boxClassName: string;
  /** The first hero on the page: the homepage Assembly lands on this image (see AssemblyIntro). */
  primary?: boolean;
  showHotspots?: boolean;
}

/**
 * The hero scooter: model swap, float, cursor tilt, paint tint and feature hotspots.
 * Fills its (relative) parent; the parent decides the stage's size and clipping.
 */
export function ScooterStage({
  model,
  colorIndex,
  direction,
  boxClassName,
  primary = false,
  showHotspots = true,
}: ScooterStageProps) {
  const [openHotspot, setOpenHotspot] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  const color = model.colors[colorIndex];
  const tinted = colorIndex !== 0;
  const neutralPaint = isNeutral(color.hex);

  // Cursor position over the stage, -0.5..0.5 on each axis.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 120, damping: 20, mass: 0.6 });
  const springY = useSpring(pointerY, { stiffness: 120, damping: 20, mass: 0.6 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const shiftX = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || e.pointerType !== "mouse") return;
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
      {/* Tilt layer: wraps the enter/exit + float so they keep working */}
      <motion.div
        className="absolute inset-0"
        style={reducedMotion ? undefined : { rotateX, rotateY, x: shiftX, transformStyle: "preserve-3d" }}
      >
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={model.id}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * 120, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -120, scale: 0.96 }}
            transition={{ duration: 0.8, ease: LUXURY_EASE }}
            className={`absolute ${boxClassName}`}
          >
            <motion.div
              animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-full w-full"
            >
              <Image
                src={model.image}
                alt={model.name}
                fill
                priority={primary}
                data-hero-scooter={primary ? "" : undefined}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="select-none object-contain drop-shadow-[0_28px_24px_rgba(16,20,18,0.16)]"
              />

              {/* Box matching the contained image, so tint and hotspots line up with it.
                  Centred with flex, not a transform: a transform would isolate the tint's blend. */}
              <div className="pointer-events-none absolute inset-0 flex justify-center">
                <div className="relative h-full max-w-full" style={{ aspectRatio: HERO_IMAGE_ASPECT }}>
                  {/* Paint tint, masked to the scooter's own pixels. `hue` only shifts
                      saturated paint (tyres and seat stay neutral); greys need `color`. */}
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
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.12, duration: 0.45, ease: LUXURY_EASE }}
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
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
