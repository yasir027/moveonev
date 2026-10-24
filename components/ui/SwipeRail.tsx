"use client";

import { Children, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Phones and tablets: a row you swipe sideways. Cards snap into place, the next one peeks in
 * from the right, and a thin line underneath shows how far along you are. The row runs to the
 * screen edges (`bleed` cancels the section's side padding) while the first card still lines
 * up with the heading.
 *
 * Desktop (lg+): the same children in the grid you pass as `className`, untouched — prefix
 * every grid class with `lg:`.
 */
export function SwipeRail({
  className = "",
  itemClassName = "",
  bleed = "7vw",
  children,
}: {
  /** Desktop layout, all `lg:` classes, e.g. "lg:grid lg:grid-cols-4 lg:gap-6". */
  className?: string;
  /** Extra classes on each card's wrapper (e.g. `h-full`). */
  itemClassName?: string;
  /** The section's side padding on a phone, so the row can run past it to the screen edge. */
  bleed?: string;
  children: ReactNode;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rail.current;
    const bar = thumb.current;
    if (!el || !bar) return;

    function update() {
      const share = el!.clientWidth / el!.scrollWidth;
      const room = el!.scrollWidth - el!.clientWidth;
      const progress = room > 0 ? el!.scrollLeft / room : 0;
      bar!.style.width = `${Math.min(100, share * 100)}%`;
      // translateX is a share of the thumb's own width: slide it across what's left.
      bar!.style.transform = `translateX(${progress * (1 / share - 1) * 100}%)`;
    }

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div style={{ "--rail-bleed": bleed } as CSSProperties}>
      <div
        ref={rail}
        className={[
          "no-scrollbar",
          "max-lg:-mx-[var(--rail-bleed)] max-lg:flex max-lg:snap-x max-lg:snap-mandatory max-lg:gap-3 max-lg:overflow-x-auto max-lg:overscroll-x-contain max-lg:px-[var(--rail-bleed)] max-lg:pb-4 max-lg:pt-1 max-lg:scroll-px-[var(--rail-bleed)] sm:max-lg:gap-5",
          className,
        ].join(" ")}
      >
        {Children.map(children, (child) => (
          <div className={`min-w-0 max-lg:w-[78%] max-lg:shrink-0 max-lg:snap-start sm:max-lg:w-[46%] ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>

      <div aria-hidden className="mx-auto mt-4 h-[3px] w-20 overflow-hidden rounded-full bg-carbon/10 lg:hidden">
        <div ref={thumb} className="h-full w-1/2 rounded-full bg-carbon" />
      </div>
    </div>
  );
}
