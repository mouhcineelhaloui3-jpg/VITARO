"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const heroStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

type MotionShellProps = {
  children: ReactNode;
  className?: string;
};

export function HeroStagger({ children, className }: MotionShellProps) {
  return (
    <motion.div variants={heroStagger} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}

export function HeroStaggerItem({ children, className }: MotionShellProps) {
  return (
    <motion.div variants={heroItem} className={className}>
      {children}
    </motion.div>
  );
}

type CtaFocusProps = MotionShellProps & {
  tone?: "emerald" | "light";
  fullWidth?: boolean;
};

/** Draws the eye to primary buy CTAs without touching header/footer chrome. */
export function CtaFocus({ children, className, tone = "emerald", fullWidth }: CtaFocusProps) {
  const glow = tone === "light" ? "bg-white/30" : "bg-emerald-500/30";

  return (
    <motion.div
      className={cn(
        "relative inline-flex",
        fullWidth ? "w-full" : "w-full sm:w-auto",
        className,
      )}
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.988 }}
      transition={{ type: "spring", stiffness: 440, damping: 26 }}
    >
      <motion.span
        aria-hidden
        className={cn("pointer-events-none absolute -inset-1 rounded-[1rem] blur-lg", glow)}
        animate={{ opacity: [0.3, 0.72, 0.3], scale: [0.96, 1.05, 0.96] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className={cn(
          "cta-shimmer relative z-[1] w-full [&_a]:w-full [&_a]:hover:translate-y-0 sm:[&_a]:w-auto",
          fullWidth && "[&_a]:w-full",
        )}
      >
        {children}
      </span>
    </motion.div>
  );
}

export function ProductShowcase({ children, className }: MotionShellProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95, y: 28 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function UrgencyPulse({ children, className }: MotionShellProps) {
  return (
    <motion.span
      className={cn("inline-flex", className)}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}

export function StickyBuyBar({ children, className }: MotionShellProps) {
  return (
    <motion.div
      className={className}
      initial={{ y: 72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function FinalCtaReveal({ children, className }: MotionShellProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl"
        animate={{ opacity: [0.25, 0.5, 0.25], x: [0, 12, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {children}
    </motion.div>
  );
}

export function BuyBoxReveal({ children, className }: MotionShellProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
