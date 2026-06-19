"use client";

import { motion } from "framer-motion";
import { Activity, Bone, Droplets, Dumbbell, ShieldCheck, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { homeBiaCopy } from "@/lib/data/home-bia-copy";

const fieldIcons = [Activity, Dumbbell, Droplets, Bone, Zap, Activity] as const;

function BiaPulse() {
  return (
    <div className="relative flex h-full min-h-[220px] items-center justify-center">
      <div className="absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.18),transparent_65%)]" />

      <svg viewBox="0 0 280 120" className="w-full max-w-xs" aria-hidden="true">
        <defs>
          <linearGradient id="biaPulse" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#34D399" stopOpacity="1" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <motion.path
          d="M10 60 H70 L90 35 L110 85 L130 50 L150 70 L170 40 L190 75 L210 55 L230 60 H270"
          fill="none"
          stroke="url(#biaPulse)"
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
        className="absolute bottom-3 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 backdrop-blur-sm"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {homeBiaCopy.pulseLabel}
      </motion.div>
    </div>
  );
}

export function HomeBiaBanner() {
  return (
    <section className="px-4 pb-10 pt-2 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border border-emerald-100/80 bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#0F172A] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.2)] sm:p-8 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-8">
          <div className="relative rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <BiaPulse />
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {homeBiaCopy.fields.map((field, index) => {
                const Icon = fieldIcons[index];
                return (
                  <motion.span
                    key={field}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.45 }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-100"
                  >
                    <Icon className="h-3.5 w-3.5 text-emerald-300" />
                    {field}
                  </motion.span>
                );
              })}
            </div>
          </div>

          <div className="mt-6 text-white lg:mt-0">
            <Badge variant="success" className="border-emerald-400/30 bg-emerald-500/15 text-emerald-100">
              {homeBiaCopy.badge}
            </Badge>
            <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">{homeBiaCopy.title}</h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-4 text-base leading-8 text-white/85 sm:text-lg"
            >
              {homeBiaCopy.body}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-100"
            >
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" />
              آمن للاستعمال اليومي
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
