"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EASE_PREMIUM, usePrefersReducedMotion } from "@/lib/motion";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { StackCard, StackCards } from "@/components/ui/StackCards";

/** Which visual treatment the section carries. Three are live so they can be compared. */
export type UspVisual = "closeups" | "annotated" | "tile";

interface Usp {
  /** The small uppercase category that sits where an icon used to. */
  label: string;
  /** "|" marks a deliberate line break in the headline. */
  title: string;
  description: string;
  /** Footprint in the desktop 4x2 grid. The first claim gets the tall box. */
  span: string;
  /**
   * Close-up crop for the `closeups` variant, cut from Hero/bike_1.png. That file's
   * "transparency" is a painted checkerboard, so these were cleaned before cropping — and
   * the grab rail could not survive the cleaning (its silver matches the checker greys), so
   * no crop includes it. The pairing is only loosely literal: a closed side-profile render
   * can't show storage or a battery, so each card gets the nearest good-looking part.
   */
  closeup: string;
  /** Where the crop is framed when it becomes a top band on narrow cards (default centre). */
  bandFocus?: string;
  /** Phones: the short claim beside the lens, taken from the description. */
  lens: { kicker: string; value: string };
}

const USPS: Usp[] = [
  {
    label: "Registration",
    title: "No RTO.|No Road Tax.",
    description:
      "Ride from day one — skip RTO registration, annual road tax and mandatory insurance entirely. Anyone 16 and up can legally ride, licence-free.",
    span: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
    closeup: "/usp/closeup-registration.webp",
    lens: { kicker: "Anyone 16+", value: "Licence-free" },
  },
  {
    label: "Battery",
    title: "A Battery Built to Outlast",
    description:
      "Fire-resistant LiFePO4 chemistry, engineered to stay stable through harsh Indian heat and rated for 2,500+ charge cycles of daily riding.",
    span: "",
    closeup: "/usp/closeup-battery.webp",
    lens: { kicker: "LiFePO4", value: "2,500+ cycles" },
  },
  {
    label: "Storage",
    title: "Space for the Whole Ride",
    description:
      "Heavy-duty carrying capacity with up to 45 litres of under-seat storage on select models — room enough for your daily groceries and essentials.",
    span: "",
    closeup: "/usp/closeup-storage.webp",
    // The middle of this crop is plain side panel; the band keeps the tail light instead.
    bandFocus: "object-[50%_12%]",
    lens: { kicker: "Under-seat", value: "Up to 45 L" },
  },
  {
    label: "Security",
    title: "Smart, Secure, Safe",
    description:
      "Reverse assist for tight parking, keyless ignition, an anti-theft alarm and a one-touch Repair Switch — safety tech rare at this price.",
    span: "sm:col-span-2 lg:col-span-2",
    closeup: "/usp/closeup-security.webp",
    lens: { kicker: "Keyless", value: "+ anti-theft alarm" },
  },
];

/** Where the markers sit on the side profile, for the `annotated` variant. */
const HOTSPOTS = [
  { x: "18%", y: "38%", label: "LED headlamp" },
  { x: "44%", y: "24%", label: "45 L under-seat" },
  { x: "49%", y: "45%", label: "Swappable battery" },
];

export function UspSection({ visual = "closeups" }: { visual?: UspVisual }) {
  const reducedMotion = usePrefersReducedMotion();

  /* Written straight onto the node: four cards re-rendering on every mousemove is not a
     trade worth making for a highlight. */
  function trackPointer(event: React.PointerEvent<HTMLElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const card = event.currentTarget;
    const box = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - box.left}px`);
    card.style.setProperty("--my", `${event.clientY - box.top}px`);
  }

  function lightUp(event: React.PointerEvent<HTMLElement>) {
    // Mouse only: on a phone a tap would just flash the highlight.
    if (reducedMotion || event.pointerType !== "mouse") return;
    event.currentTarget.style.setProperty("--card-lit", "1");
  }

  function lightDown(event: React.PointerEvent<HTMLElement>) {
    const card = event.currentTarget;
    card.style.setProperty("--card-lit", "0");
    card.style.removeProperty("--mx");
    card.style.removeProperty("--my");
  }

  const cardProps = {
    onPointerMove: trackPointer,
    onPointerEnter: lightUp,
    onPointerLeave: lightDown,
  };

  return (
    /* A mist band rather than another white section: hero, this and the audience block are
       all light now, and the tone shift is what keeps this one from merging into them. */
    <section className="relative w-full overflow-x-clip bg-mist py-12 lg:py-14">

      {/* Tonal backdrop: the word is a shade of the ground, not a colour on top of it. */}
      {/* <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[10%] flex select-none justify-center lg:justify-start lg:pl-12"
      >
        <span className="whitespace-nowrap font-display text-[22vw] font-extrabold leading-[0.8] tracking-[-0.06em] text-carbon/[0.05] lg:text-[17vw]">
          OWN IT
        </span>
      </div> */}

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">

        <header className="mb-8 max-w-2xl">
          {/* <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-carbon/65">
            Why Move On
          </span> */}

          <RevealHeading
            className="text-carbon"
            lines={["Own it.", "Skip everything else."]}
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.25 }}
            className="mt-5 max-w-[560px] text-[15px] leading-relaxed text-carbon/65 lg:text-base"
          >
            No paperwork, no licence, no annual tax — and none of the compromises that
            usually come with skipping them.
          </motion.p>
        </header>

        {visual === "tile" ? (
          /* Re-tiled so a photo sits alongside all four claims and the grid still has no
             holes: photo(2) + 01 + 02 across the top, 03(2) + 04(2) beneath. */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <PhotoTile />
            {USPS.map((usp, i) => (
              <Reveal key={usp.title} index={i + 1} span={i >= 2 ? "sm:col-span-2 lg:col-span-2" : ""}>
                <article {...cardProps} className="spec-card h-full p-5 lg:p-6">
                  <div className="spec-content flex h-full flex-col">
                    <Label index={i} usp={usp} />
                    <div className="mt-5">
                      <h3 className="spec-title mb-2.5">
                        <Title title={usp.title} />
                      </h3>
                      <p className="spec-body">{usp.description}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          /* Phones: the cards stack on top of each other as you scroll (StackCards). */
          <StackCards className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto] lg:gap-5">
            {USPS.map((usp, i) => {
              const isFeature = i === 0;

              return (
                <StackCard key={usp.title} index={i} className={usp.span}>
                <Reveal index={i} span="h-full">
                  <article
                    {...cardProps}
                    className={`spec-card @container h-full ${isFeature ? "p-7 lg:p-8" : "p-5 lg:p-6"}`}
                  >
                    {visual === "closeups" && (
                      <>
                        <CloseUp src={usp.closeup} feature={isFeature} bandFocus={usp.bandFocus} />
                        <Lens src={usp.closeup} lens={usp.lens} />
                      </>
                    )}

                    {/* On a wide card the right side belongs to the close-up, so the copy stops
                        short of it. A narrow card puts the close-up on top instead (CloseUp),
                        and the copy gets the full width. */}
                    <div
                      className={`spec-content flex flex-col sm:h-full ${
                        visual === "closeups" ? "sm:@[256px]:pr-[34%]" : ""
                      }`}
                    >
                      <Label index={i} usp={usp} />

                      {isFeature && visual === "annotated" && <AnnotatedScooter />}

                      <div className={isFeature ? "mt-auto pt-4 sm:pt-8" : "mt-5"}>
                        <h3
                          className={
                            isFeature
                              ? "mb-4 font-display text-[28px] font-bold sm:text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.04em] text-carbon"
                              : "spec-title mb-2.5"
                          }
                        >
                          <Title title={usp.title} />
                        </h3>

                        <p
                          className={
                            isFeature
                              ? "max-w-[42ch] text-[15px] leading-[1.6] text-carbon/70"
                              : "spec-body"
                          }
                        >
                          {usp.description}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
                </StackCard>
              );
            })}
          </StackCards>
        )}
      </div>
    </section>
  );
}

/* The reveal and the hover live on separate elements on purpose: framer-motion leaves an
   inline `transform` behind, which would beat the CSS hover lift. */
function Reveal({ index, span, children }: { index: number; span: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: index * 0.08 }}
      className={span}
    >
      {children}
    </motion.div>
  );
}

function Label({ index, usp }: { index: number; usp: Usp }) {
  return (
    <p className="spec-label">
      {String(index + 1).padStart(2, "0")}
      <span className="mx-2 text-carbon/25">/</span>
      {usp.label}
    </p>
  );
}

function Title({ title }: { title: string }) {
  return (
    <>
      {title.split("|").map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </>
  );
}

/**
 * Variant `closeups` — a crop of the real scooter against the card's right edge, bleeding
 * past it; the card's own overflow-hidden clips the bleed. The tall front-end crop is pinned
 * to the top so the mirrors stay in frame when the slot is shorter than the image.
 *
 * From sm up only. On phones the crop was stretched into a wide band and read as a blurry
 * zoom, so phones get it small and sharp in a Lens instead.
 *
 * It follows the card's own width (the card is a container): from 256px of inner width (the small cards on 1440-and-up screens are 263px) it sits against
 * the right edge as above. Narrower than that (the small cards on 1366-and-below laptops),
 * a side slot became a tall sliver and squeezed the copy into ~110-160px, so it becomes a
 * rounded band across the top and the copy takes the full width.
 */
function CloseUp({ src, feature, bandFocus }: { src: string; feature: boolean; bandFocus?: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative hidden select-none overflow-hidden sm:mb-5 sm:block sm:h-[clamp(110px,42cqw,150px)] sm:w-full sm:rounded-2xl sm:@[256px]:absolute sm:@[256px]:inset-y-0 sm:@[256px]:-right-[8%] sm:@[256px]:mb-0 sm:@[256px]:h-auto sm:@[256px]:w-[40%] sm:@[256px]:rounded-none"
    >
      <Image
        src={src}
        alt=""
        fill
        /* object-cover fills these slots by height, so the image is wider than the slot:
           size for the covered width, not the slot's, or it gets served small and upscaled. */
        sizes={feature ? "(min-width: 1024px) 560px, 90vw" : "(min-width: 1024px) 300px, 90vw"}
        className={`object-cover ${bandFocus ? `${bandFocus} sm:@[256px]:object-center` : "object-center"} ${feature ? "sm:object-top" : ""}`}
      />
    </div>
  );
}

/**
 * Variant `annotated` — the side profile with markers, reusing the dot-and-tooltip idiom
 * from the hero's ScooterStage. Pure CSS hover: nothing here needs state.
 */
function AnnotatedScooter() {
  return (
    <div aria-hidden className="relative mt-6 aspect-[680/370] w-full">
      <Image src="/Hero/bike_2.png" alt="" fill sizes="45vw" className="object-contain" />

      {HOTSPOTS.map((spot) => (
        <span
          key={spot.label}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: spot.x, top: spot.y }}
        >
          <span className="block h-3 w-3 rounded-full bg-volt ring-4 ring-volt/25" />
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-carbon px-3 py-1.5 font-display text-[11px] font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {spot.label}
          </span>
        </span>
      ))}
    </div>
  );
}

/** Variant `tile` — matches the rounded image tiles the audience section already uses. */
function PhotoTile() {
  return (
    <div className="relative min-h-[220px] overflow-hidden rounded-[24px] bg-soft-grey sm:col-span-2 lg:col-span-2">
      <Image
        src="/Hero/bike_2.png"
        alt="MOVE ON electric scooter, side profile"
        fill
        sizes="(min-width: 1024px) 45vw, 90vw"
        className="object-contain p-6"
      />
    </div>
  );
}

/**
 * Phones only (below sm): the close-up at about its real size, in a round lens, with the
 * card's claim beside it — a detail callout rather than a stretched banner.
 */
function Lens({ src, lens }: { src: string; lens: Usp["lens"] }) {
  return (
    <div aria-hidden className="pointer-events-none mb-5 flex select-none items-center gap-4 sm:hidden">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-soft-grey ring-1 ring-carbon/10">
        <Image src={src} alt="" fill sizes="96px" className="object-cover" />
        <span className="absolute inset-1.5 rounded-full ring-1 ring-volt" />
      </div>
      <div>
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-carbon/45">
          {lens.kicker}
        </p>
        <p className="mt-1 font-display text-xl font-bold leading-tight tracking-[-0.02em] text-carbon">
          {lens.value}
        </p>
      </div>
    </div>
  );
}
