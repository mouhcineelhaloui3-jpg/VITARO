"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Footprints,
  HelpCircle,
  Smartphone,
  Sparkles,
} from "lucide-react";

import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { scaleUsageGuide } from "@/lib/data/scale-usage-guide";
import type { SectionSpacingPreset } from "@/lib/cms/layout-spacing";
import { resolveSectionSpacing } from "@/lib/cms/layout-spacing";

type ScaleUsageGuideProps = {
  whatsappUrl?: string;
  spacing?: SectionSpacingPreset | ReturnType<typeof resolveSectionSpacing>;
};

export function ScaleUsageGuide({ whatsappUrl, spacing }: ScaleUsageGuideProps) {
  return (
    <Section
      id="usage-guide"
      background="white"
      spacing={spacing}
      eyebrow={scaleUsageGuide.eyebrow}
      title={scaleUsageGuide.title}
      description={scaleUsageGuide.description}
    >
      <Card className="mb-8 border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-emerald-500 p-3 text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold text-heading">مرحباً — هاد الشرح خاص بالزبون</p>
            <p className="mt-2 text-sm leading-7 text-body sm:text-base">{scaleUsageGuide.intro}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {scaleUsageGuide.steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-500 text-lg font-bold text-white shadow-[0_8px_24px_rgba(5,150,105,0.25)]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-heading">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-body">{step.body}</p>
                  <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs leading-6 text-emerald-900">
                    <strong>نصيحة:</strong> {step.tip}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="border-emerald-200 bg-emerald-50/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-heading">دير هادشي (مهم)</h3>
          </div>
          <ul className="space-y-3">
            {scaleUsageGuide.dos.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-body">
                <Footprints className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border-red-200 bg-red-50/40 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Ban className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-bold text-heading">ما تديرش هادشي</h3>
          </div>
          <ul className="space-y-3">
            {scaleUsageGuide.donts.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-body">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-10">
        <div className="mb-5 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-emerald-600" />
          <h3 className="text-xl font-bold text-heading">أسئلة شائعة من الزبناء</h3>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {scaleUsageGuide.mistakes.map((item) => (
            <Card key={item.question} className="p-5">
              <p className="font-semibold text-heading">{item.question}</p>
              <p className="mt-3 text-sm leading-7 text-body">{item.answer}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="mt-10 overflow-hidden bg-gradient-to-br from-heading to-heading/90 p-8 text-center text-white sm:p-10">
        <Smartphone className="mx-auto h-8 w-8 text-emerald-300" />
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
          {scaleUsageGuide.support}
        </p>
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1fb855]"
          >
            ساعدني فواتساب
          </a>
        ) : null}
      </Card>
    </Section>
  );
}
