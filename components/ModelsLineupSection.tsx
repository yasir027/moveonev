"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, X, ArrowUpRight } from "lucide-react";
import { EASE_PREMIUM } from "@/lib/motion";

/* =========================================================
   DATA & CONFIGURATION
========================================================= */

const FINISH: Record<string, string> = {
  "Glossy Red": "#C8102E",
  "Glossy Black": "#14181A",
  "Glossy Grey": "#8A9199",
  "Glossy Green": "#1F7A4D",
  "Glossy Blue": "#1E5FA8",
  "Matte Blue": "#2E4A7D",
  "Matte Green": "#4A5D4A",
  "Matte Beige": "#C9BCA6",
  "Ivory White": "#F2EFE6",
  Creme: "#EADFC8",
  "Light Blue": "#9FC7E8",
  "Dark Blue": "#1B2B57",
  "Golden Yellow": "#E8B33A",
  "Aqua Blue": "#4FB8C9",
  "Beige Gold": "#CBB48A",
  "Glacier Blue": "#BCD6E3",
  "Rose Pearl": "#E3BFC4",
  "Ice Blue": "#D6E8EF",
  Orange: "#E8722A",
};

export interface Model {
  name: string;
  range: string;
  topSpeed: string;
  price: number;
  motor: string;
  load: string;
  specs: { label: string; value: string }[];
  finishes: string[];
  image: string | null;
}

const COMMON = [
  { label: "Motor", value: "BLDC heavy duty" },
  { label: "Brake", value: "Front disc" },
  { label: "Tyres", value: "90.100.12 tubeless" },
  { label: "Ground clearance", value: "270 mm" },
  { label: "Seat height", value: "750 mm" },
  { label: "Display", value: "Digital colour" },
];

export const models: Model[] = [  {
    name: "X Double Light",
    range: "100+ km",
    topSpeed: "25 km/h",
    price: 49999,
    motor: "1000 W",
    load: "150 kg",
    specs: COMMON,
    finishes: ["Glossy Red", "Glossy Black", "Glossy Grey", "Matte Blue", "Ivory White"],
    image: "/Lineup/xdoublelight.png",
  },
  {
    name: "X-Robox",
    range: "100+ km",
    price: 64999,
    topSpeed: "25 km/h",
    motor: "1200 W",
    load: "150 kg",
    specs: COMMON,
    finishes: ["Golden Yellow", "Aqua Blue", "Beige Gold"],
    image: "/Lineup/xrobox.png",
  },
  {
    name: "X-ORL Cheetah",
    range: "100+ km",
    topSpeed: "25 km/h",
    price: 79999,
    motor: "1500 W",
    load: "150 kg",
    specs: COMMON,
    finishes: ["Glossy Red", "Glossy Black", "Glossy Grey", "Matte Green", "Matte Beige", "Glossy Blue"],
    image: "/Lineup/xorlcheetah.png",
  },
  {
    name: "X-Ozone",
    range: "100+ km",
    price: 89999,
    topSpeed: "25 km/h",
    motor: "1500 W",
    load: "150 kg",
    specs: COMMON,
    finishes: ["Ice Blue", "Orange", "Matte Green", "Matte Blue", "Ivory White"],
    image: "/Lineup/xozone.png",
  },
];

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

const RANGES = [
  { id: ALL, label: "Any range" },
  { id: "30ah", label: "70–80 km" },
  { id: "55ah", label: "160–170 km" },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* =========================================================
   MAIN BROWSER COMPONENT
========================================================= */

export function ModelsBrowser() {
  const [filters, setFilters] = useState<ModelFilters>(EMPTY);

  const dirty =
    filters.search !== "" ||
    filters.maxPrice !== PRICE_MAX ||
    filters.range !== ALL;

  /* How far along the track the thumb sits, so the fill can follow it. */
  const pricePct = ((filters.maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const visible = models.filter(
    (m) =>
      m.price <= filters.maxPrice &&
      m.name.toLowerCase().includes(filters.search.trim().toLowerCase())
  );

  return (
    <div id="lineup" className="relative w-full">
      {/* HEADER — People arrived here to browse, not to read. */}
      <section className="w-full bg-white pb-10 pt-28 lg:pt-32">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_PREMIUM }}
            className="max-w-2xl"
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
        </div>
      </section>

      {/* FILTERS — Sticky. Plain white with a hairline. */}
      <section className="sticky top-[72px] z-30 w-full border-b border-carbon/10 bg-white/95 backdrop-blur-md lg:top-[88px]">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
            
            {/* Price Slider */}
            <div className="w-full lg:w-[300px] lg:shrink-0">
              <div className="mb-2.5 flex items-baseline justify-between gap-4">
                <span className="font-display text-[12px] font-bold uppercase tracking-[0.12em] text-carbon/45">
                  Max Price
                </span>
                <span className="font-display text-[15px] font-bold text-carbon">
                  {inr(filters.maxPrice)}
                </span>
              </div>

              <div className="relative flex h-5 items-center">
                {/* Track and fill sit under the input */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 h-1 rounded-full bg-carbon/10"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-0 h-1 rounded-full bg-carbon transition-all duration-75"
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
                  className="relative h-5 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-carbon [&::-moz-range-thumb]:bg-volt [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-carbon [&::-webkit-slider-thumb]:bg-volt"
                />
              </div>
            </div>

            {/* Range Pills */}
            <div className="flex flex-wrap items-center gap-4 lg:flex-1">
              <span className="hidden font-display text-[12px] font-bold uppercase tracking-[0.12em] text-carbon/45 xl:block">
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
                        "rounded-full px-5 py-2.5 font-display text-[13px] font-semibold",
                        "transition-all duration-300 ease-premium",
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

            {/* Right Group: Count, Reset, Search */}
            <div className="flex items-center gap-4 lg:shrink-0">
              {dirty && (
                <button
                  type="button"
                  onClick={() => setFilters(EMPTY)}
                  className="hidden shrink-0 items-center gap-1.5 font-display text-[13px] font-semibold text-carbon/50 transition-colors duration-200 ease-premium hover:text-carbon sm:flex"
                >
                  Reset
                  <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </button>
              )}

              <span className="hidden shrink-0 font-display text-[14px] font-semibold text-carbon/40 xl:block">
                {visible.length} {visible.length === 1 ? "model" : "models"}
              </span>

              {/* Dark Search Field */}
              <div className="relative w-full sm:w-[260px]">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-volt"
                  strokeWidth={2.5}
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
                  className="w-full rounded-full bg-carbon py-3 pl-11 pr-5 font-display text-[14px] font-medium text-white shadow-[inset_0_0_0_1.5px_rgb(125_255_64/0)] outline-none transition-shadow duration-300 ease-premium placeholder:font-normal placeholder:text-white/45 focus:shadow-[inset_0_0_0_1.5px_rgb(125_255_64/0.85)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID SECTION */}
      <section className="w-full bg-mist py-12 lg:py-24">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-6 lg:px-8">
          {visible.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-4">
              {visible.map((model, i) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: EASE_PREMIUM,
                    delay: (i % 4) * 0.08,
                  }}
                >
                  <ModelCard model={model} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center"
            >
              <p className="font-display text-2xl font-bold text-carbon">
                No models match.
              </p>
              <p className="mt-3 text-[16px] text-carbon/60">
                Try a higher budget or a different search term.
              </p>
              <button
                type="button"
                onClick={() => setFilters(EMPTY)}
                className="mt-8 rounded-full bg-carbon px-8 py-3.5 font-display text-[14px] font-bold tracking-wide text-volt transition-transform hover:scale-105 active:scale-95"
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

/* =========================================================
   MODEL CARD - Ultra Minimal & Editorial
========================================================= */

export function ModelCard({ model }: { model: Model }) {  // Show max 4 finishes to keep it uncluttered
  const visibleFinishes = model.finishes.slice(0, 4);
  const extraFinishesCount = model.finishes.length - visibleFinishes.length;

  return (
    <div className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[24px] bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-15px_rgba(16,20,18,0.08)]">
      
      {/* Top Meta Info */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight text-carbon">
            {model.name}
          </h3>
          <p className="mt-1.5 font-display text-[10px] font-bold uppercase tracking-[0.15em] text-carbon/40">
            From {inr(model.price)}
          </p>
        </div>
        
        {/* Subtle Hover Action Icon */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon/5 text-carbon/30 transition-colors duration-300 group-hover:bg-carbon group-hover:text-volt">
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </div>
      </div>

      {/* Floating Product Image */}
      <div className="relative mb-10 aspect-[4/3] w-full">
        {/* Ambient Floor Shadow */}
        <div className="absolute bottom-2 left-1/2 h-3 w-1/2 -translate-x-1/2 rounded-[50%] bg-carbon/10 blur-xl transition-all duration-500 ease-premium group-hover:w-2/3 group-hover:bg-carbon/15" />
        <div className="absolute bottom-4 left-1/2 h-1.5 w-1/4 -translate-x-1/2 rounded-[50%] bg-carbon/20 blur-md transition-all duration-500 ease-premium group-hover:w-1/3" />

        {model.image ? (
          <Image
            src={model.image}
            alt={`${model.name} electric scooter`}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 640px) 40vw, 85vw"
            className="relative z-10 object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-premium group-hover:-translate-y-2 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-[10px] font-bold tracking-[0.25em] text-carbon/20">
              IMAGE PENDING
            </span>
          </div>
        )}
      </div>

      {/* Bottom Minimal Specs & Swatches */}
      <div className="mt-auto flex flex-col gap-5 border-t border-carbon/5 pt-5">
        
        {/* Sleek inline specs */}
        <div className="flex items-center justify-between font-display text-[10px] font-bold uppercase tracking-[0.1em] text-carbon/50">
          <span>{model.range} Range</span>
          <span className="h-1 w-1 rounded-full bg-carbon/15" />
          <span>{model.topSpeed}</span>
        </div>

        {/* Minimal overlapping swatches */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-1.5">
            {visibleFinishes.map((finish) => (
              <span
                key={finish}
                title={finish}
                className="h-5 w-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: FINISH[finish] ?? "#8A9199" }}
              />
            ))}
            {extraFinishesCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-carbon/5 text-[8px] font-bold text-carbon/60 shadow-sm">
                +{extraFinishesCount}
              </span>
            )}
          </div>
          
          <span className="font-display text-[11px] font-bold text-carbon transition-colors duration-300 group-hover:text-volt">
            Explore Details
          </span>
        </div>
      </div>
    </div>
  );
}