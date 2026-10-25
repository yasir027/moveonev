"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { EASE_PREMIUM, useIsCompact, usePrefersReducedMotion } from "@/lib/motion";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { StackCard, StackCards } from "@/components/ui/StackCards";

/*
 * The frosted card material comes from .glass-frost in globals.css. The drop shadow is the
 * one thing added on top: .glass-frost deliberately casts no glow, which reads well over the
 * dark USP block but lets a card dissolve into white here.
 *
 * Reveal these with opacity only: a transform on the card or any ancestor (framer leaves an
 * inline one behind after a slide) makes it a backdrop root and the frost stops blurring.
 */
const GLASS_CARD =
  "glass-frost rounded-[clamp(16px,1.75cqw,24px)] p-[clamp(14px,1.75cqw,24px)] shadow-[0_24px_60px_-24px_rgba(16,20,18,0.22)] transition-shadow duration-300 hover:shadow-[0_32px_80px_-24px_rgba(16,20,18,0.3)]";

interface Audience {
  /** The numeral in the volt pill. */
  label: string;
  title: string;
  description: string;
  /**
   * Photography in /public/audience. These are temporary stock shots — overwrite the
   * files in place to swap them; nothing here needs to change. Keep the type nullable:
   * next/image throws on a missing local src, so a frame with no art must say so and
   * fall through to the designed ground rather than break the page.
   */
  image: string | null;
  alt: string;
  /** object-position for the crop. Portraits want the subject above centre. */
  focal: string;
  /** Floating glass chip on the frame — the claim this rider cares about most. */
  chip: string;
  /** Shape hint, shown on the fallback ground only. */
  placeholder: string;
}

const audiences = {
  students: {
    label: "01",
    title: "Students",
    description:
      "Affordable, hassle-free commuting between campus, home and everywhere between — no licence, no queue at the RTO.",
    image: "/audience/students.png",
    alt: "A student riding a MOVE ON scooter to campus",
    focal: "50% 40%",
    chip: "No licence",
    placeholder: "TALL PORTRAIT",
  },
  newbies: {
    label: "02",
    title: "Newbies",
    description:
      "First scooter, first EV, first anything — intuitive controls and a reverse Switch that talks you through it, not at you.",
    image: "/audience/newbies.png",
    alt: "A first-time rider getting comfortable on a MOVE ON scooter",
    focal: "50% 42%",
    chip: "reverse Switch",
    placeholder: "LANDSCAPE",
  },
   seniors: {
    label: "03",
    title: "Seniors",
    description:
      "Light enough to manoeuvre, simple enough to trust — an easy, dignified way to stay independent with no licence renewal to chase.",
    image: "/audience/seniors.png",
    alt: "An older rider setting off on a MOVE ON scooter",
    focal: "0% 50%",
    chip: "Step-through",
    placeholder: "SQUARE",
  },
} satisfies Record<string, Audience>;
/**
 * What a frame needs to paint itself. The three audiences satisfy it; so does the detail
 * tile, which is not an audience — it has no card, no copy and no chip.
 */
type FrameArt = Pick<Audience, "image" | "alt" | "focal" | "label" | "placeholder"> & {
  chip?: string;
};

/*
 * The fourth piece. Not a fourth audience: it closes the hole the three frames leave at
 * bottom-centre, and the seniors card covers 47% of it, so it carries a detail crop that
 * reads as texture rather than a subject anyone has to see whole.
 */
const DETAIL = {
  image: "/audience/details.png",
  alt: "Close-up of an electric scooter's handlebar",
  focal: "20% 0%",
  label: "04",
  placeholder: "DETAIL",
} satisfies FrameArt;

/*
 * Desktop pacing. The collage pins and assembles itself: it arrives holding students alone,
 * and each further scroll adds the next piece while the section stays put.
 *
 * These are the points in the pinned travel where each step takes over, 0 being the moment
 * the track pins and 1 the moment it releases. The tail past the last one is the hold on the
 * finished collage before the page moves on — without it the third piece would land and be
 * scrolled away in the same gesture.
 *
 * Students keeps an opening beat of its own, the two middle pieces get the longest
 * segments — the seniors card lands over the newbies frame, so at even spacing those two
 * would read as one event rather than two — and the detail tile closes on the shortest,
 * because it is an accent rather than a reveal.
 *
 * The phone stack doesn't use this: its cards stack on top of each other as you scroll
 * (StackCards) instead.
 */
const STEP_AT = [0, 0.24, 0.52, 0.8] as const;

/** Inside one step the frame lands first and its card follows. */
const CARD_FOLLOW = 0.15;

export function AudienceSection() {
  const reducedMotion = usePrefersReducedMotion();
  // Below lg the pinned collage is hidden and phones get the plain stack, so don't listen.
  const compact = useIsCompact();
  const trackRef = useRef<HTMLDivElement>(null);
  /* -1 until the collage is actually arriving, so students has an entrance of its own
     rather than already sitting there when the section pins. */
  const [step, setStep] = useState(-1);

  /*
   * A plain scroll listener rather than framer-motion's useScroll: ScrollCurtain records
   * that useScroll did not track a target on this page at all, and one getBoundingClientRect
   * per scroll on a single element is cheap. Reading the position on every scroll — rather
   * than latching on an IntersectionObserver — is also what lets the sequence run backwards
   * when someone scrolls back up.
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion || compact) return;

    function update() {
      const box = track!.getBoundingClientRect();
      /* 0 when the track pins, 1 when it releases. */
      const travel = box.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -box.top / travel)) : 1;
      /* Progress is clamped at 0 for the whole approach, so it can't tell "about to pin"
         from "still far below" — this can, and it's what gives students its entrance. */
      const arriving = box.top < window.innerHeight * 0.75;

      /* Walked from the end rather than written as a ternary chain, so STEP_AT stays the
         one place a beat is added or retimed. */
      let next = 0;
      for (let i = STEP_AT.length - 1; i > 0; i--) {
        if (progress >= STEP_AT[i]) {
          next = i;
          break;
        }
      }

      /* setStep with an unchanged value is a no-op, so this re-renders once per beat across
         the whole sequence rather than once per scroll event. */
      setStep(arriving ? next : -1);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reducedMotion, compact]);

  /* No pin and no sequence when motion is reduced — that would be 200svh of scrolling in
     which nothing happens — so the collage simply stands there complete. */
  const shown = (n: number) => reducedMotion || step >= n;

  return (
    /* overflow-x-clip, not overflow-hidden: `hidden` makes this section a scroll container,
       and the sticky collage inside it would quietly stop sticking. Same distinction the
       body carries in globals.css. */
    <section className="relative w-full overflow-x-clip bg-white py-12 sm:py-16 lg:py-24">

      {/*
        STRICT BOXED CONTAINER
        mx-auto and max-w guarantee it will never be full-width on large screens
      */}
<div className="relative mx-auto w-full max-w-[1440px] px-[7%]">
        {/* Tonal backdrop, the light-section counterpart to the dark block's "OWN IT".
            It sits in the void beside the heading rather than behind the collage — the
            collage leaves no gaps wide enough to read a word through, and carbon on white
            reads far stronger than white on carbon, so the alpha runs lower too. */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-6 top-45 hidden select-none lg:right-6 lg:block"
        >
          {/* Not "EVERY RIDER": the eyebrow and the headline already say it twice, and a
              watermark repeating them a third time reads as an echo rather than a ground. */}
          <span className="whitespace-nowrap font-display text-[10vw] font-extrabold leading-[0.8] tracking-[-0.06em] text-carbon/[0.045]">
            EVERYONE
          </span>
        </div>


        {/* Universal section heading */}
<header className="mb-10 max-w-2xl lg:mx-auto lg:mb-12 lg:max-w-none lg:w-[min(100%,1376px,calc((100svh-12rem)*2.219))]">          {/* <span className="mb-4 block h-px w-10 bg-volt" />

          <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-carbon/40">
            For Every Rider
          </span> */}
          <RevealHeading
            className="text-carbon"
            lines={["Built for every", "kind of rider."]}
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.55, ease: EASE_PREMIUM, delay: 0.25 }}
            className="mt-6 max-w-[480px] text-[15px] leading-relaxed text-carbon/60 lg:text-base"
          >
            Whether you&apos;re starting out, heading to class, or simply
            looking for an easier way around town — there&apos;s a MOVE ON
            for you.
          </motion.p>
        </header>

        {/* =====================================================
            MOBILE / TABLET
            Simple editorial vertical stack
        ===================================================== */}
        <StackCards className="flex flex-col gap-6 lg:hidden">
          {[audiences.students, audiences.newbies, audiences.seniors].map((audience, i) => (
            <StackCard key={audience.label} index={i} radius="rounded-[28px]">
              <AudienceMobile audience={audience} delay={i * 0.08} />
            </StackCard>
          ))}
        </StackCards>

        {/* =====================================================
            DESKTOP
            Strict macro-rectangle with calculated gaps, pinned inside a tall track
            while its three pieces assemble.
        ===================================================== */}
        <div
          ref={trackRef}
          className={`relative hidden lg:block ${reducedMotion ? "" : "lg:h-[300svh]"}`}
        >
          <div className={reducedMotion ? "" : "sticky top-0 flex h-svh items-center"}>
            {/*
              One fixed design, scaled as a whole: the collage keeps the proportions it has at
              its full size (1376 x 620, a 1920-wide screen) and shrinks to fit both the
              column's width and the window's height, minus room for the navbar and the
              floating pill. Inside, frames are percentages and the cards are sized and placed
              in cqw (1% of the collage's width), so every piece keeps its place at any size.
              Fixed pixel cards were what squeezed it on smaller laptops.
            */}
            <div className="relative mx-auto aspect-[1376/620] w-[min(100%,1376px,calc((100svh-12rem)*2.219))] [container-type:inline-size]">

              {/* -------------------------------------------------
                  STUDENTS — LEFT ANCHOR
                  Width: 42%, Height: 100%
              ------------------------------------------------- */}
              <div className="absolute bottom-0 left-0 top-0 w-[42%]">
                {/* Image Mask */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: shown(0) ? 1 : 0, x: shown(0) ? 0 : -20 }}
                  transition={{ duration: 0.6, ease: EASE_PREMIUM }}
                  className="absolute inset-0"
                >
                  <AudienceFrame
                    audience={audiences.students}
                    /* Deliberately wider than the 42% frame. `sizes` picks the source by
                       WIDTH, but object-cover on a landscape photo in a taller frame crops
                       to HEIGHT — so the browser must be told to fetch the width the full
                       height implies (620 x 1.5), or it serves a 1.9x upscale. */
                    sizes="(min-width: 1024px) 65vw, 600px"
                  />
                </motion.div>

                {/* Glass Overlay (Pushes into the right gap) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: shown(0) ? 1 : 0 }}
                  /* The follow delay is for arriving only — leaving should not lag. */
                  transition={{
                    duration: 0.7,
                    ease: EASE_PREMIUM,
                    delay: shown(0) ? CARD_FOLLOW : 0,
                  }}
                  className={`
                    ${GLASS_CARD}
                    absolute bottom-[3.5cqw] right-[-3.63cqw] z-20 w-[24.7cqw]
                  `}
                >
                  <AudienceContent audience={audiences.students} />
                </motion.div>
              </div>

              {/* -------------------------------------------------
                  RIGHT LANDSCAPE
                  Width: 54%, Height: 48% (Leaves 4% vertical gap)
              ------------------------------------------------- */}
              <div className="absolute right-0 top-0 h-[48%] w-[54%]">
                {/* Image Mask */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: shown(1) ? 1 : 0, x: shown(1) ? 0 : 20 }}
                  transition={{ duration: 0.6, ease: EASE_PREMIUM }}
                  className="absolute inset-0"
                >
                  <AudienceFrame
                    audience={audiences.newbies}
                    sizes="(min-width: 1024px) 54vw, 90vw"
                  />
                </motion.div>

                {/* Glass Overlay (Pushes into the left gap) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: shown(1) ? 1 : 0 }}
                  /* The follow delay is for arriving only — leaving should not lag. */
                  transition={{
                    duration: 0.7,
                    ease: EASE_PREMIUM,
                    delay: shown(1) ? CARD_FOLLOW : 0,
                  }}
                  className={`
                    ${GLASS_CARD}
                    absolute bottom-[2.33cqw] left-[-4.36cqw] z-20 w-[24.7cqw]
                  `}
                >
                  <AudienceContent audience={audiences.newbies} />
                </motion.div>
              </div>

              {/* -------------------------------------------------
                  RIGHT SQUARE
                  Width: 36%, Height: 48%
              ------------------------------------------------- */}
              <div className="absolute bottom-0 right-0 h-[48%] w-[36%]">
                {/* Image Mask */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: shown(2) ? 1 : 0, x: shown(2) ? 0 : 20 }}
                  transition={{ duration: 0.6, ease: EASE_PREMIUM }}
                  className="absolute inset-0"
                >
                  <AudienceFrame
                    audience={audiences.seniors}
                    /* 90vw would under-serve the taller mobile frame — see students. */
                    sizes="(min-width: 1024px) 36vw, 600px"
                    /* Bottom-right here: the raised card now covers this frame's top-left. */
                    chipPos="bottom-5 right-5"
                  />
                </motion.div>

                {/* Glass Overlay (Pushes deep into the empty center, and up across the gap)
                    Raised so it sits mostly over this frame while biting ~16px into the
                    landscape frame above. That 16px is also all the clearance there is to the
                    Newbies card — raise it further and the two cards touch. */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: shown(2) ? 1 : 0 }}
                  /* The follow delay is for arriving only — leaving should not lag. */
                  transition={{
                    duration: 0.7,
                    ease: EASE_PREMIUM,
                    delay: shown(2) ? CARD_FOLLOW : 0,
                  }}
                  className={`
                    ${GLASS_CARD}
                    absolute left-[-13.08cqw] top-[-3.2cqw] z-20 w-[24.7cqw]
                  `}
                >
                  <AudienceContent audience={audiences.seniors} />
                </motion.div>
              </div>

              {/* -------------------------------------------------
                  DETAIL TILE — CLOSES THE COLLAGE
                  Width: 14%, Height: 48%, top-flush with the square.
                  Fills the hole the other three leave at bottom-centre, keeping the same
                  50px horizontal gutters. No z-index: both glass cards sit at z-20 and are
                  meant to cover it, which is why the art is a crop and not a subject.
              ------------------------------------------------- */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: shown(3) ? 1 : 0, x: shown(3) ? 0 : 20 }}
                transition={{ duration: 0.6, ease: EASE_PREMIUM }}
                className="absolute bottom-0 left-[46%] h-[48%] w-[14%]"
              >
                <AudienceFrame
                  audience={DETAIL}
                  /* ~32vw, not the tile's 14% — same height-bound crop as students. */
                  sizes="(min-width: 1024px) 32vw, 90vw"
                />
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   REUSABLE CONTENT
========================================================= */

function AudienceContent({ audience, compact = false }: { audience: Audience; compact?: boolean }) {
  return (
    <>
      <h3
        className={`font-display font-bold leading-[1.15] tracking-tight text-carbon ${
          compact ? "mb-1.5 text-[19px]" : "mb-[clamp(6px,0.87cqw,12px)] text-[clamp(16px,1.53cqw,21px)]"
        }`}
      >
        {audience.title}
      </h3>

      <p
        className={`${
          compact ? "text-[13.5px] leading-[1.6]" : "text-[clamp(11.5px,1.02cqw,14px)] leading-[1.6]"
        } text-carbon/70`}
      >
        {audience.description}
      </p>
    </>
  );
}

/* =========================================================
   IMAGE FRAME
   A photograph once one exists, a designed ground until then.
========================================================= */

function AudienceFrame({
  audience,
  sizes,
  chipPos = "left-5 top-5",
}: {
  audience: FrameArt;
  sizes: string;
  /**
   * Where the chip sits on the frame. Layout rather than content, so it is a prop like
   * `sizes` and not a field on `audiences` — the mobile stack shares this component and
   * pulls its card up over the frame's bottom edge, which would swallow a bottom-anchored
   * chip. Mobile therefore keeps the default.
   */
  chipPos?: string;
}) {
  return (
    <div className="group relative h-full w-full overflow-hidden rounded-[28px] bg-soft-grey">
      {audience.image ? (
        <Image
          src={audience.image}
          alt={audience.alt}
          fill
          sizes={sizes}
          style={{ objectPosition: audience.focal }}
          className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.04]"
        />
      ) : (
        <div className="audience-ground absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="font-display text-[clamp(4rem,8vw,7rem)] font-extrabold leading-none tracking-[-0.05em] text-carbon/[0.07]">
            {audience.label}
          </span>
          <span className="font-display text-[10px] font-semibold tracking-[0.25em] text-carbon/25">
            {audience.placeholder}
          </span>
        </div>
      )}

      {/* Scrim: gives the frosted card's edge something tonal to sit against, so it never
          lands on a pale patch with nothing to blur. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/25 via-transparent to-transparent"
      />

      {/* The liquid material earns its keep here: a small chip over high-contrast imagery
          has something to refract, the same reason the lens lives in the dark block.
          The detail tile has no claim to make, so it gets no chip. */}
      {audience.chip ? (
<span
  className={`absolute ${chipPos} rounded-full border border-white/60 bg-white/70 px-3 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-carbon shadow-[0_4px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-md backdrop-saturate-150`}
>          {audience.chip}
        </span>
      ) : null}
    </div>
  );
}

/* =========================================================
   MOBILE CARD
========================================================= */

function AudienceMobile({
  audience,
  delay,
}: {
  audience: Audience;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.55, ease: EASE_PREMIUM, delay }}
      className="relative h-[440px] sm:h-[520px]"
    >
      <AudienceFrame audience={audience} sizes="90vw" />

      {/* The card sits inside the photo along its bottom edge, so each rider is one object
          rather than a photo with a card hanging off it. Near-solid white, not frost: on a
          phone these stack (StackCards), and the shrink on the card underneath would take
          a backdrop blur away. */}
      <div className="absolute inset-x-3 bottom-3 z-10 rounded-[20px] bg-white/95 p-5 shadow-[0_18px_40px_-18px_rgba(16,20,18,0.35)]">
        <AudienceContent audience={audience} compact />
      </div>
    </motion.div>
  );
}
