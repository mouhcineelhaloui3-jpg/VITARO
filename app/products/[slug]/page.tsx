import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PremiumBuyBox } from "@/features/products/premium-buy-box";
import { PremiumProductGallery } from "@/features/products/premium-product-gallery";
import { ProductPageSections } from "@/features/products/product-page-sections";
import { getProductBySlug, getProducts, getBrand } from "@/lib/cms/db";
import { buildWhatsAppUrl } from "@/lib/cms/whatsapp";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.seo.title,
    description: product.seo.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const brand = await getBrand();
  const whatsappUrl = buildWhatsAppUrl(
    brand.whatsapp,
    `سلام، بغيت نطلب ${product.title} بثمن ${product.price} درهم`,
  );

  return (
    <>
      <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <PremiumProductGallery product={product} />
          <PremiumBuyBox product={product} whatsappUrl={whatsappUrl} />
        </div>
      </section>

      <ProductPageSections product={product} />

      <div className="h-20 lg:hidden" aria-hidden />
    </>
  );
}
