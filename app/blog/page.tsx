import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { blogArticles } from "@/lib/data/content";

export const metadata = {
  title: "Health Journal",
  description: "SEO-ready Vitaro articles about health, fitness, wellness, nutrition, and body analysis.",
};

export default function BlogPage() {
  return (
    <Section
      eyebrow="Health Journal"
      title="SEO-ready content for wellness, fitness, nutrition, and body analysis."
      description="The blog is prepared for CMS-managed editorial content, category pages, structured metadata, and internal product education."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {blogArticles.map((article) => (
          <Link key={article.slug} href={`/blog/${article.slug}`}>
            <Card className="h-full transition hover:-translate-y-1">
              <div className="mb-24 flex items-center justify-between">
                <Badge variant="success">{article.category}</Badge>
                <BookOpen className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-fg">
                {article.readTime}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">{article.title}</h2>
              <p className="mt-3 leading-7 text-body">
                {article.excerpt}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                Read article
                <ArrowRight className="h-4 w-4 text-emerald-500" />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
