import { NextResponse } from "next/server";
import { z } from "zod";

import { createStorefrontOrder } from "@/lib/services/order-storefront";

const orderSchema = z.object({
  productSlug: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1).max(20),
  customerName: z.string().min(2).max(120),
  gender: z.string().min(1).max(40),
  phone: z.string().min(8).max(30),
  address: z.string().min(5).max(500),
  city: z.string().max(120).optional(),
  paymentMethod: z.enum(["COD", "CARD", "WALLET"]).default("COD"),
});

export async function POST(req: Request) {
  try {
    const parsed = orderSchema.safeParse(await req.json());
    if (!parsed.success) {
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
