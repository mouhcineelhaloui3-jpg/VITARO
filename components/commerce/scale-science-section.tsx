"use client";

import { motion } from "framer-motion";
import { Activity, Bone, Droplets, Dumbbell, ShieldCheck, Sparkles } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { scaleScience } from "@/lib/data/scale-science";

const metricIcons = [Dumbbell, Droplets, Bone, Activity] as const;

function BodyDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.16),transparent_58%)]" />

      <svg viewBox="0 0 320 360" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="pulseGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#34D399" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <rect x="40" y="300" width="240" height="18" rx="9" fill="#0F172A" opacity="0.92" />
        <rect x="70" y="306" width="36" height="6" rx="3" fill="#94A3B8" />
        <rect x="214" y="306" width="36" height="6" rx="3" fill="#94A3B8" />
        <ellipse cx="160" cy="118" rx="34" ry="38" fill="#1E293B" />
        <rect x="132" y="148" width="56" height="88" rx="22" fill="#1E293B" />
        <rect x="108" y="158" width="24" height="72" rx="12" fill="#334155" />
        <rect x="188" y="158" width="24" height="72" rx="12" fill="#334155" />
        <rect x="138" y="228" width="22" height="72" rx="11" fill="#334155" />
        <rect x="160" y="228" width="22" height="72" rx="11" fill="#334155" />

        <motion.path
          d="M160 318 L160 110"
          stroke="url(#pulseGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.35 }}
          animate={{ pathLength: 1, opacity: [0.35, 1, 0.35] }}
          transition={{
            pathLength: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </svg>

      <div className="pointer-events-none absolute inset-x-8 bottom-6 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-center backdrop-blur-sm">
        <p className="text-xs font-semibold text-emerald-100">تيار آمن · ما كتحسّش بيه</p>
      </div>
    </div>
  );
}

export function ScaleScienceSection() {
  return (
    <Section background="gray" id="how-scale-works" className="!pb-24 !pt-24 lg:!py-28">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <Badge variant="success">{scaleScience.eyebrow}</Badge>
        <h2 className="mt-6 text-[2.2rem] font-bold leading-[1.15] tracking-[-0.03em] text-heading sm:text-5xl">
          {scaleScience.title}
        </h2>
        <p className="mt-4 text-xl font-semibold text-emerald-700 sm:text-2xl">
          {scaleScience.tagline}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#0F172A] p-6 text-white shadow-[0_24px_70px_rgba(2,6,23,0.28)] sm:p-8">
          <BodyDiagram />
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {scaleScience.highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85"
              >
                {item}
              </span>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-6 sm:p-8">
            <p className="text-base leading-8 text-body sm:text-lg">{scaleScience.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {scaleScience.metrics.map((metric, index) => {
                const Icon = metricIcons[index];
                return (
                  <span
                    key={metric}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900"
                  >
                    <Icon className="h-4 w-4 text-emerald-600" />
                    {metric}
                  </span>
                );
              })}
            </div>
          </Card>

          <Card className="border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-emerald-500 p-3 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-heading">{scaleScience.bia.title}</h3>
                <p className="mt-3 text-sm leading-8 text-body sm:text-base">
                  {scaleScience.bia.body}
                </p>
              </div>
            </div>
          </Card>

          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-900">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>تقدر تستعملو كل يوم بلا قلق — التقنية آمنة ومريحة.</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
