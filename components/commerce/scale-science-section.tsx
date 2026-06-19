"use client";

import { motion } from "framer-motion";
import { Activity, Bone, Droplets, Dumbbell, ShieldCheck, Zap } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { scaleScience } from "@/lib/data/scale-science";

const compositionIcons = {
  muscle: Dumbbell,
  water: Droplets,
  bone: Bone,
  fat: Activity,
} as const;

function BodyDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.18),transparent_55%)]" />

      <svg viewBox="0 0 320 360" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="pulseGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#34D399" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="40" y="300" width="240" height="18" rx="9" fill="#0F172A" opacity="0.9" />
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
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: [0.35, 1, 0.35] }}
          transition={{
            pathLength: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {[95, 145, 195, 245].map((y, index) => (
          <motion.circle
            key={y}
            cx="160"
            cy={y}
            r="5"
            fill="#34D399"
            initial={{ opacity: 0.2, scale: 0.8 }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              delay: index * 0.35,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      <div className="pointer-events-none absolute inset-x-8 bottom-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-center backdrop-blur-sm">
        <p className="text-xs font-semibold text-emerald-100">تيار آمن · غير محسوس</p>
      </div>
    </div>
  );
}

export function ScaleScienceSection() {
  return (
    <Section
      background="gray"
      id="how-scale-works"
      eyebrow={scaleScience.eyebrow}
      title={scaleScience.title}
      description={scaleScience.description}
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#0F172A] p-6 text-white shadow-[0_30px_80px_rgba(2,6,23,0.35)] sm:p-10">
          <div className="absolute -left-16 top-0 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl" />

          <div className="relative">
            <Badge variant="success">BIA Technology</Badge>
            <h3 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
              تيار كهربائي خفيف كيمشي فالمسارات ديال الجسم
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              بحال ما كيتسال سوال فالوريد — ما كيضرّش. الميزان كيرسل إشارة دقيقة من
              المستشعرات، وكل نوع من الأنسجة كيعطي مقاومة مختلفة. من هاد الفرق كنعرفو
              نسب العضلات، العظام، الماء والشحم.
            </p>

            <BodyDiagram />

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {scaleScience.pulseSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-sm font-bold text-emerald-300">
                    {index + 1}
                  </div>
                  <p className="font-semibold text-white">{step.title}</p>
                  <p className="mt-2 text-xs leading-6 text-white/65">{step.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <Card className="border-emerald-100 bg-white p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-heading">{scaleScience.safety.title}</h3>
                <p className="mt-2 text-sm leading-7 text-body">{scaleScience.safety.body}</p>
              </div>
            </div>
          </Card>

          <Card className="flex-1 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-heading">ماذا يكشف التحليل؟</h3>
            </div>

            <div className="space-y-4">
              {scaleScience.composition.map((item, index) => {
                const Icon = compositionIcons[item.id];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-2xl border border-border bg-section-bg/60 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="grid h-10 w-10 place-items-center rounded-xl text-white"
                          style={{ backgroundColor: item.color }}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-heading">{item.label}</p>
                          <p className="text-xs text-muted-fg">{item.hint}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-heading">~{item.share}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.share}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <p className="mt-6 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs leading-6 text-emerald-900">
              النسب فالرسم توضيحية للفكرة العامة. القيم الحقيقية ديالك كتظهر فالتطبيق
              حسب طولك، عمرك، وجنسك — تحليل شخصي دقيق.
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
}
