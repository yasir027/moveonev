"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BellRing, IndianRupee, Radio, ShieldCheck, type LucideIcon } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/heroModels";
import { EASE_PREMIUM } from "@/lib/motion";
import {
  BATTERIES,
  FINISH,
  formatPrice,
  splitName,
  type BatteryId,
  type Model,
} from "@/lib/models";
import { ModelDetail } from "./ModelDetail";
import { ModelStage } from "./ModelStage";

/*
 * The model's content: stage, name, price, finish, battery, features, booking and — when
 * `expanded` — the full details. One component, two homes:
 *   - ModelModal renders it inside the popup (peek, then grown to full screen).
 *   - app/models/[slug]/page.tsx renders it as the real page (`expanded`, `asPage`).
 * So the page a visitor lands on is exactly what the grown popup showed, and nothing is
 * written twice. Client component, but still server-rendered to HTML on the page route.
 */

/* The four things worth a chip. Short label under the icon; the long form is the tooltip. */
export const USP: { icon: LucideIcon; short: string; long: string }[] = [
  { icon: ShieldCheck, short: "No licence needed", long: "No licence needed · No RTO" },
  { icon: IndianRupee, short: "₹5 per charge", long: "Just ₹5 per charge" },
  { icon: Radio, short: "Remote start", long: "Remote start" },
  { icon: BellRing, short: "Anti-theft alarm", long: "Anti-theft alarm" },
];


export function ModelView({
  model,
  expanded,
  asPage = false,
  initialFinish,
  initialBattery,
  onChange,
}: {
  model: Model;
  expanded: boolean;
  /** True on the real page: the name becomes the page's <h1>. */
  asPage?: boolean;
  /** Where the choices start: the card's battery, or what the popup handed to the page. */
  initialFinish?: string;
  initialBattery?: BatteryId;
  /** Told about every pick, so the popup can carry the choices over to the page. */
  onChange?: (finish: string, battery: BatteryId) => void;
}) {
  const [finish, setFinishState] = useState(initialFinish ?? model.finishes[0]);
  const [battery, setBatteryState] = useState<BatteryId>(initialBattery ?? "30ah");

  const setFinish = (next: string) => {
    setFinishState(next);
    onChange?.(next, battery);
  };
  const setBattery = (next: BatteryId) => {
    setBatteryState(next);
    onChange?.(finish, next);
  };

  const pack = BATTERIES.find((b) => b.id === battery) ?? BATTERIES[0];
  const price = model.pricing[battery];
  const saving = price.mrp - price.offer;
  const [nameLight, nameBold] = splitName(model.name);
  const Heading = asPage ? "h1" : "h3";

  /* The carousel's slides. With real angles in `gallery` they show here; until then the
     same photo repeats. A finish that has its own photo replaces the first slide. 
  const base = model.gallery?.length
    ? model.gallery
    : model.image
      ? [model.image, model.image, model.image]
      : [];
  const slides = base.map((src, i) =>
    i === 0 ? (model.colorImages?.[finish] ?? src) : src,
  );
  */

  const slides = model.image ? [model.image] : [];

  /* Pre-filled, so the enquiry arrives already saying which scooter, colour and pack. */
  const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi MOVE ON, I'd like to book a test ride of the ${model.name}, ${pack.label}).`,
  )}`;

  const label =
    "font-display text-[10px] font-bold uppercase tracking-[0.14em] text-[#475569]";

  return (
    <div
      className={[
        "grid w-full lg:grid-cols-[1.05fr_1fr]",
        expanded
 ? asPage
    ? "gap-6 px-[7%] pb-12 pt-4 lg:gap-14 lg:pt-6"
    : "gap-6 px-[7%] pb-12 pt-16 sm:pt-20 lg:gap-14 lg:pt-20"
  : "",
      ].join(" ")}
    >
      {/* LEFT — the stage. `layout` counter-scales it during the morph so the
          scooter doesn't visibly stretch. */}
      <motion.div layout className="min-w-0">
        <ModelStage
          slides={slides.slice(0, 1)}
          //slides={slides} thumnails.
          alt={`MOVE ON ${model.name} `}
          name={model.name}
          variant="modal"
          className={
            expanded
              ? "h-[56svh] lg:h-[min(calc(100svh-10rem),680px)]"
              : "h-[44svh] sm:h-[400px] lg:h-[min(calc(100svh-4rem),590px)]"
          }
        />
      </motion.div>

      {/* RIGHT — what it is, what it costs, the choices, and the way to book. */}
      <motion.div
        layout="position"
        className={[
          "flex min-w-0 flex-col",
          expanded ? "" : "px-5 pb-6 pt-6 sm:px-8 sm:pb-8 lg:pb-5 lg:pl-4 lg:pr-6 lg:pt-5",
        ].join(" ")}
      >
        {/* The name: the series letter outlined (the hero's .type-outline, at a
            lighter stroke for this size), the model name heavy with a volt
            highlighter band under it. The band clones onto each line when the name
            wraps. In the peek the float clears the icon buttons on the first line
            only, so the name wraps around them rather than under them. */}
        <Heading
          className={[
            "whitespace-nowrap font-display text-[40px] font-extrabold leading-[0.95] tracking-[-0.045em] text-carbon sm:text-[46px] lg:text-[48px]",
            expanded ? "mt-5" : "mt-7",
          ].join(" ")}
        >
          {nameLight && (
            <span className="type-outline mr-[0.18em] [-webkit-text-stroke-width:2px]">
              {nameLight}
            </span>
          )}
          <span className="bg-[linear-gradient(transparent_60%,var(--color-volt)_60%,var(--color-volt)_88%,transparent_88%)] [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">
            {nameBold}
          </span>
        </Heading>

        {/* Price. The offer leads; the list price is struck through beside it. */}
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <span className="font-display text-[34px] font-extrabold leading-none tracking-[-0.04em] text-leaf lg:text-[32px]">
            {formatPrice(price.offer)}
          </span>
          <span className="text-[18px] text-[#475569] line-through">
            {formatPrice(price.mrp)}
          </span>
          <span className="rounded-full bg-volt px-3 py-1 font-display text-[13px] font-bold text-carbon">
            Save {formatPrice(saving)}
          </span>
        </div>

        <p
          className={[
            "mt-3 text-[14px] leading-relaxed text-[#475569]",
            expanded ? "" : "line-clamp-2",
          ].join(" ")}
        >
          {model.blurb}
        </p>

        {/* Finish. The chosen name sits right beside the header, so the two read
            as one label. Picking one re-tints the stage's arc. 
        <div className="mt-5">
          <p className="mb-2 flex items-baseline gap-3">
            <span className={label}>Finish</span>
            <span className="text-[10px] font-semibold text-carbon">{finish}</span>
          </p>
          <div role="radiogroup" aria-label="Finish" className="flex flex-wrap gap-3">
            {model.finishes.map((name) => {
              const active = name === finish;
              return (
                <button
                  key={name}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={name}
                  title={name}
                  onClick={() => setFinish(name)}
                  className={[
                    "h-6 w-6 rounded-full transition-shadow duration-200 ease-premium",
                    active
                      ? "ring-2 ring-carbon ring-offset-2"
                      : "ring-1 ring-carbon/15 hover:ring-carbon/40",
                  ].join(" ")}
                  style={{ backgroundColor: FINISH[name] ?? "#8A9199" }}
                />
              );
            })}
          </div>
        </div>
*/}
<div className="mt-5">
  <p className={`${label} mb-2`}>Available colours</p>
  <div className="flex flex-wrap gap-3">
    {model.finishes.map((name) => (
      <span
        key={name}
        role="img"
        aria-label={name}
        className="group/dot relative h-6 w-6 cursor-default rounded-full ring-1 ring-carbon/15"
        style={{ backgroundColor: FINISH[name] ?? "#8A9199" }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-carbon px-3 py-1 font-display text-[11px] font-bold text-white opacity-0 transition-opacity duration-150 group-hover/dot:opacity-100"
        >
          {name}
        </span>
      </span>
    ))}
  </div>
</div>
        {/* Battery — the choice that sets the price. The selected card is white
            with a thick green border and a 5% green wash. Both states carry the
            same 3px border, so picking one never shifts the layout. ev-green,
            not volt: volt is ~1.4:1 on white and a selection border has to be
            seen; ev-green is ~3.1:1. */}
        <div className="mt-3">
          <p className={`${label} mb-2`}>Battery</p>
          <div role="radiogroup" aria-label="Battery" className="grid grid-cols-2 gap-3">
            {BATTERIES.map((option) => {
              const active = option.id === battery;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setBattery(option.id)}
                  className={[
                    "rounded-[18px] border-[3px] px-4 py-2.5 text-left transition-colors duration-200 ease-premium",
                    active
                      ? "border-ev-green bg-ev-green/5"
                      : "border-carbon/10 bg-white hover:border-carbon/25",
                  ].join(" ")}
                >
                  <span className="block font-display text-[15px] font-bold tracking-tight text-carbon">
                    {option.id === "30ah" ? "30AH" : "45AH"}
                  </span>
                  {/* The range is what the choice is about, so it carries the
                      weight: semibold, in the darker slate. */}
                  <span className="mt-0.5 block text-[12px] font-semibold text-[#334155]">
                    {option.range}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* USPs — fill the space between battery and booking, centred   in it. */}
<div className="flex items-center py-8 sm:py-10 lg:flex-1">
  <ul className="grid w-full grid-cols-4 gap-2">
    {USP.map(({ icon: Icon, short, long }) => (
      <li
        key={long}
        title={long}
        className="flex flex-col items-center gap-2 text-center"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-soft-grey">
          <Icon size={20} strokeWidth={2.25} className="text-leaf" aria-hidden />
        </span>
        <span className="text-[13px] font-semibold leading-tight text-carbon">
          {short}
        </span>
      </li>
    ))}
  </ul>
</div>

        {/* Booking row: the button takes the width, WhatsApp is the small round
            one beside it. */}
        <div
          className={[
            "mt-2 flex items-center gap-3",
            expanded ? "lg:pt-8" : "lg:pt-2",
          ].join(" ")}
        >
          <a
            href="/#book"
            className="flex-1 rounded-full bg-volt px-6 py-3.5 text-center font-display text-[16px] font-bold text-carbon transition-colors duration-200 hover:bg-carbon hover:text-white"
          >
            Book a test ride
          </a>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chat about the ${model.name} on WhatsApp`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-carbon text-white transition-colors duration-200 hover:bg-volt hover:text-carbon"
          >
            <WhatsAppIcon className="h-6 w-6" />
          </a>
        </div>
      </motion.div>

      {/* Expanded only, spanning both columns: these are full-width sections, and
          squeezed into one column they would be a long narrow strip. Waits for
          the box to finish growing, then fades in, so the content never lands in
          a container that is still moving. On the page it is simply there: the popup
          already showed it, so fading it in again would read as a second arrival. */}
      {expanded && (
        <motion.div
          initial={asPage ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_PREMIUM, delay: 0.3 }}
          className="border-t border-carbon/10 pt-10 lg:col-span-2"
        >
          <ModelDetail model={model} />
        </motion.div>
      )}
    </div>
  );
}

/* lucide dropped its brand icons, so the WhatsApp mark is drawn inline. */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}