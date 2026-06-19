import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth-server";
import { mapAdminOrder } from "@/lib/services/order-admin";

const statusFilter = z.enum([
  "DRAFT",
  "PENDING",
  "PAID",
  "FULFILLED",
  "CANCELLED",
  "REFUNDED",
]);

export async function GET(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");
  const parsedStatus = statusParam ? statusFilter.safeParse(statusParam) : null;

  try {
    const { prisma } = await import("@/lib/prisma");
    const [rows, allRows] = await Promise.all([
      prisma.order.findMany({
        where: parsedStatus?.success ? { status: parsedStatus.data } : undefined,
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          user: { select: { name: true, email: true } },
          items: true,
        },
      }),
      prisma.order.findMany({
        select: { status: true, total: true },
      }),
    ]);

    const orders = rows.map(mapAdminOrder);
    const summary = {
      total: allRows.length,
      pending: allRows.filter((order) => order.status === "PENDING").length,
      paid: allRows.filter((order) => order.status === "PAID").length,
      fulfilled: allRows.filter((order) => order.status === "FULFILLED").length,
      revenue: allRows
        .filter((order) => order.status === "PAID" || order.status === "FULFILLED")
        .reduce((sum, order) => sum + order.total.toNumber(), 0),
    };

    return NextResponse.json({ orders, summary });
  } catch {
    return NextResponse.json({ error: "فشل جلب الطلبات" }, { status: 500 });
  }
}
