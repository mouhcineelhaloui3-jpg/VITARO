import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth-server";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.blogPost.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]);
  }
}

const createSchema = z.object({
  slug: z.string().min(1).max(120),
  title: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  excerpt: z.string().min(1).max(500),
  body: z.string().max(10000).default(""),
  readTime: z.string().max(50).default(""),
  status: z.enum(["published", "draft"]).default("published"),
  sortOrder: z.number().int().default(0),
});

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });

    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.blogPost.create({ data: parsed.data });
    return NextResponse.json(row, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل الإنشاء" }, { status: 500 });
  }
}
