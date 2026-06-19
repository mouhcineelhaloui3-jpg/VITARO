"use client";

import useSWR from "swr";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Bell,
  ClipboardList,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  adminControlAreas,
  adminOperationCards,
  moduleBadgeVariant,
  resolveAdminModules,
} from "@/lib/admin/module-registry";
import { StorefrontSpacingPanel } from "@/features/admin/storefront-spacing-panel";
import { formatCurrency } from "@/lib/utils";
import type { AdminDashboardDTO } from "@/types/admin";
import { useEffect, useState } from "react";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  });

function SkeletonCard() {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <div className="w-full">
          <div className="h-4 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-8 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-3 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </Card>
  );
}

export function DashboardClient() {
  const { data: stats, error, isLoading } = useSWR<AdminDashboardDTO>(
    "/api/admin/analytics",
    fetcher,
    { refreshInterval: 15000 },
  );

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setToast("حدث خطأ أثناء جلب البيانات. يرجى المحاولة لاحقاً.");
      const t = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-heading">نظرة عامة</h2>
          <p className="mt-1 text-sm text-muted-fg">جاري تحميل البيانات الحية...</p>
        </section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/20 dark:bg-red-500/10">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
            حدث خطأ في تحميل البيانات
          </h3>
          <p className="mt-2 text-sm text-red-500 dark:text-red-300">
            يرجى التأكد من تشغيل قاعدة البيانات ومن إعداد DATABASE_URL بشكل صحيح.
          </p>
        </div>
      </div>
    );
  }

  const isLive = stats.status === "live";
  const modules = resolveAdminModules(stats, {
    pixelsConfigured: stats.pixelsConfigured,
  });

  const dashboardStats = [
    {
      icon: TrendingUp,
      label: "الإيرادات",
      value: isLive ? formatCurrency(stats.metrics.revenue) : "—",
      delta: isLive ? "إجمالي المدفوعات" : "لا توجد بيانات بعد",
      color: "text-emerald-600",
    },
    {
      icon: ShoppingBag,
      label: "الطلبات",
      value: isLive ? stats.metrics.orders.toString() : "—",
      delta: isLive ? "إجمالي الطلبات" : "في انتظار أول طلب",
      color: "text-blue-600",
    },
    {
      icon: Users,
      label: "المستخدمين",
      value: isLive ? stats.metrics.users.toString() : "—",
      delta: isLive ? "العملاء والمسؤولين" : "البيانات فارغة",
      color: "text-violet-600",
    },
    {
      icon: Package,
      label: "المنتجات",
      value: isLive ? stats.metrics.products.toString() : "—",
      delta: isLive ? "المنتجات المتاحة" : "البيانات فارغة",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-red-600 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-heading">نظرة عامة</h2>
        <p className="mt-1 text-sm text-muted-fg">مؤشرات الأداء والنشاط — بيانات حقيقية فقط.</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden p-5 transition hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-fg">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-heading">{stat.value}</p>
                <p className={`mt-1 text-xs font-medium ${stat.color}`}>{stat.delta}</p>
              </div>
              <span className={`rounded-2xl bg-zinc-50 p-2.5 dark:bg-white/5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div id="analytics" className="grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
              <h2 className="font-semibold text-heading">الإيرادات</h2>
            </div>
            <Badge variant={isLive ? "success" : "neutral"}>
              {isLive ? "حي" : "بانتظار البيانات"}
            </Badge>
          </div>
          <div className="flex h-48 items-end gap-2">
            {(Array.isArray(stats.chart) ? stats.chart : []).map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-lg bg-emerald-100 transition-all dark:bg-emerald-500/10"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          {!isLive && (
            <p className="mt-4 text-center text-xs text-subtle">
              ستظهر البيانات تلقائياً مع أول طلبات ونشاطات المتجر.
            </p>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-emerald-500" />
            <h2 className="font-semibold text-heading">النشاطات الأخيرة</h2>
          </div>
          <div className="space-y-3">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 text-sm dark:bg-white/5"
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="font-medium text-body">{event.label}</span>
                  </div>
                  <span className="text-xs text-subtle">{event.time}</span>
                </div>
              ))
            ) : (
              <div className="flex h-40 items-center justify-center text-center text-sm text-subtle">
                لا توجد نشاطات مسجلة بعد.
              </div>
            )}
          </div>
        </Card>
      </div>

      <StorefrontSpacingPanel />

      <div id="commerce">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-heading">وحدات النظام</h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <Activity className="h-3.5 w-3.5" />
            اضغط على أي وحدة للفتح
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const content = (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant={moduleBadgeVariant(module.metric)}>{module.metric}</Badge>
                  <module.icon className="h-4 w-4 text-subtle transition group-hover:text-emerald-500" />
                </div>
                <h3 className="font-semibold text-heading">{module.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-fg">{module.description}</p>
                {module.active ? (
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                    فتح الوحدة
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="mt-4 inline-block text-xs font-medium text-subtle">قريباً</span>
                )}
              </>
            );

            if (!module.active) {
              return (
                <Card key={module.id} className="p-5 opacity-75">
                  {content}
                </Card>
              );
            }

            return (
              <Link key={module.id} href={module.href} className="group block">
                <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg">
                  {content}
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-heading">أقسام التحكم</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adminControlAreas.map((area) => (
            <Card key={area.title} className="p-5">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <area.icon className="h-4 w-4" />
                </span>
                <h3 className="font-semibold text-heading">{area.title}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {area.items.map((item) =>
                  item.active && item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      key={item.label}
                      className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-400 dark:border-white/10 dark:bg-white/5"
                    >
                      {item.label}
                    </span>
                  ),
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {adminOperationCards.map((item) => {
          const body = (
            <>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-heading">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-fg">{item.body}</p>
              {"href" in item && item.active ? (
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                  فتح
                  <ArrowLeft className="h-4 w-4" />
                </span>
              ) : (
                <span className="mt-3 inline-block text-xs text-subtle">قريباً</span>
              )}
            </>
          );

          if ("href" in item && item.active && item.href) {
            return (
              <Link key={item.title} href={item.href} className="block">
                <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                  {body}
                </Card>
              </Link>
            );
          }

          return (
            <Card key={item.title} className="p-5 opacity-80">
              {body}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
