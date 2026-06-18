import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب المنتجات" }, { status: 500 });
  }
}
