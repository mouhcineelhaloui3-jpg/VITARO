import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth-server";
import { mapAdminOrder } from "@/lib/services/order-admin";

const updateSchema = z.object({
  status: z.enum(["DRAFT", "PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"]),
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
    const row = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
      include: {
        items: true,
      },
    });

    return NextResponse.json(mapAdminOrder(row));
  } catch {
    return NextResponse.json({ error: "فشل تحديث الطلب" }, { status: 500 });
  }
}
