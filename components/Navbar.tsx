"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { TransitionLink } from "@/components/loader/RouteTransition";
import { whatsappUrl } from "@/lib/heroModels";
import { EASE_PREMIUM } from "@/lib/motion";

const LINKS = ["Models", "Technology", "About", "Experience"];

const MORPH = { duration: 0.5, ease: EASE_PREMIUM };

/**
 * Full-width and transparent at the top of the page; once scrolled it morphs into a
 * compact floating pill of near-transparent liquid glass.
 *
 * The pill also inverts over dark sections. A light pill carries `text-carbon` links,
 * which drop to ~1.8:1 against a carbon background — unreadable. Sections opt in by
 * marking themselves `data-theme="dark"`.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      /* Queried per scroll, not cached at mount: the header lives in the layout and mounts
         before the page's sections exist, so a cached list is empty forever. */
      const darkSections = document.querySelectorAll<HTMLElement>('[data-theme="dark"]');

      /* Probe the navbar's own middle rather than the viewport top: that is the line the
         pill actually sits on, and it keeps working as the pill morphs height. */
      const rect = navRef.current?.getBoundingClientRect();
      const probe = rect ? rect.top + rect.height / 2 : 40;

      let dark = false;
      for (const section of darkSections) {
        const r = section.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) {
          dark = true;
          break;
        }
      }
      setOnDark(dark);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      <motion.nav
        ref={navRef}
        layout
        data-intro="nav"
        transition={MORPH}
        style={{ borderRadius: scrolled ? 9999 : 0 }}
        className={`pointer-events-auto relative flex items-center justify-between overflow-hidden ${
          scrolled
            ? `glass-liquid ${onDark ? "glass-nav-dark" : "glass-nav"} mt-3 w-[min(920px,calc(100%-1.5rem))] py-2 pl-5 pr-2`
            : "w-full px-[max(1.5rem,3vw)] py-5"
        }`}
      >
        <motion.div layout transition={MORPH}>
          <TransitionLink href="/" aria-label="MoveOn home">
            <Logo header tone={onDark ? "dark" : "light"} className={`block w-auto ${scrolled ? "h-7" : "h-8 sm:h-10"}`} />
          </TransitionLink>
        </motion.div>

        <motion.ul layout="position" transition={MORPH} className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className={`font-medium transition-colors duration-300 ${
                  onDark ? "text-white/85 hover:text-white" : "text-carbon/85 hover:text-carbon"
                } ${scrolled ? "text-sm" : "text-[15px]"}`}
              >
                {link}
              </a>
            </li>
          ))}
        </motion.ul>

        <motion.a
          layout="position"
          transition={MORPH}
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-full font-display font-semibold transition-colors duration-300 ${
            onDark
              ? "bg-volt text-carbon hover:bg-[#6ee62f]"
              : "bg-carbon text-white hover:bg-[#1f2622]"
          } ${scrolled ? "px-5 py-2.5 text-[13px]" : "px-6 py-3 text-sm"}`}
        >
          Book test ride
        </motion.a>

        {/* Route-change progress line (see RouteTransition). */}
        <div
          data-route-progress
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-lime"
        />
      </motion.nav>
    </header>
  );
}
