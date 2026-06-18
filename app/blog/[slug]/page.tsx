import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getBlogArticleBySlug, getBlogArticles } from "@/lib/cms/site";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = await getBlogArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticleBySlug(slug);

  return {
    title: article?.title ?? "المدونة",
    description: article?.excerpt,
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = await getBlogArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <Section eyebrow={article.category} title={article.title} description={article.excerpt}>
      <Card className="mx-auto max-w-3xl">
        <Badge variant="success">{article.readTime}</Badge>
        <div className="mt-8 space-y-5 text-lg leading-8 text-body whitespace-pre-line">
          {article.body.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </Card>
    </Section>
  );
}
