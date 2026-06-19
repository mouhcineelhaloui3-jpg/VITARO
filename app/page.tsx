import { HomeLanding } from "@/features/home/home-landing";
import { getProducts, getBrand } from "@/lib/cms/db";
import { getPageSpacing } from "@/lib/cms/site";
import { buildWhatsAppUrl } from "@/lib/cms/whatsapp";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [allProducts, brand, spacing] = await Promise.all([
    getProducts(),
    getBrand(),
    getPageSpacing("home"),
  ]);
  const product = allProducts[0];

  if (!product) {
    throw new Error("No products configured for the storefront.");
  }

  const whatsappOrderLink = buildWhatsAppUrl(
    brand.whatsapp,
    `سلام، بغيت نطلب ${product.title} بثمن ${product.price} درهم`,
  );

  return <HomeLanding product={product} whatsappUrl={whatsappOrderLink} spacing={spacing} />;
}
