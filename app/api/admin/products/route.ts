import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth-server";
import {
  createAdminProduct,
  getAdminProductRows,
  hasProductDb,
  upsertAdminProduct,
} from "@/lib/services/product-admin";

const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(80),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "استخدم كود لون hex مثل #111111"),
  inventory: z.number().int().min(0),
  sku: z.string().max(80).optional(),
});

const updateSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1).max(200).optional(),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().nullable().optional(),
  variants: z.array(variantSchema).min(1).optional(),
});

const createSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9\u0600-\u06FF-]+$/, "استخدم حروفاً وأرقاماً وشرطات فقط في الرابط")
    .optional(),
  description: z.string().max(2000).optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().nullable().optional(),
  variants: z.array(variantSchema).min(1),
});

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const products = await getAdminProductRows();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  if (!hasProductDb()) {
    return NextResponse.json(
      {
        error:
          "قاعدة البيانات غير مفعّلة. أضف DATABASE_URL في Vercel ثم أعد النشر لإضافة منتجات.",
      },
      { status: 503 },
    );
  }

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }

    const product = await createAdminProduct(parsed.data);
    return NextResponse.json({ ok: true, product }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "VARIANTS_REQUIRED") {
      return NextResponse.json({ error: "أضف لوناً واحداً على الأقل" }, { status: 400 });
    }

    return NextResponse.json({ error: "فشل إنشاء المنتج" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  if (!hasProductDb()) {
    return NextResponse.json(
      {
        error:
          "قاعدة البيانات غير مفعّلة. أضف DATABASE_URL في Vercel ثم أعد النشر لتفعيل حفظ الأسعار.",
      },
      { status: 503 },
    );
  }

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }

    const product = await upsertAdminProduct(parsed.data);
    return NextResponse.json({ ok: true, product });
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ error: "فشل حفظ المنتج" }, { status: 500 });
  }
}
