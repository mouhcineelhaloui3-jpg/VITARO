import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";

import { ProductCard } from "@/components/commerce/product-card";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { collections, products } from "@/lib/data/catalog";

export const metadata = {
  title: "Collections",
  description: "Shop Vitaro connected health collections and future premium wellness devices.",
};

export default function CollectionsPage() {
  return (
    <>
      <Section
        eyebrow="Collections"
        title="A scalable store for connected health."
        description="Collection pages are designed for one launch product today and unlimited categories tomorrow."
      >
        <div className="mb-8 flex flex-wrap gap-3">
          {["Brand", "Category", "Price", "Availability"].map((filter) => (
            <button
              key={filter}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300"
            >
              <SlidersHorizontal className="h-4 w-4 text-emerald-500" />
              {filter}
            </button>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collections/${collection.slug}`}>
              <Card className="h-full transition hover:-translate-y-1">
                <Badge variant={collection.productIds.length > 0 ? "success" : "neutral"}>
                  {collection.productIds.length > 0 ? "Available now" : "Coming soon"}
                </Badge>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                  {collection.name}
                </h2>
                <p className="mt-3 text-sm leading-6 text-body">
                  {collection.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-heading">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Featured product" title="Launch device">
        <div className="grid gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          <Card className="flex min-h-96 items-center justify-center border-dashed text-center">
            <div>
              <Badge>Related products placeholder</Badge>
              <h2 className="mt-5 text-2xl font-semibold">Future device slot</h2>
              <p className="mt-3 text-sm text-muted-fg">
                Blood pressure monitors, watches, kitchen scales, and accessories can appear here.
              </p>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
