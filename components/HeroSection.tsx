"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

interface Model {
  id: string;
  code: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accent: string;
  range: string;
  topSpeed: string;
}

const MODELS: Model[] = [
  {
    id: "x1",
    code: "01",
    name: "MOVE ON X1",
    tagline: "Urban. Agile. Effortless.",
    description:
      "Designed for everyday city riding with effortless handling, confident performance and the freedom to go further.",
    image: "/Hero/bike_2.png",
    accent: "#42CE00",
    range: "150 KM",
    topSpeed: "80 KM/H",
  },
  {
    id: "x2",
    code: "02",
    name: "MOVE ON X2",
    tagline: "Bolder. Faster. Further.",
    description:
      "More range, more power and more presence — built for riders who want more from every journey.",
    image: "/Hero/bike_2.png",
    accent: "#00A86B",
    range: "190 KM",
    topSpeed: "95 KM/H",
  },
  {
    id: "pro",
    code: "03",
    name: "MOVE ON PRO",
    tagline: "Performance. Refined.",
    description:
      "Our flagship electric scooter, combining serious performance with a refined, unmistakably premium ride.",
    image: "/scooters/pro.png",
    accent: "#7DFF40",
    range: "220 KM",
    topSpeed: "110 KM/H",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const reducedMotion = useReducedMotion();

  const stageRef = useRef<HTMLDivElement>(null);

  const active = MODELS[activeIndex];

  function selectModel(index: number) {
    if (index === activeIndex) return;

    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  }

  function scrollToLineup() {
    document.getElementById("models")?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <section className="relative bg-white px-5 pb-16 pt-28 sm:px-8 lg:px-10 lg:pb-24 lg:pt-32">
      <div className="mx-auto max-w-[1500px]">
        {/* HERO FRAME */}
        <div className="relative min-h-[680px] overflow-hidden rounded-[32px] bg-mist sm:rounded-[40px] lg:min-h-[700px]">
          {/* Architectural background */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(66,206,0,0.09),transparent_35%)]" />

            <div className="absolute right-[8%] top-[10%] h-[420px] w-[420px] rounded-full border border-carbon/[0.06]" />

            <div className="absolute right-[14%] top-[18%] h-[300px] w-[300px] rounded-full border border-carbon/[0.05]" />

            <div className="absolute inset-x-0 bottom-[105px] border-t border-carbon/[0.06]" />

            <div className="absolute bottom-0 right-[22%] top-0 w-px bg-carbon/[0.035]" />

            <div className="absolute bottom-0 right-[46%] top-0 w-px bg-carbon/[0.025]" />
          </div>

          {/* Top micro navigation */}
          <div className="absolute left-7 right-7 top-7 z-20 flex items-center justify-between sm:left-10 sm:right-10 sm:top-9">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-volt" />

              <span className="font-display text-[11px] font-semibold tracking-[0.22em] text-carbon/55">
                ELECTRIC MOBILITY
              </span>
            </div>

            <button
              onClick={scrollToLineup}
              className="group hidden items-center gap-2 font-display text-[11px] font-semibold tracking-[0.16em] text-carbon/50 transition-colors hover:text-carbon sm:flex"
            >
              VIEW LINEUP

              <ArrowRight
                size={14}
                strokeWidth={1.7}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>

          {/* MAIN CONTENT */}
          <div className="relative z-10 grid min-h-[680px] items-center lg:min-h-[700px] lg:grid-cols-[0.85fr_1.4fr]">
            {/* LEFT CONTENT */}
            <div className="relative z-20 px-7 pb-4 pt-28 sm:px-10 lg:px-14 lg:py-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={
                    reducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 18, filter: "blur(8px)" }
                  }
                  animate={
                    reducedMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0, filter: "blur(0px)" }
                  }
                  exit={
                    reducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -12, filter: "blur(6px)" }
                  }
                  transition={{
                    duration: reducedMotion ? 0.2 : 0.55,
                    ease: EASE,
                  }}
                >
                  <p
                    className="mb-4 font-display text-xs font-semibold tracking-[0.2em]"
                    style={{ color: active.accent }}
                  >
                    {active.tagline.toUpperCase()}
                  </p>

                  <h1 className="max-w-[570px] font-display text-[clamp(3.4rem,6vw,6.2rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-carbon">
                    Move
                    <br />
                    without
                    <br />
                    limits.
                  </h1>

                  <p className="mt-7 max-w-[410px] text-sm leading-7 text-carbon/55 sm:text-base">
                    {active.description}
                  </p>

                  {/* Specs */}
                  <div className="mt-9 flex items-center gap-8">
                    <div>
                      <p className="font-display text-2xl font-semibold tracking-tight text-carbon">
                        {active.range}
                      </p>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-carbon/40">
                        True range
                      </p>
                    </div>

                    <div className="h-10 w-px bg-carbon/10" />

                    <div>
                      <p className="font-display text-2xl font-semibold tracking-tight text-carbon">
                        {active.topSpeed}
                      </p>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-carbon/40">
                        Top speed
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-9 flex flex-wrap items-center gap-3">
                    <button
                      onClick={scrollToLineup}
                      className="group inline-flex items-center gap-3 rounded-full bg-carbon px-6 py-3.5 font-display text-xs font-semibold tracking-wide text-white transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      Explore {active.name.replace("MOVE ON ", "")}

                      <ArrowRight
                        size={15}
                        strokeWidth={1.8}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </button>

                    <button
                      onClick={scrollToLineup}
                      className="rounded-full px-5 py-3.5 font-display text-xs font-semibold text-carbon/55 transition-colors duration-300 hover:text-carbon"
                    >
                      Book a test ride
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* PRODUCT STAGE */}
            <div
              ref={stageRef}
              className="relative h-[330px] sm:h-[420px] lg:h-[620px]"
            >
              {/* Large faint model number */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id + "-number"}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="pointer-events-none absolute right-[4%] top-[8%] select-none font-display text-[18rem] font-semibold leading-none tracking-[-0.08em] text-carbon/[0.025] lg:text-[25rem]"
                >
                  {active.code}
                </motion.div>
              </AnimatePresence>

              {/* Ground lighting */}
              <motion.div
                animate={{
                  opacity: 0.5,
                  scaleX: [1, 1.08, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute bottom-[16%] left-[14%] h-10 w-[70%] rounded-full blur-2xl"
                style={{
                  backgroundColor: `${active.accent}22`,
                }}
              />

              {/* Ground shadow */}
              <motion.div
                animate={{
                  opacity: 0.16,
                  scaleX: 1,
                }}
                className="absolute bottom-[17%] left-[18%] h-5 w-[62%] rounded-[50%] bg-carbon blur-2xl"
              />

              {/* Scooter */}
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={active.id}
                  custom={direction}
                  initial={
                    reducedMotion
                      ? {
                          opacity: 0,
                        }
                      : {
                          x: direction * 110,
                          opacity: 0,
                          scale: 0.9,
                          rotate: direction * 2,
                          filter: "blur(8px)",
                        }
                  }
                  animate={{
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    filter: "blur(0px)",
                  }}
                  exit={
                    reducedMotion
                      ? {
                          opacity: 0,
                        }
                      : {
                          x: direction * -110,
                          opacity: 0,
                          scale: 0.94,
                          rotate: direction * -2,
                          filter: "blur(7px)",
                        }
                  }
                  transition={{
                    duration: reducedMotion ? 0.2 : 0.7,
                    ease: EASE,
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.div
                    animate={
                      reducedMotion
                        ? undefined
                        : {
                            y: [0, -5, 0],
                          }
                    }
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative h-[75%] w-[92%]"
                  >
                    <Image
                      src={active.image}
                      alt={active.name}
                      fill
                      priority
                      sizes="(min-width: 1024px) 55vw, 90vw"
                      className="select-none object-contain drop-shadow-[0_35px_35px_rgba(16,20,18,0.18)]"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Floating spec */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id + "-spec"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="absolute bottom-[11%] right-[5%] hidden rounded-2xl border border-white/80 bg-white/85 px-5 py-4 shadow-[0_20px_50px_rgba(16,20,18,0.08)] backdrop-blur-md lg:block"
                >
                  <p className="font-display text-[10px] font-semibold tracking-[0.15em] text-carbon/35">
                    CURRENT MODEL
                  </p>

                  <p className="mt-1 font-display text-sm font-semibold text-carbon">
                    {active.name}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* MODEL SELECTOR */}
          <div className="absolute bottom-6 left-6 right-6 z-30 sm:bottom-8 sm:left-10 sm:right-10">
            <div className="flex items-center justify-between border-t border-carbon/10 pt-5">
              <div className="flex items-center gap-2">
                {MODELS.map((model, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={model.id}
                      onClick={() => selectModel(index)}
                      className="group flex items-center gap-2 px-2 py-1.5"
                    >
                      <span
                        className="font-display text-[10px] font-semibold tracking-[0.12em]"
                        style={{
                          color: isActive
                            ? model.accent
                            : "rgba(16,20,18,0.3)",
                        }}
                      >
                        {model.code}
                      </span>

                      <span
                        className={`font-display text-[11px] font-semibold tracking-wide transition-colors ${
                          isActive
                            ? "text-carbon"
                            : "text-carbon/35 group-hover:text-carbon/60"
                        }`}
                      >
                        {model.name.replace("MOVE ON ", "")}
                      </span>

                      {isActive && (
                        <motion.span
                          layoutId="active-model"
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor: model.accent,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={scrollToLineup}
                className="group flex items-center gap-2 text-carbon/35 transition-colors hover:text-carbon"
              >
                <span className="hidden text-[10px] font-semibold tracking-[0.16em] sm:block">
                  DISCOVER THE LINEUP
                </span>

                <ChevronDown
                  size={15}
                  strokeWidth={1.7}
                  className="transition-transform duration-300 group-hover:translate-y-1"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}