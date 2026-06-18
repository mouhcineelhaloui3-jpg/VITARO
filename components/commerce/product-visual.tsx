import { Activity, Bluetooth, Scale, Smartphone } from "lucide-react";

import { Card, GlassCard } from "@/components/ui/card";
import type { Product } from "@/types/commerce";

export function ProductVisual({ product }: { product: Product }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-border bg-[radial-gradient(circle_at_50%_12%,#ffffff,#f4f4f5_40%,#e4e4e7)] p-6 shadow-[0_45px_110px_rgba(17,17,17,0.12)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_50%_12%,#3f3f46,#18181b_45%,#09090b)]">
      <div className="premium-grid absolute inset-0 opacity-60" />
      <div className="absolute left-8 top-8 z-10">
        <GlassCard className="flex items-center gap-3 rounded-3xl p-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500 text-white">
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-surface-muted">
              Body score
            </p>
            <p className="text-xl font-semibold tracking-tight text-surface-heading">92</p>
          </div>
        </GlassCard>
      </div>

      <div className="absolute bottom-8 right-8 z-10">
        <GlassCard className="rounded-3xl p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-surface-heading">
            <Bluetooth className="h-4 w-4 text-emerald-500" />
            App sync ready
          </div>
          <div className="mt-3 h-2 w-40 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
            <div className="h-full w-[78%] rounded-full bg-emerald-500" />
          </div>
        </GlassCard>
      </div>

      <div
        data-surface="dark"
        className="float-slow absolute left-1/2 top-[49%] h-[56%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[3rem] bg-surface p-5 shadow-[0_55px_120px_rgba(2,6,23,0.45)]"
      >
        <div className="h-full rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.22),rgba(255,255,255,0.06)_32%,rgba(0,0,0,0.15)_70%)] p-5">
          <div className="mx-auto mt-4 h-2 w-24 rounded-full bg-white/15" />
          <div className="mt-12 text-center text-surface-heading">
            <Scale className="mx-auto h-10 w-10 text-emerald-400" />
            <p className="mt-5 text-6xl font-semibold tracking-[-0.08em]">72.4</p>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-surface-muted">
              kg
            </p>
          </div>
          <div className="absolute bottom-8 left-1/2 grid w-[72%] -translate-x-1/2 grid-cols-3 gap-2">
            {product.metrics.slice(0, 3).map((metric) => (
              <div key={metric.label} className="rounded-2xl bg-white/10 p-3 text-center">
                <p className="text-sm font-semibold text-surface-heading">{metric.value}</p>
                <p className="mt-1 truncate text-[10px] uppercase tracking-[0.14em] text-surface-muted">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="pulse-ring absolute bottom-10 left-8 z-10 rounded-3xl p-4">
        <div className="relative flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#020617] text-white dark:bg-white dark:text-[#0f172a]">
            <Smartphone className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-surface-muted">
              Trend
            </p>
            <p className="font-semibold text-surface-heading">-8% body fat</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
