"use client";

import { motion } from "framer-motion";
import { EASE_PREMIUM } from "@/lib/motion";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { models } from "@/lib/models";
import { ModelCard } from "@/components/models/ModelCard";

/*
 * Homepage lineup. Data lives in lib/models.ts and the card (with its popup) in
 * components/models/ModelCard.tsx, so this file is only the section around them.
 */
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
       
        {/* Grid */}
        <div className="focus-siblings grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-4">
          {models.map((model, i) => (
            <motion.div
              key={model.slug}
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