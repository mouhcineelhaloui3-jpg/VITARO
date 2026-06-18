import { products as staticProducts } from "@/lib/data/catalog";
import type { Product } from "@/types/commerce";

export type AdminProductRow = {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  status: string;
  rating?: number;
  reviewCount?: number;
  inventory?: number;
  variants?: { name: string; color: string; inventory: number }[];
  images?: string[];
  persisted: boolean;
};

type DbProduct = {
  id: string;
  slug: string;
  title: string;
  price: { toNumber(): number };
  compareAtPrice: { toNumber(): number } | null;
  currency: string;
  status: string;
  rating: number | null;
  reviewCount: number | null;
  imagesJson: string | null;
  variants: {
    name: string;
    color: string | null;
    inventory: number;
  }[];
};

export function hasProductDb(): boolean {
  const url = process.env.DATABASE_URL;
  return !!url && !url.startsWith("file:");
}

function staticToRow(product: Product): AdminProductRow {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    currency: product.currency,
    status: "active",
    rating: product.rating,
    reviewCount: product.reviewCount,
    inventory: product.variants?.reduce((sum, variant) => sum + variant.inventory, 0),
    variants: product.variants?.map((variant) => ({
      name: variant.name,
      color: variant.color,
      inventory: variant.inventory,
    })),
    images: product.images,
    persisted: false,
  };
}

function dbToRow(row: DbProduct, staticMatch?: Product): AdminProductRow {
  let images: string[] = [];
  if (row.imagesJson) {
    try {
      const parsed = JSON.parse(row.imagesJson);
      if (Array.isArray(parsed)) images = parsed;
    } catch {}
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    price: row.price.toNumber(),
    compareAtPrice: row.compareAtPrice?.toNumber() ?? staticMatch?.compareAtPrice,
    currency: row.currency,
    status: row.status,
    rating: row.rating ?? staticMatch?.rating,
    reviewCount: row.reviewCount ?? staticMatch?.reviewCount,
    inventory: row.variants.reduce((sum, variant) => sum + variant.inventory, 0),
    variants: row.variants.map((variant) => ({
      name: variant.name,
      color: variant.color ?? "#000000",
      inventory: variant.inventory,
    })),
    images: images.length > 0 ? images : staticMatch?.images,
    persisted: true,
  };
}

export async function getAdminProductRows(): Promise<AdminProductRow[]> {
  const rows = staticProducts.map(staticToRow);

  if (!hasProductDb()) {
    return rows;
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const dbProducts = await prisma.product.findMany({
      include: { variants: true },
      orderBy: { updatedAt: "desc" },
    });

    for (const dbProduct of dbProducts) {
      const staticMatch = staticProducts.find((product) => product.slug === dbProduct.slug);
      const serialized = dbToRow(dbProduct, staticMatch);
      const index = rows.findIndex((row) => row.slug === dbProduct.slug);

      if (index >= 0) {
        rows[index] = serialized;
      } else {
        rows.push(serialized);
      }
    }
  } catch {
    return rows;
  }

  return rows;
}

export async function upsertAdminProduct(input: {
  slug: string;
  title?: string;
  price?: number;
  compareAtPrice?: number | null;
}) {
  if (!hasProductDb()) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  const staticMatch = staticProducts.find((product) => product.slug === input.slug);
  if (!staticMatch) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  const { prisma } = await import("@/lib/prisma");
  const existing = await prisma.product.findUnique({
    where: { slug: input.slug },
    include: { variants: true },
  });

  const metadata = {
    metrics: staticMatch.metrics,
    features: staticMatch.features,
    specifications: staticMatch.specifications,
    packageContents: staticMatch.packageContents,
    usageSteps: staticMatch.usageSteps,
    seo: staticMatch.seo,
  };

  if (existing) {
    const updated = await prisma.product.update({
      where: { slug: input.slug },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.compareAtPrice !== undefined ? { compareAtPrice: input.compareAtPrice } : {}),
      },
      include: { variants: true },
    });

    if (input.price !== undefined) {
      await prisma.productVariant.updateMany({
        where: { productId: existing.id },
        data: { price: input.price },
      });
    }

    return dbToRow(
      {
        ...updated,
        variants: input.price !== undefined
          ? updated.variants.map((variant) => ({ ...variant, price: updated.price }))
          : updated.variants,
      },
      staticMatch,
    );
  }

  const created = await prisma.product.create({
    data: {
      slug: staticMatch.slug,
      title: input.title ?? staticMatch.title,
      eyebrow: staticMatch.eyebrow,
      subtitle: staticMatch.subtitle ?? "",
      description: staticMatch.description,
      price: input.price ?? staticMatch.price,
      compareAtPrice: input.compareAtPrice ?? staticMatch.compareAtPrice ?? null,
      currency: staticMatch.currency,
      status: "active",
      rating: staticMatch.rating,
      reviewCount: staticMatch.reviewCount,
      inventory: staticMatch.variants?.reduce((sum, variant) => sum + variant.inventory, 0) ?? 0,
      tags: staticMatch.tags?.join(","),
      imagesJson: JSON.stringify(staticMatch.images),
      metadataJson: JSON.stringify(metadata),
      variants: {
        create: (staticMatch.variants ?? []).map((variant) => ({
          name: variant.name,
          sku: variant.sku,
          price: input.price ?? variant.price,
          inventory: variant.inventory,
          color: variant.color,
        })),
      },
    },
    include: { variants: true },
  });

  return dbToRow(created, staticMatch);
}
