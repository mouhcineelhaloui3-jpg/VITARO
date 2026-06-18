import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: { select: { name: true, email: true } },
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب الطلبات" }, { status: 500 });
  }
}
