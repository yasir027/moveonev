"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ComponentProps } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

/**
 * Moving between pages (concept v7, Scene 6, tier 3): no fullscreen loader. The header
 * stays put, its logo redraws and recharges as the progress indicator, a thin green line
 * runs under the header, and the old content slides out as the new page slides in.
 *
 * Use <TransitionLink> for links to other pages; plain hash links are unaffected.
 */

const NavigateContext = createContext<(href: string) => void>(() => {});

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function headerParts() {
  const logo = document.querySelector("svg[data-brand-logo]");
  return {
    progress: document.querySelector<HTMLElement>("[data-route-progress]"),
    charge: logo?.querySelector("[data-logo-charge]") ?? null,
    stroke: logo?.querySelector("[data-logo-stroke]") ?? null,
    strokes: [...(logo?.querySelectorAll<SVGPathElement>("[data-logo-stroke] path") ?? [])],
  };
}

/** The header logo redraws and refills from the bottom, like a battery charging. */
function rechargeHeader() {
  const { progress, charge, stroke, strokes } = headerParts();
  const tl = gsap.timeline();
  if (progress) {
    tl.fromTo(progress, { scaleX: 0, opacity: 1 }, { scaleX: 0.6, duration: 0.3, ease: "power2.out" }, 0);
  }
  if (charge) {
    const c = { h: 0 };
    tl.to(c, {
      h: 770,
      duration: 0.6,
      ease: "power1.inOut",
      onUpdate() {
        charge.setAttribute("y", (910 - c.h).toFixed(1));
        charge.setAttribute("height", c.h.toFixed(1));
      },
    }, 0.02);
  }
  if (stroke) {
    tl.set(stroke, { opacity: 1 }, 0);
    strokes.forEach((p) => {
      const len = p.getTotalLength();
      tl.fromTo(p, { attr: { "stroke-dasharray": len, "stroke-dashoffset": len } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.5, ease: "power1.inOut" }, 0);
    });
    tl.to(stroke, { opacity: 0, duration: 0.2 }, 0.55);
  }
  return tl;
}

function finishProgress() {
  const { progress } = headerParts();
  if (!progress) return;
  gsap.timeline()
    .to(progress, { scaleX: 1, duration: 0.2, ease: "power2.in" })
    .to(progress, { opacity: 0, duration: 0.2 }, "+=0.01");
}

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const wrap = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const busy = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      if (busy.current) return;
      if (reducedMotion() || !wrap.current) {
        router.push(href);
        return;
      }
      busy.current = true;
      rechargeHeader();
      gsap.to(wrap.current, {
        autoAlpha: 0,
        y: -24,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => router.push(href),
      });
    },
    [router],
  );

  // The new page has rendered: slide it in and finish the progress line.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    busy.current = false;
    if (!wrap.current) return;
    finishProgress();
    gsap.fromTo(
      wrap.current,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", clearProps: "all" },
    );
  }, [pathname]);

  return (
    <NavigateContext.Provider value={navigate}>
      <div ref={wrap} data-intro="page">
        {children}
      </div>
    </NavigateContext.Provider>
  );
}

/** A next/link that plays the route transition before navigating. */
export function TransitionLink({ onNavigate, ...props }: ComponentProps<typeof Link>) {
  const navigate = useContext(NavigateContext);
  return (
    <Link
      {...props}
      onNavigate={(e) => {
        onNavigate?.(e);
        const href = typeof props.href === "string" ? props.href : (props.href.pathname ?? "/");
        if (href === window.location.pathname) return;
        e.preventDefault();
        navigate(href);
      }}
    />
  );
}
