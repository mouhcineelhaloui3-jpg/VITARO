import { products as staticProducts } from "@/lib/data/catalog";
import type { PrismaClient } from "@prisma/client";
import type { Product } from "@/types/commerce";

export type AdminProductVariant = {
  id?: string;
  name: string;
  color: string;
  inventory: number;
  sku?: string;
};

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
  variants?: AdminProductVariant[];
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
    id: string;
    name: string;
    sku: string;
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
      id: variant.id,
      name: variant.name,
      color: variant.color,
      inventory: variant.inventory,
      sku: variant.sku,
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
      id: variant.id,
      name: variant.name,
      color: variant.color ?? "#000000",
      inventory: variant.inventory,
      sku: variant.sku,
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

function slugifyTitle(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  return base || `product-${Date.now()}`;
}

export async function createAdminProduct(input: {
  title: string;
  slug?: string;
  description?: string;
  price: number;
  compareAtPrice?: number | null;
  variants: AdminProductVariant[];
}) {
  if (!hasProductDb()) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  if (!input.variants.length) {
    throw new Error("VARIANTS_REQUIRED");
  }

  const { prisma } = await import("@/lib/prisma");
  let slug = input.slug?.trim() || slugifyTitle(input.title);

  const slugTaken = await prisma.product.findUnique({ where: { slug } });
  if (slugTaken) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const metadata = {
    metrics: [],
    features: [],
    specifications: [],
    packageContents: [],
    usageSteps: [],
    seo: {
      title: input.title.trim(),
      description: input.description?.trim() || input.title.trim(),
    },
  };

  const created = await prisma.product.create({
    data: {
      slug,
      title: input.title.trim(),
      eyebrow: "منتج جديد",
      subtitle: "",
      description: input.description?.trim() || input.title.trim(),
      price: input.price,
      compareAtPrice: input.compareAtPrice ?? null,
      currency: "MAD",
      status: "active",
      inventory: input.variants.reduce((sum, variant) => sum + variant.inventory, 0),
      imagesJson: JSON.stringify([]),
      metadataJson: JSON.stringify(metadata),
      variants: {
        create: input.variants.map((variant, index) => ({
          name: variant.name.trim(),
          sku: variant.sku ?? buildVariantSku(slug, variant.name, index),
          price: input.price,
          inventory: Math.max(0, Math.floor(variant.inventory)),
          color: variant.color,
        })),
      },
    },
    include: { variants: true },
  });

  return dbToRow(created);
}

export async function upsertAdminProduct(input: {
  slug: string;
  title?: string;
  price?: number;
  compareAtPrice?: number | null;
  variants?: AdminProductVariant[];
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

  const variantInputs =
    input.variants ??
    staticMatch.variants?.map((variant) => ({
      id: undefined,
      name: variant.name,
      color: variant.color,
      inventory: variant.inventory,
      sku: variant.sku,
    }));

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

    const productPrice = input.price ?? updated.price.toNumber();

    if (input.price !== undefined) {
      await prisma.productVariant.updateMany({
        where: { productId: existing.id },
        data: { price: input.price },
      });
    }

    if (input.variants) {
      await syncProductVariants(prisma, existing.id, input.slug, productPrice, input.variants);
    }

    const refreshed = await prisma.product.findUnique({
      where: { slug: input.slug },
      include: { variants: true },
    });

    if (!refreshed) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    return dbToRow(refreshed, staticMatch);
  }

  const initialVariants = variantInputs ?? [];
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
      inventory: initialVariants.reduce((sum, variant) => sum + variant.inventory, 0),
      tags: staticMatch.tags?.join(","),
      imagesJson: JSON.stringify(staticMatch.images),
      metadataJson: JSON.stringify(metadata),
      variants: {
        create: initialVariants.map((variant, index) => ({
          name: variant.name,
          sku: variant.sku ?? buildVariantSku(input.slug, variant.name, index),
          price: input.price ?? staticMatch.price,
          inventory: variant.inventory,
          color: variant.color,
        })),
      },
    },
    include: { variants: true },
  });

  return dbToRow(created, staticMatch);
}

function buildVariantSku(productSlug: string, variantName: string, index: number): string {
  const slugPart = productSlug
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 12);
  const namePart = variantName
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, 12) || `COLOR-${index + 1}`;
  return `VIT-${slugPart}-${namePart}`;
}

async function syncProductVariants(
  prisma: PrismaClient,
  productId: string,
  productSlug: string,
  productPrice: number,
  variants: AdminProductVariant[],
) {
  const existing = await prisma.productVariant.findMany({ where: { productId } });
  const keepIds = new Set(variants.map((variant) => variant.id).filter(Boolean) as string[]);

  for (const row of existing) {
    if (!keepIds.has(row.id)) {
      await prisma.productVariant.delete({ where: { id: row.id } });
    }
  }

  for (let index = 0; index < variants.length; index++) {
    const variant = variants[index];
    const data = {
      name: variant.name.trim(),
      color: variant.color,
      inventory: Math.max(0, Math.floor(variant.inventory)),
      price: productPrice,
    };

    if (variant.id && existing.some((row) => row.id === variant.id)) {
      await prisma.productVariant.update({
        where: { id: variant.id },
        data,
      });
      continue;
    }

    let sku = variant.sku ?? buildVariantSku(productSlug, variant.name, index);
    const skuTaken = await prisma.productVariant.findUnique({ where: { sku } });
    if (skuTaken) {
      sku = `${sku}-${Date.now().toString().slice(-4)}`;
    }

    await prisma.productVariant.create({
      data: {
        productId,
        sku,
        ...data,
      },
    });
  }
}
