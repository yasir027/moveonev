"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EASE_PREMIUM } from "@/lib/motion";

/*
 * The frosted card material comes from .glass-frost in globals.css. The drop shadow is the
 * one thing added on top: .glass-frost deliberately casts no glow, which reads well over the
 * dark USP block but lets a card dissolve into white here.
 */
const GLASS_CARD =
  "glass-frost rounded-[24px] p-6 shadow-[0_24px_60px_-24px_rgba(16,20,18,0.22)] transition-shadow duration-300 hover:shadow-[0_32px_80px_-24px_rgba(16,20,18,0.3)]";

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
    image: "/audience/students.jpg",
    alt: "A student riding a MOVE ON scooter to campus",
    focal: "50% 40%",
    chip: "No licence",
    placeholder: "TALL PORTRAIT",
  },
  newbies: {
    label: "02",
    title: "Newbies",
    description:
      "First scooter, first EV, first anything — intuitive controls and a Repair Switch that talks you through it, not at you.",
    image: "/audience/newbies.jpg",
    alt: "A first-time rider getting comfortable on a MOVE ON scooter",
    focal: "50% 42%",
    chip: "Repair Switch",
    placeholder: "LANDSCAPE",
  },
  seniors: {
    label: "03",
    title: "Seniors",
    description:
      "Light enough to manoeuvre, simple enough to trust — an easy, dignified way to stay independent with no licence renewal to chase.",
    image: "/audience/seniors.jpg",
    alt: "An older rider setting off on a MOVE ON scooter",
    focal: "50% 50%",
    chip: "Step-through",
    placeholder: "SQUARE",
  },
} satisfies Record<string, Audience>;

/*
 * The glass cards fade in and never translate.
 *
 * An ancestor carrying `opacity < 1` or a transform becomes a backdrop root, and everything
 * inside it loses the page behind it — the same trap ScrollCurtain documents for the hero's
 * .glass-liquid chips. framer-motion leaves an inline `transform: translateX(0px)` behind
 * once a reveal settles, so animating x or y here would break the frost permanently rather
 * than just during the reveal. Opacity settles at exactly 1, which is not a backdrop root.
 *
 * The frames beside them hold no backdrop-filter, so those keep the directional reveal.
 */
const CARD_REVEAL = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-10%" },
} as const;

export function AudienceSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-16 lg:py-24">

      {/*
        STRICT BOXED CONTAINER
        mx-auto and max-w guarantee it will never be full-width on large screens
      */}
      <div className="relative mx-auto w-full max-w-[1300px] px-5 sm:px-6 lg:px-8">

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
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{
            duration: 0.55,
            ease: EASE_PREMIUM,
          }}
          className="mb-10 max-w-2xl lg:mb-12"
        >
          <span className="mb-4 block h-px w-10 bg-volt" />

          <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-carbon/40">
            For Every Rider
          </span>
          <h2 className="font-display text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-carbon">
            Built for every
            <br />
            kind of rider.
          </h2>

          <p className="mt-6 max-w-[480px] text-base leading-relaxed text-carbon/60">
            Whether you&apos;re starting out, heading to class, or simply
            looking for an easier way around town — there&apos;s a MOVE ON
            for you.
          </p>
        </motion.header>

        {/* =====================================================
            MOBILE / TABLET
            Simple editorial vertical stack
        ===================================================== */}
        <div className="flex flex-col gap-8 lg:hidden">
          <AudienceMobile audience={audiences.students} delay={0} />
          <AudienceMobile audience={audiences.newbies} delay={0.08} />
          <AudienceMobile audience={audiences.seniors} delay={0.16} />
        </div>

        {/* =====================================================
            DESKTOP
            Strict macro-rectangle with calculated gaps
        ===================================================== */}
        <div className="relative hidden h-[620px] w-full lg:block">

          {/* -------------------------------------------------
              STUDENTS — LEFT ANCHOR
              Width: 42%, Height: 100%
          ------------------------------------------------- */}
          <div className="absolute bottom-0 left-0 top-0 w-[42%]">
            {/* Image Mask */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.6,
                ease: EASE_PREMIUM,
              }}
              className="absolute inset-0"
            >
              <AudienceFrame
                audience={audiences.students}
                sizes="(min-width: 1024px) 42vw, 90vw"
              />
            </motion.div>

            {/* Glass Overlay (Pushes into the right gap) */}
            <motion.div
              {...CARD_REVEAL}
              transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.15 }}
              className={`
                ${GLASS_CARD}
                absolute bottom-12 right-[-50px] z-20 w-[340px]
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
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.6,
                ease: EASE_PREMIUM,
                delay: 0.08,
              }}
              className="absolute inset-0"
            >
              <AudienceFrame
                audience={audiences.newbies}
                sizes="(min-width: 1024px) 54vw, 90vw"
              />
            </motion.div>

            {/* Glass Overlay (Pushes into the left gap) */}
            <motion.div
              {...CARD_REVEAL}
              transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.23 }}
              className={`
                ${GLASS_CARD}
                absolute bottom-8 left-[-60px] z-20 w-[340px]
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
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.6,
                ease: EASE_PREMIUM,
                delay: 0.16,
              }}
              className="absolute inset-0"
            >
              <AudienceFrame
                audience={audiences.seniors}
                sizes="(min-width: 1024px) 36vw, 90vw"
                /* Bottom-right here: the raised card now covers this frame's top-left. */
                chipPos="bottom-5 right-5"
              />
            </motion.div>

            {/* Glass Overlay (Pushes deep into the empty center, and up across the gap)
                Raised so it sits mostly over this frame while biting ~16px into the
                landscape frame above. That 16px is also all the clearance there is to the
                Newbies card — raise it further and the two cards touch. */}
            <motion.div
              {...CARD_REVEAL}
              transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.31 }}
              className={`
                ${GLASS_CARD}
                absolute left-[-180px] top-[-44px] z-20 w-[340px]
              `}
            >
              <AudienceContent audience={audiences.seniors} />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* =========================================================
   REUSABLE CONTENT
========================================================= */

function AudienceContent({ audience }: { audience: Audience }) {
  return (
    <>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon font-display text-[10px] font-semibold text-volt">
          {audience.label}
        </span>
        <span className="h-px w-8 bg-carbon/15" />
      </div>

      <h3 className="mb-3 font-display text-[21px] font-bold leading-[1.15] tracking-tight text-carbon">
        {audience.title}
      </h3>

      <p className="text-[14px] leading-[1.65] text-carbon/70">
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
  audience: Audience;
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
          has something to refract, the same reason the lens lives in the dark block. */}
      <span className={`glass-liquid absolute ${chipPos} rounded-full px-3 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-carbon`}>
        {audience.chip}
      </span>
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
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{
          duration: 0.55,
          ease: EASE_PREMIUM,
          delay,
        }}
        className="h-[380px] sm:h-[440px]"
      >
        <AudienceFrame audience={audience} sizes="90vw" />
      </motion.div>

      {/* Opacity only — see CARD_REVEAL. */}
      <motion.div
        {...CARD_REVEAL}
        transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: delay + 0.15 }}
        className={`relative z-10 mx-4 -mt-12 ${GLASS_CARD}`}
      >
        <AudienceContent audience={audience} />
      </motion.div>
    </div>
  );
}
