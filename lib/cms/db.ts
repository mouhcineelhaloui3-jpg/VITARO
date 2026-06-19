/**
 * CMS Data Layer
 * All storefront data comes through these functions.
 * Database is the source of truth when available; falls back to static data.
 */

import { products as staticProducts, collections as staticCollections } from "@/lib/data/catalog";
import {
  brand as staticBrand,
  testimonials as staticTestimonials,
  faqs as staticFaqs,
  navigation as staticNav,
} from "@/lib/data/content";
import type { Product, Collection } from "@/types/commerce";

function hasDb(): boolean {
  const url = process.env.DATABASE_URL;
  // SQLite file URLs only work locally — ignore them on serverless hosts.
  return !!url && !url.startsWith("file:");
}

function asArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? value : fallback;
}

// ─── PRODUCTS ──────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  if (!hasDb()) return staticProducts;
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.product.findMany({
      where: { status: "active" },
      include: { variants: true, category: true },
    });
    if (rows.length === 0) return staticProducts;
    return rows.map(mapDbProduct);
  } catch {
    return staticProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!hasDb()) return staticProducts.find((p) => p.slug === slug);
  try {
    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.product.findUnique({
      where: { slug },
      include: { variants: true, category: true },
    });
    if (!row) return staticProducts.find((p) => p.slug === slug);
    return mapDbProduct(row);
  } catch {
    return staticProducts.find((p) => p.slug === slug);
  }
}

export async function getCollections(): Promise<Collection[]> {
  if (!hasDb()) return staticCollections;

  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.category.findMany({
      include: { products: { select: { slug: true } } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    if (rows.length === 0) return staticCollections;

    return rows.map((row) => ({
      id: row.slug,
      slug: row.slug,
      name: row.name,
      eyebrow: row.eyebrow ?? "",
      description: row.description ?? "",
      productIds: row.products.map((product) => product.slug),
      futureReady: !row.active,
    }));
  } catch {
    return staticCollections;
  }
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const all = await getCollections();
  return all.find((collection) => collection.slug === slug);
}

export async function getProductsForCollection(collectionSlug: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(
    (product) =>
      product.collectionIds.includes(collectionSlug) ||
      product.categoryId === collectionSlug,
  );
}

// ─── BRAND / SETTINGS ──────────────────────────────────────────────────────

export type BrandSettings = typeof staticBrand;

export async function getBrand(): Promise<BrandSettings> {
  if (!hasDb()) return staticBrand;
  try {
    const { prisma } = await import("@/lib/prisma");
    const configs = await prisma.siteConfig.findMany({ where: { group: "brand" } });
    if (configs.length === 0) return staticBrand;
    const map = Object.fromEntries(configs.map((c) => [c.key, c.value]));
    return {
      ...staticBrand,
      name: map["name"] ?? staticBrand.name,
      tagline: map["tagline"] ?? staticBrand.tagline,
      description: map["description"] ?? staticBrand.description,
      supportEmail: map["supportEmail"] ?? staticBrand.supportEmail,
      whatsapp: map["whatsapp"] ?? staticBrand.whatsapp,
      address: map["address"] ?? staticBrand.address,
    };
  } catch {
    return staticBrand;
  }
}

// ─── NAVIGATION ────────────────────────────────────────────────────────────

export async function getNavigation() {
  const { getNavigation: getNav } = await import("@/lib/cms/site");
  return getNav();
}

// ─── TESTIMONIALS ──────────────────────────────────────────────────────────

export type Testimonial = { name: string; role: string; quote: string; rating: number };

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!hasDb()) return staticTestimonials;
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return staticTestimonials;
    return rows.map((r) => ({
      name: r.name,
      role: r.role ?? "",
      quote: r.quote,
      rating: r.rating,
    }));
  } catch {
    return staticTestimonials;
  }
}

// ─── FAQS ──────────────────────────────────────────────────────────────────

export type FaqItem = { question: string; answer: string };

export async function getFaqs(): Promise<FaqItem[]> {
  if (!hasDb()) return staticFaqs;
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.faqEntry.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return staticFaqs;
    return rows.map((r) => ({ question: r.question, answer: r.answer }));
  } catch {
    return staticFaqs;
  }
}

// ─── CONTENT BLOCKS ────────────────────────────────────────────────────────

export async function getContentBlock(
  page: string,
  section: string,
  key: string,
  fallback = "",
): Promise<string> {
  if (!hasDb()) return fallback;
  try {
    const { prisma } = await import("@/lib/prisma");
    const block = await prisma.contentBlock.findUnique({
      where: { page_section_key: { page, section, key } },
    });
    return block?.value ?? fallback;
  } catch {
    return fallback;
  }
}

// ─── MAPPING HELPERS ────────────────────────────────────────────────────────

type DbProduct = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string | null;
  subtitle: string | null;
  description: string;
  price: { toNumber(): number };
  compareAtPrice: { toNumber(): number } | null;
  currency: string;
  status: string;
  rating: number | null;
  reviewCount: number | null;
  imagesJson: string | null;
  metadataJson: string | null;
  tags: string | null;
  category: { slug: string } | null;
  variants: {
    id: string;
    name: string;
    sku: string;
    price: { toNumber(): number };
    compareAtPrice?: { toNumber(): number } | null;
    inventory: number;
    color: string | null;
  }[];
};

function mapDbProduct(row: DbProduct): Product {
  let metadata: Record<string, unknown> = {};
  if (row.metadataJson) {
    try {
      metadata = JSON.parse(row.metadataJson);
    } catch {}
  }

  let images: string[] = [];
  if (row.imagesJson) {
    try {
      const parsed = JSON.parse(row.imagesJson);
      images = asArray(parsed, []);
    } catch {}
  }

  const staticMatch = staticProducts.find((p) => p.slug === row.slug);
  const categorySlug = row.category?.slug ?? staticMatch?.categoryId ?? "";

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    eyebrow: row.eyebrow ?? staticMatch?.eyebrow ?? "",
    subtitle: row.subtitle ?? staticMatch?.subtitle ?? "",
    description: row.description,
    price: row.price.toNumber(),
    compareAtPrice: row.compareAtPrice?.toNumber() ?? staticMatch?.compareAtPrice,
    currency: row.currency as import("@/types/commerce").CurrencyCode,
    rating: row.rating ?? staticMatch?.rating ?? 0,
    reviewCount: row.reviewCount ?? staticMatch?.reviewCount ?? 0,
    inventory: (row.variants ?? []).reduce((s, v) => s + v.inventory, 0),
    tags: row.tags ? row.tags.split(",").map((t) => t.trim()) : (staticMatch?.tags ?? []),
    images: images.length > 0 ? images : (staticMatch?.images ?? []),
    categoryId: categorySlug,
    collectionIds: categorySlug
      ? [categorySlug]
      : (staticMatch?.collectionIds ?? []),
    variants: (row.variants ?? []).map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: v.price.toNumber(),
      compareAtPrice: staticMatch?.variants?.[0]?.compareAtPrice,
      inventory: v.inventory,
      color: v.color ?? "#000000",
    })),
    metrics: asArray(metadata.metrics, staticMatch?.metrics ?? []),
    features: asArray(metadata.features, staticMatch?.features ?? []),
    specifications: asArray(
      metadata.specifications,
      staticMatch?.specifications ?? [],
    ),
    packageContents: asArray(
      metadata.packageContents,
      staticMatch?.packageContents ?? [],
    ),
    usageSteps: asArray(metadata.usageSteps, staticMatch?.usageSteps ?? []),
    seo: (metadata.seo as Product["seo"]) ?? staticMatch?.seo,
  };
}
