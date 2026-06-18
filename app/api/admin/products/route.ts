import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth-server";
import {
  getAdminProductRows,
  hasProductDb,
  upsertAdminProduct,
} from "@/lib/services/product-admin";

const updateSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1).max(200).optional(),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().nullable().optional(),
});

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const products = await getAdminProductRows();
  return NextResponse.json(products);
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
