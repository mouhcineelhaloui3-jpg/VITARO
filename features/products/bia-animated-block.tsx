"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { BiaPulseVisual } from "@/components/motion/bia-pulse-visual";
import { Reveal } from "@/components/motion/reveal";

type BiaAnimatedBlockProps = {
  body: string;
  image: string;
  imageAlt: string;
};

export function BiaAnimatedBlock({ body, image, imageAlt }: BiaAnimatedBlockProps) {
  return (
    <div className="mx-auto grid max-w-5xl items-center gap-6 overflow-hidden rounded-[2rem] border border-emerald-100/80 bg-gradient-to-br from-emerald-50/60 to-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-8 lg:grid-cols-2 lg:gap-8">
      <div className="space-y-4">
        <Reveal className="rounded-[1.5rem] border border-emerald-100/80 bg-white/80 p-4 backdrop-blur-sm">
          <BiaPulseVisual variant="light" />
        </Reveal>

        <Reveal delay={0.1} className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
          <Image src={image} alt={imageAlt} fill sizes="(max-width: 1024px) 90vw, 480px" className="object-cover" />
        </Reveal>
      </div>

      <Reveal delay={0.15} className="lg:p-2">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg leading-8 text-body"
        >
          {body}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800"
        >
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          آمن للاستعمال اليومي
        </motion.div>
      </Reveal>
    </div>
  );
}
