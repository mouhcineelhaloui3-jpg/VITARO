import { Gem, Headphones, Sparkles, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { aboutCopy } from "@/lib/data/about-copy";
import { getPageSpacing } from "@/lib/cms/site";

export const metadata = {
  title: "شكون حنا | فيتارو",
  description:
    "تعرف على فيتارو — علامة مغربية كتخلي متابعة صحتك بسيطة، واضحة، وموثوقة.",
};

const whyIcons: LucideIcon[] = [Target, Gem, Sparkles, Headphones];

export default async function AboutPage() {
  const spacing = await getPageSpacing("about");

  return (
    <>
      <Section background="white" spacing={spacing} eyebrow={aboutCopy.intro.eyebrow} title={aboutCopy.intro.title}>
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          {aboutCopy.intro.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-8 text-body">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section
        background="gray"
        spacing={spacing}
        eyebrow={aboutCopy.mission.eyebrow}
        title={aboutCopy.mission.title}
      >
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          {aboutCopy.mission.body.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-8 text-body">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section background="white" spacing={spacing} eyebrow={aboutCopy.why.eyebrow} title={aboutCopy.why.title}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {aboutCopy.why.cards.map((card, index) => {
            const Icon = whyIcons[index];
            return (
              <Card
                key={card.title}
                className="border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-md"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h2 className="mt-5 text-lg font-bold tracking-tight text-heading">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-body">{card.body}</p>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section
        background="gray"
        spacing={spacing}
        eyebrow={aboutCopy.origin.eyebrow}
        title={aboutCopy.origin.title}
      >
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          {aboutCopy.origin.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-8 text-body">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section background="white" spacing={spacing}>
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-emerald-100/80 bg-gradient-to-br from-emerald-50/70 to-white px-8 py-14 text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:px-12">
          <p className="text-2xl font-bold leading-relaxed tracking-tight text-heading sm:text-3xl">
            {aboutCopy.closing.statement}
          </p>
        </div>
      </Section>
    </>
  );
}
