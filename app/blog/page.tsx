import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getBlogArticles } from "@/lib/cms/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "المدونة",
  description: "مقالات صحية عن اللياقة، التغذية، وتحليل الجسم من فيتارو.",
};

export default async function BlogPage() {
  const blogArticles = await getBlogArticles();

  return (
    <Section
      eyebrow="المدونة"
      title="مقالات صحية عن اللياقة، التغذية، وتحليل الجسم."
      description="تحرير المقالات من لوحة التحكم → المحتوى والصفحات → المدونة."
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
              <p className="mt-3 leading-7 text-body">{article.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                اقرأ المقال
                <ArrowRight className="h-4 w-4 text-emerald-500" />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
