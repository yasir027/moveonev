"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface StatBlockProps {
  value: number;
  suffix: string; // "KM", "KM/H", "SEC", "H"
  label: string;
  decimals?: number;
}

export function StatBlock({ value, suffix, label, decimals = 0 }: StatBlockProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1200, bounce: 0 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${latest.toFixed(decimals)} ${suffix}`;
      }
    });
  }, [spring, suffix, decimals]);

  return (
    <div className="border-t border-carbon/10 py-8 first:border-t-0">
      <motion.p
        ref={ref}
        className="font-display text-4xl font-bold text-carbon lg:text-5xl"
      >
        0 {suffix}
      </motion.p>
      <p className="mt-2 text-sm text-carbon/45">{label}</p>
    </div>
  );
}
