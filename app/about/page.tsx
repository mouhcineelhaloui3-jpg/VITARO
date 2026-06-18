import {
  Cpu,
  Globe2,
  Microscope,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/ui/card";
import { brand } from "@/lib/data/content";

export const metadata = {
  title: "من نحن",
  description: "اكتشف مهمة ورؤية وتقنية فيتارو وفلسفتها الصحية.",
};

export default function AboutPage() {
  const visionCards: { icon: LucideIcon; title: string; body: string }[] = [
    {
      icon: Sparkles,
      title: "فاخر بطبيعته",
      body: "نظام علامتنا التجارية يعطي الأولوية للوضوح والهدوء وتفاصيل التجارة الإلكترونية عالية الموثوقية.",
    },
    {
      icon: Globe2,
      title: "جاهز عالمياً",
      body: "هيكل مصمم لدعم اللغات المتعددة، العملات، والتسعير الإقليمي.",
    },
    {
      icon: ShieldCheck,
      title: "الثقة أولاً",
      body: "السياسات والدعم والأمان والمصادقة حاضرة منذ اليوم الأول.",
    },
  ];

  return (
    <>
      <Section
        background="white"
        eyebrow="عن فيتارو"
        title="علامة تجارية للصحة التقنية لرفاهية أهدأ وأوضح."
        description={brand.description}
      >
        <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-accent to-accent-hover p-12 shadow-[0_20px_70px_rgba(5,150,105,0.3)] lg:p-16">
          <Badge variant="success" className="border-white/30 bg-white/20 text-white">
            المهمة
          </Badge>
          <h1 className="mt-8 max-w-4xl text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-6xl">
            جعل الأجهزة الصحية المتصلة تبدو فاخرة وجديرة بالثقة وسهلة الاستخدام كل يوم.
          </h1>
        </div>
      </Section>

      <Section 
        background="gray"
        eyebrow="الرؤية" 
        title="من جهاز رائد واحد إلى نظام صحي بيئي متكامل."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {visionCards.map((item) => (
            <FeatureCard key={item.title}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                <item.icon className="h-7 w-7 text-accent" />
              </div>
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-heading">
                {item.title}
              </h2>
              <p className="mt-4 leading-[1.75] text-body">{item.body}</p>
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section 
        background="white"
        id="technology" 
        eyebrow="التكنولوجيا" 
        title="مصمم لعادات صحية دقيقة وتكاملات مستقبلية."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <FeatureCard>
            <Cpu className="h-10 w-10 text-accent" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-heading">
              أساس الجهاز المتصل
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-[1.75] text-body">
              يقدم المتجر مؤشرات المنتج، متغيرات الجهاز، وتثقيف المعاينة للتطبيق، ووصول الإدارة الموثق،
              ومساحات البيانات الجاهزة للتكامل الصحي المستقبلي.
            </p>
          </FeatureCard>
          <FeatureCard>
            <Microscope className="h-10 w-10 text-accent" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-heading">
              فلسفة الصحة
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-[1.75] text-body">
              تقدم فيتارو بيانات العافية في شكل اتجاهات وسياق، مما يساعد العملاء على اتخاذ قرارات
              روتينية أفضل دون تحويل كل رقم لموضوع طبي بحت.
            </p>
          </FeatureCard>
        </div>
      </Section>
    </>
  );
}
