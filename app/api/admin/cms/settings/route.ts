import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const configs = await prisma.siteConfig.findMany({ orderBy: { group: "asc" } });
    return NextResponse.json(configs);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

const upsertSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string(),
  type: z.string().default("text"),
  group: z.string().default("general"),
});

export async function PUT(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];

    const results = await Promise.all(
      items.map(async (item) => {
        const parsed = upsertSchema.safeParse(item);
        if (!parsed.success) return null;
        const { key, value, type, group } = parsed.data;
        return prisma.siteConfig.upsert({
          where: { key },
          update: { value, type, group },
          create: { key, value, type, group },
        });
      }),
    );

    return NextResponse.json({ ok: true, count: results.filter(Boolean).length });
  } catch {
    return NextResponse.json({ error: "فشل الحفظ" }, { status: 500 });
  }
}
