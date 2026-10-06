"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
 * The scooter's stage, shared by the modal and the /models/<slug> page.
 *
 * No box. Back to front: a big arc tinted with the chosen finish (it bleeds off the left
 * edge, so only a curved slice shows), the model name as a huge faded vertical
 * watermark, the floor shadow, then the scooter itself — no padding, sitting on the
 * floor. The photos are portrait, so the stage is meant to be tall: the caller sets its
 * height through `className`, and the scooter fills it.
 *
 * The photos sit on a native scroll-snap track, so swipe, momentum and snapping come
 * from the browser rather than from a drag handler that would fight the modal's own
 * gestures. The arc and the watermark stay put while the photos slide over them.
 *
 * `[container-type:size]` lets the watermark size itself off the stage height (cqh), so
 * it reads the same in the peek, the expanded view and on a phone.
 */
export function ModelStage({
  slides,
  alt,
  name,
  color,
  className = "",
}: {
  slides: string[];
  alt: string;
  name: string;
  /** Finish hex. The arc is a light tint of it. */
  color: string;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const multi = slides.length > 1;

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
      {/* ARC. Its right edge sits 35% in from the stage's right, so the scooter overlaps
          the curve rather than sitting fully inside it. A 28% tint keeps even Glossy
          Black a soft grey; the inset ring keeps Ivory White from vanishing on white. */}
      <div
        aria-hidden
        className="absolute right-[35%] top-1/2 aspect-square h-[140%] -translate-y-1/2 rounded-full shadow-[inset_0_0_0_1px_rgb(16_20_18/0.06)] transition-[background-color] duration-500 ease-premium"
        style={{ backgroundColor: `color-mix(in srgb, ${color} 28%, white)` }}
      />

      {/* WATERMARK. Read bottom to top, cropped by the stage if it runs long. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-[3%] flex select-none items-center"
      >
        <span className="rotate-180 whitespace-nowrap font-display text-[11cqh] font-extrabold uppercase leading-none tracking-[-0.02em] text-carbon/[0.06] [writing-mode:vertical-rl]">
          {name}
        </span>
      </div>

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
              {/* The scooter's box. It stops above the thumbnails when there are any,
                  and object-bottom stands the wheels on its floor. */}
              <div
                className={[
                  "absolute inset-x-[6%] top-[7%]",
                  multi ? "bottom-[17%]" : "bottom-[7%]",
                ].join(" ")}
              >
                {/* Floor: tight contact ellipse plus a wide ambient one. */}
                <div
                  aria-hidden
                  className="absolute -bottom-2 left-1/2 h-6 w-[62%] -translate-x-1/2 rounded-[50%] bg-carbon/20 blur-2xl"
                />
                <div
                  aria-hidden
                  className="absolute bottom-0 left-1/2 h-2.5 w-[34%] -translate-x-1/2 rounded-[50%] bg-carbon/30 blur-lg"
                />
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
        <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-3">
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
                  "relative h-14 w-14 overflow-hidden rounded-[14px] bg-white transition-[box-shadow,opacity] duration-200 ease-premium",
                  i === index
                    ? "shadow-[0_8px_20px_-8px_rgba(16,20,18,0.35)] ring-2 ring-carbon"
                    : "opacity-70 ring-1 ring-carbon/10 hover:opacity-100",
                ].join(" ")}
              >
                <Image src={src} alt="" fill sizes="56px" className="object-contain p-1" />
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
