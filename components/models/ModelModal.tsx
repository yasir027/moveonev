"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, type PanInfo } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  KeyRound,
  Maximize2,
  Minimize2,
  Route,
  ShieldCheck,
  Undo2,
  X,
  type LucideIcon,
} from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/heroModels";
import { EASE_PREMIUM } from "@/lib/motion";
import {
  BATTERIES,
  FINISH,
  formatPrice,
  type BatteryId,
  type Model,
} from "@/lib/models";
import { ModelDetail } from "./ModelDetail";

/*
 * The popup. One white box in two sizes, with the same two columns in both:
 *   peek     — a rectangle on desktop, a bottom sheet on mobile. URL stays /models.
 *   expanded — the same box grown to fill the screen. URL becomes /models/<slug>.
 *
 * Left column: the photo carousel, the finish picker, then the four USP badges. Right
 * column: price, description, the battery picker (right under the price it changes) and
 * the booking row. Because the columns don't change between the two sizes, expanding
 * only grows the box and adds the full details below.
 *
 * The peek must fit a laptop viewport with no scrolling. Every block is fixed height
 * except the carousel, which takes whatever is left of 90svh (see PhotoCarousel).
 *
 * It is a single motion.div whose classes flip with `expanded`, never re-mounted, so
 * framer animates the size change. The card carries the same layoutId, which is what
 * makes the open seamless.
 *
 * Rendered by ModelCard through a portal. Don't mount it inside the grid directly: the
 * grid's reveal wrappers carry transforms, and position:fixed inside a transformed
 * ancestor is fixed to that ancestor rather than the screen.
 */

/* The four things worth a badge. The range one reads the selected pack, so it never
   claims 120 km while the 30AH is picked. */
const USP: { icon: LucideIcon; label: (range: string) => string }[] = [
  { icon: ShieldCheck, label: () => "No licence · No RTO" },
  { icon: Route, label: (range) => `${range} range` },
  { icon: Undo2, label: () => "Reverse gear" },
  { icon: KeyRound, label: () => "Key, remote or NFC start" },
];

export function ModelModal({
  model,
  onClose,
}: {
  model: Model;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [finish, setFinish] = useState(model.finishes[0]);
  const [battery, setBattery] = useState<BatteryId>("30ah");

  /* Set while a close is waiting on history.back(), so the popstate handler knows to
     finish closing rather than just collapse. */
  const closing = useRef(false);

  const pack = BATTERIES.find((b) => b.id === battery) ?? BATTERIES[0];
  const price = model.pricing[battery];
  const saving = price.mrp - price.offer;

  /* The carousel's slides. With real angles in `gallery` they show here; until then the
     same photo repeats, so the carousel can be built and judged now. A finish that has
     its own photo replaces the first slide. */
  const base = model.gallery?.length
    ? model.gallery
    : model.image
      ? [model.image, model.image, model.image]
      : [];
  const slides = base.map((src, i) =>
    i === 0 ? (model.colorImages?.[finish] ?? src) : src,
  );

  /* Pre-filled, so the enquiry arrives already saying which scooter, colour and pack. */
  const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi MOVE ON, I'd like to book a test ride of the ${model.name} (${finish}, ${pack.label}).`,
  )}`;

  /* ---- URL ------------------------------------------------------------------ */

  const expand = useCallback(() => {
    setExpanded(true);
    window.history.pushState({ model: true }, "", `/models/${model.slug}`);
  }, [model.slug]);

  /* Collapsing is "go back": it pops the entry expand() pushed, and popstate flips the
     state. The browser's own back button takes the same path, so there is one route to
     the collapsed state rather than two. */
  const collapse = useCallback(() => {
    window.history.back();
  }, []);

  /* Closing from expanded has to pop the URL too, or the address bar is left on
     /models/<slug> with the modal gone. */
  const close = useCallback(() => {
    if (expanded) {
      closing.current = true;
      window.history.back();
    } else {
      onClose();
    }
  }, [expanded, onClose]);

  useEffect(() => {
    function onPop() {
      if (closing.current) {
        closing.current = false;
        onClose();
      } else {
        setExpanded(false);
      }
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [onClose]);

  /* ---- Page behaviour ------------------------------------------------------- */

  /* Lock page scroll while open. */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /* Escape steps back one level: expanded → peek → closed. */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (expanded) collapse();
      else close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, collapse, close]);

  /* Swipe the handle: up expands, down collapses (or closes from the peek). */
  function onHandlePanEnd(_: unknown, info: PanInfo) {
    if (info.offset.y < -40) {
      if (!expanded) expand();
    } else if (info.offset.y > 60) {
      if (expanded) collapse();
      else close();
    }
  }

  const iconBtn =
    "flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-carbon shadow-[inset_0_0_0_1px_rgb(16_20_18/0.1)] transition-colors duration-200 hover:bg-carbon hover:text-volt";

  const label =
    "font-display text-[12px] font-bold uppercase tracking-[0.14em] text-[#475569]";

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-0 z-[60] bg-carbon/45 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE_PREMIUM }}
        onClick={close}
      />

      {/* The wrapper handles placement, so the dialog itself never needs translate
          classes that would fight framer's transform. Its padding drops to 0 on expand
          and the dialog's layout animation absorbs the change. */}
      <div
        className={[
          "pointer-events-none fixed inset-0 z-[70] flex justify-center",
          expanded ? "items-stretch p-0" : "items-end p-3 sm:items-center sm:p-6",
        ].join(" ")}
      >
        <motion.div
          layoutId={`model-${model.slug}`}
          transition={{ duration: 0.55, ease: EASE_PREMIUM }}
          style={{ borderRadius: expanded ? 0 : 28 }}
          role="dialog"
          aria-modal="true"
          aria-label={model.name}
          className={[
            "pointer-events-auto relative flex flex-col overflow-hidden bg-white shadow-[0_40px_100px_-30px_rgba(16,20,18,0.45)]",
            expanded
              ? "h-full w-full"
              : "max-h-[90svh] w-full max-w-full sm:w-[600px] lg:w-[1000px]",
          ].join(" ")}
        >
          {/* Drag handle, mobile only */}
          <motion.div
            onPanEnd={onHandlePanEnd}
            style={{ touchAction: "none" }}
            className="absolute inset-x-0 top-0 z-20 flex h-8 cursor-grab justify-center pt-2.5 sm:hidden"
          >
            <span className="h-1 w-10 rounded-full bg-carbon/20" />
          </motion.div>

          <div className="absolute right-4 top-4 z-30 flex gap-2">
            <button
              type="button"
              onClick={expanded ? collapse : expand}
              aria-label={expanded ? "Collapse" : "Expand"}
              className={iconBtn}
            >
              {expanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>
            {/* A plain anchor: a new tab is a fresh page load, so there is nothing for
                client-side routing to do. */}
            <a
              href={`/models/${model.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in a new tab"
              className={iconBtn}
            >
              <ExternalLink size={17} />
            </a>
            <button type="button" onClick={close} aria-label="Close" className={iconBtn}>
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* No scrollbar at all. The peek is sized to fit a laptop viewport, so on one it
              has nothing to scroll; the expanded view and short or mobile screens still
              scroll by wheel and touch, just without a bar. Both spellings: Chrome 121+
              honours scrollbar-width, older WebKit needs the pseudo-element. */}
          <div className="flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div
              className={[
                "grid w-full gap-6 lg:grid-cols-[1.05fr_1fr]",
                expanded
                  ? "mx-auto max-w-[1200px] p-5 pt-16 sm:p-8 sm:pt-20 lg:gap-14 lg:p-12 lg:pt-20"
                  : "p-5 pt-16 sm:p-6 sm:pt-16 lg:gap-10 lg:p-8 lg:pt-16",
              ].join(" ")}
            >
              {/* LEFT — the photos, then the finish. `layout` counter-scales the
                  contents during the morph so they don't visibly stretch. */}
              <motion.div layout className="min-w-0">
                <PhotoCarousel
                  slides={slides}
                  alt={`MOVE ON ${model.name} in ${finish}`}
                  compact={!expanded}
                />

                {/* Finish. The chosen name sits right beside the header, so the two
                    read as one label. */}
                <div className="mt-5">
                  <p className="mb-3 flex items-baseline gap-3">
                    <span className={label}>Finish</span>
                    <span className="text-[15px] font-semibold text-carbon">{finish}</span>
                  </p>
                  <div role="radiogroup" aria-label="Finish" className="flex flex-wrap gap-3">
                    {model.finishes.map((name) => {
                      const active = name === finish;
                      return (
                        <button
                          key={name}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          aria-label={name}
                          title={name}
                          onClick={() => setFinish(name)}
                          className={[
                            "h-9 w-9 rounded-full transition-shadow duration-200 ease-premium",
                            active
                              ? "ring-2 ring-carbon ring-offset-2"
                              : "ring-1 ring-carbon/15 hover:ring-carbon/40",
                          ].join(" ")}
                          style={{ backgroundColor: FINISH[name] ?? "#8A9199" }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* The four USPs sit under the photo and finish, which balances the two
                    columns. Below lg they render in the right column instead (see
                    there), so on a phone the price and battery still come before them. */}
                <UspGrid range={pack.range} className="mt-5 hidden lg:grid" />
              </motion.div>

              {/* RIGHT — what it costs, the choice that sets it, and the way to book. */}
              <motion.div layout="position" className="flex min-w-0 flex-col">
                <h3 className="font-display text-[28px] font-bold leading-[1.05] tracking-[-0.03em] text-carbon lg:text-[34px]">
                  {model.name}
                </h3>

                {/* Price. The offer leads; the list price is struck through beside it. */}
                <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <span className="font-display text-[34px] font-extrabold leading-none tracking-[-0.04em] text-leaf lg:text-[40px]">
                    {formatPrice(price.offer)}
                  </span>
                  <span className="text-[18px] text-[#475569] line-through">
                    {formatPrice(price.mrp)}
                  </span>
                  <span className="rounded-full bg-volt px-3 py-1 font-display text-[13px] font-bold text-carbon">
                    Save {formatPrice(saving)}
                  </span>
                </div>

                <p className="mt-4 text-[16px] leading-relaxed text-[#475569]">
                  {model.blurb}
                </p>

                {/* Battery — directly under the price it changes. The selected card is
                    white with a thick green border and a 5% green wash. Both states
                    carry the same 3px border, so picking one never shifts the layout.
                    ev-green, not volt: volt is ~1.4:1 on white and a selection border
                    has to be seen; ev-green is ~3.1:1. */}
                <div className="mt-6">
                  <p className={`${label} mb-3`}>Battery</p>
                  <div role="radiogroup" aria-label="Battery" className="grid grid-cols-2 gap-3">
                    {BATTERIES.map((option) => {
                      const active = option.id === battery;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setBattery(option.id)}
                          className={[
                            "rounded-[18px] border-[3px] px-4 py-3.5 text-left transition-colors duration-200 ease-premium",
                            active
                              ? "border-ev-green bg-ev-green/5"
                              : "border-carbon/10 bg-white hover:border-carbon/25",
                          ].join(" ")}
                        >
                          <span className="block font-display text-[17px] font-bold tracking-tight text-carbon">
                            {option.id === "30ah" ? "30AH" : "45AH"}
                          </span>
                          {/* The range is what the choice is about, so it carries the
                              weight: semibold, in the darker slate. */}
                          <span className="mt-1 block text-[16px] font-semibold text-[#334155]">
                            {option.range}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <UspGrid range={pack.range} className="mt-6 grid lg:hidden" />

                {/* Booking row: the button takes the width, WhatsApp is the small round
                    one beside it. */}
                <div className="mt-8 flex items-center gap-3 lg:mt-auto lg:pt-8">
                  <a
                    href="/#book"
                    className="flex-1 rounded-full bg-volt px-6 py-4 text-center font-display text-[16px] font-bold text-carbon transition-colors duration-200 hover:bg-carbon hover:text-white"
                  >
                    Book a test ride
                  </a>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Chat about the ${model.name} on WhatsApp`}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-carbon text-white transition-colors duration-200 hover:bg-volt hover:text-carbon"
                  >
                    <WhatsAppIcon className="h-6 w-6" />
                  </a>
                </div>
              </motion.div>

              {/* Expanded only, spanning both columns: these are full-width sections, and
                  squeezed into one column they would be a long narrow strip. Waits for
                  the box to finish growing, then fades in, so the content never lands in
                  a container that is still moving. */}
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE_PREMIUM, delay: 0.3 }}
                  className="border-t border-carbon/10 pt-10 lg:col-span-2"
                >
                  <ModelDetail model={model} />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* =========================================================
   PHOTO CAROUSEL
   Native scroll-snap, so touch swipe, momentum and snapping come from the browser
   rather than from a drag handler that would fight the modal's own gestures. Arrows
   appear on hover; the dots are always there.
========================================================= */

function PhotoCarousel({
  slides,
  alt,
  compact,
}: {
  slides: string[];
  alt: string;
  /** The peek: on desktop the height follows the viewport, so the whole modal fits. */
  compact: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

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
    "absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-carbon opacity-0 shadow-[0_6px_18px_-6px_rgba(16,20,18,0.35)] transition-[opacity,background-color,color] duration-200 hover:bg-carbon hover:text-volt focus-visible:opacity-100 group-hover:opacity-100";

  return (
    /* Everything else in the peek is fixed height (~340px with the dialog's padding), so
       the photo takes whatever is left of 90svh, between 180px and its natural 4:3. That
       is the only reason the modal fits a short laptop screen without a scrollbar. */
    <div
      className={[
        "group relative w-full overflow-hidden rounded-[20px] bg-soft-grey",
        compact
          ? "aspect-[4/3] lg:aspect-auto lg:h-[clamp(180px,calc(90svh-340px),344px)]"
          : "aspect-[4/3]",
      ].join(" ")}
    >
      <div
        ref={track}
        onScroll={onScroll}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${alt}, photos`}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              {/* Floor: tight contact ellipse plus a wide ambient one. */}
              <div
                aria-hidden
                className="absolute bottom-[12%] left-1/2 h-5 w-[58%] -translate-x-1/2 rounded-[50%] bg-carbon/15 blur-2xl"
              />
              <div
                aria-hidden
                className="absolute bottom-[15%] left-1/2 h-2 w-[30%] -translate-x-1/2 rounded-[50%] bg-carbon/25 blur-lg"
              />
              <Image
                src={src}
                alt={i === 0 ? alt : ""}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 500px, 90vw"
                className="relative z-10 object-contain p-4 drop-shadow-[0_18px_18px_rgba(0,0,0,0.14)]"
              />
            </div>
          ))
        ) : (
          <div className="flex h-full w-full shrink-0 items-center justify-center font-display text-[12px] font-bold tracking-[0.25em] text-carbon/30">
            IMAGE PENDING
          </div>
        )}
      </div>

      {index > 0 && (
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous photo"
          className={`${arrow} left-3`}
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
      )}
      {index < slides.length - 1 && (
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next photo"
          className={`${arrow} right-3`}
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      )}

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-2 z-20 flex justify-center">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Photo ${i + 1} of ${slides.length}`}
              aria-current={i === index}
              /* The button is the hit area; the pill inside is what's drawn. */
              className="p-1.5"
            >
              <span
                className={[
                  "block h-2 rounded-full transition-all duration-300 ease-premium",
                  i === index ? "w-6 bg-carbon" : "w-2 bg-carbon/25",
                ].join(" ")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* The four USP badges. Rendered twice — under the photo on desktop, under the battery on
   mobile — with the caller choosing the display class, so only one is ever visible and
   the hidden one drops out of the accessibility tree. */
function UspGrid({ range, className }: { range: string; className: string }) {
  return (
    <ul className={`grid-cols-2 gap-2.5 ${className}`}>
      {USP.map(({ icon: Icon, label }) => (
        <li
          key={label(range)}
          className="flex items-center gap-2.5 rounded-[16px] bg-soft-grey px-3.5 py-3"
        >
          <Icon size={18} strokeWidth={2.25} className="shrink-0 text-leaf" aria-hidden />
          {/* Already full carbon, which is darker than the slate used elsewhere. */}
          <span className="text-[14px] font-semibold leading-tight text-carbon">
            {label(range)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* lucide dropped its brand icons, so the WhatsApp mark is drawn inline. */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}