import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth-server";

const bulkSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export async function DELETE(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const parsed = bulkSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "حدد طلباً واحداً على الأقل" }, { status: 400 });
    }

    const { prisma } = await import("@/lib/prisma");
    const result = await prisma.order.deleteMany({
      where: { id: { in: parsed.data.ids } },
    });

    return NextResponse.json({ ok: true, deleted: result.count });
  } catch {
    return NextResponse.json({ error: "فشل حذف الطلبات" }, { status: 500 });
  }
}
