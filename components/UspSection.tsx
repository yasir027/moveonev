"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { GlassLens } from "@/components/ui/GlassLens";
import { EASE_PREMIUM, usePrefersReducedMotion } from "@/lib/motion";

interface Usp {
  /** The small uppercase category that sits where an icon used to. */
  label: string;
  /** "|" marks a deliberate line break in the headline. */
  title: string;
  description: string;
  /** Footprint in the desktop 4x2 grid. The first claim gets the tall box. */
  span: string;
}

const USPS: Usp[] = [
  {
    label: "Registration",
    title: "No RTO.|No Road Tax.",
    description:
      "Ride from day one — skip RTO registration, annual road tax and mandatory insurance entirely. Anyone 16 and up can legally ride, licence-free.",
    span: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  },
  {
    label: "Battery",
    title: "A Battery Built to Outlast",
    description:
      "Fire-resistant LiFePO4 chemistry, engineered to stay stable through harsh Indian heat and rated for 2,500+ charge cycles of daily riding.",
    span: "",
  },
  {
    label: "Storage",
    title: "Space for the Whole Ride",
    description:
      "Heavy-duty carrying capacity with up to 45 litres of under-seat storage on select models — room enough for your daily groceries and essentials.",
    span: "",
  },
  {
    label: "Security",
    title: "Smart, Secure, Safe",
    description:
      "Reverse assist for tight parking, keyless ignition, an anti-theft alarm and a one-touch Repair Switch — safety tech rare at this price.",
    span: "sm:col-span-2 lg:col-span-2",
  },
];

export function UspSection() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    /* The one dark block on an otherwise light page. It exists to break the tonal run of
       white sections either side of it, and it is what lets volt read as a brand colour
       rather than a highlighter. */
    <section
      ref={sectionRef}
      data-theme="dark"
      /* Rounded top + the shadow it casts upward are what make this read as a panel rising
         over the hero rather than a hard edge between two colours. */
      className="relative w-full overflow-hidden bg-carbon py-12 shadow-[0_-40px_80px_-24px_rgba(16,20,18,0.55)] lg:rounded-t-[40px] lg:py-14"
    >

      {/* Tonal backdrop: the word is a shade of the ground, not a colour on top of it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-100 top-[10%] flex select-none justify-center lg:justify-start lg:pl-12"
      >
        <span className="whitespace-nowrap font-display text-[22vw] font-extrabold leading-[0.8] tracking-[-0.06em] text-white/[0.04] lg:text-[17vw]">
          OWN IT
        </span>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          className="mb-8 max-w-2xl"
        >
          <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            Why Move On
          </span>

          <h2 className="font-display text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
            Own it. <br />
            Skip everything else.
          </h2>

          <p className="mt-5 max-w-[560px] text-base leading-relaxed text-white/55">
            No paperwork, no licence, no annual tax — and none of the compromises that
            usually come with skipping them.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto] lg:gap-5">
          {USPS.map((usp, i) => {
            const isFeature = i === 0;

            return (
              /* The reveal and the hover live on separate elements on purpose:
                 framer-motion leaves an inline `transform` behind, which would beat the
                 CSS hover lift. */
              <motion.div
                key={usp.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: i * 0.08 }}
                className={usp.span}
              >
                <article
                  onPointerMove={trackPointer}
                  onPointerEnter={lightUp}
                  onPointerLeave={lightDown}
                  className={`spec-card h-full ${isFeature ? "p-7 lg:p-8" : "p-5 lg:p-6"}`}
                >
                  <div className="spec-content flex h-full flex-col">
                    <p className="spec-label">
                      {String(i + 1).padStart(2, "0")}
                      <span className="mx-2 text-white/25">/</span>
                      {usp.label}
                    </p>

                    <div className={isFeature ? "mt-auto pt-8" : "mt-5"}>
                      <h3
                        className={
                          isFeature
                            ? "mb-4 font-display text-[clamp(2rem,3.2vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.04em] text-white"
                            : "spec-title mb-2.5"
                        }
                      >
                        {usp.title.split("|").map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </h3>

                      <p className={isFeature ? "max-w-[42ch] text-[15px] leading-[1.6] text-white/55" : "spec-body"}>
                        {usp.description}
                      </p>
                    </div>
                  </div>
                </article>
              </motion.div>
            );
          })}
        </div>
      </div>

      <GlassLens boundsRef={sectionRef} />
    </section>
  );
}
