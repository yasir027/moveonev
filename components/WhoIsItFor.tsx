"use client";

import { motion } from "framer-motion";
import { EASE_PREMIUM } from "@/lib/motion";

const GLASS_CARD =
  "rounded-[24px] border border-white/70 bg-white/75 p-6 shadow-[0_24px_60px_-24px_rgba(16,20,18,0.22)] backdrop-blur-2xl backdrop-saturate-150";

const audiences = {
  students: {
    label: "01",
    title: "Students",
    description:
      "Affordable, hassle-free commuting between campus, home and everywhere between — no licence, no queue at the RTO.",
    placeholder: "TALL PORTRAIT",
  },
  newbies: {
    label: "02",
    title: "Newbies",
    description:
      "First scooter, first EV, first anything — intuitive controls and a Repair Switch that talks you through it, not at you.",
    placeholder: "LANDSCAPE",
  },
  seniors: {
    label: "03",
    title: "Seniors",
    description:
      "Light enough to manoeuvre, simple enough to trust — an easy, dignified way to stay independent with no licence renewal to chase.",
    placeholder: "SQUARE",
  },
};

export function AudienceSection() {
  return (
    <section className="w-full bg-white py-24 lg:py-32">
      {/* 
        STRICT BOXED CONTAINER 
        mx-auto and max-w guarantee it will never be full-width on large screens 
      */}
      <div className="mx-auto w-full max-w-[1300px] px-6 sm:px-8 lg:px-12">

        {/* Universal section heading */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{
            duration: 0.55,
            ease: EASE_PREMIUM,
          }}
          className="mb-16 max-w-2xl"
        >
          <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-carbon/40">
            For Every Rider
          </span>
          <h2 className="font-display text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-carbon">
            Built for every
            <br />
            kind of rider.
          </h2>

          <p className="mt-6 max-w-[420px] text-base leading-relaxed text-carbon/60">
            Whether you're starting out, heading to class, or simply
            looking for an easier way around town — there's a MOVE ON
            for you.
          </p>
        </motion.header>

        {/* =====================================================
            MOBILE / TABLET
            Simple editorial vertical stack
        ===================================================== */}
        <div className="flex flex-col gap-10 lg:hidden">
          <AudienceMobile audience={audiences.students} delay={0} />
          <AudienceMobile audience={audiences.newbies} delay={0.08} />
          <AudienceMobile audience={audiences.seniors} delay={0.16} />
        </div>

        {/* =====================================================
            DESKTOP
            Strict macro-rectangle with calculated gaps
        ===================================================== */}
        <div className="relative hidden h-[700px] w-full lg:block">

          {/* -------------------------------------------------
              STUDENTS — LEFT ANCHOR
              Width: 42%, Height: 100%
          ------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.6,
              ease: EASE_PREMIUM,
            }}
            className="absolute bottom-0 left-0 top-0 w-[42%]"
          >
            {/* Image Mask */}
            <div className="absolute inset-0 overflow-hidden rounded-[28px] bg-carbon/5">
              <Placeholder label={audiences.students.placeholder} />
            </div>

            {/* Glass Overlay (Pushes into the right gap) */}
            <div
              className={`
                ${GLASS_CARD}
                absolute bottom-12 right-[-80px] z-20 w-[340px]
              `}
            >
              <AudienceContent audience={audiences.students} />
            </div>
          </motion.div>

          {/* -------------------------------------------------
              RIGHT LANDSCAPE
              Width: 54%, Height: 48% (Leaves 4% vertical gap)
          ------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.6,
              ease: EASE_PREMIUM,
              delay: 0.08,
            }}
            className="absolute right-0 top-0 h-[48%] w-[54%]"
          >
            {/* Image Mask */}
            <div className="absolute inset-0 overflow-hidden rounded-[28px] bg-carbon/5">
              <Placeholder label={audiences.newbies.placeholder} />
            </div>

            {/* Glass Overlay (Pushes into the left gap) */}
            <div
              className={`
                ${GLASS_CARD}
                absolute bottom-8 left-[-60px] z-20 w-[340px]
              `}
            >
              <AudienceContent audience={audiences.newbies} />
            </div>
          </motion.div>

          {/* -------------------------------------------------
              RIGHT SQUARE
              Width: 36%, Height: 48%
          ------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.6,
              ease: EASE_PREMIUM,
              delay: 0.16,
            }}
            className="absolute bottom-0 right-0 h-[48%] w-[36%]"
          >
            {/* Image Mask */}
            <div className="absolute inset-0 overflow-hidden rounded-[28px] bg-carbon/5">
              <Placeholder label={audiences.seniors.placeholder} />
            </div>

            {/* Glass Overlay (Pushes deep into the empty center) */}
            <div
              className={`
                ${GLASS_CARD}
                absolute left-[-180px] top-12 z-20 w-[340px]
              `}
            >
              <AudienceContent audience={audiences.seniors} />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* =========================================================
   REUSABLE CONTENT
========================================================= */

function AudienceContent({
  audience,
}: {
  audience: {
    label: string;
    title: string;
    description: string;
  };
}) {
  return (
    <>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon font-display text-[10px] font-semibold text-[#7DFF40]">
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
   IMAGE PLACEHOLDER
========================================================= */

function Placeholder({
  label,
}: {
  label: string;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center shadow-inner">
      <div className="flex flex-col items-center gap-3">
        <div className="h-px w-8 bg-carbon/15" />
        <span className="font-display text-[10px] font-semibold tracking-[0.25em] text-carbon/25">
          {label}
        </span>
        <div className="h-px w-8 bg-carbon/15" />
      </div>
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
  audience: {
    label: string;
    title: string;
    description: string;
    placeholder: string;
  };
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.55,
        ease: EASE_PREMIUM,
        delay,
      }}
      className="relative"
    >
      <div className="h-[360px] overflow-hidden rounded-[28px] bg-carbon/5">
        <Placeholder label={audience.placeholder} />
      </div>

      <div className={`relative z-10 mx-4 -mt-12 ${GLASS_CARD}`}>
        <AudienceContent audience={audience} />
      </div>
    </motion.div>
  );
}