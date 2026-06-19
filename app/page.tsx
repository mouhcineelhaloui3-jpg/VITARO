import Image from "next/image";
import {
  Activity,
  ArrowLeft,
  BadgeCheck,
  Bone,
  CheckCircle2,
  Droplets,
  Dumbbell,
  Gauge,
  MessageCircle,
  Ruler,
  ShieldCheck,
  Smartphone,
  Star,
  Truck,
  Zap,
} from "lucide-react";

import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { CompanionAppSection } from "@/components/commerce/companion-app-section";
import { ScaleScienceSection } from "@/components/commerce/scale-science-section";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, FeatureCard } from "@/components/ui/card";
import { getProducts, getTestimonials, getFaqs, getBrand } from "@/lib/cms/db";
import { getHomeContent } from "@/lib/cms/site";
import { buildWhatsAppUrl } from "@/lib/cms/whatsapp";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [allProducts, testimonials, faqs, home, brand] = await Promise.all([
    getProducts(),
    getTestimonials(),
    getFaqs(),
    getHomeContent(),
    getBrand(),
  ]);
  const product = allProducts[0];

  if (!product) {
    throw new Error("No products configured for the storefront.");
  }

  const whatsappOrderLink = (title: string, price: number) =>
    buildWhatsAppUrl(
      brand.whatsapp,
      `سلام، بغيت نطلب ${title} بثمن ${price} درهم`,
    );

  const trustChips = [
    { icon: Truck, label: home.trustChips[0] ?? "توصيل لجميع المدن" },
    { icon: ShieldCheck, label: home.trustChips[1] ?? "خلّص فالدار (COD)" },
    { icon: BadgeCheck, label: home.trustChips[2] ?? "ضمان سنتين" },
  ];

  const steps = [
    { icon: Zap, title: "حُط رجليك", body: "الميزان كيتعرف عليك ويعطيك القياس فثواني." },
    { icon: Smartphone, title: "شوف النتائج", body: "كل التفاصيل ديال جسمك فالتطبيق وبكل بساطة." },
    { icon: BadgeCheck, title: "تبّع تقدمك", body: "شوف فين وصلتي ووصل لهدفك بسهولة." },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-section-bg px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(5,150,105,0.08),transparent_60%)]" />
        
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Badge variant="success">{home.hero.badge}</Badge>
            
            <h1 className="mt-6 text-[2.75rem] font-extrabold leading-[1.1] tracking-[-0.04em] text-heading sm:text-6xl lg:text-[4rem]">
              {home.hero.title}
            </h1>
            
            <p className="mt-7 max-w-xl text-[1.125rem] leading-[1.75] text-body">
              {home.hero.subtitle}
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
              <ButtonLink
                href={whatsappOrderLink(product.title, product.price)}
                size="lg"
                variant="primary"
              >
                <MessageCircle className="h-5 w-5" />
                {home.hero.cta_whatsapp}
              </ButtonLink>
              <ButtonLink href={`/products/${product.slug}`} size="lg" variant="secondary">
                {home.hero.cta_buy}
                <ArrowLeft className="h-5 w-5" />
              </ButtonLink>
            </div>

            <div className="mt-8 flex flex-wrap gap-6">
              {trustChips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-2.5 text-[0.9375rem] font-medium text-body"
                >
                  <chip.icon className="h-5 w-5 text-accent" />
                  {chip.label}
                </span>
              ))}
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

      {/* KEY BENEFITS */}
      <Section
        background="white"
        eyebrow={home.sections.benefits_eyebrow}
        title={home.sections.benefits_title}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {product.features.map((feature) => (
            <FeatureCard key={feature.title} className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-heading">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-[1.7] text-body">
                  {feature.description}
                </p>
              </div>
            </FeatureCard>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section 
        background="gray"
        id="how" 
        eyebrow={home.sections.how_eyebrow}
        title={home.sections.how_title}
      >
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title}>
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <span className="text-5xl font-extrabold text-border">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-heading">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-[1.7] text-body">{step.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <ScaleScienceSection />

      <CompanionAppSection />

      {/* METRICS */}
      <Section
        background="white"
        eyebrow={home.sections.metrics_eyebrow}
        title={home.sections.metrics_title}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Gauge, title: "الوزن و BMI", body: "تعرف واش الوزن ديالك مناسب مع الطول ديالك." },
            { icon: Activity, title: "نسبة الشحم", body: "تابع الشحم فالجسم وشوف التغيير مع الوقت." },
            { icon: Dumbbell, title: "العضلات", body: "مفيد للرياضة وبناء الكتلة العضلية." },
            { icon: Droplets, title: "الماء", body: "شوف نسبة الماء فالجسم باش تبقى مرطّب." },
            { icon: Bone, title: "كتلة العظام", body: "يعطيك فكرة على صحة العظام بشكل مبسط." },
            { icon: Smartphone, title: "تطبيق OKOK", body: "كل النتائج كتتحفظ فالتطبيق مع مبيانات سهلة." },
          ].map((item) => (
            <FeatureCard key={item.title}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                <item.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-heading">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-[1.7] text-body">{item.body}</p>
            </FeatureCard>
          ))}
        </div>
      </Section>

      {/* QUALITY */}
      <Section
        background="gray"
        eyebrow={home.sections.quality_eyebrow}
        title={home.sections.quality_title}
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="overflow-hidden bg-gradient-to-br from-heading to-heading/90 p-10 text-white">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <Badge variant="success">زجاج مقسّى</Badge>
                <h3 className="mt-5 text-3xl font-bold tracking-[-0.03em]">
                  قوي وآمن للاستعمال اليومي.
                </h3>
                <p className="mt-5 leading-[1.75] text-white/80">
                  سطح زجاجي مقاوم، 4 مستشعرات معدنية، وشاشة LCD زرقاء واضحة حتى فالليل.
                </p>
              </div>
              <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 shadow-2xl">
                <div className="absolute inset-x-8 top-12 h-8 rounded-lg bg-sky-400/90 shadow-[0_0_35px_rgba(56,189,248,0.75)]" />
                <div className="absolute inset-x-8 bottom-12 grid grid-cols-2 gap-8">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-16 rounded-full bg-zinc-200/90" />
                  ))}
                </div>
                <div className="absolute inset-8 rounded-[1.75rem] border border-white/20" />
              </div>
            </div>
          </Card>

          <div className="grid gap-6">
            <Card>
              <Ruler className="h-8 w-8 text-accent" />
              <h3 className="mt-5 text-xl font-bold text-heading">حجم عملي وخفيف</h3>
              <p className="mt-3 text-[0.9375rem] leading-[1.7] text-body">
                تقريباً 26cm وبسماكة 2.2cm، كيدخل بسهولة فالحمام ولا الغرفة.
              </p>
            </Card>
            <Card>
              <Truck className="h-8 w-8 text-accent" />
              <h3 className="mt-5 text-xl font-bold text-heading">Free shipping</h3>
              <p className="mt-3 text-[0.9375rem] leading-[1.7] text-body">
                التوصيل مجاني لجميع المدن المغربية، وكتخلّص حتى توصلك السلعة.
              </p>
            </Card>
          </div>
        </div>
      </Section>

      {/* REVIEWS */}
      <Section 
        background="white"
        id="reviews" 
        eyebrow={home.sections.reviews_eyebrow}
        title={home.sections.reviews_title}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="relative">
              <div className="flex gap-1.5 text-accent">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star key={index} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="mt-6 text-[1.0625rem] leading-[1.75] text-body">
                "{testimonial.quote}"
              </p>
              <p className="mt-6 font-bold text-heading">{testimonial.name}</p>
              <p className="mt-1 text-sm text-muted">{testimonial.role}</p>
              <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-accent/5" />
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section 
        background="gray"
        id="faq"
        eyebrow={home.sections.faq_eyebrow}
        title={home.sections.faq_title}
      >
        <div className="mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
          {faqs.slice(0, 4).map((faq) => (
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

      {/* FINAL CTA */}
      <Section background="white">
        <Card className="overflow-hidden bg-gradient-to-br from-accent to-accent-hover p-10 text-center text-white shadow-[0_20px_70px_rgba(5,150,105,0.3)] lg:p-16">
          <h2 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
            {home.sections.cta_title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-[1.75] text-white/90">
            {home.sections.cta_subtitle}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <ButtonLink
              href={whatsappOrderLink(product.title, product.price)}
              size="xl"
              variant="secondary"
              className="bg-white text-accent hover:bg-white/95"
            >
              <MessageCircle className="h-5 w-5" />
              {home.hero.cta_whatsapp}
            </ButtonLink>
            <ButtonLink 
              href={`/products/${product.slug}`} 
              size="xl" 
              variant="outline"
              className="border-white/30 text-white hover:bg-white hover:text-accent"
            >
              شوف التفاصيل
            </ButtonLink>
          </div>
        </Card>
      </Section>
    </>
  );
}
