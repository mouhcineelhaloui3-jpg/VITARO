import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { policies } from "@/lib/data/content";

type HelpPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({ params }: HelpPageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = policies.find((item) => item.slug === slug);

  return {
    title: policy?.title ?? "Help",
    description: policy?.summary,
  };
}

export default async function HelpPolicyPage({ params }: HelpPageProps) {
  const { slug } = await params;
  const policy = policies.find((item) => item.slug === slug);

  if (!policy) {
    notFound();
  }

  return (
    <Section eyebrow="Help Center" title={policy.title} description={policy.summary}>
      <div className="mx-auto max-w-4xl space-y-5">
        {policy.sections.map((section) => (
          <Card key={section.title}>
            <Badge variant="success">Policy</Badge>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">{section.title}</h2>
            <p className="mt-3 leading-8 text-body">{section.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
