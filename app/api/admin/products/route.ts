import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-server";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.startsWith("file:")) {
    return NextResponse.json([]);
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([]);
  }
}
