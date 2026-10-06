"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
 * The scooter's stage, shared by the modal and the /models/<slug> page.
 *
 * No box. Back to front: the model name as a huge faded vertical watermark, the floor
 * shadow, then the scooter itself — no padding, standing on the floor. The photos are
 * portrait, so the stage is meant to be tall: the caller sets its height through
 * `className`, and the scooter is sized by that height.
 *
 * The photos sit on a native scroll-snap track, so swipe, momentum and snapping come
 * from the browser rather than from a drag handler that would fight the modal's own
 * gestures. The watermark stays put while the photos slide over them.
 *
 * `[container-type:size]` lets the watermark size itself off the stage height (cqh), so
 * it reads the same in the peek, the expanded view and on a phone.
 *
 * `variant="modal"` drops the watermark and stands the scooter lower, closer to the
 * thumbnails. The page keeps the default.
 */

/* Where the scooter sits. `box` places the image box (see the note on it below), `floor`
   puts the shadow on the line the wheels stand on. Phones (below sm) start the scooter
   at ~15%, clear of the modal's icon buttons and drag handle, which sit over the stage
   there; the thumbnails leave no room to lower it further. */
const FIT = {
  /* Body ~4%→82%, floor 82%. */
  page: { box: "top-[5%] bottom-[9%] sm:top-[-7%]", floor: "bottom-[18%]" },
  /* Body ~9%→87%, floor 87%: the same size, set lower. */
  modal: {
    box: "top-[5%] bottom-[9%] sm:top-[-2%] sm:bottom-[4%]",
    floor: "bottom-[18%] sm:bottom-[13%]",
  },
  /* No thumbnails: body ~4%→88%, floor 88%. */
  single: { box: "top-[5%] bottom-[2%] sm:top-[-8%]", floor: "bottom-[12%]" },
} as const;

export function ModelStage({
  slides,
  alt,
  name,
  variant = "page",
  className = "",
}: {
  slides: string[];
  alt: string;
  name: string;
  variant?: "page" | "modal";
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const multi = slides.length > 1;
  const modal = variant === "modal";
  const fit = FIT[multi ? variant : "single"];

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const next = Math.max(0, Math.min(slides.length - 1, i));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({
        left: next * el.clientWidth,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [slides.length],
  );

  /* The slide nearest the left edge is the current one. Setting an unchanged value is a
     no-op, so this re-renders once per slide rather than once per scroll event. */
  function onScroll() {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  const arrow =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-carbon shadow-[0_6px_18px_-6px_rgba(16,20,18,0.35)] transition-[background-color,color,opacity] duration-200 hover:bg-carbon hover:text-volt disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className={`relative w-full overflow-hidden [container-type:size] ${className}`}>
      {/* WATERMARK. Read bottom to top, cropped by the stage if it runs long. */}
      {!modal && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-[3%] flex select-none items-center"
        >
          <span className="rotate-180 whitespace-nowrap font-display text-[11cqh] font-extrabold uppercase leading-none tracking-[-0.02em] text-carbon/[0.06] [writing-mode:vertical-rl]">
            {name}
          </span>
        </div>
      )}

      {/* PHOTOS */}
      <div
        ref={track}
        onScroll={onScroll}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${alt}, photos`}
        className="relative z-10 flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.length > 0 ? (
          slides.map((src, i) => (
            <div
              key={`${src}-${i}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              className="relative h-full w-full shrink-0 snap-center"
            >
              {/* Floor: tight contact ellipse plus a wide ambient one, on the line the
                  wheels stand on. */}
              <div
                aria-hidden
                className={`absolute left-1/2 h-6 w-[50%] -translate-x-1/2 translate-y-1/2 rounded-[50%] bg-carbon/20 blur-2xl ${fit.floor}`}
              />
              <div
                aria-hidden
                className={`absolute left-1/2 h-2.5 w-[28%] -translate-x-1/2 translate-y-1/2 rounded-[50%] bg-carbon/30 blur-lg ${fit.floor}`}
              />

              {/* The scooter's box, deliberately bigger than what shows. The lineup PNGs
                  carry transparent padding (~12% above the scooter, ~9% below), so a box
                  that fits the stage would give the scooter only ~80% of it. This box can
                  run past the stage's top, where only empty pixels get clipped, and FIT
                  places it so the body lands where wanted with the wheels on the floor
                  line. A photo framed differently — xozone.png has only ~3% / ~2% —
                  needs its own numbers. */}
              <div className={`absolute inset-x-[6%] ${fit.box}`}>
                <Image
                  src={src}
                  alt={i === 0 ? alt : ""}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 560px, 90vw"
                  className="relative object-contain object-bottom drop-shadow-[0_24px_22px_rgba(0,0,0,0.18)]"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-full w-full shrink-0 items-center justify-center font-display text-[12px] font-bold tracking-[0.25em] text-carbon/30">
            IMAGE PENDING
          </div>
        )}
      </div>

      {/* THUMBNAILS, flanked by the arrows. */}
      {multi && (
        <div
          className={[
            "absolute inset-x-0 z-20 flex items-center justify-center gap-3",
            modal ? "bottom-3" : "bottom-4",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous photo"
            className={arrow}
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          <div className="flex gap-2">
            {slides.map((src, i) => (
              <button
                key={`${src}-thumb-${i}`}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Photo ${i + 1} of ${slides.length}`}
                aria-current={i === index}
                className={[
                  "relative overflow-hidden rounded-[14px]",
                  modal ? "h-11 w-11" : "h-12 w-12",
                  "bg-white transition-[box-shadow,opacity] duration-200 ease-premium",
                  i === index
                    ? "shadow-[0_8px_20px_-8px_rgba(16,20,18,0.35)] ring-2 ring-carbon"
                    : "opacity-70 ring-1 ring-carbon/10 hover:opacity-100",
                ].join(" ")}
              >
                <Image src={src} alt="" fill sizes="48px" className="object-contain p-1" />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === slides.length - 1}
            aria-label="Next photo"
            className={arrow}
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}
