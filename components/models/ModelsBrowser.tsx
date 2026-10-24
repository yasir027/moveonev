"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

import { EASE_PREMIUM } from "@/lib/motion";
import { models, type BatteryId } from "@/lib/models";
import { ModelGrid } from "@/components/models/ModelGrid";

/* =========================================================
   FILTER CONFIGURATION
========================================================= */

export interface ModelFilters {
  search: string;
  maxPrice: number;
  range: string;
}

const ALL = "all";

const PRICE_MIN = 45000;
const PRICE_MAX = 150000;
const PRICE_STEP = 5000;

const EMPTY: ModelFilters = {
  search: "",
  maxPrice: PRICE_MAX,
  range: ALL,
};

const RANGES = [
  { id: ALL, label: "Any range" },
  { id: "30ah", label: "70–80 km" },
  { id: "55ah", label: "160–170 km" },
];

const inr = (n: number) =>
  `₹${n.toLocaleString("en-IN")}`;

/* =========================================================
   MODELS BROWSER
========================================================= */

export function ModelsBrowser() {
  const [filters, setFilters] =
    useState<ModelFilters>(EMPTY);

  /* FILTER STATE */

  const dirty =
    filters.search !== "" ||
    filters.maxPrice !== PRICE_MAX ||
    filters.range !== ALL;

  const pricePct =
    ((filters.maxPrice - PRICE_MIN) /
      (PRICE_MAX - PRICE_MIN)) *
    100;

  /* FILTER MODELS */

  

const visible = models.flatMap((model) => {
  const matchesSearch = model.name
    .toLowerCase()
    .includes(filters.search.trim().toLowerCase());

  if (!matchesSearch) return [];

  const matchingBatteries = (
    Object.keys(model.pricing) as BatteryId[]
  )
    .filter((batteryId) => {
      const matchesRange =
        filters.range === ALL ||
        batteryId === filters.range;

      const matchesPrice =
        model.pricing[batteryId].offer <=
        filters.maxPrice;

      return matchesRange && matchesPrice;
    })
    .sort(
      (a, b) =>
        model.pricing[a].offer -
        model.pricing[b].offer
    );

  if (matchingBatteries.length === 0) {
    return [];
  }

  const batteryId = matchingBatteries[0];

  return [
    {
      model,
      batteryId,
      pricing: model.pricing[batteryId],
    },
  ];
});



  /* RESET FILTERS */

  const resetFilters = () => {
    setFilters({ ...EMPTY });
  };

  return (
    <div
      id="lineup"
      className="relative w-full"
    >
      {/* ================================================
          HEADER
      ================================================= */}

      <section
        className="
          w-full bg-white
          pb-10 pt-24
          sm:pt-28 lg:pt-32
        "
      >
        <div
          className="
            w-full
            px-[7%]
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              ease: EASE_PREMIUM,
            }}
            className="max-w-2xl"
          >

            <h1
              className="
                font-display
                text-[clamp(2.5rem,4.5vw,3.75rem)]
                font-bold
                leading-[1.02]
                tracking-[-0.035em]
                text-carbon
              "
            >
              Eight models.
              <br />
              No licence, no RTO.
            </h1>

            <p
              className="
                mt-6 max-w-[520px]
                text-[17px]
                leading-relaxed
                text-carbon/65
              "
            >
              Every model runs the same platform
              — 25 km/h, up to 170 km of range
              and a 150 kg load rating.
              Pick the one that looks right,
              then choose your finish and battery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================================
          STICKY FILTER BAR
      ================================================= */}

      <section
        className="
          w-full
          border-b border-carbon/10
          bg-white/95
          backdrop-blur-md
          lg:top-[88px]
        "
      >
        <div
          className="
            w-full
            px-[7%] py-5
          "
        >
          <div
            className="
              flex flex-col gap-6
              lg:flex-row
              lg:items-center
              lg:gap-6
              xl:gap-10
            "
          >
            {/* PRICE SLIDER */}

            <div
              className="
                w-full
                lg:w-[260px]
                lg:shrink-0
                xl:w-[300px]
              "
            >
              <div
                className="
                  mb-2.5
                  flex items-baseline
                  justify-between gap-4
                "
              >
                <span
                  className="
                    font-display
                    text-[12px]
                    font-bold uppercase
                    tracking-[0.12em]
                    text-carbon/45
                  "
                >
                  Max Price
                </span>

                <span
                  className="
                    font-display
                    text-[15px]
                    font-bold text-carbon
                  "
                >
                  {inr(filters.maxPrice)}
                </span>
              </div>

              <div
                className="
                  relative flex h-5 items-center
                "
              >
                {/* Track */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute inset-x-0
                    h-1 rounded-full
                    bg-carbon/10
                  "
                />

                {/* Filled track */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute left-0
                    h-1 rounded-full
                    bg-carbon
                    transition-all duration-75
                  "
                  style={{
                    width: `${pricePct}%`,
                  }}
                />

                {/* Native range input */}
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={PRICE_STEP}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      maxPrice: Number(
                        e.target.value
                      ),
                    }))
                  }
                  aria-label="Maximum price"
                  className="
                    relative h-5 w-full
                    cursor-pointer
                    appearance-none
                    bg-transparent

                    [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:w-4
                    [&::-moz-range-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:border-[3px]
                    [&::-moz-range-thumb]:border-carbon
                    [&::-moz-range-thumb]:bg-volt

                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:border-[3px]
                    [&::-webkit-slider-thumb]:border-carbon
                    [&::-webkit-slider-thumb]:bg-volt
                  "
                />
              </div>
            </div>

            {/* RANGE FILTERS */}

            <div
              className="
                flex flex-wrap
                items-center gap-4
                lg:min-w-0
                lg:flex-1
              "
            >
              <span
                className="
                  hidden
                  font-display
                  text-[12px]
                  font-bold uppercase
                  tracking-[0.12em]
                  text-carbon/45
                  xl:block
                "
              >
                Range
              </span>

              <div
                className="
                  flex flex-wrap
                  items-center gap-2
                "
              >
                {RANGES.map((range) => {
                  const active =
                    filters.range === range.id;

                  return (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() =>
                        setFilters((f) => ({
                          ...f,
                          range: range.id,
                        }))
                      }
                      aria-pressed={active}
                      className={[
                        "rounded-full",
                        "px-4 py-2.5",
                        "font-display",
                        "text-[12px]",
                        "font-semibold",
                        "transition-all",
                        "duration-300",
                        "ease-premium",
                        "xl:px-5",
                        "xl:text-[13px]",
                        active
                          ? "bg-carbon text-volt shadow-[inset_0_0_0_1px_var(--color-carbon)]"
                          : "text-carbon/60 shadow-[inset_0_0_0_1px_rgb(16_20_18/0.12)] hover:text-carbon hover:shadow-[inset_0_0_0_1px_rgb(16_20_18/0.25)]",
                      ].join(" ")}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT GROUP */}

            <div
              className="
                flex w-full
                items-center gap-3
                lg:w-auto
                lg:shrink-0
                xl:gap-4
              "
            >
              {/* Reset */}
              {dirty && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="
                    hidden shrink-0
                    items-center gap-1.5
                    font-display
                    text-[13px]
                    font-semibold
                    text-carbon/50
                    transition-colors
                    duration-200
                    ease-premium
                    hover:text-carbon
                    sm:flex
                  "
                >
                  Reset

                  <X
                    className="h-4 w-4"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </button>
              )}

              {/* Result count */}
              <span
                className="
                  hidden shrink-0
                  font-display
                  text-[14px]
                  font-semibold
                  text-carbon/40
                  2xl:block
                "
              >
                {visible.length}{" "}
                {visible.length === 1
                  ? "model"
                  : "models"}
              </span>

              {/* Search */}
              <div
                className="
                  relative w-full
                  sm:w-[260px]
                  lg:w-[190px]
                  xl:w-[240px]
                  2xl:w-[260px]
                "
              >
                <Search
                  className="
                    pointer-events-none
                    absolute left-4 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    text-volt
                  "
                  strokeWidth={2.5}
                  aria-hidden="true"
                />

                <input
                  type="search"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      search: e.target.value,
                    }))
                  }
                  placeholder="Search models"
                  aria-label="Search models"
                  className="
                    w-full rounded-full
                    bg-carbon
                    py-3 pl-11 pr-5
                    font-display
                    text-[14px]
                    font-medium
                    text-white
                    outline-none
                    transition-shadow
                    duration-300
                    ease-premium
                    placeholder:font-normal
                    placeholder:text-white/45
                    focus:shadow-[inset_0_0_0_1.5px_rgb(125_255_64/0.85)]
                  "
                />
              </div>
            </div>
          </div>

          {/* MOBILE RESET AND RESULT COUNT */}

          <div
            className="
              mt-4 flex items-center
              justify-between gap-4
              sm:mt-3
              lg:hidden
            "
          >
            <span
              className="
                font-display
                text-[12px]
                font-semibold
                text-carbon/50
              "
            >
              {visible.length}{" "}
              {visible.length === 1
                ? "model"
                : "models"}{" "}
              found
            </span>

            {dirty && (
              <button
                type="button"
                onClick={resetFilters}
                className="
                  flex items-center gap-1
                  font-display
                  text-[12px]
                  font-semibold
                  text-carbon/60
                  sm:hidden
                "
              >
                Clear filters

                <X
                  size={14}
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================================================
          MODELS GRID
          Shared with homepage LineupSection
      ================================================= */}

      <section
        className="
          w-full bg-mist
          py-12 lg:py-20
        "
      >
        <div
          className="
            w-full
            px-[7%]
          "
        >
          {/* RESULTS COUNT ABOVE GRID */}

          <div
            className="
              mb-6 flex items-center
              justify-between gap-4
              lg:mb-8
            "
          >
            <p
              aria-live="polite"
              className="
                font-display
                text-[13px]
                font-semibold
                text-carbon/55
              "
            >
              Showing {visible.length} of{" "}
              {models.length} models
            </p>

            {dirty && (
              <button
                type="button"
                onClick={resetFilters}
                className="
                  font-display
                  text-[12px]
                  font-semibold
                  text-leaf
                  transition-colors
                  hover:text-carbon
                "
              >
                Clear filters
              </button>
            )}
          </div>

          {visible.length > 0 ? (
            /* SHARED GRID — SAME AS HOMEPAGE */
            <ModelGrid items={visible} />
          ) : (
            /* EMPTY STATE */
            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                ease: EASE_PREMIUM,
              }}
              className="
                flex min-h-[360px]
                flex-col items-center
                justify-center
                py-20 text-center
              "
            >
              <div
                className="
                  mb-6 flex h-16 w-16
                  items-center justify-center
                  rounded-full
                  bg-white text-carbon/40
                "
              >
                <Search
                  size={26}
                  strokeWidth={1.5}
                />
              </div>

              <h2
                className="
                  font-display
                  text-2xl
                  font-bold
                  tracking-tight
                  text-carbon
                "
              >
                No models match.
              </h2>

              <p
                className="
                  mt-3 max-w-[360px]
                  text-[15px]
                  leading-relaxed
                  text-carbon/60
                "
              >
                Try increasing your budget or
                searching for a different model.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="
                  mt-8 rounded-full
                  bg-carbon
                  px-8 py-3.5
                  font-display
                  text-[13px]
                  font-bold
                  tracking-wide
                  text-volt
                  transition-transform
                  duration-300
                  hover:scale-105
                  active:scale-95
                "
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}