"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Flame,
  Droplets,
  Zap,
  Smartphone,
  BatteryCharging,
  Repeat,
  Layers,
  Scale,
  Check,
} from "lucide-react";
import { EASE_PREMIUM } from "@/lib/motion";

const GLASS_CARD =
  "rounded-[32px] p-6 shadow-[0_24px_50px_-15px_rgba(16,20,18,0.08)] transition-all duration-500 hover:shadow-[0_32px_60px_-15px_rgba(16,20,18,0.12)]";

const CARD_REVEAL = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-10%" },
} as const;

interface Pack {
  label: string;
  name: string;
  title: string;
  range: string;
  specs: string;
  perks: string[];
  image: string | null;
  alt: string;
  placeholder: string;
  featured?: boolean;
  chip?: string;
}

const packs: Pack[] = [
  {
    label: "01",
    name: "60V 30AH",
    title: "Everyday",
    range: "70–80",
    specs: "1.8 kWh · LFP cells · 12 kg",
    perks: [
      "Fire proof",
      "IP67 sealed",
      "Laser-welded",
      "App tracking",
      "Fast charge",
      "2,000 cycles",
    ],
    image: "/Battery1.png",
    alt: "MOVE ON 60V 30AH lithium battery",
    placeholder: "PACK PNG",
  },
  {
    label: "02",
    name: "60V 45AH",
    title: "All week",
    range: "110–130",
    specs: "2.7 kWh · LFP cells · 16 kg",
    perks: [
      "Fire proof",
      "IP67 sealed",
      "Laser-welded",
      "Nickel strips",
      "App tracking",
      "2,000 cycles",
    ],
    image: "/Battery2.png",
    alt: "MOVE ON 60V 45AH lithium battery",
    placeholder: "PACK PNG",
    featured: true,
    chip: "Most picked",
  },
  {
    label: "03",
    name: "60V 55AH",
    title: "Long range",
    range: "160–170",
    specs: "3.3 kWh · Pouch cells · 19 kg",
    perks: [
      "Fire proof",
      "IP67 sealed",
      "Cell balancing",
      "Nickel strips",
      "App tracking",
      "2,000 cycles",
    ],
    image: "/Battery3.png",
    alt: "MOVE ON 60V 55AH lithium battery",
    placeholder: "PACK PNG",
  },
];

/* Helper to map perk strings to suitable Lucide icons */
function getPerkIcon(perk: string) {
  const lower = perk.toLowerCase();
  if (lower.includes("fire")) return Flame;
  if (lower.includes("ip67")) return Droplets;
  if (lower.includes("laser")) return Zap;
  if (lower.includes("app")) return Smartphone;
  if (lower.includes("charge")) return BatteryCharging;
  if (lower.includes("cycles")) return Repeat;
  if (lower.includes("nickel")) return Layers;
  if (lower.includes("cell")) return Scale;
  return Check;
}

export function BatterySection() {
  return (
    <section
      id="batteries"
      className="relative w-full bg-mist py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 15% 20%, rgba(66, 206, 0, 0.08), transparent 62%), radial-gradient(55% 45% at 88% 78%, rgba(0, 168, 107, 0.08), transparent 62%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1300px] px-6 sm:px-8 lg:px-12">
        <span
          aria-hidden
          className="pointer-events-none absolute right-12 top-8 hidden select-none whitespace-nowrap font-display text-[8vw] font-extrabold leading-[0.8] tracking-[-0.04em] text-carbon/[0.03] lg:block"
        >
          RANGE
        </span>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.55, ease: EASE_PREMIUM }}
          className="relative mb-12 max-w-2xl"
        >
          <span className="mb-5 block h-1 w-12 rounded-full bg-volt" />

          <span className="mb-4 block font-display text-xs font-bold uppercase tracking-[0.2em] text-carbon/40">
            The Battery
          </span>
          <h2 className="font-display text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-carbon">
            Pick the pack
            <br />
            that fits your day.
          </h2>

          <p className="mt-6 max-w-[480px] text-base leading-relaxed text-carbon/60">
            Same protection, same charger, same three-year cover across all
            three. The only question is how far you ride between charges.
          </p>
        </motion.header>

        <div className="grid gap-6 pt-8 md:grid-cols-3 lg:gap-8">
          {packs.map((pack, i) => (
            <motion.article
              key={pack.name}
              {...CARD_REVEAL}
              transition={{
                duration: 0.7,
                ease: EASE_PREMIUM,
                delay: i * 0.1,
              }}
              className="relative z-10 h-full"
            >
              <PackCard pack={pack} />
            </motion.article>
          ))}
        </div>

        <p className="relative mt-10 text-center text-sm font-medium tracking-wide text-carbon/50 sm:text-left">
          2 + 1 years warranty on every pack. Swappable, and fits every MOVE ON
          model.
        </p>
      </div>
    </section>
  );
}

function PackCard({ pack }: { pack: Pack }) {
  const isFeatured = pack.featured;

  return (
    <div
      className={[
        GLASS_CARD,
        "group flex h-full flex-col bg-white",
        /* Removed overflow-hidden so the 3D image can break the top boundary */
        /* Solid black border and resting lift for the featured card */
        isFeatured
          ? "border-[3px] border-carbon lg:-translate-y-6 hover:lg:-translate-y-8"
          : "border border-carbon/10 hover:-translate-y-2",
      ].join(" ")}
    >
      <PackFrame pack={pack} />

      <div className="relative z-20 -mt-6 flex items-center gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-carbon font-display text-xs font-bold text-volt">
          {pack.label}
        </span>
        <div className="min-w-0">
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-carbon/40">
            {pack.name}
          </p>
          <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-carbon sm:text-2xl">
            {pack.title}
          </h3>
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-4xl font-extrabold leading-none tracking-[-0.03em] text-carbon lg:text-5xl">
          {pack.range}
        </span>
        <span className="text-sm font-semibold text-carbon/50">km per charge</span>
      </div>

      <p className="mt-2 text-sm font-medium tracking-wide text-carbon/60">
        {pack.specs}
      </p>

      {/* Increased text size and specific Lucide icons for perks */}
      <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-carbon/10 pt-5 mb-6">
        {pack.perks.map((perk) => {
          const Icon = getPerkIcon(perk);
          return (
            <li key={perk} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-volt/20">
                <Icon className="h-4 w-4 text-[#42ce00]" strokeWidth={2.5} aria-hidden />
              </span>
              <span className="truncate text-base font-semibold text-carbon/80">
                {perk}
              </span>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={[
          "mt-auto w-full rounded-full py-3 font-display text-sm font-bold tracking-wide transition-colors duration-300 ease-premium",
          isFeatured
            ? "bg-volt text-carbon hover:bg-carbon hover:text-white"
            : "bg-carbon text-white hover:bg-volt hover:text-carbon",
        ].join(" ")}
      >
        Book a test ride
      </button>
    </div>
  );
}

function PackFrame({ pack }: { pack: Pack }) {
  return (
    <div className="relative isolate flex aspect-[5/4] items-center justify-center rounded-[20px]">
      <span
        aria-hidden
        className="absolute inset-0 rounded-[20px] bg-[radial-gradient(56%_52%_at_50%_58%,rgba(16,20,18,0.06),transparent_70%)]"
      />

      {pack.image ? (
        <>
          <span
            aria-hidden
            className="absolute bottom-[12%] h-8 w-[68%] rounded-[50%] bg-carbon/20 blur-2xl"
          />
          <span
            aria-hidden
            className="absolute bottom-[15%] h-3.5 w-[42%] rounded-[50%] bg-carbon/40 blur-lg"
          />

          {/* 
            Image scaled up and translated sharply upwards to break the top of the card.
            Hover transform effects have been completely removed.
          */}
          <Image
            src={pack.image}
            alt={pack.alt}
            width={600}
            height={600}
            className="relative z-10 h-[100%] w-auto -translate-y-[20%] object-contain drop-shadow-[0_30px_26px_rgba(16,20,18,0.32)]"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden rounded-[20px]">
          <span className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-[-0.05em] text-carbon/[0.07]">
            {pack.label}
          </span>
          <span className="font-display text-[10px] font-semibold tracking-[0.25em] text-carbon/25">
            {pack.placeholder}
          </span>
        </div>
      )}

      {pack.chip ? (
        <span className="absolute right-4 top-4 z-20 rounded-full bg-volt px-4 py-2 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-carbon shadow-sm">
          {pack.chip}
        </span>
      ) : null}
    </div>
  );
}