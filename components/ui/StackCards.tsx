"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** Phones only (below sm): that is where these grids are a single column. */
const COMPACT = "(max-width: 639px)";
/** How far the covered card shrinks, and how dark it goes, once the next one is on top. */
const SHRINK = 0.06;
const DIM = 0.28;

/**
 * Phones: the cards pin one after another and each new one slides up over the last, which
 * shrinks back and dims a little — depth instead of one long column. From sm up it renders
 * the children exactly as they were; the container keeps whatever grid it is given.
 *
 * Each card's `top` steps down a little, so the edge of every card underneath stays in view.
 * A plain scroll listener (the WhoIsItFor pattern) writes straight onto the nodes, so a scroll
 * never re-renders anything. The shrink is a transform on the card's own wrapper: keep
 * backdrop-blur glass inside these cards opaque enough to read without the blur.
 */
export function StackCards({
  className = "",
  top = 88,
  step = 14,
  children,
}: {
  /** The container's own classes — the desktop grid lives here. */
  className?: string;
  /** Where the first card pins, in px from the top of the screen (clears the navbar). */
  top?: number;
  /** How much lower each following card pins. */
  step?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const compact = window.matchMedia(COMPACT);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    function update() {
      const cards = [...root!.querySelectorAll<HTMLElement>(":scope > [data-stack-card]")];
      const live = compact.matches && !reduced.matches;
      cards.forEach((card, i) => {
        const body = card.querySelector<HTMLElement>(":scope > [data-stack-body]");
        const dim = card.querySelector<HTMLElement>(":scope > [data-stack-body] > [data-stack-dim]");
        const next = cards[i + 1];
        let p = 0;
        if (live && next) {
          // 0 while the next card is still below the fold, 1 once it has pinned on top.
          const from = window.innerHeight;
          const to = top + (i + 1) * step;
          p = Math.min(1, Math.max(0, (from - next.getBoundingClientRect().top) / (from - to)));
        }
        if (body) body.style.transform = p ? `scale(${1 - SHRINK * p})` : "";
        if (dim) dim.style.opacity = String(DIM * p);
      });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    compact.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      compact.removeEventListener("change", update);
    };
  }, [top, step]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * One card in a StackCards. `className` is for the grid item (spans etc.); `radius` should
 * match the card's own corners so the dimming follows them.
 */
export function StackCard({
  index,
  className = "",
  radius = "rounded-[24px]",
  top = 88,
  step = 14,
  children,
}: {
  index: number;
  className?: string;
  radius?: string;
  top?: number;
  step?: number;
  children: ReactNode;
}) {
  return (
    <div
      data-stack-card
      className={`max-sm:sticky max-sm:[top:var(--stack-top)] ${className}`}
      style={{ "--stack-top": `${top + index * step}px` } as CSSProperties}
    >
      <div data-stack-body className="relative h-full origin-top max-sm:will-change-transform">
        {children}
        <div
          data-stack-dim
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-20 bg-carbon opacity-0 sm:hidden ${radius}`}
        />
      </div>
    </div>
  );
}
