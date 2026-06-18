import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
  glass?: boolean;
};

export function Card({ className, hover = true, glass = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-card p-8 shadow-[0_4px_24px_rgba(15,23,42,0.08)] transition-all duration-300",
        hover && "hover:-translate-y-1 hover:shadow-[0_12px_48px_rgba(15,23,42,0.12)]",
        glass && "backdrop-blur-xl bg-white/80",
        "border border-border/50",
        className,
      )}
      {...props}
    />
  );
}

export function FeatureCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden",
        "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-accent/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

export function ProductCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <Card
      className={cn(
        "group cursor-pointer p-0 overflow-hidden",
        "hover:border-accent/20",
        className,
      )}
      {...props}
    />
  );
}

export function GlassCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <Card
      className={cn("backdrop-blur-xl bg-white/80", className)}
      {...props}
    />
  );
}
