"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_PREMIUM, usePrefersReducedMotion } from "@/lib/motion";

const faqs = [
  {
    q: "How far can a MOVE ON go on a single charge?",
    a: "Up to 150 km on the X1, and further on the X2 and PRO. Real-world range shifts with rider weight, speed and terrain, but a full charge comfortably covers a week of city commuting, errands and weekend runs without hunting for a socket.",
  },
  {
    q: "How long does it take to charge the battery?",
    a: "About 4.5 hours from empty to full on a standard home socket. Plug in overnight or at your desk and you start every day with a full battery — no special wiring or charging station needed.",
  },
  {
    q: "Do I need a licence to ride one?",
    a: "No. Our low-speed models are built to ride without a licence or registration, so students, first-timers and seniors can get going the same day — no queue at the RTO, no renewals to chase.",
  },
  {
    q: "Does a MOVE ON need regular maintenance?",
    a: "Very little. With no oil, clutch or exhaust, upkeep comes down to tyre pressure, brakes and the occasional check-up. The built-in Repair Switch talks you through common fixes, and our service network handles the rest.",
  },
  {
    q: "Why choose an electric scooter over a bike or car?",
    a: "It costs a fraction of a car to run, parks anywhere, and skips traffic — without the sweat of a bicycle. Zero tailpipe emissions and near-silent riding make it the easiest upgrade to your daily commute.",
  },
  {
    q: "Can I ride a MOVE ON in the rain?",
    a: "Yes. The motor, battery and wiring are sealed against splashes and everyday monsoon rides. Avoid riding through deep standing water, and give the brakes a little extra distance on wet roads — just as you would on any two-wheeler.",
  },
  {
    q: "How long does the battery last before it needs replacing?",
    a: "Our lithium-ion packs are built for years of daily riding and hold most of their capacity well beyond the warranty period. When the time does come, a replacement pack swaps in at any MOVE ON service centre — the rest of the scooter carries on as it was.",
  },
  {
    q: "What does the warranty cover?",
    a: "Every MOVE ON comes with a warranty on the motor, battery and controller, plus free periodic check-ups in the first year. Register your scooter at delivery and the details live in your account, so there are no papers to keep track of.",
  },
  {
    q: "Can I take a test ride before I buy?",
    a: "Of course. Book a test ride at your nearest MOVE ON showroom and try any model on real roads. Our team will walk you through the controls, charging and the Repair Switch so you leave knowing exactly what you're getting.",
  },
  {
    q: "Is there a financing or EMI option?",
    a: "Yes. We partner with leading banks and lenders to offer easy EMI plans with minimal paperwork, and you may also be eligible for EV subsidies that bring the on-road price down further. Ask at the showroom for the latest offers.",
  },
  {
    q: "How much weight can a MOVE ON carry?",
    a: "Every model is built to carry an adult rider plus a bag or two of shopping with ease. The frame, suspension and brakes are tuned for real daily loads, so the ride stays stable whether you're heading to class or bringing the groceries home.",
  },
  {
    q: "Is there space to store a helmet or bag?",
    a: "Yes. Under-seat storage takes a half-face helmet or a laptop bag, and there's a front hook for lighter carry. It's designed so your everyday essentials ride with you, not on your back.",
  },
  {
    q: "What happens if the battery runs out mid-ride?",
    a: "The display warns you well before you get low, and an eco mode stretches the last of the charge to get you home. If you're ever caught out, the scooter is light enough to push, and the charger plugs into any standard socket along the way.",
  },
  {
    q: "How secure is my scooter when parked?",
    a: "Each MOVE ON has a keyed ignition and a steering lock, and the smart models add an alarm plus live location in the app — so you can check where your scooter is from anywhere and get alerted if it's moved.",
  },
  {
    q: "Where can I get my scooter serviced?",
    a: "At any authorised MOVE ON service centre, and in many cities our technicians can come to you. Book a slot in the app, and your service history is saved automatically for warranty and resale.",
  },
];

const avatars = [
  { src: "/audience/students.jpg", alt: "MOVE ON rider" },
  { src: "/audience/newbies.jpg", alt: "MOVE ON rider" },
  { src: "/audience/seniors.jpg", alt: "MOVE ON rider" },
];

export function FaqSection() {
  const reducedMotion = usePrefersReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  /* The bar tracks how far down the list the open answer sits; with everything closed it
     falls back to the first step rather than emptying out. */
  const progress = ((open ?? 0) + 1) / faqs.length;

  return (
    <section id="faq" className="relative border-t border-carbon/10 bg-mist py-16 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1300px] gap-12 px-5 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-8">
        {/* Left column — heading and social proof, pinned while the list scrolls. */}
        <motion.div
          /* Not `once`: the reveal plays in reverse on the way out, so every visit to the
             FAQ gets a fresh entrance. */
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55, ease: EASE_PREMIUM }}
          className="flex flex-col self-start lg:sticky lg:top-28 lg:min-h-[520px]"
        >
          <span className="mb-4 block h-px w-10 bg-volt" />
          <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-carbon/40">
            Questions, Answered
          </span>
          <h2 className="font-display text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-carbon">
            Smarter way to
            <br />
            <span className="text-carbon/30">ride every day.</span>
          </h2>
          <p className="mt-6 max-w-[420px] text-base leading-relaxed text-carbon/60">
            Everything you need to know before your first ride — range,
            charging, licences and upkeep.
          </p>

          <div className="mt-12 lg:mt-auto">
            <p className="max-w-[220px] font-display text-[17px] font-medium leading-snug text-carbon">
              Reliable scooters built for comfort
            </p>

            <div className="mt-4 h-[3px] w-full max-w-[420px] overflow-hidden rounded-full bg-carbon/10">
              <div
                className="h-full rounded-full bg-volt transition-[width] duration-500 ease-premium"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex -space-x-3">
                {avatars.map((avatar) => (
                  <span
                    key={avatar.src}
                    className="relative h-12 w-12 overflow-hidden rounded-full bg-soft-grey ring-2 ring-mist"
                  >
                    <Image
                      src={avatar.src}
                      alt={avatar.alt}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                ))}
              </div>
              <div>
                <p className="font-display text-3xl font-extrabold leading-none tracking-[-0.03em] text-carbon">
                  150+
                </p>
                <p className="mt-1 text-sm text-carbon/55">riders this week</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right column — the accordion. */}
        <ul className="flex flex-col">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            const buttonId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;

            return (
              <motion.li
                key={item.q}
                /* Replays in both directions. The stagger is for arriving only (and capped,
                   so a long list doesn't pile up) — a row leaving should not lag. */
                initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.55,
                    ease: EASE_PREMIUM,
                    delay: Math.min(i, 5) * 0.06,
                  },
                }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                className={`border-b transition-[background-color,box-shadow,border-color] duration-300 ease-premium ${
                  isOpen
                    ? "rounded-[24px] border-transparent bg-white shadow-[0_1px_2px_rgba(16,20,18,0.04),0_18px_40px_-22px_rgba(16,20,18,0.18)]"
                    : "border-carbon/10"
                }`}
              >
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center gap-4 px-5 py-6 text-left sm:gap-6 sm:px-8 lg:py-8"
                >
                  <span className="w-10 shrink-0 font-display text-[clamp(1.5rem,2.2vw,2rem)] font-bold leading-none tracking-[-0.03em] text-carbon sm:w-12">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-base font-semibold leading-snug tracking-[-0.01em] text-carbon sm:text-lg lg:text-xl">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ease-premium sm:h-12 sm:w-12 ${
                      isOpen
                        ? "border-carbon bg-carbon text-volt"
                        : "border-carbon/70 text-carbon"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-5 w-5 transition-transform duration-300 ease-premium ${
                        isOpen ? "-rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.45,
                        ease: EASE_PREMIUM,
                      }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-7 text-[15px] leading-[1.75] text-carbon/65 sm:pl-[6.5rem] sm:pr-24 lg:pb-8">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
