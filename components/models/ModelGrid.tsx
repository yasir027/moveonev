
"use client";

import { motion } from "framer-motion";

import {
  type BatteryId,
  type Model,
} from "@/lib/models";

import { EASE_PREMIUM } from "@/lib/motion";
import { ModelCard } from "./ModelCard";

type PricedModel = {
  model: Model;
  batteryId: BatteryId;
  pricing: Model["pricing"][BatteryId];
};

type ModelGridProps = {
  models?: Model[];
  items?: PricedModel[];
};

export function ModelGrid({
  models = [],
  items,
}: ModelGridProps) {
  const cards =
    items ??
    models.map((model) => ({
      model,
      batteryId: undefined,
      pricing: undefined,
    }));

  return (
    <div
      className="
        grid w-full min-w-0
        grid-cols-2
        gap-x-3 gap-y-6
        sm:gap-x-5 sm:gap-y-10
        lg:grid-cols-4
        xl:gap-x-6
      "
    >
      {cards.map((item, index) => (
        <motion.div
          key={item.model.slug}
          className="h-full min-w-0"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.12,
          }}
          transition={{
            duration: 0.55,
            delay: Math.min(index * 0.06, 0.3),
            ease: EASE_PREMIUM,
          }}
        >
          <ModelCard
            model={item.model}
            batteryId={item.batteryId}
            pricing={item.pricing}
          />
        </motion.div>
      ))}
    </div>
  );
}
