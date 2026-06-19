import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth-server";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(
      rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        eyebrow: row.eyebrow ?? "",
        description: row.description ?? "",
        active: row.active,
        sortOrder: row.sortOrder,
        productCount: row._count.products,
      })),
    );
  } catch {
    return NextResponse.json([]);
  }
}

const createSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "استخدم حروفاً إنجليزية صغيرة وأرقام وشرطات فقط"),
  name: z.string().min(1).max(200),
  eyebrow: z.string().max(100).default(""),
  description: z.string().max(1000).default(""),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }

    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.category.create({ data: parsed.data });
    return NextResponse.json(
      {
        id: row.id,
        slug: row.slug,
        name: row.name,
        eyebrow: row.eyebrow ?? "",
        description: row.description ?? "",
        active: row.active,
        sortOrder: row.sortOrder,
        productCount: 0,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "فشل الإنشاء — قد يكون الـ slug مستخدماً مسبقاً" }, { status: 500 });
  }
}
