"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EASE_PREMIUM, usePrefersReducedMotion } from "@/lib/motion";

/** Which visual treatment the section carries. Three are live so they can be compared. */
export type UspVisual = "parts" | "annotated" | "tile";

interface Usp {
  /** The small uppercase category that sits where an icon used to. */
  label: string;
  /** "|" marks a deliberate line break in the headline. */
  title: string;
  description: string;
  /** Footprint in the desktop 4x2 grid. The first claim gets the tall box. */
  span: string;
  /**
   * Line drawing used as a watermark in the `parts` variant.
   *
   * Only four of the loader's parts read as anything on their own — cowl, front wheel, seat
   * and headlamps. The others (body, bars, fork…) are stroke fragments that only resolve
   * once the assembly layers them, so they are unusable here. That means the pairing is
   * only loosely semantic: seat genuinely is the under-seat storage and headlamps stand in
   * for the safety kit, but the other two are product texture rather than illustration.
   */
  art: string;
}

const USPS: Usp[] = [
  {
    label: "Registration",
    title: "No RTO.|No Road Tax.",
    description:
      "Ride from day one — skip RTO registration, annual road tax and mandatory insurance entirely. Anyone 16 and up can legally ride, licence-free.",
    span: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
    /* full.webp is the finished photo, not line art — the cowl is the most product-like
       of the drawn parts, so the big card gets that. */
    art: "/intro/cowl.webp",
  },
  {
    label: "Battery",
    title: "A Battery Built to Outlast",
    description:
      "Fire-resistant LiFePO4 chemistry, engineered to stay stable through harsh Indian heat and rated for 2,500+ charge cycles of daily riding.",
    span: "",
    art: "/intro/frontWheel.webp",
  },
  {
    label: "Storage",
    title: "Space for the Whole Ride",
    description:
      "Heavy-duty carrying capacity with up to 45 litres of under-seat storage on select models — room enough for your daily groceries and essentials.",
    span: "",
    art: "/intro/seat.webp",
  },
  {
    label: "Security",
    title: "Smart, Secure, Safe",
    description:
      "Reverse assist for tight parking, keyless ignition, an anti-theft alarm and a one-touch Repair Switch — safety tech rare at this price.",
    span: "sm:col-span-2 lg:col-span-2",
    art: "/intro/headlamps.webp",
  },
];

/** Where the markers sit on the side profile, for the `annotated` variant. */
const HOTSPOTS = [
  { x: "18%", y: "38%", label: "LED headlamp" },
  { x: "44%", y: "24%", label: "45 L under-seat" },
  { x: "49%", y: "45%", label: "Swappable battery" },
];

export function UspSection({ visual = "parts" }: { visual?: UspVisual }) {
  const reducedMotion = usePrefersReducedMotion();

  /* Written straight onto the node: four cards re-rendering on every mousemove is not a
     trade worth making for a highlight. */
  function trackPointer(event: React.PointerEvent<HTMLElement>) {
    if (reducedMotion) return;
    const card = event.currentTarget;
    const box = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - box.left}px`);
    card.style.setProperty("--my", `${event.clientY - box.top}px`);
  }

  function lightUp(event: React.PointerEvent<HTMLElement>) {
    if (reducedMotion) return;
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
    <section className="relative w-full overflow-hidden bg-mist py-12 lg:py-14">

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

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          className="mb-8 max-w-2xl"
        >
          <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-carbon/65">
            Why Move On
          </span>

          <h2 className="font-display text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-carbon">
            Own it. <br />
            Skip everything else.
          </h2>

          <p className="mt-5 max-w-[560px] text-base leading-relaxed text-carbon/65">
            No paperwork, no licence, no annual tax — and none of the compromises that
            usually come with skipping them.
          </p>
        </motion.header>

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto] lg:gap-5">
            {USPS.map((usp, i) => {
              const isFeature = i === 0;

              return (
                <Reveal key={usp.title} index={i} span={usp.span}>
                  <article
                    {...cardProps}
                    className={`spec-card h-full ${isFeature ? "p-7 lg:p-8" : "p-5 lg:p-6"}`}
                  >
                    {visual === "parts" && <PartArt src={usp.art} feature={isFeature} />}

                    <div className="spec-content flex h-full flex-col">
                      <Label index={i} usp={usp} />

                      {isFeature && visual === "annotated" && <AnnotatedScooter />}

                      <div className={isFeature ? "mt-auto pt-8" : "mt-5"}>
                        <h3
                          className={
                            isFeature
                              ? "mb-4 font-display text-[clamp(2rem,3.2vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.04em] text-carbon"
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
              );
            })}
          </div>
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
 * Variant `parts` — the loader's line drawings, which otherwise only exist for the three
 * seconds the intro runs. They are volt strokes on transparent, so on white they need
 * darkening rather than more opacity: opacity alone would leave them fighting the copy.
 */
function PartArt({ src, feature }: { src: string; feature: boolean }) {
  return (
    <div
      aria-hidden
      /* Kept clear of the copy: the tall card sets its text at the bottom so the art takes
         the top, and the small cards are text all the way down, so theirs bleeds off the
         bottom-right corner where only a fragment shows. */
      className={`pointer-events-none absolute select-none ${
        feature ? "right-[2%] top-[4%] w-[54%]" : "-bottom-[16%] -right-[10%] w-[46%]"
      }`}
      style={{
        filter: "brightness(0.38) saturate(2.4)",
        opacity: feature ? 0.45 : 0.3,
      }}
    >
      <Image src={src} alt="" width={600} height={600} className="h-auto w-full object-contain" />
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
