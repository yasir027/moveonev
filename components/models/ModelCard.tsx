
"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  FINISH,
  formatPrice,
  type BatteryId,
  type Model,
} from "@/lib/models";
import { ModelModal } from "./ModelModal";


type ModelCardProps = {
  model: Model;
  pricing?: Model["pricing"][keyof Model["pricing"]];
  batteryId?: BatteryId;
};




export function ModelCard({
  model,
  pricing,
  batteryId,
}: ModelCardProps) {
  
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleClose = useCallback(() => setOpen(false), []);

const start =
  pricing ??
  Object.values(model.pricing).reduce(
    (a, b) => (b.offer < a.offer ? b : a)
  );

  const visibleFinishes = model.finishes.slice(0, 5);
  const extraFinishesCount =
    model.finishes.length - visibleFinishes.length;

  return (
    <>
      <motion.div
        layoutId={`model-${model.slug}`}
        style={{
          borderRadius: 24,
          opacity: open ? 0 : 1,
        }}
        role="button"
        tabIndex={0}
        aria-label={`${model.name} — explore details`}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="
          group relative isolate flex
          h-full w-full min-w-0
          cursor-pointer flex-col
          overflow-hidden
          border border-soft-grey
bg-white p-3 sm:p-5
          font-body
          transition-[translate,box-shadow,border-color]
          duration-500 ease-premium
          hover:-translate-y-1
          hover:border-leaf/20
          hover:shadow-xl hover:shadow-carbon/10
          focus-visible:outline-2
          focus-visible:outline-offset-4
          focus-visible:outline-leaf
        "
      >
        {/* 1. Product name and arrow */}
        <div className="flex items-start justify-between gap-2 sm:items-center sm:gap-3">
  <h3
    className="
      min-w-0 font-display
      text-[15px] font-extrabold
      leading-tight tracking-[-0.03em]
      text-carbon sm:text-[21px] sm:tracking-[-0.04em]
    "
  >
    {model.name}
  </h3>

  <span
    className="
      hidden h-9 w-9 shrink-0
      items-center justify-center
      rounded-full bg-mist
      text-carbon
      transition-colors duration-300
      group-hover:bg-volt
      group-hover:text-black sm:flex"
  >
    <ArrowUpRight size={16} strokeWidth={2.2} />
  </span>
</div>

        
{/* 2. OFFER PRICE + MRP */}
<div className="mt-2 sm:mt-3">
  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:gap-x-3 sm:gap-y-1">
    <span
      className="
        font-display
        text-[21px] font-extrabold
        leading-none
        tracking-[-0.05em]
        text-leaf
        sm:text-[29px]
        lg:text-[clamp(25px,2vw,32px)]
      "
    >
      {formatPrice(start.offer)}
    </span>

    <span className="font-body text-[10px] font-medium text-carbon/75 sm:text-[12px]">
      <s className="font-semibold text-carbon/70">
        {formatPrice(start.mrp)}
      </s>
    </span>

    <span className="w-full font-body text-[10px] font-medium italic text-carbon/65 sm:w-auto sm:text-[12px]">
      On-road price*
    </span>
  </div>
</div>

        {/* 4. Compact scooter showcase */}
        <div
          className="
            relative -mx-3 mt-1
            aspect-[4/3]
            overflow-hidden
          "
        >
          {/* Subtle branded glow */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute
              left-1/2 top-1/2
              h-[75%] w-[85%]
              -translate-x-1/2 -translate-y-1/2
              rounded-full
              bg-volt/10 blur-3xl
            "
          />

          {/* Ground shadow */}
          <div
            aria-hidden="true"
            className="
              absolute bottom-[9%] left-1/2
              h-3 w-[45%]
              -translate-x-1/2
              rounded-[50%]
              bg-carbon/10 blur-xl
              transition-all duration-500 ease-premium
              group-hover:w-[52%]
            "
          />

          {model.image ? (
            <Image
              src={model.image}
              alt={`MOVE ON ${model.name}`}
              fill
              sizes="(min-width: 1280px) 26vw, (min-width: 640px) 48vw, 100vw"
              className="
                relative z-10
                origin-bottom
                scale-[1.03]
                object-contain
                drop-shadow-lg
                transition-transform duration-700 ease-premium
                group-hover:-translate-y-1
                group-hover:scale-[1.08]
              "
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="
                  font-display text-[10px]
                  font-bold tracking-widest
                  text-carbon/25
                "
              >
                IMAGE PENDING
              </span>
            </div>
          )}
        </div>

        {/* 5. Colour variants */}
        <div className="mt-auto">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center -space-x-1.5">
              {visibleFinishes.map((finish, index) => (
                <span
                  key={finish}
                  title={finish}
                  aria-label={finish}
                  className={`
                    relative h-6 w-6
                    rounded-full
                    border-2 border-white
                    shadow-sm
                    transition-transform duration-300
                    group-hover:translate-x-0.5
                    ${
                      index === 0
                        ? "ring-1 ring-leaf/40"
                        : ""
                    }
                  `}
                  style={{
                    backgroundColor:
                      FINISH[finish] ?? "var(--color-soft-grey)",
                  }}
                />
              ))}

              {extraFinishesCount > 0 && (
                <span
                  className="
                    relative flex h-6 w-6
                    items-center justify-center
                    rounded-full border-2 border-white
                    bg-soft-grey
                    font-display text-[10px]
                    font-bold text-carbon/70
                    shadow-sm
                  "
                >
                  +{extraFinishesCount}
                </span>
              )}
            </div>

            <span
              className="
                font-body text-[11px]
                font-medium text-carbon/45
                
              "
            >
              Available colours
            </span>
          </div>

          {/* 6. Slim Explore Details CTA */}
          <div
  className="
    mt-3 flex w-full
    items-center justify-center gap-2
    rounded-full
    bg-volt px-3 py-2 sm:mt-4 sm:px-4 sm:py-2.5
    text-carbon
    transition-all duration-300 ease-premium
    group-hover:bg-carbon
    group-hover:text-white
  "
>
  <span className="whitespace-nowrap font-display text-[12px] font-bold tracking-tight sm:text-[13px]">
    Explore Details
  </span>

  <ArrowRight
    size={16}
    strokeWidth={2.3}
    className="
      hidden transition-transform duration-300
      ease-premium sm:block
      group-hover:translate-x-1
    "
  />
</div>
        </div>
      </motion.div>

      {/* Existing modal integration */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <ModelModal
                model={model}
                initialBattery={batteryId}
                onClose={handleClose}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
