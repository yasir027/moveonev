"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { EASE_PREMIUM } from "@/lib/motion";

interface ProductCardProps {
  name: string;
  words: string[]; // e.g. ["Urban.", "Agile.", "Effortless."]
  image: string;
  range: string;
  topSpeed: string;
  reversed?: boolean; // alternate layout left/right per model
}

export function ProductCard({
  name,
  words,
  image,
  range,
  topSpeed,
  reversed = false,
}: ProductCardProps) {
  return (
    <div
      className={`grid grid-cols-1 items-center gap-10 border-t border-carbon/10 py-16 lg:grid-cols-2 ${
        reversed ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div>
        <h3 className="mb-4 font-display text-3xl font-semibold text-carbon">
          {name}
        </h3>
        <p className="mb-8 font-display text-2xl leading-tight text-carbon/40">
          {words.map((w) => (
            <span key={w} className="block">
              {w}
            </span>
          ))}
        </p>

        <div className="mb-8 flex gap-12">
          <div>
            <p className="font-display text-xl font-semibold">{range}</p>
            <p className="text-xs text-carbon/50">Range</p>
          </div>
          <div>
            <p className="font-display text-xl font-semibold">{topSpeed}</p>
            <p className="text-xs text-carbon/50">Top speed</p>
          </div>
        </div>

        <Button variant="secondary">Explore {name.split(" ").pop()}</Button>
      </div>

      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: EASE_PREMIUM }}
        className="relative h-[280px] rounded-3xl bg-soft-grey lg:h-[360px]"
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="object-contain p-8"
        />
      </motion.div>
    </div>
  );
}
