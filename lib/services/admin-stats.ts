import type { AdminDashboardDTO } from "@/types/admin";

const EVENT_LABELS: Record<string, string> = {
  product_view: "مشاهدة منتج",
  add_to_cart: "إضافة للسلة",
  whatsapp_click: "طلب واتساب",
  initiate_checkout: "بدء الطلب",
  purchase_click: "نقرة شراء",
};

function buildChart(revenue: number, orders: number): number[] {
  const base = Math.max(revenue / 100, orders * 8, 12);
  return Array.from({ length: 12 }, (_, index) => {
    const wave = Math.sin(index * 0.9) * 18;
    const growth = index * 4;
    return Math.round(Math.min(95, Math.max(18, base + wave + growth)));
  });
}

export async function getAdminDashboardStats(): Promise<AdminDashboardDTO> {
  const empty: AdminDashboardDTO = {
    status: "empty",
    metrics: {
      revenue: 0,
      orders: 0,
      conversionRate: 0,
      whatsappLeads: 0,
      users: 0,
      products: 0,
    },
    chart: buildChart(0, 0),
    recentActivity: [],
  };

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:")) {
    return empty;
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    const [orders, revenueResult, whatsappLeads, productViews, recentEvents, users, products, storeConfigs] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { total: true }, where: { status: "PAID" } }),
        prisma.analyticsEvent.count({ where: { eventName: "whatsapp_click" } }),
        prisma.analyticsEvent.count({ where: { eventName: "product_view" } }),
        prisma.analyticsEvent.findMany({
          take: 6,
          orderBy: { createdAt: "desc" },
          select: { id: true, eventName: true, createdAt: true },
        }),
        prisma.user.count(),
        prisma.product.count(),
        prisma.siteConfig.findMany({ where: { group: "store" } }),
      ]);

    const storeMap = Object.fromEntries(storeConfigs.map((row) => [row.key, row.value]));
    const pixelsConfigured = Boolean(
      storeMap.metaPixelId?.trim() ||
        storeMap.tiktokPixelId?.trim() ||
        storeMap.gaMeasurementId?.trim(),
    );

    const revenue = revenueResult._sum.total ? Number(revenueResult._sum.total) : 0;
    const conversionRate =
      productViews > 0 ? ((orders + whatsappLeads) / productViews) * 100 : 0;

    const hasData = orders > 0 || revenue > 0 || whatsappLeads > 0 || productViews > 0 || users > 0 || products > 0;

    return {
      status: hasData ? "live" : "empty",
      metrics: {
        revenue,
        orders,
        conversionRate,
        whatsappLeads,
        users,
        products,
      },
      chart: buildChart(revenue, orders),
      recentActivity: recentEvents.map((event) => ({
        id: event.id,
        label: EVENT_LABELS[event.eventName] ?? "نشاط جديد",
        time: event.createdAt.toLocaleTimeString("ar-MA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
      pixelsConfigured,
    };
  } catch {
    return empty;
  }
}
