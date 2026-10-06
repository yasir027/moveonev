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
import { RevealHeading } from "@/components/ui/RevealHeading";

const CARD_REVEAL = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
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
    featured: true,
    chip: "Most picked",
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
      className="relative w-full overflow-hidden bg-mist py-24 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 15% 20%, rgba(66, 206, 0, 0.08), transparent 62%), radial-gradient(55% 45% at 88% 78%, rgba(0, 168, 107, 0.08), transparent 62%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <span
          aria-hidden
          className="pointer-events-none absolute right-12 top-8 hidden select-none whitespace-nowrap font-display text-[8vw] font-extrabold leading-[0.8] tracking-[-0.04em] text-carbon/[0.03] lg:block"
        >
          RANGE
        </span>

        <header className="relative mb-16 max-w-2xl lg:mb-20">
          {/* <span className="mb-5 block h-1 w-12 rounded-full bg-volt" />

          <span className="mb-4 block font-display text-xs font-bold uppercase tracking-[0.2em] text-carbon/40">
            The Battery
          </span> */}
          <RevealHeading
            className="text-carbon"
            lines={["Pick the pack", "that fits your day."]}
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.55, ease: EASE_PREMIUM, delay: 0.25 }}
            className="mt-6 max-w-[480px] text-base leading-relaxed text-carbon/60"
          >
            Same protection, same charger, same three-year cover across all
            three. The only question is how far you ride between charges.
          </motion.p>
        </header>

        <div className="focus-siblings mx-auto grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
          {packs.map((pack, i) => (
            <motion.article
              key={pack.name}
              {...CARD_REVEAL}
              transition={{
                duration: 0.7,
                ease: EASE_PREMIUM,
                delay: i * 0.1,
              }}
              className="relative z-10 w-full"
            >
              <PackCard pack={pack} />
            </motion.article>
          ))}
        </div>

        <p className="relative mt-16 text-center text-sm font-medium tracking-wide text-carbon/50 lg:mt-20">
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
        "group relative flex h-full flex-col items-center gap-6 rounded-[32px] bg-white p-6 sm:flex-row sm:items-stretch sm:p-7",
        "shadow-[0_20px_40px_-15px_rgba(16,20,18,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-15px_rgba(16,20,18,0.12)]",
        isFeatured ? "border-2 border-carbon" : "border border-carbon/10",
      ].join(" ")}
    >
      <span aria-hidden className="focus-veil" />

{pack.chip && (
  <span className="absolute left-5 top-5 z-20 rounded-full bg-volt px-3 py-1.5 font-display text-[9px] font-bold uppercase tracking-[0.16em] text-carbon shadow-sm sm:left-7 sm:top-7">
    {pack.chip}
  </span>
)}

      {/* Left side: Image Frame */}
      <PackFrame pack={pack} />

      {/* Right side: Content */}
      <div className="flex flex-1 flex-col justify-center py-2">
        <div className="flex items-center gap-3.5">
          {/* Increased label size */}
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-carbon font-display text-sm font-bold text-volt">
            {pack.label}
          </span>
          <div className="min-w-0">
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-carbon/40">
              {pack.name}
            </p>
            {/* Increased title size */}
            <h3 className="truncate font-display text-2xl font-bold leading-tight tracking-tight text-carbon sm:text-3xl">
              {pack.title}
            </h3>
          </div>
        </div>

        <div className="mt-6 flex items-baseline gap-2">
          {/* Increased range sizing */}
          <span className="font-display text-4xl font-extrabold leading-none tracking-[-0.03em] text-carbon lg:text-5xl">
            {pack.range}
          </span>
          <span className="text-sm font-semibold text-carbon/50">km per charge</span>
        </div>

        {/* Increased specs font size */}
        <p className="mt-2 text-base font-medium tracking-wide text-carbon/60">
          {pack.specs}
        </p>

        <ul className="mt-6 grid grid-cols-1 gap-x-4 gap-y-3.5 border-t border-carbon/10 pt-6 sm:grid-cols-2">
          {pack.perks.map((perk) => {
            const Icon = getPerkIcon(perk);
            return (
              <li key={perk} className="flex items-center gap-3">
                {/* Increased icon bounding box and icon size */}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-volt/20">
                  <Icon
                    className="h-4 w-4 text-[#42ce00]"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </span>
                {/* Increased perk text size */}
                <span className="truncate text-[15px] font-semibold text-carbon/80">
                  {perk}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Wrapped button to push it further down */}
        <div className="mt-10 w-full sm:mt-auto sm:pt-6">
          <button
            type="button"
            className={[
              "w-full rounded-full py-4 font-display text-[15px] font-bold tracking-wide transition-colors duration-300 ease-premium",
              isFeatured
                ? "bg-volt text-carbon hover:bg-carbon hover:text-white"
                : "bg-carbon text-white hover:bg-volt hover:text-carbon",
            ].join(" ")}
          >
            Book a test ride
          </button>
        </div>
      </div>
    </div>
  );
}

function PackFrame({ pack }: { pack: Pack }) {
  return (
    <div className="relative isolate flex w-full shrink-0 items-center justify-center rounded-[24px] sm:w-[220px] lg:w-[260px]">
      <span
        aria-hidden
        className="absolute inset-0 rounded-[24px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(16,20,18,0.05),transparent_80%)]"
      />

      {pack.image ? (
        <div className="relative flex aspect-square w-full items-center justify-center">
          <span
            aria-hidden
            className="absolute bottom-[10%] h-5 w-[70%] rounded-[50%] bg-carbon/15 blur-xl"
          />
          <span
            aria-hidden
            className="absolute bottom-[15%] h-2 w-[45%] rounded-[50%] bg-carbon/30 blur-md"
          />

          <Image
            src={pack.image}
            alt={pack.alt}
            width={400}
            height={400}
            className="relative z-10 w-[95%] -translate-y-2 object-contain drop-shadow-[0_20px_25px_rgba(16,20,18,0.25)] transition-transform duration-500 ease-premium group-hover:-translate-y-3 group-hover:scale-105 md:w-[105%]"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden rounded-[24px]">
          <span className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-[-0.05em] text-carbon/[0.07]">
            {pack.label}
          </span>
          <span className="font-display text-[10px] font-semibold tracking-[0.25em] text-carbon/25">
            {pack.placeholder}
          </span>
        </div>
      )}
    </div>
  );
}