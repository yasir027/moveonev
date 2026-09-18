"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { EASE_PREMIUM } from "@/lib/motion";

const LINKS = ["Models", "Technology", "About", "Experience"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      animate={{
        paddingTop: scrolled ? "0.75rem" : "1.5rem",
        paddingBottom: scrolled ? "0.75rem" : "1.5rem",
      }}
      transition={{ duration: 0.35, ease: EASE_PREMIUM }}
      className={`fixed top-0 z-50 w-full px-8 transition-colors duration-standard ease-premium ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-[0_1px_0_0_rgba(16,20,18,0.06)]"
          : "bg-white/0"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <span className="font-display text-lg font-bold tracking-tight">
          MOVE ON
        </span>

        <ul className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className="text-sm text-carbon/70 transition-colors duration-fast hover:text-carbon"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <Button variant="primary" showArrow={false} className="px-5 py-2.5 text-xs">
          Book test ride
        </Button>
      </nav>
    </motion.header>
  );
}
