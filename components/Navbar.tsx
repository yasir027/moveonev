"use client";

import { useEffect, useState } from "react";
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
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      <motion.nav
        layout
        data-intro="nav"
        transition={MORPH}
        style={{ borderRadius: scrolled ? 9999 : 0 }}
        className={`pointer-events-auto relative flex items-center justify-between overflow-hidden ${
          scrolled
            ? "glass-liquid glass-nav mt-3 w-[min(920px,calc(100%-1.5rem))] py-2 pl-5 pr-2"
            : "w-full px-[max(1.5rem,3vw)] py-5"
        }`}
      >
        <motion.div layout transition={MORPH}>
          <TransitionLink href="/" aria-label="MoveOn home">
            <Logo header className={`block w-auto ${scrolled ? "h-7" : "h-8 sm:h-10"}`} />
          </TransitionLink>
        </motion.div>

        <motion.ul layout="position" transition={MORPH} className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className={`font-medium text-carbon/85 transition-colors duration-fast hover:text-carbon ${
                  scrolled ? "text-sm" : "text-[15px]"
                }`}
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
          className={`rounded-full bg-carbon font-display font-semibold text-white transition-colors duration-300 hover:bg-[#1f2622] ${
            scrolled ? "px-5 py-2.5 text-[13px]" : "px-6 py-3 text-sm"
          }`}
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
