import Image from "next/image";
import {
  Activity,
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Bone,
  CheckCircle2,
  Droplets,
  Dumbbell,
  Gauge,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Star,
  Truck,
  Wallet,
} from "lucide-react";

import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { CompanionAppSection } from "@/components/commerce/companion-app-section";
import { ScaleUsageGuide } from "@/components/commerce/scale-usage-guide";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, FeatureCard } from "@/components/ui/card";
import { getProducts, getBrand } from "@/lib/cms/db";
import { homeCopy } from "@/lib/data/home-copy";
import { buildWhatsAppUrl } from "@/lib/cms/whatsapp";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

const offeringIcons = {
  scale: Gauge,
  muscle: Dumbbell,
  fat: Activity,
  water: Droplets,
  bone: Bone,
  chart: BarChart3,
} as const;

const trustIcons = [Truck, Wallet, ShieldCheck] as const;

export default async function Home() {
  const [allProducts, brand] = await Promise.all([getProducts(), getBrand()]);
  const product = allProducts[0];

  if (!product) {
    throw new Error("No products configured for the storefront.");
  }

  const whatsappOrderLink = buildWhatsAppUrl(
    brand.whatsapp,
    `سلام، بغيت نطلب ${product.title} بثمن ${product.price} درهم`,
  );

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-section-bg px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(5,150,105,0.08),transparent_60%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Badge variant="success">{homeCopy.hero.badge}</Badge>

            <h1 className="mt-6 text-[2.75rem] font-extrabold leading-[1.1] tracking-[-0.04em] text-heading sm:text-6xl lg:text-[3.75rem]">
              {homeCopy.hero.title}
            </h1>

            <p className="mt-7 max-w-xl text-[1.125rem] leading-[1.8] text-body">
              {homeCopy.hero.subtitle}
            </p>

            <div className="mt-8 flex items-end gap-4">
              <span className="text-5xl font-extrabold tracking-tight text-heading">
                {formatCurrency(product.price, product.currency)}
              </span>
              {product.compareAtPrice ? (
                <span className="pb-2 text-xl text-muted line-through" dir="ltr">
                  {formatCurrency(product.compareAtPrice, product.currency)}
                </span>
              ) : null}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href={`/products/${product.slug}`} size="lg" variant="primary">
                {homeCopy.hero.ctaBuy}
                <ArrowLeft className="h-5 w-5" />
              </ButtonLink>
              <ButtonLink href={whatsappOrderLink} size="lg" variant="secondary">
                <MessageCircle className="h-5 w-5" />
                {homeCopy.hero.ctaWhatsapp}
              </ButtonLink>
            </div>

            <div className="mt-8 flex flex-wrap gap-6">
              {homeCopy.hero.trust.map((label, index) => {
                const Icon = trustIcons[index];
                return (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2.5 text-[0.9375rem] font-medium text-body"
                  >
                    <Icon className="h-5 w-5 text-accent" />
                    {label}
                  </span>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2.5rem] border-2 border-border/50 bg-gradient-to-br from-background to-section-bg shadow-[0_20px_70px_rgba(15,23,42,0.15)]">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <Section
        background="white"
        eyebrow={homeCopy.offerings.eyebrow}
        title={homeCopy.offerings.title}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homeCopy.offerings.items.map((item) => {
            const Icon = offeringIcons[item.icon];
            return (
              <FeatureCard key={item.label} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-heading">{item.label}</h3>
              </FeatureCard>
            );
          })}
        </div>
      </Section>

      <Section background="gray" id="how" eyebrow={homeCopy.how.eyebrow} title={homeCopy.how.title}>
        <div className="grid gap-6 md:grid-cols-3">
          {homeCopy.how.steps.map((step, index) => (
            <Card key={step.title}>
              <span className="text-5xl font-extrabold text-border">{index + 1}</span>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-heading">{step.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-[1.7] text-body">{step.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section background="white" eyebrow={homeCopy.why.eyebrow} title={homeCopy.why.title}>
        <Card className="mx-auto max-w-3xl p-8">
          <ul className="grid gap-4 sm:grid-cols-2">
            {homeCopy.why.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base leading-7 text-body">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section background="gray" eyebrow={homeCopy.app.eyebrow} title={homeCopy.app.title}>
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeCopy.app.items.map((item) => (
            <Card key={item} className="p-5 text-center">
              <Smartphone className="mx-auto h-6 w-6 text-emerald-600" />
              <p className="mt-3 font-semibold text-heading">{item}</p>
            </Card>
          ))}
        </div>
      </Section>

      <CompanionAppSection />

      <Section background="white" eyebrow={homeCopy.safety.eyebrow} title={homeCopy.safety.title}>
        <Card className="mx-auto max-w-3xl border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-8 text-center sm:p-10">
          <BadgeCheck className="mx-auto h-10 w-10 text-emerald-600" />
          <p className="mt-5 text-lg leading-8 text-body sm:text-xl">{homeCopy.safety.body}</p>
        </Card>
      </Section>

      <ScaleUsageGuide whatsappUrl={whatsappOrderLink} />

      <Section background="gray" id="reviews" eyebrow={homeCopy.reviews.eyebrow} title={homeCopy.reviews.title}>
        <div className="grid gap-6 lg:grid-cols-3">
          {homeCopy.reviews.items.map((review, index) => (
            <Card key={review.quote} className="relative">
              <div className="flex gap-1.5 text-accent">
                {Array.from({ length: review.rating }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="mt-6 text-[1.0625rem] leading-[1.75] text-body">"{review.quote}"</p>
              <p className="mt-6 text-sm text-muted">زبون فيتارو {index + 1}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section background="white" id="faq" eyebrow={homeCopy.faq.eyebrow} title={homeCopy.faq.title}>
        <div className="mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
          {homeCopy.faq.items.map((faq) => (
            <details key={faq.question} className="group p-7">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-heading">
                {faq.question}
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 leading-[1.75] text-body">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section background="gray">
        <Card className="overflow-hidden bg-gradient-to-br from-accent to-accent-hover p-10 text-center text-white shadow-[0_20px_70px_rgba(5,150,105,0.3)] lg:p-16">
          <h2 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
            {homeCopy.finalCta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-[1.75] text-white/90">
            {homeCopy.finalCta.subtitle}
          </p>
          <p className="mt-8 text-5xl font-extrabold tracking-tight">
            {formatCurrency(product.price, product.currency)}{" "}
            <span className="text-2xl font-semibold text-white/85">
              {homeCopy.finalCta.priceLabel}
            </span>
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <ButtonLink
              href={`/products/${product.slug}`}
              size="xl"
              variant="secondary"
              className="bg-white text-accent hover:bg-white/95"
            >
              {homeCopy.finalCta.ctaBuy}
              <ArrowLeft className="h-5 w-5" />
            </ButtonLink>
            <ButtonLink
              href={whatsappOrderLink}
              size="xl"
              variant="outline"
              className="border-white/30 text-white hover:bg-white hover:text-accent"
            >
              <MessageCircle className="h-5 w-5" />
              {homeCopy.finalCta.ctaWhatsapp}
            </ButtonLink>
          </div>
        </Card>
      </Section>
    </>
  );
}
