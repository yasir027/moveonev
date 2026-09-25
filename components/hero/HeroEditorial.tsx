"use client";

import type { CSSProperties, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import {
  GOOGLE_RATING,
  LUXURY_EASE,
  MODELS,
  PETROL_COST_PER_KM,
  RIDER_COUNT,
  whatsappUrl,
} from "@/lib/heroModels";
import { Magnetic } from "@/components/ui/Magnetic";
import { ScooterStage } from "./ScooterStage";
import { useHeroState } from "./useHeroState";

/**
 * The hero: main's wide rounded stage and its bar of non-CTA details, with the split
 * layout, seam pills and outlined display type from the editorial direction.
 */
export function HeroEditorial() {
  const { active, activeIndex, activeColor, colorIndex, selectModel, setColorIndex } =
    useHeroState();
  const reducedMotion = useReducedMotion();

  function scrollToLineup() {
    document.getElementById("models")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }

  const pills = [`${active.range} range`, `${active.topSpeed} top speed`, "Swappable battery"];

  const facts: { label: string; value: string; note?: ReactNode }[] = [
    { label: "Top speed", value: active.topSpeed },
    { label: "True range", value: active.range },
    {
      label: "Starting from",
      value: active.priceFrom,
      note: (
        <>
          <span className="font-semibold text-carbon">{active.costPerKm}/km</span> vs {PETROL_COST_PER_KM} on petrol
        </>
      ),
    },
    {
      label: "Riders",
      value: RIDER_COUNT,
      note: (
        <span className="flex items-center gap-1">
          <Star size={12} fill="#FBBC04" strokeWidth={0} />
          <span className="font-semibold text-carbon">{GOOGLE_RATING}</span> on Google
        </span>
      ),
    },
  ];

  return (
    // Reduced pt-24 to pt-20, and lg:pb-10 to lg:pb-8
    <section className="w-full bg-white px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pb-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="relative flex flex-col overflow-hidden rounded-[40px] bg-[#F6F7F6] lg:h-[calc(100svh-8.5rem)] lg:min-h-[620px]">

          <div className="grid flex-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">

            {/* LEFT: type */}
            <div
              data-intro="hero"
              // Reduced gap-9 to gap-7, and lg:py-12 to lg:py-8. On lg the facts bar floats over
              // the bottom 16% of the card, so the copy is centred in the space above it.
              className="flex flex-col justify-center gap-7 px-7 pb-2 pt-10 sm:px-10 lg:pb-[calc(max(104px,(100svh-8.5rem)*0.16)+1.5rem)] lg:pl-14 lg:pr-10 lg:pt-8"
            >
              {/* Model tabs */}
              <div role="tablist" aria-label="Model" className="flex gap-8 border-b border-carbon/10">
                {MODELS.map((model, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={model.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => selectModel(index)}
                      className={`relative pb-3 font-display text-sm font-semibold tracking-wide transition-colors duration-300 ${
                        isActive ? "text-carbon" : "text-carbon/40 hover:text-carbon/70"
                      }`}
                    >
                      {model.code}
                      {isActive && (
                        <motion.span
                          layoutId="hero-tab-line"
                          className="absolute inset-x-0 -bottom-px h-[2px] bg-carbon"
                          transition={{ duration: 0.45, ease: LUXURY_EASE }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: LUXURY_EASE }}
                >
                  <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-carbon/50">
                    {active.tagline}
                  </p>
                  <h1 className="mt-4 font-display text-[clamp(3.25rem,6vw,7rem)] font-extrabold leading-[0.86] tracking-[-0.055em] text-carbon">
                    MOVE
                    <br />
                    ON{" "}
                    <span className="type-outline" style={{ "--outline-fill": "#F6F7F6" } as CSSProperties}>
                      {active.code}
                    </span>
                  </h1>
                  <p className="mt-6 max-w-[400px] text-[15px] leading-relaxed text-carbon/60">
                    {active.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                <Magnetic>
                  <a
                    href={whatsappUrl(active)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-14 items-center gap-3 rounded-full bg-volt pl-6 pr-2 font-display text-sm font-bold text-carbon transition-colors duration-300 hover:bg-[#3bbd00]"
                  >
                    Book a free test ride
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-carbon text-white transition-transform duration-300 group-hover:translate-x-0.5">
                      <ArrowRight size={16} strokeWidth={2.2} />
                    </span>
                  </a>
                </Magnetic>
                <button
                  onClick={scrollToLineup}
                  className="group inline-flex items-center gap-1.5 font-display text-sm font-semibold text-carbon/70 transition-colors hover:text-carbon"
                >
                  Explore {active.code}
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* RIGHT: product panel, inset inside the stage */}
            <div className="relative m-3 h-[50vh] min-h-[380px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#E4E8E4] via-[#EDF0ED] to-[#DCE1DC] lg:m-4 lg:ml-0 lg:h-auto lg:min-h-0">
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#D3D8D3]/70 to-transparent" />

              {/* Shot close: the box runs past the bottom and right edges, so the panel crops it */}
              <ScooterStage
                primary
                model={active}
                colorIndex={colorIndex}
                boxClassName="-bottom-[7%] left-[4%] right-[4%] top-[5%]"
              />

              {/* Paint */}
              <div data-intro="hero" className="absolute left-5 top-5 z-20 flex items-center gap-3 lg:left-7 lg:top-7">
                <div className="glass-liquid flex gap-0.5 rounded-full p-1">
                  {active.colors.map((color, index) => (
                    <button
                      key={color.name}
                      onClick={() => setColorIndex(index)}
                      aria-label={color.name}
                      aria-pressed={index === colorIndex}
                      className="relative flex h-8 w-8 items-center justify-center rounded-full"
                    >
                      {index === colorIndex && (
                        <motion.span
                          layoutId="hero-color-ring"
                          className="absolute inset-0 rounded-full ring-[1.5px] ring-carbon"
                          transition={{ duration: 0.4, ease: LUXURY_EASE }}
                        />
                      )}
                      <span
                        className="h-5 w-5 rounded-full ring-1 ring-inset ring-carbon/15"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-medium text-carbon/70">{activeColor.name}</span>
              </div>
            </div>
          </div>

          {/* Spec pills on the seam — half over the type, half over the product panel */}
          <div aria-hidden className="pointer-events-none absolute left-[41.667%] top-0 z-30 hidden h-full lg:block">
            {pills.map((pill, index) => (
              <motion.span
                key={pill}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.12, duration: 0.6, ease: LUXURY_EASE }}
                className="glass-liquid absolute -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 font-display text-xs font-semibold text-carbon"
                style={{ top: `${32 + index * 13}%`, marginLeft: `${[0, 38, -6][index]}px` }}
              >
                {pill}
              </motion.span>
            ))}
          </div>

          {/*
           * The details bar: facts only, no actions. On lg it is a slab of near-clear glass
           * over the bottom 16% of the card — a share, not a height, because the scooter
           * scales with the card, and at 16% the top edge runs through the front wheel's
           * centre at every desktop size. Behind the glass the lower half of that wheel is
           * softened, which is where the rebuilt tyre is weakest.
           *
           * The tint can't go to zero: two of the cells sit right over the black tyre, and
           * it's the blur plus that little white that keeps their dark text readable.
           */}
          <div
            data-intro="hero"
            className="relative z-20 grid grid-cols-2 gap-px border-t border-carbon/[0.07] bg-carbon/[0.07] lg:absolute lg:inset-x-0 lg:bottom-0 lg:h-[16%] lg:min-h-[104px] lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-carbon/[0.08] lg:border-carbon/[0.09] lg:bg-white/[0.22] lg:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.55)] lg:backdrop-blur-[18px] lg:backdrop-saturate-[1.4]"
          >
            {facts.map((fact) => (
              <div
                key={fact.label}
                // Opaque cells over a 1px-gap fill draw the hairlines below lg; on the glass the
                // cells go clear and `divide-x` draws them instead.
                className="flex flex-col justify-center gap-1 bg-[#FBFBFA] px-6 py-5 sm:px-8 lg:bg-transparent lg:px-10"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-carbon/40">{fact.label}</p>
                <p className="font-display text-xl font-bold tracking-tight text-carbon lg:text-[26px]">{fact.value}</p>
                {fact.note && <p className="text-xs text-carbon/55">{fact.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}