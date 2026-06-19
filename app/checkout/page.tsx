import { notFound } from "next/navigation";

import { Section } from "@/components/layout/section";
import { CheckoutPanel } from "@/features/checkout/checkout-panel";
import { getProductBySlug, getProducts, getBrand } from "@/lib/cms/db";
import { getStoreSettings } from "@/lib/cms/store-settings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "إتمام الطلب",
  description: "أكمل طلبك عبر الموقع أو واتساب مع بياناتك الشخصية.",
};

type CheckoutPageProps = {
  searchParams: Promise<{ product?: string; variant?: string; qty?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const [brand, settings, products] = await Promise.all([
    getBrand(),
    getStoreSettings(),
    getProducts(),
  ]);

  const productSlug = params.product?.trim();
  const product = productSlug
    ? await getProductBySlug(productSlug)
    : products[0];

  if (!product) {
    notFound();
  }

  const initialQuantity = Math.max(1, Math.min(20, Number(params.qty) || 1));

  return (
    <Section
      eyebrow="إتمام الطلب"
      title="اطلب عبر الموقع أو واتساب."
      description="أدخل اسمك، الجنس، رقم الهاتف، والعنوان. يمكنك تأكيد الطلب على الموقع أو إرسال نفس البيانات عبر واتساب."
    >
      <CheckoutPanel
        product={product}
        brandWhatsapp={brand.whatsapp}
        settings={settings}
        initialVariantId={params.variant}
        initialQuantity={initialQuantity}
      />
    </Section>
  );
}
