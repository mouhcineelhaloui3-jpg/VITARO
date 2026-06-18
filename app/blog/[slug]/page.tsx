import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { blogArticles } from "@/lib/data/content";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = blogArticles.find((item) => item.slug === slug);

  return {
    title: article?.title ?? "Health Journal",
    description: article?.excerpt,
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = blogArticles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <Section eyebrow={article.category} title={article.title} description={article.excerpt}>
      <Card className="mx-auto max-w-3xl">
        <Badge variant="success">{article.readTime}</Badge>
        <div className="mt-8 space-y-5 text-lg leading-8 text-body">
          <p>
            This SEO article page is ready for CMS content blocks, author metadata, related products, structured data, and internal links.
          </p>
          <p>
            Vitaro’s editorial system is designed to support health education, product discovery, and trust-building content without changing the commerce architecture.
          </p>
        </div>
      </Card>
    </Section>
  );
}
