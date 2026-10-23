"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
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

/* Figures from the XIDAA catalogue: 60V 30AH = 70–80 km, 60V 45AH = 110–120 km, both LFP
   with a smart BMS. kWh is volts x amp-hours (60 x 30 = 1.8, 60 x 45 = 2.7). Both packs
   carry the same feature set, so they share one perk list. On phones only the first four
   show, so both cards fit on screen together. */
const PERKS = [
  "Fire proof",
  "IP67 sealed",
  "Laser-welded",
  "Nickel strips",
  "Cell balancing",
  "App tracking",
  "Fast charge",
  "2,000 cycles",
];

const packs: Pack[] = [
  {
    label: "01",
    name: "60V 30AH",
    title: "Everyday",
    range: "70–80",
    specs: "1.8 kWh · LFP cells · Smart BMS",
    perks: PERKS,
    image: "/Battery1.png",
    alt: "MOVE ON 60V 30AH lithium battery",
    placeholder: "PACK PNG",
  },
  {
    label: "02",
    name: "60V 45AH",
    title: "Long range",
    range: "110–120",
    specs: "2.7 kWh · LFP cells · Smart BMS",
    perks: PERKS,
    image: "/Battery3.png",
    alt: "MOVE ON 60V 45AH lithium battery",
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
    /* overflow-x-clip, not overflow-hidden — same as LineupSection. Spacing matches it too. */
    <section
      id="batteries"
      className="relative w-full overflow-x-clip bg-mist py-16 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 15% 20%, rgba(66, 206, 0, 0.08), transparent 62%), radial-gradient(55% 45% at 88% 78%, rgba(0, 168, 107, 0.08), transparent 62%)",
        }}
      />

      {/* Same container as LineupSection. */}
      <div className="relative mx-auto w-full max-w-[1440px] px-[7%]">
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 top-8 hidden select-none whitespace-nowrap font-display text-[8vw] font-extrabold leading-[0.8] tracking-[-0.04em] text-carbon/[0.03] lg:block"
        >
          RANGE
        </span>

        <header className="relative mb-8 max-w-2xl lg:mb-14">
          <RevealHeading
            className="text-carbon"
            lines={["Pick the pack", "that fits your day."]}
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.55, ease: EASE_PREMIUM, delay: 0.25 }}
            className="mt-4 max-w-[480px] text-base leading-relaxed text-carbon/60 lg:mt-6"
          >
            Same protection, same smart BMS, same 2 + 1 year cover on both
            packs. The only question is how far you ride between charges.
          </motion.p>
        </header>

        {/* Always two columns, so both packs show together even on a phone. */}
        <div className=" mx-auto grid grid-cols-2 gap-3 sm:gap-5 lg:gap-6">
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

        <div className="relative mt-8 flex flex-col items-center gap-4 lg:mt-14 lg:gap-5">
          <p className="text-center text-xs font-medium tracking-wide text-carbon/50 sm:text-sm">
            2 + 1 years / 40,000 km warranty on every pack.
          </p>

          {/* Subtle: transparent, volt outline, fills lightly on hover. */}
          <Link
            href="/technology"
className="
              inline-flex items-center justify-center gap-2
              rounded-full border border-carbon/25
              bg-transparent px-7 py-3.5
              text-sm font-medium text-carbon
              transition-all duration-300
              hover:border-carbon
              hover:bg-carbon hover:text-white
            "          >
            Read more about our technology
            <ArrowRight
              size={15}
              strokeWidth={2.5}
              aria-hidden
              className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

/*
 * Desktop (lg+): the top of the card is two halves, details on the left and the battery
 * on the right, with the feature pills and the button underneath.
 * Below lg the card is a narrow column: battery on top, details under it. It is sized so
 * two of them sit side by side on a phone.
 */
function PackCard({ pack }: { pack: Pack }) {
  const isFeatured = pack.featured;

  return (
    <div
      className={[
        "group relative flex h-full flex-col gap-3 rounded-[22px] bg-white p-3 sm:gap-4 sm:rounded-[28px] sm:p-5",
        "shadow-[0_20px_40px_-15px_rgba(16,20,18,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-15px_rgba(16,20,18,0.12)]",
        isFeatured ? "border-2 border-carbon" : "border border-carbon/10",
      ].join(" ")}
    >
      {pack.chip && (
        <span className="absolute left-2.5 top-2.5 z-20 rounded-full bg-volt px-2 py-1 font-display text-[8px] font-bold uppercase tracking-[0.14em] text-carbon shadow-sm sm:left-5 sm:top-5 sm:px-3 sm:py-1.5 sm:text-[9px]">
          {pack.chip}
        </span>
      )}

      {/* Top: details (left on desktop) and battery (right on desktop). The battery is
          first in the DOM order on phones via `order-first`. */}
      <div className="grid items-center gap-2 lg:grid-cols-2 lg:gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-carbon font-display text-[11px] font-bold text-volt sm:h-9 sm:w-9 sm:text-[13px]">
              {pack.label}
            </span>
            <div className="min-w-0">
              <p className="font-display text-[9px] font-bold uppercase tracking-[0.14em] text-carbon/40 sm:text-[11px] sm:tracking-[0.16em]">
                {pack.name}
              </p>
              <h3 className="truncate font-display text-base font-bold leading-tight tracking-tight text-carbon sm:text-xl lg:text-2xl">
                {pack.title}
              </h3>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 sm:mt-4">
            <span className="font-display text-2xl font-extrabold leading-none tracking-[-0.03em] text-carbon sm:text-3xl lg:text-4xl">
              {pack.range}
            </span>
            <span className="text-[11px] font-semibold text-carbon/50 sm:text-sm">
              km per charge
            </span>
          </div>

          <p className="mt-1.5 hidden text-[13px] font-medium tracking-wide text-carbon/60 sm:block">
            {pack.specs}
          </p>
        </div>

        <PackFrame pack={pack} className="order-first lg:order-last" />
      </div>

      {/* Features, as pills. */}
      <ul className="flex flex-wrap gap-1.5 border-t border-carbon/10 pt-3 sm:gap-2 sm:pt-4">
        {pack.perks.map((perk, idx) => {
          const Icon = getPerkIcon(perk);
          return (
            <li
              key={perk}
              className={[
                "items-center gap-1 rounded-full bg-volt/15 py-0.5 pl-1.5 pr-2 sm:gap-1.5 sm:py-1 sm:pl-2 sm:pr-3",
                idx > 3 ? "hidden sm:flex" : "flex",
              ].join(" ")}
            >
              <Icon
                className="h-3 w-3 shrink-0 text-leaf sm:h-3.5 sm:w-3.5"
                strokeWidth={2.5}
                aria-hidden
              />
              <span className="text-[10px] font-semibold text-carbon/80 sm:text-[12px]">
                {perk}
              </span>
            </li>
          );
        })}
      </ul>

      {/* mt-auto pins the button to the bottom, so both cards' buttons line up. */}
      {/* Two buttons. Stacked on phones (the cards are narrow), side by side from sm up. */}
<div className="mt-auto flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
  <Link
    href="/models"
  className="flex-1 rounded-full border border-carbon/15 bg-transparent py-2.5 text-center font-display text-[13px] font-bold tracking-wide text-carbon transition-colors duration-300 hover:border-carbon hover:bg-carbon hover:text-volt sm:py-3 sm:text-[15px]"
  >
    View scooters
  </Link>
  <Link
    href="/#book"
    className={[
      "flex-1 rounded-full py-2.5 text-center font-display text-[13px] font-bold tracking-wide transition-colors duration-300 ease-premium sm:py-3 sm:text-[15px]",
      isFeatured
        ? "bg-volt text-carbon hover:bg-carbon hover:text-white"
        : "bg-carbon text-white hover:bg-volt hover:text-carbon",
    ].join(" ")}
  >
    Book a test ride
  </Link>
</div>
    </div>
  );
}

function PackFrame({ pack, className = "" }: { pack: Pack; className?: string }) {
  return (
    <div
      className={`relative isolate flex h-[105px] w-full shrink-0 items-center justify-center rounded-[16px] sm:h-[150px] lg:h-[190px] ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-[16px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(16,20,18,0.05),transparent_80%)]"
      />

      {pack.image ? (
        <div className="relative h-full w-full">
          <span
            aria-hidden
            className="absolute bottom-[8%] left-1/2 h-5 w-[45%] -translate-x-1/2 rounded-[50%] bg-carbon/15 blur-xl"
          />
          <span
            aria-hidden
            className="absolute bottom-[12%] left-1/2 h-2 w-[30%] -translate-x-1/2 rounded-[50%] bg-carbon/30 blur-md"
          />

          <Image
            src={pack.image}
            alt={pack.alt}
            fill
            sizes="(min-width: 1024px) 25vw, 45vw"
            className="relative z-10 object-contain p-1 drop-shadow-[0_20px_25px_rgba(16,20,18,0.25)] transition-transform duration-500 ease-premium group-hover:-translate-y-1 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden rounded-[16px]">
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