import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const rows = await prisma.faqEntry.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]);
  }
}

const createSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(2000),
  sortOrder: z.number().int().default(0),
});

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    const row = await prisma.faqEntry.create({ data: parsed.data });
    return NextResponse.json(row, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل الإنشاء" }, { status: 500 });
  }
}
