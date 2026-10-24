"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { useIsCompact } from "@/lib/motion";

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
  colors: { name: string; hex: string }[];
}

const MODELS: Model[] = [
  {
    id: "x1",
    code: "X1",
    name: "MOVE ON X1",
    tagline: "Urban. Agile. Effortless.",
    description: "Designed for everyday city riding with effortless handling and confident performance. A perfect blend of agility and efficiency for the daily commuter.",
    image: "/Hero/bike.png",
    accent: "#42CE00",
    range: "150 KM",
    topSpeed: "80 KM/H",
    colors: [
      { name: "Graphite", hex: "#2C2C2C" },
      { name: "Arctic White", hex: "#F5F5F5" },
      { name: "Volt Green", hex: "#42CE00" },
    ],
  },
  {
    id: "x2",
    code: "X2",
    name: "MOVE ON X2",
    tagline: "Bolder. Faster. Further.",
    description: "More range, more power and more presence. Built with an extended chassis and upgraded motor for riders who want more from every journey.",
    image: "/Hero/bike.png",
    accent: "#00A86B",
    range: "190 KM",
    topSpeed: "95 KM/H",
    colors: [
      { name: "Midnight Blue", hex: "#1A2530" },
      { name: "Crimson", hex: "#8B0000" },
      { name: "Emerald", hex: "#00A86B" },
    ],
  },
  {
    id: "pro",
    code: "PRO",
    name: "MOVE ON PRO",
    tagline: "Performance. Refined.",
    description: "Our flagship electric scooter. Dual motors, active suspension, and aerospace-grade materials combine for a refined, unmistakably premium ride.",
    image: "/Hero/bike.png",
    accent: "#7DFF40",
    range: "220 KM",
    topSpeed: "110 KM/H",
    colors: [
      { name: "Carbon Black", hex: "#111111" },
      { name: "Titanium Silver", hex: "#C0C0C0" },
      { name: "Neon Pulse", hex: "#7DFF40" },
    ],
  },
];

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const reducedMotion = useReducedMotion();
  // Phones: shorter ride, gentler float, no animated blur on the giant code word.
  const compact = useIsCompact();
  const ride = compact ? 80 : 150;
  const active = MODELS[activeIndex];

  function selectModel(index: number) {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setActiveColorIndex(0); // Reset color when switching models
  }

  function scrollToLineup() {
    document.getElementById("models")?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <section className="relative w-full bg-white px-4 pb-3 pt-24 sm:px-6 sm:pb-8 lg:px-8 lg:pb-12 lg:pt-28">
      <div className="mx-auto max-w-[1600px]">
        
        {/* HERO STAGE */}
        <div className="relative flex min-h-[80svh] w-full flex-col overflow-hidden rounded-[40px] bg-[#F8F9FA] lg:min-h-[85vh] lg:flex-row">
          
          {/* Subtle Studio Lighting Radial */}
          <motion.div
            className="absolute inset-0 z-0 transition-opacity duration-1000 lg:right-0 lg:left-auto lg:w-1/2"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${active.accent}15 0%, transparent 70%)`,
            }}
          />

          {/* LEFT COLUMN: Content & Selectors */}
          <div className="relative z-20 flex w-full flex-col justify-center px-6 pb-4 pt-6 sm:px-8 sm:pb-10 sm:pt-16 lg:w-[45%] lg:px-16 lg:pb-32 lg:pt-0">
            
            {/* Model Selector */}
            <div className="mb-5 sm:mb-10">
              <p className="mb-4 hidden text-[10px] font-bold uppercase tracking-[0.15em] text-carbon/40 sm:block">
                Select Model
              </p>
              {/* Phones: one row you can swipe, running to the stage's edges. */}
              <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:px-0">
                {MODELS.map((model, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={model.id}
                      onClick={() => selectModel(index)}
                      className={`flex shrink-0 items-center gap-3 rounded-full p-1.5 pr-5 transition-all duration-300 ${
                        isActive
                          ? "bg-carbon text-white shadow-md"
                          : "bg-white text-carbon/60 shadow-sm hover:bg-white/80 hover:text-carbon"
                      }`}
                    >
                      <div 
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                          isActive ? "bg-white/10" : "bg-carbon/5"
                        }`}
                      >
                        <Image
                          src={model.image}
                          alt={model.name}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <span className="font-display text-xs font-semibold tracking-wide">
                        {model.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: LUXURY_EASE }}
              >
                <p className="mb-2 font-display text-[11px] font-bold tracking-[0.2em] sm:mb-4 sm:text-xs" style={{ color: active.accent }}>
                  {active.tagline.toUpperCase()}
                </p>

                <h1 className="font-display text-[34px] font-bold sm:text-[clamp(3rem,5vw,5rem)] leading-[0.95] tracking-[-0.04em] text-carbon">
                  {active.name}
                </h1>

                <p className="mt-3 line-clamp-2 max-w-[400px] text-sm leading-relaxed text-carbon/60 sm:mt-6 sm:line-clamp-none sm:text-base">
                  {active.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-5 flex flex-col gap-8 sm:mt-10">
              {/* Dummy Color Selector */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id + "-colors"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-carbon/40 sm:mb-4">
                    Exterior Color — {active.colors[activeColorIndex].name}
                  </p>
                  <div className="flex gap-4">
                    {active.colors.map((color, index) => (
                      <button
                        key={color.name}
                        onClick={() => setActiveColorIndex(index)}
                        className="group relative flex h-8 w-8 items-center justify-center rounded-full"
                      >
                        <span
                          className="absolute inset-0 rounded-full shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                        {index === activeColorIndex && (
                          <motion.span
                            layoutId="active-color-ring"
                            className="absolute -inset-1.5 rounded-full border border-carbon/20"
                            transition={{ duration: 0.4, ease: LUXURY_EASE }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Stage. Below lg it gets its own height, so the scooter
              sits in its own band instead of spilling over the copy and under the dock. */}
          <div className="relative z-10 flex h-[30svh] min-h-[220px] w-full items-center justify-center sm:h-[50svh] lg:h-auto lg:min-h-0 lg:w-[55%]">
            {/* Background Typography */}
            <div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-[55%] select-none lg:-translate-x-[40%]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id + "-bg-text"}
                  initial={compact ? { opacity: 0 } : { opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  animate={compact ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={compact ? { opacity: 0 } : { opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                  transition={{ duration: compact ? 0.6 : 1.2, ease: LUXURY_EASE }}
                  className="font-display text-[35vw] font-bold leading-none tracking-tighter text-carbon/[0.03] lg:text-[28vw]"
                >
                  {active.code}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Scooter - Increased Size */}
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={active.id}
                custom={direction}
                initial={reducedMotion ? { opacity: 0 } : { 
                  opacity: 0, 
                  x: direction * ride,
                  scale: 0.9,
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: 1,
                }}
                exit={reducedMotion ? { opacity: 0 } : { 
                  opacity: 0, 
                  x: direction * -ride,
                  scale: 0.95,
                }}
                transition={{ duration: compact ? 0.7 : 0.9, ease: LUXURY_EASE }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  animate={reducedMotion ? undefined : { y: [0, compact ? -6 : -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative h-full w-full lg:h-[75vh] lg:w-[105%]"
                >
                  <Image
                    src={active.image}
                    alt={active.name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="select-none object-contain drop-shadow-[0_50px_50px_rgba(0,0,0,0.15)]"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* FLOATING COMMAND CENTER (Glassmorphism Dock). Floats over the stage from lg;
              below that it sits under the scooter so it never covers it. */}
          <div className="relative z-30 mx-auto mb-4 w-[92%] max-w-[1200px] sm:mb-6 lg:absolute lg:bottom-10 lg:left-1/2 lg:mx-0 lg:mb-0 lg:w-[85%] lg:-translate-x-1/2">
            <div className="flex flex-col items-center justify-between gap-3 rounded-[32px] border border-white/50 bg-white/40 px-4 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] backdrop-blur-md sm:flex-row sm:gap-6 sm:px-8 sm:py-4 lg:rounded-full lg:backdrop-blur-2xl">
              
              {/* Left Actions */}
              <div className="flex w-full flex-1 items-center justify-center gap-3 sm:w-auto sm:justify-start">
                <button
                  onClick={scrollToLineup}
                  className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-carbon px-6 font-display sm:flex-none text-xs font-bold tracking-wide text-white transition-all hover:bg-carbon/90 hover:shadow-lg hover:shadow-carbon/20"
                >
                  Configure
                  <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button
                  onClick={scrollToLineup}
                  className="flex h-12 flex-1 items-center justify-center rounded-full border border-carbon/20 bg-white/30 px-6 font-display sm:flex-none text-xs font-bold tracking-wide text-carbon transition-all hover:bg-white hover:border-carbon/40"
                >
                  Test Drive
                </button>
              </div>

              {/* Central Specs */}
              <div className="flex flex-1 items-center justify-center gap-8 border-t border-carbon/10 pt-3 sm:border-x sm:border-t-0 sm:py-0">
                <div className="text-center">
                  <p className="font-display text-xl font-bold text-carbon sm:text-2xl">{active.topSpeed}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-carbon/40">Top Speed</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-xl font-bold text-carbon sm:text-2xl">{active.range}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-carbon/40">True Range</p>
                </div>
              </div>

              {/* Right Side: Google Rating. Hidden on phones: the hero below shows it too. */}
              <div className="hidden flex-1 items-center justify-center sm:flex sm:justify-end">
                <div className="flex flex-col items-center sm:items-end">
                  <div className="flex items-center gap-1 text-[#FBBC04]">
                    <Star size={14} fill="currentColor" strokeWidth={0} />
                    <Star size={14} fill="currentColor" strokeWidth={0} />
                    <Star size={14} fill="currentColor" strokeWidth={0} />
                    <Star size={14} fill="currentColor" strokeWidth={0} />
                    <Star size={14} fill="currentColor" strokeWidth={0} />
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-carbon/60">
                    <span className="font-bold text-carbon">4.9/5</span>
                    <span>Google Reviews</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}