import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Package,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { BuyBox } from "@/features/products/buy-box";
import { ProductGallery } from "@/features/products/product-gallery";
import { getProductBySlug, products } from "@/lib/data/catalog";
import { getFaqs, getTestimonials } from "@/lib/cms/db";
import { faqs as staticFaqs, testimonials as staticTestimonials } from "@/lib/data/content";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.seo.title,
    description: product.seo.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [faqs, testimonials] = await Promise.all([getFaqs(), getTestimonials()]);

  const serviceCards: { icon: LucideIcon; title: string; body: string }[] = [
    {
      icon: Truck,
      title: "الشحن",
      body: "تتبع مجاني، خيارات التوصيل السريع، ودعم وسائل التوصيل لجميع المدن المغربية جاهز للدمج.",
    },
    {
      icon: ShieldCheck,
      title: "الضمان",
      body: "ضمان محدود لمدة سنتين مدمج ضمن صفحات تثقيف المنتجات والدعم الفني.",
    },
    {
      icon: RotateCcw,
      title: "الإرجاع",
      body: "ضمان استرداد الأموال خلال 30 يوماً يتواجد في صفحة الدفع والمنتجات ومركز المساعدة.",
    },
  ];

  return (
    <>
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <ProductGallery product={product} />
          <BuyBox product={product} />
        </div>
      </section>

      <Section eyebrow="علاش غادي يعجبك" title="ماشي غير ميزان، هو مستشارك الصحي.">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {product.features.map((feature) => (
            <Card key={feature.title}>
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              <h2 className="mt-5 text-xl font-semibold tracking-tight">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-body">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="طريقة الاستعمال" title="كيفاش تستعملو؟ 3 خطوات بسيطة.">
        <div className="grid gap-4 md:grid-cols-3">
          {product.usageSteps.map((step, index) => (
            <Card key={step} className="p-6">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500 text-lg font-bold text-white">
                {index + 1}
              </span>
              <p className="mt-5 leading-7 text-body">{step}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="المواصفات" title="التفاصيل الفنية بوضوح.">
        <div className="grid gap-5 lg:grid-cols-3">
          {product.specifications.map((spec) => (
            <Card key={spec.group}>
              <h2 className="text-2xl font-semibold tracking-tight">{spec.group}</h2>
              <div className="mt-6 space-y-4">
                {spec.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-3 text-sm last:border-b-0 dark:border-white/10"
                  >
                    <span className="text-muted-fg">{item.label}</span>
                    <span className="text-right font-semibold text-heading">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="محتويات العلبة" title="تجربة فك التغليف مصممة لمنتج رائد.">
        <div className="grid gap-4 md:grid-cols-5">
          {product.packageContents.map((item) => (
            <Card key={item} className="text-center">
              <Package className="mx-auto h-7 w-7 text-emerald-500" />
              <p className="mt-4 text-sm font-semibold text-heading">{item}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="الشحن، الضمان، والإرجاع" title="أزل التردد قبل الدفع.">
        <div className="grid gap-5 md:grid-cols-3">
          {serviceCards.map((item) => (
            <Card key={item.title}>
              <item.icon className="h-8 w-8 text-emerald-500" />
              <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 leading-7 text-body">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="الأسئلة الشائعة" title="إجابات لكل تساؤلاتك عن المنتج.">
        <div
          data-surface="light"
          className="mx-auto max-w-4xl divide-y divide-surface rounded-[2rem] border border-surface bg-surface dark:divide-white/10 dark:border-white/10 dark:bg-white/5 dark:[--surface-bg:theme(colors.white/5%)] dark:[--surface-fg-heading:#f8fafc] dark:[--surface-fg-body:#e2e8f0] dark:[--surface-fg-muted:#cbd5e1] dark:[--surface-fg-subtle:#94a3b8] dark:[--surface-icon:#f8fafc] dark:[--surface-border:rgba(255,255,255,0.1)]"
        >
          {faqs.slice(1).map((faq) => (
            <details key={faq.question} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-surface-heading">
                {faq.question}
                <span className="text-emerald-500 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 leading-7 text-surface-body">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section eyebrow="التقييمات" title="دليل اجتماعي ومساحات لتقييم الفيديو.">
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name}>
              <div className="flex gap-1 text-emerald-500">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-6 leading-7 text-body">
                “{testimonial.quote}”
              </p>
              <p className="mt-5 font-semibold text-surface-heading">{testimonial.name}</p>
              <p className="text-sm text-surface-muted">{testimonial.role}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="بدا دابا" title="صحة أحسن كتبدا بخطوة وحدة.">
        <div
          data-surface="dark"
          className="rounded-[2rem] bg-surface p-8 text-center shadow-[0_30px_80px_rgba(2,6,23,0.35)] lg:p-14"
        >
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-[-0.04em] text-surface-heading sm:text-4xl">
            طلب ميزانك دابا وخلّص فالدار.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-surface-muted">
            كنوصلو لجميع مدن المغرب. تواصل معانا فواتساب وفريقنا غادي يعاونك.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={`https://wa.me/212682217644?text=${encodeURIComponent(`سلام، بغيت نطلب ${product.title} بثمن ${product.price} درهم`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              طلب عبر واتساب
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
