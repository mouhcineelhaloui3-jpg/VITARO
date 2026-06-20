import Image from "next/image";
import { BarChart3, Activity, Bluetooth, Smartphone, Users } from "lucide-react";

import { Section } from "@/components/layout/section";
import { BiaAnimatedBlock } from "@/features/products/bia-animated-block";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { companionApp } from "@/lib/data/companion-app";
import { productPageCopy } from "@/lib/data/product-page-copy";
import type { SectionSpacingPreset } from "@/lib/cms/layout-spacing";
import { resolveSectionSpacing } from "@/lib/cms/layout-spacing";
import type { Product } from "@/types/commerce";

const appFeatureIcons = [BarChart3, Activity, Bluetooth, Smartphone, Users] as const;

type ProductPageSectionsProps = {
  product: Product;
  spacing?: SectionSpacingPreset | ReturnType<typeof resolveSectionSpacing>;
};

export function ProductPageSections({ product, spacing }: ProductPageSectionsProps) {
  const specRows = product.specifications.flatMap((group) =>
    group.items.map((item) => ({ group: group.group, ...item })),
  );

  return (
    <>
      <Section
        spacing={spacing}
        eyebrow={productPageCopy.why.eyebrow}
        title={productPageCopy.why.title}
        className="bg-section-bg/50"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {productPageCopy.why.cards.map((card) => (
            <Card
              key={card.title}
              className="border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-md transition hover:-translate-y-0.5"
            >
              <h3 className="text-lg font-bold tracking-tight text-heading">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-body">{card.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section spacing={spacing} eyebrow={productPageCopy.included.eyebrow} title={productPageCopy.included.title}>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {productPageCopy.included.items.map((item) => (
            <div
              key={item.label}
              className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/60 shadow-[0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur-md"
            >
              <div className="relative aspect-square">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  sizes="(max-width: 640px) 90vw, 320px"
                  className="object-cover"
                />
              </div>
              <p className="px-4 py-5 text-center text-lg font-semibold text-heading">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        spacing={spacing}
        eyebrow={productPageCopy.how.eyebrow}
        title={productPageCopy.how.title}
        className="bg-section-bg/50"
      >
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {productPageCopy.how.steps.map((step, index) => (
            <div
              key={step.title}
              className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.07)]"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 1024px) 90vw, 380px"
                  className="object-cover"
                />
                <span className="absolute start-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-[0.2em] text-emerald-700 backdrop-blur-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-heading">{step.title}</h3>
                <p className="mt-2 text-sm text-body">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing={spacing} eyebrow={productPageCopy.bia.eyebrow} title={productPageCopy.bia.title}>
        <BiaAnimatedBlock
          body={productPageCopy.bia.body}
          image={productPageCopy.bia.image}
          imageAlt="استعمال ميزان فيتارو"
        />
      </Section>

      <Section
        id="app"
        spacing={spacing}
        eyebrow={productPageCopy.app.eyebrow}
        title={productPageCopy.app.title}
        className="bg-section-bg/50"
      >
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/70 shadow-[0_30px_90px_rgba(15,23,42,0.1)]">
            <Image
              src={productPageCopy.app.image}
              alt={`تطبيق ${companionApp.name}`}
              fill
              sizes="(max-width: 1024px) 90vw, 420px"
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <p className="text-2xl font-bold text-heading">{companionApp.name}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {productPageCopy.app.features.map((feature, index) => {
                const Icon = appFeatureIcons[index];
                return (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-4 py-3 backdrop-blur-sm"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-sm font-medium text-heading">{feature}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href={productPageCopy.app.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="flex-1"
              >
                {productPageCopy.app.playStoreLabel}
              </ButtonLink>
              <ButtonLink
                href={productPageCopy.app.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                variant="secondary"
                className="flex-1"
              >
                {productPageCopy.app.appStoreLabel}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section spacing={spacing} eyebrow={productPageCopy.specs.eyebrow} title={productPageCopy.specs.title}>
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-right">
                <th className="px-6 py-4 font-semibold text-heading">المواصفة</th>
                <th className="px-6 py-4 font-semibold text-heading">القيمة</th>
              </tr>
            </thead>
            <tbody>
              {specRows.map((row) => (
                <tr
                  key={`${row.group}-${row.label}`}
                  className="border-b border-slate-100/80 last:border-0"
                >
                  <td className="px-6 py-4 text-muted-fg">{row.label}</td>
                  <td className="px-6 py-4 text-left font-semibold text-heading sm:text-right">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        spacing={spacing}
        eyebrow={productPageCopy.faq.eyebrow}
        title={productPageCopy.faq.title}
        className="bg-section-bg/50"
      >
        <div className="mx-auto max-w-3xl divide-y divide-slate-200/80 overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 backdrop-blur-md">
          {productPageCopy.faq.items.map((faq) => (
            <details key={faq.q} className="group p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-heading">
                {faq.q}
                <span className="text-xl text-emerald-600 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-body">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section spacing={spacing} eyebrow={productPageCopy.reviews.eyebrow} title={productPageCopy.reviews.title}>
        <div className="grid gap-5 lg:grid-cols-3">
          {productPageCopy.reviews.items.map((review) => (
            <Card
              key={review.name}
              className="border-white/70 bg-white/70 p-6 backdrop-blur-md"
            >
              <p className="text-sm leading-7 text-body">"{review.quote}"</p>
              <p className="mt-5 font-semibold text-heading">{review.name}</p>
              <p className="text-sm text-muted-fg">{review.city}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
