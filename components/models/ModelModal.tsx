"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import {
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
  splitName,
  type BatteryId,
  type Model,
} from "@/lib/models";
import { ModelDetail } from "./ModelDetail";
import { ModelStage } from "./ModelStage";

/*
 * The popup. One white box in two sizes, with the same two columns in both:
 *   peek     — a rectangle on desktop, a bottom sheet on mobile. URL stays /models.
 *   expanded — the same box grown to fill the screen. URL becomes /models/<slug>.
 *
 * Left column: the stage (see ModelStage) — the scooter, tall, on an arc tinted with the
 * chosen finish. It is full-bleed, so the arc runs into the box's rounded corners.
 * Right column: name, price, description, then the two choices (finish, battery), the
 * USP chips and the booking row. Expanding grows the box and adds the full details below.
 *
 * The peek must fit a laptop viewport with no scrolling: the stage is at most 90svh and
 * the right column is kept compact enough to fit beside it.
 *
 * It is a single motion.div whose classes flip with `expanded`, never re-mounted, so
 * framer animates the size change. The card carries the same layoutId, which is what
 * makes the open seamless.
 *
 * Rendered by ModelCard through a portal. Don't mount it inside the grid directly: the
 * grid's reveal wrappers carry transforms, and position:fixed inside a transformed
 * ancestor is fixed to that ancestor rather than the screen.
 */

/* The four things worth a chip. Short labels so all four fit one row; the long form is
   the tooltip. The range one reads the selected pack, so it never claims 120 km while
   the 30AH is picked. */
const USP: { icon: LucideIcon; short: (range: string) => string; long: (range: string) => string }[] = [
  { icon: ShieldCheck, short: () => "No licence", long: () => "No licence · No RTO" },
  { icon: Route, short: (range) => range, long: (range) => `${range} range` },
  { icon: Undo2, short: () => "Reverse gear", long: () => "Reverse gear" },
  { icon: KeyRound, short: () => "NFC start", long: () => "Key, remote or NFC start" },
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
  const [nameLight, nameBold] = splitName(model.name);

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
            className="absolute inset-x-0 top-0 z-40 flex h-8 cursor-grab justify-center pt-2.5 sm:hidden"
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
            {/* No padding on the grid: the stage is full-bleed, and only the right
                column carries padding. */}
            <div className="grid w-full lg:grid-cols-[1.05fr_1fr]">
              {/* LEFT — the stage. `layout` counter-scales it during the morph so the
                  scooter doesn't visibly stretch. */}
              <motion.div layout className="min-w-0">
                <ModelStage
                  slides={slides}
                  alt={`MOVE ON ${model.name} in ${finish}`}
                  name={model.name}
                  color={FINISH[finish] ?? "#8A9199"}
                  className={
                    expanded
                      ? "h-[56svh] lg:h-svh"
                      : "h-[44svh] sm:h-[400px] lg:h-[min(90svh,640px)]"
                  }
                />
              </motion.div>

              {/* RIGHT — what it is, what it costs, the choices, and the way to book. */}
              <motion.div
                layout="position"
                className={[
                  "flex min-w-0 flex-col px-5 pb-6 pt-6 sm:px-8 sm:pb-8",
                  expanded
                    ? "lg:mx-auto lg:w-full lg:max-w-[560px] lg:justify-center lg:px-12 lg:py-20"
                    : "lg:pl-4 lg:pr-8 lg:pt-[30px]",
                ].join(" ")}
              >
                {/* Eyebrow. In the peek it shares a line with the icon buttons. */}
                <p className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-leaf">
                  MOVE ON · Electric scooter
                </p>

                <h3 className="mt-3 font-display text-[30px] leading-[1.05] tracking-[-0.03em] text-carbon lg:text-[36px]">
                  {nameLight && <span className="font-light">{nameLight} </span>}
                  <span className="font-bold">{nameBold}</span>
                </h3>

                {/* Price. The offer leads; the list price is struck through beside it. */}
                <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <span className="font-display text-[34px] font-extrabold leading-none tracking-[-0.04em] text-leaf lg:text-[38px]">
                    {formatPrice(price.offer)}
                  </span>
                  <span className="text-[18px] text-[#475569] line-through">
                    {formatPrice(price.mrp)}
                  </span>
                  <span className="rounded-full bg-volt px-3 py-1 font-display text-[13px] font-bold text-carbon">
                    Save {formatPrice(saving)}
                  </span>
                </div>

                <p
                  className={[
                    "mt-3 text-[15px] leading-relaxed text-[#475569]",
                    expanded ? "" : "line-clamp-2",
                  ].join(" ")}
                >
                  {model.blurb}
                </p>

                {/* Finish. The chosen name sits right beside the header, so the two read
                    as one label. Picking one re-tints the stage's arc. */}
                <div className="mt-5">
                  <p className="mb-2.5 flex items-baseline gap-3">
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
                            "h-8 w-8 rounded-full transition-shadow duration-200 ease-premium",
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

                {/* Battery — the choice that sets the price. The selected card is white
                    with a thick green border and a 5% green wash. Both states carry the
                    same 3px border, so picking one never shifts the layout. ev-green,
                    not volt: volt is ~1.4:1 on white and a selection border has to be
                    seen; ev-green is ~3.1:1. */}
                <div className="mt-5">
                  <p className={`${label} mb-2.5`}>Battery</p>
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
                            "rounded-[18px] border-[3px] px-4 py-3 text-left transition-colors duration-200 ease-premium",
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
                          <span className="mt-0.5 block text-[15px] font-semibold text-[#334155]">
                            {option.range}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* USPs — a row of round icon chips, short label under each. */}
                <ul className="mt-5 grid grid-cols-4 gap-2">
                  {USP.map(({ icon: Icon, short, long }) => (
                    <li
                      key={long(pack.range)}
                      title={long(pack.range)}
                      className="flex flex-col items-center gap-1.5 text-center"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-soft-grey">
                        <Icon size={18} strokeWidth={2.25} className="text-leaf" aria-hidden />
                      </span>
                      <span className="text-[12px] font-semibold leading-tight text-carbon">
                        {short(pack.range)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Booking row: the button takes the width, WhatsApp is the small round
                    one beside it. */}
                <div
                  className={[
                    "mt-6 flex items-center gap-3",
                    expanded ? "lg:mt-10" : "lg:mt-auto lg:pt-6",
                  ].join(" ")}
                >
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
                  className="lg:col-span-2"
                >
                  <div className="mx-auto w-full max-w-[1200px] border-t border-carbon/10 px-5 pb-12 pt-10 sm:px-8 lg:px-12 lg:pt-14">
                    <ModelDetail model={model} />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
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
