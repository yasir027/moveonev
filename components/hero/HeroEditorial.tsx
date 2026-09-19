"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LUXURY_EASE, MODELS, whatsappUrl } from "@/lib/heroModels";
import { ScooterStage } from "./ScooterStage";
import { useHeroState } from "./useHeroState";

/**
 * Variant B — split editorial. Oversized type on white at the left; the product panel
 * bleeds off the right edge with the scooter shot close. Glass chips sit on the seam.
 */
export function HeroEditorial() {
  const { active, activeIndex, activeColor, colorIndex, direction, selectModel, setColorIndex } =
    useHeroState();
  const reducedMotion = useReducedMotion();

  function scrollToLineup() {
    document.getElementById("models")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }

  const chips = [`${active.range} range`, `${active.topSpeed} top speed`, "Swappable battery"];

  return (
    <section className="relative grid w-full bg-white lg:h-[100svh] lg:min-h-[640px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">

      {/* LEFT: type */}
      <div className="flex flex-col justify-between gap-12 px-[max(1.5rem,4vw)] pb-10 pt-28 lg:pb-[max(2rem,3vw)] lg:pr-12">

        {/* Model tabs — editorial: text with an underline */}
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
                    layoutId="editorial-tab-line"
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
            <h2 className="mt-4 font-display text-[clamp(3.5rem,7.4vw,8.5rem)] font-extrabold leading-[0.86] tracking-[-0.055em] text-carbon">
              MOVE
              <br />
              ON <span className="type-outline">{active.code}</span>
            </h2>
            <p className="mt-6 max-w-[400px] text-[15px] leading-relaxed text-carbon/60">
              {active.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
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
            <button
              onClick={scrollToLineup}
              className="group inline-flex items-center gap-1.5 font-display text-sm font-semibold text-carbon/70 transition-colors hover:text-carbon"
            >
              Explore {active.code}
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          <dl className="mt-8 grid grid-cols-3 border-t border-carbon/10 pt-5">
            {[
              { label: "Top speed", value: active.topSpeed },
              { label: "Range", value: active.range },
              { label: "From", value: active.priceFrom },
            ].map((fact) => (
              <div key={fact.label}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-carbon/45">{fact.label}</dt>
                <dd className="mt-1 font-display text-base font-bold text-carbon lg:text-lg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* RIGHT: product panel, bleeding off the right edge */}
      <div className="relative mx-2 mb-2 h-[62vh] min-h-[420px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#E4E8E4] via-[#EDF0ED] to-[#DADFDA] lg:mx-0 lg:mb-0 lg:h-auto lg:rounded-none lg:rounded-l-[40px]">
        {/* soft studio floor */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#D3D8D3]/70 to-transparent" />

        {/* Shot close: the box runs past the bottom and right edges, so the panel crops it */}
        <ScooterStage
          model={active}
          colorIndex={colorIndex}
          direction={direction}
          showHotspots={false}
          boxClassName="-bottom-[12%] -right-[6%] left-[2%] top-[10%]"
        />

        {/* Paint — top of the panel, clear of the (close-cropped) scooter */}
        <div className="absolute left-5 top-5 z-20 flex items-center gap-3 lg:left-10 lg:top-28">
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
                    layoutId="editorial-color-ring"
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

      {/* Spec chips on the seam — half over white, half over the panel */}
      <div aria-hidden className="pointer-events-none absolute left-[41.667%] top-0 z-20 hidden h-full lg:block">
        {chips.map((chip, index) => (
          <motion.span
            key={chip}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.12, duration: 0.6, ease: LUXURY_EASE }}
            className="glass-liquid absolute -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 font-display text-xs font-semibold text-carbon"
            style={{ top: `${34 + index * 12}%`, marginLeft: `${[0, 36, -8][index]}px` }}
          >
            {chip}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
