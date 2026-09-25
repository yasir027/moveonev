"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE_PREMIUM } from "@/lib/motion";

interface ProductCardProps {
  name: string;
  words: string[];
  image: string;
  range: string;
  topSpeed: string;
  reversed?: boolean;
}

export function ProductCard({
  name,
  words,
  image,
  range,
  topSpeed,
  reversed = false,
}: ProductCardProps) {
  const modelCode = name.split(" ").pop(); // e.g., "X1", "PRO"

  return (
    <div
      className={`group relative grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-20 lg:py-24 ${
        reversed ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Text Column */}
      <div className={`relative z-10 flex flex-col ${reversed ? "lg:items-end lg:text-right" : "items-start"}`}>
        <h3 className="font-display text-[clamp(3.5rem,7vw,5.5rem)] font-extrabold leading-[0.85] tracking-[-0.05em] text-carbon">
          MOVE ON <br />
          <span className="text-carbon/30 group-hover:text-volt transition-colors duration-500">
            {modelCode}
          </span>
        </h3>

        {/* Spec Pills */}
        <div className={`mt-8 flex flex-wrap gap-3 ${reversed ? "lg:justify-end" : ""}`}>
          <span className="rounded-full border border-carbon/10 bg-[#F6F7F6] px-4 py-2 font-display text-[11px] font-bold uppercase tracking-[0.15em] text-carbon">
            {range} Range
          </span>
          <span className="rounded-full border border-carbon/10 bg-[#F6F7F6] px-4 py-2 font-display text-[11px] font-bold uppercase tracking-[0.15em] text-carbon">
            {topSpeed} Top Speed
          </span>
        </div>

        {/* Editorial Words */}
        <p className="mt-8 max-w-sm font-display text-2xl font-medium leading-snug text-carbon/50">
          {words.join(" ")}
        </p>

        {/* CTA */}
        <div className="mt-10">
          <button className="group/btn inline-flex h-14 items-center gap-3 rounded-full bg-carbon pl-6 pr-2 font-display text-sm font-bold text-white transition-all hover:bg-volt hover:text-carbon">
            Explore {modelCode}
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:bg-carbon group-hover/btn:text-white">
              <ArrowRight size={16} strokeWidth={2.2} />
            </span>
          </button>
        </div>
      </div>

      {/* Image Column */}
      <div className="relative h-[40vh] min-h-[350px] w-full overflow-hidden rounded-[40px] bg-[#F6F7F6] lg:h-[600px]">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />

        {/* Oversized watermark text */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex flex-col justify-center overflow-hidden opacity-[0.04] select-none"
        >
          <span className="whitespace-nowrap font-display text-[25vw] font-black uppercase leading-none tracking-tighter text-carbon lg:text-[18vw]">
            {modelCode}
          </span>
        </div>

        {/* Scooter Image with floating hover effect */}
        <motion.div
          whileHover={{ y: -15, scale: 1.02 }}
          transition={{ duration: 0.8, ease: EASE_PREMIUM }}
          className="absolute inset-0"
        >
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-contain p-8 drop-shadow-2xl lg:p-12"
          />
        </motion.div>
      </div>
    </div>
  );
}