import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth-server";

const updateSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  name: z.string().min(1).max(200).optional(),
  eyebrow: z.string().max(100).optional(),
  description: z.string().max(1000).optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  try {
    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }

    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.category.update({
      where: { id },
      data: parsed.data,
      include: { _count: { select: { products: true } } },
    });

    return NextResponse.json({
      id: row.id,
      slug: row.slug,
      name: row.name,
      eyebrow: row.eyebrow ?? "",
      description: row.description ?? "",
      active: row.active,
      sortOrder: row.sortOrder,
      productCount: row._count.products,
    });
  } catch {
    return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  try {
    const { prisma } = await import("@/lib/prisma");
    const linked = await prisma.product.count({ where: { categoryId: id } });
    if (linked > 0) {
      return NextResponse.json(
        { error: `لا يمكن الحذف — القسم مرتبط بـ ${linked} منتج` },
        { status: 409 },
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
