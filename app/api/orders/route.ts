import { NextResponse } from "next/server";
import { z } from "zod";

import { createStorefrontOrder } from "@/lib/services/order-storefront";

function normalizeOrderBody(body: unknown) {
  if (!body || typeof body !== "object") return body;

  const raw = body as Record<string, unknown>;

  return {
    productSlug: typeof raw.productSlug === "string" ? raw.productSlug.trim() : raw.productSlug,
    variantId:
      typeof raw.variantId === "string" && raw.variantId.trim()
        ? raw.variantId.trim()
        : undefined,
    quantity: raw.quantity ?? 1,
    customerName: typeof raw.customerName === "string" ? raw.customerName.trim() : "",
    gender: typeof raw.gender === "string" && raw.gender.trim() ? raw.gender.trim() : "غير محدد",
    phone: typeof raw.phone === "string" ? raw.phone.trim() : "",
    address: typeof raw.address === "string" ? raw.address.trim() : "",
    city: typeof raw.city === "string" && raw.city.trim() ? raw.city.trim() : undefined,
    paymentMethod: raw.paymentMethod ?? "COD",
  };
}

const orderSchema = z.object({
  productSlug: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.coerce.number().int().min(1).max(20),
  customerName: z
    .string()
    .max(120)
    .transform((value) => value || "زبون"),
  gender: z.string().max(40).default("غير محدد"),
  phone: z.string().min(6).max(30),
  address: z
    .string()
    .max(500)
    .transform((value) => value || "غير محدد"),
  city: z.string().max(120).optional(),
  paymentMethod: z.enum(["COD", "CARD", "WALLET"]).default("COD"),
});

export async function POST(req: Request) {
  try {
    const parsed = orderSchema.safeParse(normalizeOrderBody(await req.json()));
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      if (firstIssue?.path[0] === "phone") {
        return NextResponse.json({ error: "رقم الهاتف مطلوب (6 أرقام على الأقل)" }, { status: 400 });
      }
      if (firstIssue?.path[0] === "productSlug") {
        return NextResponse.json({ error: "المنتج غير محدد" }, { status: 400 });
      }
      return NextResponse.json({ error: "بيانات الطلب غير صالحة" }, { status: 400 });
    }

    const result = await createStorefrontOrder(parsed.data);
    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "DATABASE_NOT_CONFIGURED") {
        return NextResponse.json(
          { error: "الطلبات غير متاحة حالياً. تواصل معنا عبر واتساب." },
          { status: 503 },
        );
      }
      if (error.message === "PRODUCT_NOT_AVAILABLE") {
        return NextResponse.json({ error: "المنتج غير متاح للطلب" }, { status: 404 });
      }
      if (error.message === "VARIANT_NOT_FOUND") {
        return NextResponse.json({ error: "المتغير المختار غير متاح" }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "فشل إنشاء الطلب" }, { status: 500 });
  }
}
