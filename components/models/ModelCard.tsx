"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FINISH, formatPrice, type Model } from "@/lib/models";
import { ModelModal } from "./ModelModal";

/*
 * MODEL CARD — your card, plus a click that opens the modal.
 *
 * The card and the modal share a layoutId, which is what morphs one into the other.
 * The card owns `open`; the grid and the filters know nothing about the modal.
 */
export function ModelCard({ model }: { model: Model }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleClose = useCallback(() => setOpen(false), []);

  /* Show max 4 finishes to keep it uncluttered. */
  const visibleFinishes = model.finishes.slice(0, 4);
  const extraFinishesCount = model.finishes.length - visibleFinishes.length;

  return (
    <>
      <motion.div
        layoutId={`model-${model.slug}`}
        /* Radius in style, not just the class: framer only corrects it for scale
           distortion mid-morph when it owns the value. Opacity hides the card while the
           modal stands in for it, so there is never a doubled card on screen. */
        style={{ borderRadius: 24, opacity: open ? 0 : 1 }}
        role="button"
        tabIndex={0}
        aria-label={`${model.name} — view details`}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        /* transition-[translate,box-shadow], not transition-all: a CSS transition on
           `transform` fights framer, which writes transform every frame of the morph. */
        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[24px] bg-white p-7 transition-[translate,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-15px_rgba(16,20,18,0.08)]"
      >
        <span aria-hidden className="focus-veil" />

        {/* Top meta */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="font-display text-[22px] font-bold tracking-tight text-carbon">
              {model.name}
            </h3>
            <p className="mt-1.5 font-display text-[15px] font-bold tracking-tight text-carbon/75">
              From <span className="text-carbon">{formatPrice(model.price)}</span>
            </p>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-carbon/5 text-carbon/40 transition-all duration-300 group-hover:bg-carbon group-hover:text-volt">
            <ArrowUpRight size={17} strokeWidth={2.5} />
          </div>
        </div>

        {/* Floating product image */}
        <div className="relative mb-7 aspect-[4/3] w-full">
          <div className="absolute bottom-1 left-1/2 h-3.5 w-[58%] -translate-x-1/2 rounded-[50%] bg-carbon/10 blur-xl transition-all duration-500 ease-premium group-hover:w-[70%] group-hover:bg-carbon/15" />
          <div className="absolute bottom-3 left-1/2 h-1.5 w-[30%] -translate-x-1/2 rounded-[50%] bg-carbon/20 blur-md transition-all duration-500 ease-premium group-hover:w-[38%]" />

          {model.image ? (
            <Image
              src={model.image}
              alt={`MOVE ON ${model.name}`}
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 640px) 42vw, 90vw"
              className="relative z-10 scale-[1.15] object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.14)] transition-transform duration-500 ease-premium group-hover:-translate-y-2 group-hover:scale-[1.22]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[10px] font-bold tracking-[0.25em] text-carbon/20">
                IMAGE PENDING
              </span>
            </div>
          )}
        </div>

        {/* Bottom specs */}
        <div className="mt-auto flex flex-col gap-5 border-t border-carbon/8 pt-5">
          <div className="flex items-center justify-between font-display text-[11px] font-bold uppercase tracking-[0.1em] text-carbon/70">
            <span>{model.range} Range</span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-carbon/25" />
            <span>{model.topSpeed}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex -space-x-1.5">
              {visibleFinishes.map((finish) => (
                <span
                  key={finish}
                  title={finish}
                  className="h-5 w-5 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: FINISH[finish] ?? "#8A9199" }}
                />
              ))}

              {extraFinishesCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-carbon/5 text-[8px] font-bold text-carbon/70 shadow-sm">
                  +{extraFinishesCount}
                </span>
              )}
            </div>

            <span className="font-display text-[11px] font-bold tracking-tight text-carbon/80 transition-colors duration-300 group-hover:text-volt">
              Explore Details
            </span>
          </div>
        </div>
      </motion.div>

      {/* Portalled to <body>: see the note at the top of ModelModal. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && <ModelModal model={model} onClose={handleClose} />}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}