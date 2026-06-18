import {
  defaultAnnouncement,
  defaultBlogArticles,
  defaultBrand,
  defaultCollectionLinks,
  defaultFooter,
  defaultFooterHelpLinks,
  defaultHeader,
  defaultHero,
  defaultHomeSections,
  defaultNavigation,
  defaultTrustChips,
  type NavItem,
} from "@/lib/cms/defaults";
import { buildWhatsAppUrl } from "@/lib/cms/whatsapp";
import { getBrand, type BrandSettings } from "@/lib/cms/db";

function hasDb(): boolean {
  const url = process.env.DATABASE_URL;
  return !!url && !url.startsWith("file:");
}

function parseJson<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

async function getConfigMap(group?: string): Promise<Record<string, string>> {
  if (!hasDb()) return {};

  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.siteConfig.findMany({
      where: group ? { group } : undefined,
    });
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  } catch {
    return {};
  }
}

async function getContentMap(page: string): Promise<Record<string, string>> {
  if (!hasDb()) return {};

  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.contentBlock.findMany({ where: { page } });
    return Object.fromEntries(rows.map((row) => [`${row.section}.${row.key}`, row.value]));
  } catch {
    return {};
  }
}

export type SiteChrome = {
  brand: BrandSettings;
  header: {
    logoLetter: string;
    logoText: string;
    ctaLabel: string;
    productHref: string;
    navigation: NavItem[];
    whatsappUrl: string;
  };
  footer: {
    brandName: string;
    logoLetter: string;
    description: string;
    whatsappCta: string;
    whatsappUrl: string;
    supportEmail: string;
    whatsappDisplay: string;
    shopColumnTitle: string;
    helpColumnTitle: string;
    collectionLinks: { name: string; href: string }[];
    helpLinks: NavItem[];
  };
  announcement: {
    text: string;
    chip1: string;
    chip2: string;
    chip3: string;
  };
  whatsappUrl: string;
};

export type HomeContent = {
  hero: typeof defaultHero;
  sections: typeof defaultHomeSections;
  trustChips: string[];
};

export type BlogArticle = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  body: string;
};

export async function getSiteChrome(): Promise<SiteChrome> {
  const [brand, headerMap, footerMap, navMap, homeBlocks] = await Promise.all([
    getBrand(),
    getConfigMap("header"),
    getConfigMap("footer"),
    getConfigMap("nav"),
    getContentMap("home"),
  ]);

  const whatsappUrl = buildWhatsAppUrl(brand.whatsapp);
  const navigation = parseJson<NavItem[]>(navMap.navigation, defaultNavigation);
  const helpLinks = parseJson<NavItem[]>(footerMap.helpLinks, defaultFooterHelpLinks);
  const productSlug = headerMap.productSlug ?? defaultHeader.productSlug;

  return {
    brand,
    header: {
      logoLetter: headerMap.logoLetter ?? defaultHeader.logoLetter,
      logoText: headerMap.logoText ?? defaultHeader.logoText,
      ctaLabel: headerMap.ctaLabel ?? defaultHeader.ctaLabel,
      productHref: `/products/${productSlug}`,
      navigation,
      whatsappUrl,
    },
    footer: {
      brandName: brand.name,
      logoLetter: headerMap.logoLetter ?? defaultHeader.logoLetter,
      description: footerMap.description ?? defaultFooter.description,
      whatsappCta: footerMap.whatsappCta ?? defaultFooter.whatsappCta,
      whatsappUrl,
      supportEmail: brand.supportEmail,
      whatsappDisplay: brand.whatsapp,
      shopColumnTitle: footerMap.shopColumnTitle ?? defaultFooter.shopColumnTitle,
      helpColumnTitle: footerMap.helpColumnTitle ?? defaultFooter.helpColumnTitle,
      collectionLinks: defaultCollectionLinks,
      helpLinks,
    },
    announcement: {
      text: homeBlocks["announcement.text"] ?? defaultAnnouncement.text,
      chip1: homeBlocks["announcement.chip1"] ?? defaultAnnouncement.chip1,
      chip2: homeBlocks["announcement.chip2"] ?? defaultAnnouncement.chip2,
      chip3: homeBlocks["announcement.chip3"] ?? defaultAnnouncement.chip3,
    },
    whatsappUrl,
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  const homeBlocks = await getContentMap("home");

  const hero = {
    badge: homeBlocks["hero.badge"] ?? defaultHero.badge,
    title: homeBlocks["hero.title"] ?? defaultHero.title,
    subtitle: homeBlocks["hero.subtitle"] ?? defaultHero.subtitle,
    cta_whatsapp: homeBlocks["hero.cta_whatsapp"] ?? defaultHero.cta_whatsapp,
    cta_buy: homeBlocks["hero.cta_buy"] ?? defaultHero.cta_buy,
  };

  const sections = Object.fromEntries(
    Object.entries(defaultHomeSections).map(([key, fallback]) => [
      key,
      homeBlocks[`sections.${key}`] ?? fallback,
    ]),
  ) as typeof defaultHomeSections;

  const trustChips = parseJson<string[]>(
    homeBlocks["sections.trust_chips"],
    defaultTrustChips,
  );

  return { hero, sections, trustChips };
}

export async function getBlogArticles(): Promise<BlogArticle[]> {
  if (!hasDb()) return defaultBlogArticles;

  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { sortOrder: "asc" },
    });

    if (rows.length === 0) return defaultBlogArticles;

    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      category: row.category,
      excerpt: row.excerpt,
      readTime: row.readTime,
      body: row.body,
    }));
  } catch {
    return defaultBlogArticles;
  }
}

export async function getBlogArticleBySlug(slug: string): Promise<BlogArticle | undefined> {
  const articles = await getBlogArticles();
  return articles.find((article) => article.slug === slug);
}

export async function getNavigation(): Promise<NavItem[]> {
  const navMap = await getConfigMap("nav");
  return parseJson(navMap.navigation, defaultNavigation);
}

export { defaultBrand, defaultHero, defaultHomeSections, defaultAnnouncement, defaultFooter, defaultHeader };
