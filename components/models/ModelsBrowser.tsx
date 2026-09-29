"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { EASE_PREMIUM } from "@/lib/motion";
import Image from "next/image";
import { models, ModelCard } from "@/components/ModelsLineupSection";

/*
 * Models page: header, filters, and the state the grid will read.
 *
 * One row: price slider, range chips, search. Range starts on "Any", so the bar always
 * shows a selected state rather than a blank group.
 */

export interface ModelFilters {
  search: string;
  maxPrice: number;
  range: string;
}

const ALL = "all";
const PRICE_MIN = 45000;
const PRICE_MAX = 150000;
const PRICE_STEP = 5000;

const EMPTY: ModelFilters = { search: "", maxPrice: PRICE_MAX, range: ALL };

/* Range comes from the pack, not the model — both fit every scooter, so this filters
   the configuration rather than the lineup. */
const RANGES = [
  { id: ALL, label: "Any range" },
  { id: "30ah", label: "70–80 km" },
  { id: "55ah", label: "160–170 km" },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function ModelsBrowser() {
  const [filters, setFilters] = useState<ModelFilters>(EMPTY);

  const dirty =
    filters.search !== "" ||
    filters.maxPrice !== PRICE_MAX ||
    filters.range !== ALL;

  /* How far along the track the thumb sits, so the fill can follow it. */
  const pricePct =
    ((filters.maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const visible = models.filter(
    (m) =>
      m.price <= filters.maxPrice &&
      m.name.toLowerCase().includes(filters.search.trim().toLowerCase()),
  );

  return (
    <>
      {/* HEADER — short. People arrived here to browse, not to read. */}
      <section className="relative w-full overflow-hidden bg-white pb-10 pt-28 lg:pt-32">
        <div className="relative mx-auto flex w-full max-w-[1400px] items-center justify-between px-5 sm:px-6 lg:px-8">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_PREMIUM }}
            className="relative z-10 max-w-2xl"
          >
            <span className="mb-5 block h-px w-10 bg-volt" />
            <span className="mb-4 block font-display text-[13px] font-bold uppercase tracking-[0.18em] text-leaf">
              The Lineup
            </span>
            <h1 className="font-display text-[clamp(2.5rem,4.5vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.035em] text-carbon">
              Eight models.
              <br />
              No licence, no RTO.
            </h1>
            <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-carbon/65">
              Every model runs the same platform — 25 km/h, 100+ km of range and a
              150 kg load rating. Pick the one that looks right, then choose your
              finish and battery.
            </p>
          </motion.div>

          {/* Hero Image — Placed in the right negative space on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.1 }}
            className="pointer-events-none absolute right-5 top-1/2 hidden w-[380px] -translate-y-1/2 lg:block xl:right-10 xl:w-[480px]"
          >
            {/* The provided image proportion leans vertical, so a 4/5 aspect ratio container keeps it constrained[cite: 3] */}
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/modelsbg.png"
                alt="Move On Scooter Lineup"
                fill
                priority
                className="object-contain"
                sizes="(min-width: 1280px) 480px, 380px"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FILTERS — sticky. Plain white with a hairline: a sticky bar has to be opaque
          anyway, and frost over a white page is just a pale box. */}
      <section className="sticky top-20 z-30 w-full border-b border-carbon/10 bg-white">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">

            {/* Price */}
            <div className="w-full lg:w-[300px] lg:shrink-0">
              <div className="mb-2.5 flex items-baseline justify-between gap-4">
                <span className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-carbon/45">
                  Price
                </span>
                <span className="font-display text-[15px] font-bold text-carbon">
                  Up to {inr(filters.maxPrice)}
                </span>
              </div>

              <div className="relative flex h-5 items-center">
                {/* Track and fill sit under the input; the input stays transparent so the
                    native thumb still drives it. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 h-1.5 rounded-full bg-carbon/10"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-0 h-1.5 rounded-full bg-carbon"
                  style={{ width: `${pricePct}%` }}
                />
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={PRICE_STEP}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))
                  }
                  aria-label="Maximum price"
                  className="relative h-5 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-carbon [&::-moz-range-thumb]:bg-volt [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-carbon [&::-webkit-slider-thumb]:bg-volt"
                />
              </div>
            </div>

            {/* Range */}
            <div className="flex flex-wrap items-center gap-3 lg:flex-1">
              <span className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-carbon/45">
                Range
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {RANGES.map((range) => {
                  const active = filters.range === range.id;
                  return (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => setFilters((f) => ({ ...f, range: range.id }))}
                      aria-pressed={active}
                      className={[
                        "rounded-full px-5 py-2.5 font-display text-[14px] font-semibold",
                        "transition-colors duration-200 ease-premium",
                        /* Carbon body, volt label. Volt is ~1.4:1 on white and can't carry
                           a chip alone; on carbon it's clean, so the pair does the work. */
                        active
                          ? "bg-carbon text-volt"
                          : "border-[1.5px] border-carbon/15 text-carbon/65 hover:border-carbon/40 hover:text-carbon",
                      ].join(" ")}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Count, reset, search */}
            <div className="flex items-center gap-4 lg:shrink-0">
              {dirty && (
                <button
                  type="button"
                  onClick={() => setFilters(EMPTY)}
                  className="flex shrink-0 items-center gap-1.5 font-display text-[14px] font-semibold text-leaf transition-opacity duration-200 ease-premium hover:opacity-70"
                >
                  Reset
                  <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </button>
              )}

              <span className="hidden shrink-0 font-display text-[15px] font-semibold text-carbon/70 sm:block">
                {visible.length} {visible.length === 1 ? "model" : "models"}
              </span>

              {/* Dark field with a volt icon and a volt focus ring. The one control
                  people reach for first, so it's the one thing here that isn't quiet. */}
              <div className="relative w-full sm:w-[280px]">
                <Search
                  className="pointer-events-none absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-volt"
                  aria-hidden
                />
                <input
                  type="search"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, search: e.target.value }))
                  }
                  placeholder="Search models"
                  aria-label="Search models"
                  className="w-full rounded-full bg-carbon py-3.5 pl-[52px] pr-5 text-[15px] font-medium text-white shadow-[inset_0_0_0_1.5px_rgb(125_255_64/0)] outline-none transition-shadow duration-200 ease-premium placeholder:font-normal placeholder:text-white/45 focus:shadow-[inset_0_0_0_1.5px_rgb(125_255_64/0.85)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-mist py-12 lg:py-16">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-6 lg:px-8">
          {visible.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-4">
              {visible.map((model, i) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_PREMIUM, delay: (i % 4) * 0.06 }}
                >
                  <ModelCard model={model} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="font-display text-2xl font-bold text-carbon">
                No models match.
              </p>
              <p className="mt-2 text-[17px] text-carbon/60">
                Try a higher budget or a different search.
              </p>
              <button
                type="button"
                onClick={() => setFilters(EMPTY)}
                className="mt-6 rounded-full bg-carbon px-6 py-3 font-display text-[14px] font-semibold text-volt"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}