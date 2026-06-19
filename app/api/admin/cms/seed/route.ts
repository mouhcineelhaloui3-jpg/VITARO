import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-server";
import { hasProductionDb, missingDbMessage } from "@/lib/cms/has-db";
import { prisma } from "@/lib/prisma";
import { products as staticProducts, collections as staticCollections } from "@/lib/data/catalog";
import {
  brand,
  testimonials,
  faqs,
  navigation,
  blogArticles,
} from "@/lib/data/content";
import {
  defaultAnnouncement,
  defaultFooter,
  defaultFooterHelpLinks,
  defaultHeader,
  defaultHomeSections,
  defaultTrustChips,
} from "@/lib/cms/defaults";

export async function POST() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  if (!hasProductionDb()) {
    return NextResponse.json({ error: missingDbMessage() }, { status: 503 });
  }

  const results: Record<string, number> = {};

  try {
    // 1. Seed site config
    const brandEntries = [
      { key: "name", value: brand.name, group: "brand" },
      { key: "tagline", value: brand.tagline, group: "brand" },
      { key: "description", value: brand.description, group: "brand" },
      { key: "supportEmail", value: brand.supportEmail, group: "brand" },
      { key: "whatsapp", value: brand.whatsapp, group: "brand" },
      { key: "address", value: brand.address, group: "brand" },
    ];
    let configCount = 0;
    for (const entry of brandEntries) {
      await prisma.siteConfig.upsert({
        where: { key: entry.key },
        update: { value: entry.value, group: entry.group },
        create: { key: entry.key, value: entry.value, group: entry.group },
      });
      configCount++;
    }
    results.siteConfig = configCount;

    const headerEntries = Object.entries(defaultHeader).map(([key, value]) => ({
      key,
      value: String(value),
      group: "header",
    }));
    for (const entry of headerEntries) {
      await prisma.siteConfig.upsert({
        where: { key: entry.key },
        update: { value: entry.value, group: entry.group },
        create: entry,
      });
    }

    const footerEntries = Object.entries(defaultFooter).map(([key, value]) => ({
      key,
      value: String(value),
      group: "footer",
    }));
    for (const entry of footerEntries) {
      await prisma.siteConfig.upsert({
        where: { key: entry.key },
        update: { value: entry.value, group: entry.group },
        create: entry,
      });
    }

    await prisma.siteConfig.upsert({
      where: { key: "helpLinks" },
      update: { value: JSON.stringify(defaultFooterHelpLinks), group: "footer" },
      create: { key: "helpLinks", value: JSON.stringify(defaultFooterHelpLinks), group: "footer" },
    });

    await prisma.siteConfig.upsert({
      where: { key: "navigation" },
      update: { value: JSON.stringify(navigation), group: "nav" },
      create: { key: "navigation", value: JSON.stringify(navigation), group: "nav" },
    });

    // 2. Seed testimonials
    const existingTestimonials = await prisma.testimonial.count();
    if (existingTestimonials === 0) {
      for (let i = 0; i < testimonials.length; i++) {
        const t = testimonials[i];
        await prisma.testimonial.create({
          data: {
            name: t.name,
            role: t.role ?? "",
            quote: t.quote,
            rating: t.rating,
            sortOrder: i,
          },
        });
      }
    }
    results.testimonials = await prisma.testimonial.count();

    // 3. Seed FAQs
    const existingFaqs = await prisma.faqEntry.count();
    if (existingFaqs === 0) {
      for (let i = 0; i < faqs.length; i++) {
        const f = faqs[i];
        await prisma.faqEntry.create({
          data: { question: f.question, answer: f.answer, sortOrder: i },
        });
      }
    }
    results.faqs = await prisma.faqEntry.count();

    // 4. Seed categories / collections
    const categorySlugMap = new Map<string, string>();
    for (let i = 0; i < staticCollections.length; i++) {
      const collection = staticCollections[i];
      const row = await prisma.category.upsert({
        where: { slug: collection.slug },
        update: {
          name: collection.name,
          eyebrow: collection.eyebrow,
          description: collection.description,
          active: !collection.futureReady,
          sortOrder: i,
        },
        create: {
          slug: collection.slug,
          name: collection.name,
          eyebrow: collection.eyebrow,
          description: collection.description,
          active: !collection.futureReady,
          sortOrder: i,
        },
      });
      categorySlugMap.set(collection.slug, row.id);
    }
    results.categories = await prisma.category.count();

    // 5. Seed products
    for (const p of staticProducts) {
      const categoryId =
        categorySlugMap.get(p.categoryId) ??
        categorySlugMap.get(p.collectionIds[0] ?? "") ??
        null;
      const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
      if (!existing) {
        const metadata = {
          metrics: p.metrics,
          features: p.features,
          specifications: p.specifications,
          packageContents: p.packageContents,
          usageSteps: p.usageSteps,
          seo: p.seo,
        };
        const created = await prisma.product.create({
          data: {
            slug: p.slug,
            title: p.title,
            eyebrow: p.eyebrow,
            subtitle: p.subtitle ?? "",
            description: p.description,
            price: p.price,
            compareAtPrice: p.compareAtPrice,
            currency: p.currency,
            status: "active",
            rating: p.rating,
            reviewCount: p.reviewCount,
            inventory: p.variants?.reduce((s, v) => s + v.inventory, 0) ?? 0,
            tags: p.tags?.join(","),
            imagesJson: JSON.stringify(p.images),
            metadataJson: JSON.stringify(metadata),
            categoryId,
          },
        });
        // Seed variants
        if (p.variants) {
          for (const v of p.variants) {
            await prisma.productVariant.create({
              data: {
                productId: created.id,
                name: v.name,
                sku: v.sku,
                price: v.price,
                inventory: v.inventory,
                color: v.color,
              },
            });
          }
        }
      } else if (!existing.categoryId && categoryId) {
        await prisma.product.update({
          where: { id: existing.id },
          data: { categoryId },
        });
      }
    }
    results.products = await prisma.product.count();

    // 5. Seed homepage content blocks
    const heroBlocks = [
      { page: "home", section: "hero", key: "title", value: "عرف جسمك بزاف ديال التفاصيل، فثواني." },
      { page: "home", section: "hero", key: "subtitle", value: "ميزان ذكي كيقيس ليك الوزن، الشحم، العضلات، الماء وأكثر من 13 مؤشر. كولشي كيمشي مباشرة لتيليفونك." },
      { page: "home", section: "hero", key: "badge", value: "الميزان الذكي رقم 1 فالمغرب" },
      { page: "home", section: "hero", key: "cta_whatsapp", value: "طلب عبر واتساب" },
      { page: "home", section: "hero", key: "cta_buy", value: "شري دابا" },
      { page: "home", section: "announcement", key: "text", value: defaultAnnouncement.text },
      { page: "home", section: "announcement", key: "chip1", value: defaultAnnouncement.chip1 },
      { page: "home", section: "announcement", key: "chip2", value: defaultAnnouncement.chip2 },
      { page: "home", section: "announcement", key: "chip3", value: defaultAnnouncement.chip3 },
      ...Object.entries(defaultHomeSections).map(([key, value]) => ({
        page: "home",
        section: "sections",
        key,
        value,
      })),
      {
        page: "home",
        section: "sections",
        key: "trust_chips",
        value: JSON.stringify(defaultTrustChips),
      },
    ];
    for (const b of heroBlocks) {
      await prisma.contentBlock.upsert({
        where: { page_section_key: { page: b.page, section: b.section, key: b.key } },
        update: { value: b.value },
        create: b,
      });
    }
    results.contentBlocks = await prisma.contentBlock.count();

    const existingBlogPosts = await prisma.blogPost.count();
    if (existingBlogPosts === 0) {
      for (let i = 0; i < blogArticles.length; i++) {
        const article = blogArticles[i];
        await prisma.blogPost.create({
          data: {
            slug: article.slug,
            title: article.title,
            category: article.category,
            excerpt: article.excerpt,
            readTime: article.readTime,
            body: "هاد المقال جاهز للتحرير من لوحة التحكم. يمكنك إضافة محتوى تعليمي، روابط داخلية، ونصائح صحية مفصلة.",
            sortOrder: i,
          },
        });
      }
    }
    results.blogPosts = await prisma.blogPost.count();

    return NextResponse.json({ ok: true, seeded: results });
  } catch (err) {
    return NextResponse.json(
      { error: "فشل العملية", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
