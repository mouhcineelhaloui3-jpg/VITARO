import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const products = await prisma.product.findMany({
      include: { variants: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([]);
  }
}

const updateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200).optional(),
  eyebrow: z.string().max(100).optional(),
  subtitle: z.string().max(300).optional(),
  description: z.string().max(5000).optional(),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().optional().nullable(),
  status: z.enum(["active", "draft", "archived"]).optional(),
  tags: z.string().optional(),
});

export async function PUT(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });

    const { id, price, compareAtPrice, ...rest } = parsed.data;
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(price !== undefined ? { price } : {}),
        ...(compareAtPrice !== undefined ? { compareAtPrice } : {}),
      },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  }
}
