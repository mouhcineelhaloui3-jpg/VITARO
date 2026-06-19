import Image from "next/image";
import { Bluetooth, Download, Smartphone } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { companionApp } from "@/lib/data/companion-app";

type CompanionAppSectionProps = {
  showImage?: boolean;
  className?: string;
};

export function CompanionAppSection({
  showImage = true,
  className = "",
}: CompanionAppSectionProps) {
  return (
    <Section
      background="white"
      eyebrow={companionApp.eyebrow}
      title={companionApp.title}
      description={companionApp.description}
      className={className}
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <Card className="overflow-hidden border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="success">Bluetooth</Badge>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <Bluetooth className="h-4 w-4" />
              متصل بالميزان
            </span>
          </div>

          <h3 className="mt-5 text-2xl font-bold tracking-tight text-heading">
            {companionApp.name}
          </h3>

          <p className="mt-4 text-[0.98rem] leading-7 text-body">
            هاد هو التطبيق اللي خاصك باش تستافد من كل مؤشرات الميزان. ما كاينش سلك —
            كيتصل مباشرة بالبلوتوث وكيعرض ليك النتائج بوضوح.
          </p>

          <ul className="mt-6 space-y-3">
            {companionApp.highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-body">
                <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={companionApp.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="primary"
              className="flex-1"
            >
              <Download className="h-5 w-5" />
              {companionApp.playStoreLabel}
            </ButtonLink>
            <ButtonLink
              href={companionApp.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="secondary"
              className="flex-1"
            >
              <Download className="h-5 w-5" />
              {companionApp.appStoreLabel}
            </ButtonLink>
          </div>
        </Card>

        <div className="space-y-4">
          {showImage ? (
            <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-section-bg">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/products/product-app-premium.png"
                  alt="تطبيق OKOK متصل بالميزان عبر البلوتوث"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}

          <div className="grid gap-4">
            {companionApp.steps.map((step, index) => (
              <Card key={step} className="flex gap-4 p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-500 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-7 text-body">{step}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
