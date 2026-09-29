"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE_PREMIUM } from "@/lib/motion";
import { RevealHeading } from "@/components/ui/RevealHeading";

/* Named finishes, as they appear on the price list. */
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

const DUMMY_PRICE = "45,000";

interface Model {
  name: string;
  range: string;
  topSpeed: string;
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

const models: Model[] = [
  
{
  name: "X Double Light",
  range: "100+ km",
  topSpeed: "25 km/h",
  motor: "1000 W",
  load: "150 kg",
  specs: COMMON,
  finishes: ["Glossy Red", "Glossy Black", "Glossy Grey", "Matte Blue", "Ivory White"],
  image: "/Lineup/xdoublelight.png",
},

/*
{
  name: "X-Torvo",
  range: "100+ km",
  topSpeed: "25 km/h",
  motor: "1200 W",
  load: "150 kg",
  specs: COMMON,
  finishes: ["Creme", "Light Blue", "Ivory White", "Glossy Red", "Dark Blue"],
  image: "",
},
*/

{
  name: "X-Robox",
  range: "100+ km",
  topSpeed: "25 km/h",
  motor: "1200 W",
  load: "150 kg",
  specs: COMMON,
  finishes: ["Golden Yellow", "Aqua Blue", "Beige Gold"],
  image: "/Lineup/xrobox.png",
},

/*
{
  name: "X-Lambretta",
  range: "100+ km",
  topSpeed: "25 km/h",
  motor: "1200 W",
  load: "150 kg",
  specs: COMMON,
  finishes: ["Glacier Blue", "Rose Pearl", "Glossy Green"],
  image: null,
},
*/

{
  name: "X-ORL Cheetah",
  range: "100+ km",
  topSpeed: "25 km/h",
  motor: "1500 W",
  load: "150 kg",
  specs: COMMON,
  finishes: ["Glossy Red", "Glossy Black", "Glossy Grey", "Matte Green", "Matte Beige", "Glossy Blue"],
  image: "/Lineup/xorlcheetah.png",
},

/*
{
  name: "X-E4",
  range: "100+ km",
  topSpeed: "25 km/h",
  motor: "1200 W",
  load: "150 kg",
  specs: COMMON,
  finishes: ["Glossy Red", "Glossy Black", "Glossy Grey", "Matte Blue", "Ivory White", "Matte Green"],
  image: null,
},

{
  name: "X-FH",
  range: "100+ km",
  topSpeed: "25 km/h",
  motor: "1200 W",
  load: "150 kg",
  specs: COMMON,
  finishes: ["Glossy Red", "Glossy Black", "Glossy Grey", "Matte Blue", "Ivory White", "Matte Green"],
  image: null,
},
*/

{
  name: "X-Ozone",
  range: "100+ km",
  topSpeed: "25 km/h",
  motor: "1500 W",
  load: "150 kg",
  specs: COMMON,
  finishes: ["Ice Blue", "Orange", "Matte Green", "Matte Blue", "Ivory White"],
  image: "/Lineup/xozone.png",
},
];

export function LineupSection() {
  return (
    <section id="lineup" className="relative w-full bg-mist py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <header className="mb-16 max-w-2xl">
         
          <RevealHeading
            className="text-carbon"
            lines={["Eight models.", "No licence, no RTO."]}
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.55, ease: EASE_PREMIUM, delay: 0.25 }}
            className="mt-6 max-w-[480px] text-base leading-relaxed text-carbon/60"
          >
            Every model runs the same platform — 100+ km of range, a heavy-duty BLDC motor, and a 150 kg load rating. Pick the one that looks right and choose your finish.
          </motion.p>
        </header>

        {/* Minimal Grid */}
        <div className="focus-siblings grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 lg:gap-8">
          {models.map((model, i) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.6,
                ease: EASE_PREMIUM,
                delay: (i % 4) * 0.1,
              }}
            >
              <ModelCard model={model} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* =========================================================
   MODEL CARD - Ultra Minimal & Editorial
========================================================= */

function ModelCard({ model }: { model: Model }) {
  // Show max 4 finishes to keep it uncluttered
  const visibleFinishes = model.finishes.slice(0, 4);
  const extraFinishesCount = model.finishes.length - visibleFinishes.length;

  return (
    <div className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[24px] bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-15px_rgba(16,20,18,0.08)]">
      <span aria-hidden className="focus-veil" />

      {/* Top Meta Info */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          {/* Model Name */}
          <h3 className="font-display text-[22px] font-bold tracking-tight text-carbon">
            {model.name}
          </h3>

          {/* Price */}
          <p className="mt-1.5 font-display text-[15px] font-bold tracking-tight text-carbon/75">
            From{" "}
            <span className="text-carbon">
              ₹{DUMMY_PRICE}
            </span>
          </p>
        </div>

        {/* Hover Action Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-carbon/5 text-carbon/40 transition-all duration-300 group-hover:bg-carbon group-hover:text-volt">
          <ArrowUpRight size={17} strokeWidth={2.5} />
        </div>
      </div>

      {/* Floating Product Image */}
      <div className="relative mb-7 aspect-[4/3] w-full">
        {/* Ambient Floor Shadow */}
        <div className="absolute bottom-1 left-1/2 h-3.5 w-[58%] -translate-x-1/2 rounded-[50%] bg-carbon/10 blur-xl transition-all duration-500 ease-premium group-hover:w-[70%] group-hover:bg-carbon/15" />

        <div className="absolute bottom-3 left-1/2 h-1.5 w-[30%] -translate-x-1/2 rounded-[50%] bg-carbon/20 blur-md transition-all duration-500 ease-premium group-hover:w-[38%]" />

        {model.image ? (
          <Image
            src={model.image}
            alt={`MOVE ON ${model.name}`}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 640px) 42vw, 90vw"
            className="relative z-10 scale-[1.15] object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.14)] transition-transform duration-500 ease-premium group-hover:-translate-y-2 group-hover:scale-[1.22]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-[10px] font-bold tracking-[0.25em] text-carbon/20">
              IMAGE PENDING
            </span>
          </div>
        )}
      </div>

      {/* Bottom Specs */}
      <div className="mt-auto flex flex-col gap-5 border-t border-carbon/8 pt-5">

        {/* Range / Speed */}
        <div className="flex items-center justify-between font-display text-[11px] font-bold uppercase tracking-[0.1em] text-carbon/70">
          <span>{model.range} Range</span>

          <span className="h-1 w-1 shrink-0 rounded-full bg-carbon/25" />

          <span>{model.topSpeed}</span>
        </div>

        {/* Finishes + CTA */}
        <div className="flex items-center justify-between">
          
          {/* Colour Swatches */}
          <div className="flex -space-x-1.5">
            {visibleFinishes.map((finish) => (
              <span
                key={finish}
                title={finish}
                className="h-5 w-5 rounded-full border-2 border-white shadow-sm"
                style={{
                  backgroundColor: FINISH[finish] ?? "#8A9199",
                }}
              />
            ))}

            {extraFinishesCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-carbon/5 text-[8px] font-bold text-carbon/70 shadow-sm">
                +{extraFinishesCount}
              </span>
            )}
          </div>

          {/* CTA */}
          <span className="font-display text-[11px] font-bold tracking-tight text-carbon/80 transition-colors duration-300 group-hover:text-volt">
            Explore Details
          </span>
        </div>
      </div>
    </div>
  );
}