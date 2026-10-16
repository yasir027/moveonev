
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { EASE_PREMIUM } from "@/lib/motion";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { models } from "@/lib/models";
import { ModelGrid } from "@/components/models/ModelGrid";

export function LineupSection() {
  return (
    <section
      id="lineup"
      className="relative w-full bg-mist py-20 lg:py-24"
    >
      <div
        className="
  mx-auto w-full
  max-w-[1440px]
  px-[7%]
"
      >
        {/* Section Header */}
        <header className="mb-12 max-w-2xl lg:mb-14">
          <RevealHeading
            className="text-carbon"
            lines={["Eight models.", "No licence, no RTO."]}
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              margin: "-10%",
            }}
            transition={{
              duration: 0.55,
              ease: EASE_PREMIUM,
              delay: 0.25,
            }}
            className="
              mt-6 max-w-[480px]
              text-base leading-relaxed
              text-carbon/60
            "
          >
            Every model runs the same platform — up to 170 km
            of range, a heavy-duty BLDC motor, and a 150 kg
            load rating. Pick the one that looks right and
            choose your finish.
          </motion.p>
        </header>

        {/* First Four Models — Shared Responsive Grid */}
        <ModelGrid models={models.slice(0, 4)} />

        {/* View All Models */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            margin: "-10%",
          }}
          transition={{
            duration: 0.55,
            ease: EASE_PREMIUM,
            delay: 0.2,
          }}
          className="mt-10 flex justify-center lg:mt-12"
        >
          <Link
            href="/models"
            className="
              inline-flex items-center justify-center gap-2
              rounded-full border border-carbon/15
              bg-transparent px-7 py-3.5
              text-sm font-medium text-carbon
              transition-all duration-300
              hover:border-carbon
              hover:bg-carbon hover:text-white
            "
          >
            View All Models
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
