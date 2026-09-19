"use client";

import { motion } from "framer-motion";
import { FileX2, BatteryCharging, ShoppingBag, Lock, type LucideIcon } from "lucide-react";

interface Usp {
  icon: LucideIcon;
  title: string;
  description: string;
}

const USPS: Usp[] = [
  {
    icon: FileX2,
    title: "No RTO. No Road Tax.",
    description:
      "Ride from day one — skip RTO registration, annual road tax and mandatory insurance entirely. Anyone 16 and up can legally ride, licence-free.",
  },
  {
    icon: BatteryCharging,
    title: "A Battery Built to Outlast",
    description:
      "Fire-resistant LiFePO4 chemistry, engineered to stay stable through harsh Indian heat and rated for 2,500+ charge cycles of daily riding.",
  },
  {
    icon: ShoppingBag,
    title: "Space for the Whole Ride",
    description:
      "Heavy-duty carrying capacity with up to 45 litres of under-seat storage on select models — room enough for your daily groceries and essentials.",
  },
  {
    icon: Lock,
    title: "Smart, Secure, Safe",
    description:
      "Reverse assist for tight parking, keyless ignition, an anti-theft alarm and a one-touch Repair Switch — safety tech rare at this price.",
  },
];

const EASE_PREMIUM = [0.22, 1, 0.36, 1];

export function UspSection() {
  return (
    <section className="relative w-full py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          className="mb-14 max-w-2xl"
        >
          <h2 className="font-display text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-carbon">
            Own it. <br />
            Skip everything else.
          </h2>
        </motion.div>

        {/* Alternating Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {USPS.map((usp, i) => {
            const Icon = usp.icon;
            
            // Alternate styles based on index[cite: 5]
            const isHighlight = i % 2 !== 0; 
            
            // Dark Card Styling[cite: 5]
            const cardBg = isHighlight ? "bg-volt" : "bg-carbon";
            const titleColor = isHighlight ? "text-carbon" : "text-white";
            const descColor = isHighlight ? "text-carbon/85" : "text-white/70";
            
            // Inverted Icon Container Styling[cite: 5]
            const iconBg = isHighlight ? "bg-carbon" : "bg-volt";
            const iconColor = isHighlight ? "#7DFF40" : "#101412";

            return (
              <motion.div
                key={usp.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: i * 0.1 }}
                className={`relative flex flex-col rounded-[24px] p-8 shadow-xl shadow-carbon/5 transition-transform duration-300 hover:-translate-y-2 ${cardBg}`}
              >
                <div
                  className={`mb-8 flex h-14 w-14 items-center justify-center rounded-full ${iconBg}`}
                >
                  <Icon size={24} color={iconColor} strokeWidth={2} />
                </div>

                <h3 className={`mb-3 font-display text-xl font-bold leading-snug tracking-tight ${titleColor}`}>
                  {usp.title}
                </h3>
                
                <p className={`text-base leading-relaxed ${descColor}`}>
                  {usp.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}