"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { TransitionLink } from "@/components/loader/RouteTransition";
import { HANDOVER_EVENT, isHandover } from "@/lib/handover";
import { EASE_PREMIUM, usePrefersReducedMotion } from "@/lib/motion";
import { SHOWROOM } from "@/lib/showroom";

/** Scrolled this share of a screen before the pill shows: past the top section. */
const SHOW_AFTER = 0.7;

/**
 * Where the page already offers booking or contact, the pill steps aside: the home booking
 * form, the contact page's form, "Come ride one" and the footer.
 */
const OWN_CTA = '#book, #message, [data-footer-lead], footer';

/**
 * A small glass pill fixed at the bottom of every page: Book now, and Contact us (Call, on
 * /contact itself). Hidden at the top of the page, over the sections above, and during the
 * model popup's hand-over.
 *
 * Mounted beside the Navbar in RouteTransition's `header`, so it sits outside the sliding
 * page (a transformed ancestor would break `fixed`) and inside the context TransitionLink
 * needs. The glass is the navbar's (.glass-nav / -dark, picked by the same dark-section probe)
 * but not .glass-liquid, whose shared turbulence would smear a surface this size.
 */
export function FloatingCta() {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const vh = window.innerHeight;

      /* Queried per frame, not cached: the pill outlives page changes, and each page brings
         its own sections. */
      const covered = [...document.querySelectorAll<HTMLElement>(OWN_CTA)].some((el) => {
        const r = el.getBoundingClientRect();
        return r.top < vh && r.bottom > 0;
      });
      setVisible(window.scrollY > vh * SHOW_AFTER && !covered && !isHandover());

      // The pill's own middle line, as the Navbar probes its own.
      const box = ref.current?.getBoundingClientRect();
      const probe = box && box.height ? box.top + box.height / 2 : vh - 44;
      const dark = [...document.querySelectorAll<HTMLElement>('[data-theme="dark"]')].some(
        (el) => {
          const r = el.getBoundingClientRect();
          return r.top <= probe && r.bottom >= probe;
        },
      );
      setOnDark(dark);
    }

    function onChange() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    window.addEventListener(HANDOVER_EVENT, onChange);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
      window.removeEventListener(HANDOVER_EVENT, onChange);
    };
    // A new page starts at the top with new sections: check again.
  }, [pathname]);

  const onContact = pathname === "/contact";
  const ghost = `inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-display text-[14px] font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt sm:px-5 sm:text-[15px] ${
    onDark ? "text-white/85 hover:text-white" : "text-carbon/80 hover:text-carbon"
  }`;
  const primary =
    "group inline-flex items-center gap-2 rounded-full bg-volt px-5 py-2.5 font-display text-[14px] font-bold text-carbon transition-colors duration-300 hover:bg-[#6ee62f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carbon sm:px-6 sm:text-[15px]";

  const bookLabel = (
    <>
      Book now
      <ArrowRight
        size={16}
        strokeWidth={2.75}
        aria-hidden
        className="transition-transform duration-300 ease-premium group-hover:translate-x-0.5"
      />
    </>
  );

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-x-0 z-40 flex justify-center px-4"
      style={{ bottom: "max(16px, env(safe-area-inset-bottom))" }}
    >
      <AnimatePresence>
        {visible && (
          <motion.nav
            aria-label="Quick actions"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
            transition={{ duration: 0.4, ease: EASE_PREMIUM }}
            /* The navbar's rim and shadow, but frosted denser than its 20% white: this pill
               floats over body copy, and its labels have to stay readable over it. */
            className={`pointer-events-auto flex items-center gap-1 rounded-full p-1.5 backdrop-blur-xl ${
              onDark ? "glass-nav-dark bg-carbon/55" : "glass-nav bg-white/70"
            }`}
          >
            {onContact ? (
              <a href={`tel:${SHOWROOM.phone.tel}`} className={ghost}>
                <Phone size={15} strokeWidth={2.5} aria-hidden />
                Call
              </a>
            ) : (
              <TransitionLink href="/contact" className={ghost}>
                Contact us
              </TransitionLink>
            )}
            {pathname === "/" ? (
              /* Scrolled by hand, like the hero's own buttons: a bare #book jump did not move
                 this page. The href stays for middle-click and no-JS. */
              <a
                href="#book"
                className={primary}
                onClick={(e) => {
                  const form = document.getElementById("book");
                  if (!form) return;
                  e.preventDefault();
                  form.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
                }}
              >
                {bookLabel}
              </a>
            ) : (
              <Link href="/#book" className={primary}>
                {bookLabel}
              </Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
