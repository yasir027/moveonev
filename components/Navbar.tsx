"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { TransitionLink } from "@/components/loader/RouteTransition";
import { NavGlassFilter } from "@/components/ui/NavGlassFilter";
import { HANDOVER_EVENT } from "@/lib/handover";
import { whatsappUrl } from "@/lib/heroModels";
import { EASE_PREMIUM, usePrefersReducedMotion } from "@/lib/motion";
import { SHOWROOM } from "@/lib/showroom";

const LINKS = [
  { label: "Models", href: "/models" },
  { label: "Technology", href: "/technology" },
  { label: "About", href: "/about" },
  { label: "Blogs", href: "/blogs" },
];

const MORPH = { duration: 0.5, ease: EASE_PREMIUM };

// The mobile menu panel unrolls downward from the bar.
const CLIP_SHUT = "inset(0% 0% 100% 0% round 28px)";
const CLIP_OPEN = "inset(0% 0% 0% 0% round 28px)";

/**
 * Full-width and transparent at the top of the page; once scrolled it morphs into a
 * compact floating pill of near-transparent liquid glass.
 *
 * The pill also inverts over dark sections. A light pill carries `text-carbon` links,
 * which drop to ~1.8:1 against a carbon background — unreadable. Sections opt in by
 * marking themselves `data-theme="dark"`.
 */
export function Navbar() {
  const [scrolledRaw, setScrolled] = useState(false);
  const [onDarkRaw, setOnDark] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  /* While the model popup grows into its page (lib/handover.ts), show the form the page
     will have at its top: full width, light. It morphs there as it fades in over the
     popup, so nothing changes when the route swaps underneath. */
  const [handover, setHandover] = useState(false);
  /* Phones get the links in a drop-down panel under the bar (below md the row is hidden). */
  const [menuRaw, setMenuOpen] = useState(false);
  useEffect(() => {
    const onHandover = (e: Event) => {
      const on = (e as CustomEvent<boolean>).detail;
      setHandover(on);
      if (on) setMenuOpen(false);
    };
    window.addEventListener(HANDOVER_EVENT, onHandover);
    return () => window.removeEventListener(HANDOVER_EVENT, onHandover);
  }, []);
  const scrolled = scrolledRaw && !handover;
  const onDark = onDarkRaw && !handover;

  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  // Links close it on tap; a hand-over into a model page closes it too.
  const menuOpen = menuRaw && !handover;

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    // Widening past md shows the desktop row; the panel would be stranded open.
    const desktop = window.matchMedia("(min-width: 768px)");
    const onWide = () => desktop.matches && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onWide);
    // The page underneath stays put while the panel is open.
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onWide);
      root.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

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

  /*
   * While the pill morphs, framer writes a transform: scale() on it — which stretches the
   * refracted backdrop and visibly smears the rim. `data-morphing` drops the pill back to a
   * plain blur until it settles.
   *
   * Timed off MORPH rather than framer's onLayoutAnimationComplete: the nav's children carry
   * their own `layout`, so the parent's animation gets interrupted and re-started, and the
   * complete callback can simply never arrive — which leaves the attribute stuck on and the
   * refraction switched off for good.
   */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    nav.setAttribute("data-morphing", "");
    const settle = window.setTimeout(
      () => nav.removeAttribute("data-morphing"),
      MORPH.duration * 1000,
    );
    return () => window.clearTimeout(settle);
  }, [scrolled]);

  return (
    <header
      data-site-header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center"
    >
      {/* Builds the pill's refraction map against navRef. Mounted here rather than in the
          layout beside GlassFilter so it can take the ref directly. */}
      <NavGlassFilter targetRef={navRef} />
      <motion.nav
        ref={navRef}
        layout
        data-intro="nav"
        transition={MORPH}
        style={{ borderRadius: scrolled ? 9999 : 0 }}
        className={`pointer-events-auto relative flex items-center justify-between overflow-hidden ${
          scrolled
            ? `glass-liquid ${onDark ? "glass-nav-dark" : "glass-nav"} mt-3 w-[min(920px,calc(100%-1.5rem))] py-4 pl-7 pr-5`
            : "w-full px-[max(1.5rem,3vw)] py-5"
        }`}
      >
        <motion.div layout transition={MORPH}>
          <TransitionLink href="/" aria-label="MoveOn home">
            <Logo header tone={onDark ? "dark" : "light"} className={`block w-auto ${scrolled ? "h-7 sm:h-9" : "h-9 sm:h-12"}`} />
          </TransitionLink>
        </motion.div>

        {/* No gap: each link carries its own side padding, sized so the row is exactly as
            wide as it was at 25px/18px with gap-8 — the labels shrank, the navbar didn't.
            Padding rather than gap also widens each link's click target. */}
        <motion.ul layout="position" transition={MORPH} className="hidden items-center md:flex">
  {LINKS.map((link) => {
    const className = `inline-block font-medium transition-colors duration-300 ${
      onDark ? "text-white/85 hover:text-white" : "text-carbon/85 hover:text-carbon"
    } ${scrolled ? "px-[18.5px] text-[15px]" : "px-[22.85px] text-[20px]"}`;

    return (
      <li key={link.href}>
        {link.href.startsWith("#") ? (
          <a href={link.href} className={className}>
            {link.label}
          </a>
        ) : (
          <TransitionLink href={link.href} className={className}>
            {link.label}
          </TransitionLink>
        )}
      </li>
    );
  })}
</motion.ul>

        <motion.div layout="position" transition={MORPH} className="flex shrink-0 items-center gap-2">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={`shrink-0 whitespace-nowrap rounded-full font-display font-semibold transition-colors duration-300 ${
              onDark
                ? "bg-volt text-carbon hover:bg-[#6ee62f]"
                : "bg-carbon text-white hover:bg-[#1f2622]"
            } ${
              scrolled
                ? "px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-[15px]"
                : "px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-[17px]"
            }`}
          >
            {/* Shorter on phones, where it shares the row with the menu button. */}
            <span className="sm:hidden">Test ride</span>
            <span className="hidden sm:inline">Book test ride</span>
          </a>

          {/* Two bars that cross into an X. Phones only. */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={`relative grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt md:hidden ${
              onDark ? "bg-white/10 text-white hover:bg-white/15" : "bg-carbon/[0.06] text-carbon hover:bg-carbon/10"
            }`}
          >
            <span
              aria-hidden
              className={`absolute h-[2px] w-[18px] rounded-full bg-current transition-transform duration-300 ease-premium ${
                menuOpen ? "rotate-45" : "-translate-y-[4px]"
              }`}
            />
            <span
              aria-hidden
              className={`absolute h-[2px] w-[18px] rounded-full bg-current transition-transform duration-300 ease-premium ${
                menuOpen ? "-rotate-45" : "translate-y-[4px]"
              }`}
            />
          </button>
        </motion.div>

        {/* Route-change progress line (see RouteTransition). */}
        <div
          data-route-progress
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-lime"
        />
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Tap outside to close. Behind the bar: it comes first and isn't positioned. */}
            <motion.div
              key="menu-scrim"
              aria-hidden
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-auto fixed inset-0 -z-10 bg-carbon/25 md:hidden"
            />

            {/* Opacity and clip-path only: a transform here would switch off its own blur. */}
            <motion.div
              key="menu-panel"
              id="mobile-menu"
              initial={{ opacity: 0, clipPath: reducedMotion ? CLIP_OPEN : CLIP_SHUT }}
              animate={{ opacity: 1, clipPath: CLIP_OPEN }}
              exit={{ opacity: 0, clipPath: reducedMotion ? CLIP_OPEN : CLIP_SHUT }}
              transition={{ duration: 0.45, ease: EASE_PREMIUM }}
              /* Frosted denser than the bar, like the floating Book now pill: the labels have to
                 read over whatever page is underneath. */
              className={`pointer-events-auto absolute inset-x-3 top-[calc(100%+0.5rem)] rounded-[28px] p-2 backdrop-blur-xl md:hidden ${
                onDark ? "glass-nav-dark bg-carbon/75 text-white" : "glass-nav bg-white/85 text-carbon"
              }`}
            >
              <ul>
                {LINKS.map((link, i) => {
                  const current = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: EASE_PREMIUM, delay: 0.06 + i * 0.05 }}
                    >
                      <TransitionLink
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={current ? "page" : undefined}
                        className={`group flex items-center justify-between rounded-[20px] px-5 py-4 font-display text-[26px] font-semibold tracking-tight transition-colors duration-300 ${
                          onDark ? "hover:bg-white/[0.06]" : "hover:bg-carbon/[0.04]"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {link.label}
                          {current && <span aria-hidden className="size-2 rounded-full bg-volt" />}
                        </span>
                        <ArrowRight
                          size={20}
                          strokeWidth={2.25}
                          aria-hidden
                          className={`transition-transform duration-300 ease-premium group-hover:translate-x-0.5 ${
                            onDark ? "text-white/40" : "text-carbon/35"
                          }`}
                        />
                      </TransitionLink>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.06 + LINKS.length * 0.05 }}
                className={`mx-3 mt-1 flex items-center justify-between gap-3 border-t py-4 pl-2 ${
                  onDark ? "border-white/10" : "border-carbon/10"
                }`}
              >
                <div className="min-w-0 text-[13px] leading-snug">
                  <p className="font-semibold">{SHOWROOM.area}, {SHOWROOM.city}</p>
                  <p className={onDark ? "text-white/60" : "text-carbon/60"}>{SHOWROOM.hours.label}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <TransitionLink
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors duration-300 ${
                      onDark ? "bg-white/10 hover:bg-white/15" : "bg-carbon/[0.06] hover:bg-carbon/10"
                    }`}
                  >
                    Contact
                  </TransitionLink>
                  <a
                    href={`tel:${SHOWROOM.phone.tel}`}
                    aria-label={`Call ${SHOWROOM.phone.display}`}
                    className="grid size-9 place-items-center rounded-full bg-volt text-carbon transition-colors duration-300 hover:bg-[#6ee62f]"
                  >
                    <Phone size={15} strokeWidth={2.5} aria-hidden />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
