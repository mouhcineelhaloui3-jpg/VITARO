"use client";

import { motion } from "framer-motion";
import { Activity, Bone, Droplets, Dumbbell, Zap } from "lucide-react";

import { biaMetricFields } from "@/lib/data/bia-fields";
import { cn } from "@/lib/utils";

const defaultFields = biaMetricFields;
const fieldIcons = [Activity, Dumbbell, Droplets, Bone, Zap, Activity] as const;

type BiaPulseVisualProps = {
  variant?: "light" | "dark";
  pulseLabel?: string;
  fields?: readonly string[];
  showFields?: boolean;
  className?: string;
};

export function BiaPulseVisual({
  variant = "light",
  pulseLabel = "إشارة خفيفة · غير محسوسة",
  fields = defaultFields,
  showFields = true,
  className,
}: BiaPulseVisualProps) {
  const isDark = variant === "dark";
  const gradientId = `biaPulse-${variant}`;

  return (
    <div className={cn("relative flex flex-col", className)}>
      <div className="relative flex min-h-[200px] items-center justify-center sm:min-h-[220px]">
        <div
          className={cn(
            "absolute inset-0 rounded-[1.75rem]",
            isDark
              ? "bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.18),transparent_65%)]"
              : "bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.12),transparent_65%)]",
          )}
        />

        <svg viewBox="0 0 280 120" className="w-full max-w-xs" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#34D399" stopOpacity="1" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          <motion.path
            d="M10 60 H70 L90 35 L110 85 L130 50 L150 70 L170 40 L190 75 L210 55 L230 60 H270"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: [0.4, 1, 0.4] }}
            transition={{
              pathLength: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {[70, 110, 150, 190].map((x, index) => (
            <motion.circle
              key={x}
              cx={x}
              cy={index % 2 === 0 ? 35 : 75}
              r="5"
              fill="#34D399"
              initial={{ scale: 0.6, opacity: 0.3 }}
              animate={{ scale: [0.6, 1.15, 0.6], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: index * 0.35,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>

        <motion.div
          className={cn(
            "absolute bottom-3 rounded-full border px-4 py-1.5 text-xs font-semibold backdrop-blur-sm",
            isDark
              ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
              : "border-emerald-200 bg-emerald-50 text-emerald-700",
          )}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {pulseLabel}
        </motion.div>
      </div>

      {showFields ? (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {fields.map((field, index) => {
            const Icon = fieldIcons[index];
            return (
              <motion.span
                key={field}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                  isDark
                    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                    : "border-emerald-100 bg-white text-emerald-800 shadow-sm",
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isDark ? "text-emerald-300" : "text-emerald-600")} />
                {field}
              </motion.span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
