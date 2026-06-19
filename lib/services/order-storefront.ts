import type { PaymentMethod } from "@prisma/client";

import { getStoreSettings, calculateOrderTotals } from "@/lib/cms/store-settings";
import { hasProductionDb } from "@/lib/cms/has-db";

export type CheckoutInput = {
  productSlug: string;
  variantId?: string;
  quantity: number;
  customerName: string;
  gender: string;
  phone: string;
  address: string;
  city?: string;
  paymentMethod: PaymentMethod;
};

function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "").trim();
}

function orderEmailFromPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `order+${digits || Date.now()}@vitaro.local`;
}

export async function createStorefrontOrder(input: CheckoutInput) {
  if (!hasProductionDb()) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  const { prisma } = await import("@/lib/prisma");
  const settings = await getStoreSettings();

  const product = await prisma.product.findFirst({
    where: { slug: input.productSlug, status: "active" },
    include: { variants: true },
  }) ?? await prisma.product.findUnique({
    where: { slug: input.productSlug },
    include: { variants: true },
  });

  if (!product) {
    throw new Error("PRODUCT_NOT_AVAILABLE");
  }

  const variant =
    (input.variantId
      ? product.variants.find((row) => row.id === input.variantId)
      : undefined) ?? product.variants[0];

  const quantity = Math.max(1, Math.floor(input.quantity));
  const unitPrice = variant ? variant.price.toNumber() : product.price.toNumber();
  const variantName = variant?.name ?? "افتراضي";
  const variantSku = variant?.sku ?? `SKU-${product.slug}`;
  const subtotal = unitPrice * quantity;
  const totals = calculateOrderTotals(subtotal, settings);

  const order = await prisma.order.create({
    data: {
      email: orderEmailFromPhone(input.phone),
      customerName: input.customerName.trim() || "زبون",
      phone: normalizePhone(input.phone),
      gender: input.gender.trim() || "غير محدد",
      address: input.address.trim() || "غير محدد",
      city: input.city?.trim() || null,
      status: "PENDING",
      paymentMethod: input.paymentMethod,
      subtotal: totals.total - totals.shipping - totals.tax,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
      currency: product.currency,
      items: {
        create: {
          productId: product.id,
          name: `${product.title} — ${variantName}`,
          sku: variantSku,
          quantity,
          price: unitPrice,
        },
      },
    },
    include: { items: true },
  });

  return {
    orderId: order.id,
    total: order.total.toNumber(),
    currency: order.currency,
  };
}

export function buildOrderWhatsAppMessage(input: {
  customerName: string;
  gender: string;
  phone: string;
  address: string;
  city?: string;
  productTitle: string;
  variantName: string;
  quantity: number;
  total: number;
  currency: string;
  paymentLabel: string;
}) {
  const lines = [
    "سلام، بغيت نطلب من موقع فيتارو:",
    "",
    `الاسم: ${input.customerName}`,
    `الجنس: ${input.gender}`,
    `الهاتف: ${input.phone}`,
    `العنوان: ${input.address}`,
    input.city ? `المدينة: ${input.city}` : null,
    "",
    `المنتج: ${input.productTitle}`,
    `اللون/المتغير: ${input.variantName}`,
    `الكمية: ${input.quantity}`,
    `الإجمالي: ${input.total} ${input.currency}`,
    `الدفع: ${input.paymentLabel}`,
  ].filter(Boolean);

  return lines.join("\n");
}
