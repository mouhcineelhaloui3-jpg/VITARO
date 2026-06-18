import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { policies } from "@/lib/data/content";

export const metadata = {
  title: "Help Center",
  description: "Shipping, returns, warranty, privacy, terms, and support resources for Vitaro.",
};

export default function HelpCenterPage() {
  return (
    <Section
      eyebrow="Help Center"
      title="Support designed like a premium SaaS product."
      description="Shipping, returns, refunds, warranty, tracking, privacy, and terms pages are ready to become CMS-managed help content."
    >
      <div className="mx-auto mb-10 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle" />
          <input
            className="h-14 w-full rounded-full border border-zinc-200 bg-white pl-14 pr-5 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 dark:border-white/10 dark:bg-white/10"
            placeholder="Search shipping, returns, warranty, tracking..."
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {policies.map((policy) => (
          <Link key={policy.slug} href={`/help/${policy.slug}`}>
            <Card className="h-full transition hover:-translate-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">{policy.title}</h2>
              <p className="mt-3 leading-7 text-body">
                {policy.summary}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                Read policy
                <ArrowRight className="h-4 w-4 text-emerald-500" />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
