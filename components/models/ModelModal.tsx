"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type PanInfo } from "framer-motion";
import { ExternalLink, Maximize2, X } from "lucide-react";
import { skipNextRouteTransition } from "@/components/loader/RouteTransition";
import { EASE_PREMIUM } from "@/lib/motion";
import type { BatteryId, Model } from "@/lib/models";
import { ModelView } from "./ModelView";

/*
 * The popup shell: overlay, placement, the three icon buttons and the grow animation.
 * What's inside is ModelView, the same component the real page renders.
 *   peek     — a rectangle on desktop, a bottom sheet on mobile. URL stays /models.
 *   expanded — the box grown to fill the screen; once it has, we navigate to
 *              /models/<slug>, a real server-rendered page showing the same ModelView.
 *
 * The peek must fit a laptop viewport with no scrolling. It is a single motion.div whose
 * classes flip with `expanded`, never re-mounted, so framer animates the size change.
 * The card carries the same layoutId, which is what makes the open seamless.
 *
 * Rendered by ModelCard through a portal. Don't mount it inside the grid directly: the
 * grid's reveal wrappers carry transforms, and position:fixed inside a transformed
 * ancestor is fixed to that ancestor rather than the screen.
 */

export function ModelModal({
  model,
  initialBattery,
  onClose,
}: {
  model: Model;
  /** The battery the card was priced at, so the popup opens on the same price. */
  initialBattery?: BatteryId;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const href = `/models/${model.slug}`;

  /* The visitor's picks, handed to the page in the URL so it opens on the same ones. */
  const choice = useRef({ finish: model.finishes[0], battery: initialBattery ?? "30ah" });
  const onChoice = useCallback((finish: string, battery: BatteryId) => {
    choice.current = { finish, battery };
  }, []);

  /* Warm the page up while the popup is open, so the hand-over below is instant. */
  useEffect(() => {
    router.prefetch(href);
  }, [router, href]);

  /* The pending hand-over. Closing mid-grow (Escape, the backdrop) cancels it: close()
     below clears it at once, since AnimatePresence keeps us mounted through the exit
     animation, past the moment it would fire. */
  const handover = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(handover.current), []);

  /* Expand: grow to full screen, then hand over to the real page. The page renders the
     same ModelView as this popup's expanded state, so the swap is invisible: the window
     jumps to the top behind the popup (no smooth scroll on the new page) and the route
     transition's slide-in is skipped (no blank frame). */
  const goToPage = useCallback(() => {
    setExpanded(true);
    handover.current = window.setTimeout(() => {
      const { finish, battery } = choice.current;
      const query = new URLSearchParams();
      if (finish !== model.finishes[0]) query.set("finish", finish);
      if (battery !== "30ah") query.set("battery", battery);
      const search = query.toString();
      window.scrollTo({ top: 0, behavior: "instant" });
      skipNextRouteTransition();
      router.push(search ? `${href}?${search}` : href);
    }, 520);
  }, [router, href, model.finishes]);

  const close = useCallback(() => {
    window.clearTimeout(handover.current);
    onClose();
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

  /* Escape closes. */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  /* Swipe the handle: up expands to the page, down closes. */
  function onHandlePanEnd(_: unknown, info: PanInfo) {
    if (info.offset.y < -40) {
      if (!expanded) goToPage();
    } else if (info.offset.y > 60) {
      close();
    }
  }

  const iconBtn =
    "flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-carbon shadow-[inset_0_0_0_1px_rgb(16_20_18/0.1)] transition-colors duration-200 hover:bg-carbon hover:text-volt";

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
          expanded ? "items-stretch p-0" : "items-end p-3 sm:items-center sm:p-6 lg:p-4",
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
              : "max-h-[90svh] w-full max-w-full sm:w-[600px] lg:max-h-[calc(100svh-4rem)] lg:w-[880px]",
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

          {/* Above the drag handle (z-40): it spans the full width, and beneath it the
              buttons only took taps on their bottom edge. */}
          <div className="absolute right-4 top-2 z-50 flex gap-2">
            <button
              type="button"
              onClick={goToPage}
              disabled={expanded}
              aria-label="Open full page"
              className={iconBtn}
            >
              <Maximize2 size={17} />
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
          {/* Expanded, the top padding matches the page's navbar clearance (its <main>
              pt-[88px]), so nothing moves when the page takes over. */}
          <div
            className={[
              "flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              expanded ? "pt-[88px]" : "",
            ].join(" ")}
          >
            <ModelView
              model={model}
              expanded={expanded}
              initialBattery={initialBattery}
              onChange={onChoice}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}