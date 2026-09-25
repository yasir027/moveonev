"use client";

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
import { ScooterStage } from "./ScooterStage";
import { useHeroState } from "./useHeroState";

/**
 * Variant A — full-bleed light studio. The scooter stands centre stage over its giant
 * model code; the four corners hold model, paint, headline and the buy panel.
 */
export function HeroStudio() {
  const { active, activeIndex, activeColor, colorIndex, selectModel, setColorIndex } =
    useHeroState();
  const reducedMotion = useReducedMotion();

  function scrollToLineup() {
    document.getElementById("models")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }

  return (
    <section className="w-full bg-white p-2 sm:p-3">
      <div className="relative flex flex-col overflow-hidden rounded-[28px] bg-gradient-to-b from-[#ECEEEC] to-[#F7F8F7] lg:block lg:h-[calc(100svh-1.5rem)] lg:min-h-[640px]">

        {/* Studio floor */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 top-[68%] border-t border-carbon/[0.05] bg-gradient-to-b from-[#E6E9E6] to-[#F1F3F1]" />

        {/* Giant model code — the backdrop the glass bends */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[30%] flex select-none justify-center lg:top-[16%]">
          <AnimatePresence mode="wait">
            <motion.span
              key={active.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: LUXURY_EASE }}
              className="whitespace-nowrap font-display font-extrabold leading-[0.8] tracking-[-0.06em] text-carbon/[0.07]"
              style={{ fontSize: active.code.length > 2 ? "25vw" : "34vw" }}
            >
              {active.code}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* TOP ROW: model (left) and paint (right) */}
        <div
          data-intro="hero"
          className="relative z-20 flex items-center justify-between gap-3 px-4 pt-24 sm:px-6 lg:absolute lg:inset-x-[max(2rem,3vw)] lg:top-28 lg:px-0 lg:pt-0"
        >
          <div role="tablist" aria-label="Model" className="glass-liquid flex rounded-full p-1">
            {MODELS.map((model, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={model.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => selectModel(index)}
                  className={`relative rounded-full px-4 py-2 font-display text-xs font-semibold tracking-wide transition-colors duration-300 sm:px-5 ${
                    isActive ? "text-white" : "text-carbon/60 hover:text-carbon"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="studio-model-pill"
                      className="absolute inset-0 rounded-full bg-carbon"
                      transition={{ duration: 0.45, ease: LUXURY_EASE }}
                    />
                  )}
                  <span className="relative">{model.code}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-medium text-carbon/60 sm:block">{activeColor.name}</span>
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
                      layoutId="studio-color-ring"
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
          </div>
        </div>

        {/* HEADLINE: bottom-left */}
        <div data-intro="hero" className="relative z-20 px-5 pt-8 sm:px-8 lg:absolute lg:bottom-[max(2rem,3vw)] lg:left-[max(2rem,3vw)] lg:max-w-[40%] lg:p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: LUXURY_EASE }}
            >
              <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-carbon/50">
                {active.tagline}
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.75rem,5.4vw,6rem)] font-bold leading-[0.9] tracking-[-0.045em] text-carbon">
                {active.name}
              </h1>
              <p className="mt-5 hidden max-w-[440px] text-[15px] leading-relaxed text-carbon/60 lg:block">
                {active.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SCOOTER */}
        <div className="relative z-10 h-[40vh] min-h-[300px] lg:absolute lg:inset-0 lg:h-auto">
          <ScooterStage
            primary
            model={active}
            colorIndex={colorIndex}
            boxClassName="inset-x-4 inset-y-2 lg:inset-x-[24%] lg:bottom-[5%] lg:top-[13%]"
          />
        </div>

        {/* BUY PANEL: bottom-right, frosted because it's for reading */}
        <div
          data-intro="hero"
          className="glass-frost relative z-20 m-3 rounded-[24px] p-5 sm:mx-6 sm:mb-6 lg:absolute lg:bottom-[max(2rem,3vw)] lg:right-[max(2rem,3vw)] lg:m-0 lg:w-[360px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-carbon/50">Starting from</p>
              <div className="mt-1 flex items-baseline justify-between gap-3">
                <p className="font-display text-[26px] font-bold tracking-tight text-carbon">{active.priceFrom}</p>
                <p className="text-xs text-carbon/60">
                  <span className="font-semibold text-carbon">{active.costPerKm}/km</span> vs {PETROL_COST_PER_KM}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <a
            href={whatsappUrl(active)}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-4 flex h-12 w-full items-center justify-between rounded-full bg-carbon pl-5 pr-1.5 font-display text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#1f2622]"
          >
            <span className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-volt" />
              Book a free test ride
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight size={16} strokeWidth={2.2} />
            </span>
          </a>

          <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-carbon/[0.07]">
            {[
              { label: "Top speed", value: active.topSpeed },
              { label: "Range", value: active.range },
              { label: "Riders", value: RIDER_COUNT },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/70 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-carbon/45">{stat.label}</p>
                <p className="mt-0.5 font-display text-sm font-bold text-carbon">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-carbon/60">
              <Star size={12} fill="#FBBC04" strokeWidth={0} />
              <span className="font-semibold text-carbon">{GOOGLE_RATING}</span> on Google
            </span>
            <button
              onClick={scrollToLineup}
              className="group flex items-center gap-1 font-semibold text-carbon/70 transition-colors hover:text-carbon"
            >
              Explore {active.code}
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
