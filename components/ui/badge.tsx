import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "success" | "neutral" | "accent";
};

export function Badge({ className, variant = "success", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.8125rem] font-semibold uppercase tracking-[0.06em]",
        variant === "success" &&
          "bg-emerald-50 text-emerald-700 border border-emerald-200",
        variant === "neutral" &&
          "bg-section-bg text-body border border-border",
        variant === "accent" &&
          "bg-accent/10 text-accent border border-accent/20",
        className,
      )}
      {...props}
    />
  );
}
