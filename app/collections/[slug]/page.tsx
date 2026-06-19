import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { ProductCard } from "@/components/commerce/product-card";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  getCollectionBySlug,
  getCollections,
  getProductsForCollection,
} from "@/lib/cms/db";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  return {
    title: collection?.name ?? "Collection",
    description: collection?.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const collectionProducts = await getProductsForCollection(collection.slug);

  return (
    <Section
      eyebrow={collection.eyebrow}
      title={collection.name}
      description={collection.description}
    >
      <div className="mb-8 flex flex-wrap gap-3">
        {["Vitaro", "Connected", "In stock", "Premium"].map((filter) => (
          <button
            key={filter}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300"
          >
            <SlidersHorizontal className="h-4 w-4 text-emerald-500" />
            {filter}
          </button>
        ))}
      </div>

      {collectionProducts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collectionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card className="mx-auto max-w-3xl text-center">
          <Badge>Coming soon</Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight">
            This collection is ready for future products.
          </h2>
          <p className="mt-3 leading-7 text-body">
            Product cards, filters, SEO, collection routing, and merchandising sections are already in place.
          </p>
        </Card>
      )}
    </Section>
  );
}
