import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const section = searchParams.get("section");

  try {
    const blocks = await prisma.contentBlock.findMany({
      where: {
        ...(page ? { page } : {}),
        ...(section ? { section } : {}),
      },
      orderBy: [{ page: "asc" }, { section: "asc" }, { key: "asc" }],
    });
    return NextResponse.json(blocks);
  } catch {
    return NextResponse.json([]);
  }
}

const blockSchema = z.object({
  page: z.string().min(1),
  section: z.string().min(1),
  key: z.string().min(1),
  value: z.string(),
  type: z.string().default("text"),
});

export async function PUT(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];

    const results = await Promise.all(
      items.map(async (item) => {
        const parsed = blockSchema.safeParse(item);
        if (!parsed.success) return null;
        const { page, section, key, value, type } = parsed.data;
        return prisma.contentBlock.upsert({
          where: { page_section_key: { page, section, key } },
          update: { value, type },
          create: { page, section, key, value, type },
        });
      }),
    );

    return NextResponse.json({ ok: true, count: results.filter(Boolean).length });
  } catch {
    return NextResponse.json({ error: "فشل الحفظ" }, { status: 500 });
  }
}
