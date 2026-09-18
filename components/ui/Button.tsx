"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE_PREMIUM, DURATION } from "@/lib/motion";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  showArrow?: boolean;
}

/**
 * Primary  -> solid Volt Green, used for the single most important action per view
 * Secondary -> outlined carbon, used for the paired secondary action
 * Ghost     -> text-only, used inside dark (carbon) sections
 */
export function Button({
  variant = "primary",
  showArrow = true,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium font-body";

  const variants: Record<string, string> = {
    primary: "bg-volt text-carbon hover:bg-[#39b800]",
    secondary: "border border-carbon/15 text-carbon hover:border-carbon/40 bg-transparent",
    ghost: "text-white/90 hover:text-white bg-transparent",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: DURATION.fast, ease: EASE_PREMIUM }}
      className={`${base} ${variants[variant]} ${className} group`}
      {...(props as any)}
    >
      {children}
      {showArrow && (
        <ArrowRight
          size={16}
          className="transition-transform duration-fast ease-premium group-hover:translate-x-1"
        />
      )}
    </motion.button>
  );
}
