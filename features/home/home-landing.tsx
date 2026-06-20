"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Bluetooth,
  Bone,
  Droplets,
  Dumbbell,
  Gauge,
  LineChart,
  MessageCircle,
  ShieldCheck,
  Star,
  Truck,
  Users,
  Wallet,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import {
  CtaFocus,
  FinalCtaReveal,
  HeroStagger,
  HeroStaggerItem,
  ProductShowcase,
  StickyBuyBar,
  UrgencyPulse,
} from "@/components/motion/dtc-motion";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { homeLandingCopy } from "@/lib/data/home-landing-copy";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/commerce";
import { resolveSectionSpacing } from "@/lib/cms/layout-spacing";

type HomeLandingProps = {
  product: Product;
  whatsappUrl: string;
  spacing: ReturnType<typeof resolveSectionSpacing>;
};

const metricIcons = {
  weight: Gauge,
  fat: Activity,
  muscle: Dumbbell,
  water: Droplets,
  bone: Bone,
  chart: BarChart3,
} as const;

const trustIcons = [Users, Gauge, ShieldCheck, MessageCircle] as const;
const heroTrustIcons = [Wallet, Truck, ShieldCheck] as const;
const appIcons = [LineChart, BarChart3, Bluetooth, Gauge, Users] as const;

function sectionPad(spacing: HomeLandingProps["spacing"]) {
  return spacing.section;
}

function headerPad(spacing: HomeLandingProps["spacing"]) {
  return spacing.header;
}

function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function HomeLanding({ product, whatsappUrl, spacing }: HomeLandingProps) {
  const copy = homeLandingCopy;
  const productUrl = `/products/${product.slug}`;
  const discount = discountPercent(product.price, product.compareAtPrice);
  const pad = sectionPad(spacing);
  const headPad = headerPad(spacing);

  return (
    <>
      <section className="relative flex min-h-[100svh] items-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50/40 via-background to-background" />
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-teal-100/40 blur-3xl" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <HeroStagger>
            <HeroStaggerItem>
              <Badge variant="success">{copy.hero.badge}</Badge>
            </HeroStaggerItem>
            <HeroStaggerItem>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-heading sm:text-5xl lg:text-6xl">
                {copy.hero.title}
              </h1>
            </HeroStaggerItem>
            <HeroStaggerItem>
              <p className="mt-5 max-w-lg text-lg leading-8 text-body">{copy.hero.subtitle}</p>
            </HeroStaggerItem>
            <HeroStaggerItem>
              <div className="mt-8 flex flex-wrap items-end gap-3">
                <span className="text-4xl font-extrabold tracking-tight text-heading sm:text-5xl">
                  {formatCurrency(product.price, product.currency)}
                </span>
                {product.compareAtPrice ? (
                  <>
                    <span className="pb-1 text-lg text-muted line-through">
                      {formatCurrency(product.compareAtPrice, product.currency)}
                    </span>
                    {discount ? (
                      <UrgencyPulse>
                        <Badge variant="accent">-{discount}%</Badge>
                      </UrgencyPulse>
                    ) : null}
                  </>
                ) : null}
              </div>
            </HeroStaggerItem>
            <HeroStaggerItem>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaFocus>
                  <ButtonLink href={productUrl} size="lg" className="hover:translate-y-0">
                    {copy.hero.ctaBuy}
                    <ArrowLeft className="h-5 w-5" />
                  </ButtonLink>
                </CtaFocus>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 items-center justify-center gap-2.5 rounded-[0.875rem] border-[1.5px] border-border bg-background px-9 text-base font-semibold text-heading transition-colors hover:bg-section-bg"
                >
                  <MessageCircle className="h-5 w-5" />
                  {copy.hero.ctaWhatsapp}
                </a>
              </div>
            </HeroStaggerItem>
            <HeroStaggerItem>
              <div className="mt-8 flex flex-wrap gap-5">
                {copy.hero.trust.map((label, index) => {
                  const Icon = heroTrustIcons[index];
                  return (
                    <span key={label} className="inline-flex items-center gap-2 text-sm font-medium text-body">
                      <Icon className="h-4 w-4 text-accent" />
                      {label}
                    </span>
                  );
                })}
              </div>
            </HeroStaggerItem>
          </HeroStagger>

          <ProductShowcase className="relative mx-auto w-full max-w-xl">
            <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/50 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-md sm:rounded-[2.5rem] sm:p-6">
              <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-slate-50 to-white">
                <Image
                  src={product.images[0] ?? "/products/product-included-scale.png"}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-contain p-6"
                />
              </div>
            </div>
          </ProductShowcase>
        </div>
      </section>

      <section className={`px-4 sm:px-6 lg:px-8 ${pad} bg-section-bg/50`}>
        <div className="mx-auto max-w-7xl">
          <div className={`mx-auto max-w-2xl text-center ${headPad}`}>
            <Badge variant="success">{copy.trust.eyebrow}</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
              {copy.trust.title}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.trust.cards.map((card, index) => {
              const Icon = trustIcons[index];
              return (
                <div
                  key={card.label}
                  className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm"
                >
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-3xl font-extrabold tracking-tight text-heading">{card.value}</p>
                  <p className="mt-1 text-sm font-medium text-muted-fg">{card.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="metrics" className={`px-4 sm:px-6 lg:px-8 ${pad}`}>
        <div className="mx-auto max-w-7xl">
          <Reveal className={`mx-auto max-w-2xl text-center ${headPad}`}>
            <Badge variant="success">{copy.metrics.eyebrow}</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
              {copy.metrics.title}
            </h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.metrics.items.map((item, index) => {
              const Icon = metricIcons[item.icon];
              return (
                <Reveal key={item.label} delay={index * 0.07}>
                  <div className="flex items-center gap-4 rounded-[1.75rem] border border-border/80 bg-card p-5 shadow-sm">
                    <motion.div
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"
                      initial={{ scale: 0.92, opacity: 0.6 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.07 + 0.15, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-heading">{item.label}</h3>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`px-4 sm:px-6 lg:px-8 ${pad} bg-section-bg/50`}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_30px_90px_rgba(15,23,42,0.1)]">
            <Image
              src={copy.lifestyle.image}
              alt={copy.lifestyle.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl lg:text-5xl">
              {copy.lifestyle.title}
            </h2>
            <p className="mt-5 text-lg leading-8 text-body">{copy.lifestyle.body}</p>
          </div>
        </div>
      </section>

      <section id="how" className={`px-4 sm:px-6 lg:px-8 ${pad}`}>
        <div className="mx-auto max-w-7xl">
          <div className={`mx-auto max-w-2xl text-center ${headPad}`}>
            <Badge variant="success">{copy.how.eyebrow}</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
              {copy.how.title}
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {copy.how.steps.map((step, index) => (
              <div key={step.title} className="overflow-hidden rounded-[2rem] border border-border/80 bg-card">
                <div className="relative aspect-[4/5]">
                  <Image src={step.image} alt={step.title} fill sizes="360px" loading="lazy" className="object-cover" />
                </div>
                <div className="p-5 text-center">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-heading">{step.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`px-4 sm:px-6 lg:px-8 ${pad} bg-section-bg/50`}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/70 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.1)]">
            <Image src={copy.app.image} alt="تطبيق الرفقة" fill sizes="420px" loading="lazy" className="object-cover" />
          </div>
          <div>
            <Badge variant="success">{copy.app.eyebrow}</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-heading sm:text-4xl">{copy.app.title}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {copy.app.features.map((feature, index) => {
                const Icon = appIcons[index];
                return (
                  <div key={feature} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                    <Icon className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium text-heading">{feature}</span>
                  </div>
                );
              })}
            </div>
            <ButtonLink href={`${productUrl}#app`} size="lg" className="mt-8">
              {copy.app.cta}
              <ArrowLeft className="h-5 w-5" />
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className={`px-4 sm:px-6 lg:px-8 ${pad}`}>
        <div className="mx-auto max-w-7xl space-y-16">
          {copy.features.map((feature, index) => (
            <div
              key={feature.title}
              className={`grid items-center gap-10 lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                <Image src={feature.image} alt={feature.title} fill sizes="560px" loading="lazy" className="object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">{feature.title}</h3>
                <p className="mt-3 text-lg leading-8 text-body">{feature.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="reviews" className={`px-4 sm:px-6 lg:px-8 ${pad} bg-section-bg/50`}>
        <div className="mx-auto max-w-7xl">
          <div className={`mx-auto max-w-2xl text-center ${headPad}`}>
            <Badge variant="success">{copy.reviews.eyebrow}</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
              {copy.reviews.title}
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {copy.reviews.items.map((review) => (
              <div key={review.name} className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-sm">
                <div className="flex gap-1 text-emerald-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-body">&ldquo;{review.quote}&rdquo;</p>
                <p className="mt-5 font-semibold text-heading">{review.name}</p>
                <p className="text-sm text-muted-fg">{review.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className={`px-4 sm:px-6 lg:px-8 ${pad}`}>
        <div className="mx-auto max-w-3xl">
          <div className={`text-center ${headPad}`}>
            <Badge variant="success">{copy.faq.eyebrow}</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-heading sm:text-4xl">{copy.faq.title}</h2>
          </div>
          <div className="divide-y divide-border overflow-hidden rounded-[2rem] border border-border bg-card">
            {copy.faq.items.map((faq) => (
              <details key={faq.q} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-heading">
                  {faq.q}
                  <span className="text-xl text-emerald-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-body">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-16">
        <FinalCtaReveal className="relative mx-auto grid max-w-7xl items-center gap-10 overflow-hidden rounded-[2.5rem] bg-[#0B1220] p-8 text-white sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{copy.finalCta.title}</h2>
            <motion.p
              className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {formatCurrency(product.price, product.currency)}
            </motion.p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaFocus tone="light">
                <ButtonLink
                  href={productUrl}
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-white/95 hover:translate-y-0"
                >
                  {copy.finalCta.ctaBuy}
                </ButtonLink>
              </CtaFocus>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-[0.875rem] border border-white/25 px-9 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                <MessageCircle className="h-5 w-5" />
                {copy.finalCta.ctaWhatsapp}
              </a>
            </div>
          </div>
          <ProductShowcase className="relative mx-auto aspect-square w-full max-w-sm">
            <Image
              src={product.images[0] ?? "/products/product-included-scale.png"}
              alt={product.title}
              fill
              sizes="400px"
              loading="lazy"
              className="object-contain"
            />
          </ProductShowcase>
        </FinalCtaReveal>
      </section>

      <StickyBuyBar className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-white/95 p-3 shadow-[0_-12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-heading">{product.title}</p>
            <p className="text-sm font-bold text-emerald-700">
              {formatCurrency(product.price, product.currency)}
            </p>
          </div>
          <CtaFocus>
            <Link
              href={productUrl}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white hover:translate-y-0"
            >
              {copy.hero.ctaBuy}
            </Link>
          </CtaFocus>
        </div>
      </StickyBuyBar>

      <div className="h-20 lg:hidden" aria-hidden />
    </>
  );
}
