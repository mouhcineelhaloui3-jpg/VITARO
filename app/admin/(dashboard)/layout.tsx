import Link from "next/link";
import { getServerSession } from "next-auth";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import { AdminQuickActions } from "@/features/admin/quick-actions";

const navItems = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/admin/products", label: "المنتجات", icon: ShoppingBag },
  { href: "/admin/categories", label: "الأقسام", icon: Boxes },
  { href: "/admin/orders", label: "الطلبات", icon: ClipboardList },
  { href: "/admin/content", label: "المحتوى والصفحات", icon: FileText },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1440px]">
        <aside
          data-surface="light"
          className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-surface bg-surface px-4 py-6 dark:border-white/10 dark:bg-[#111827] dark:[--surface-bg:#111827] dark:[--surface-fg-heading:#f8fafc] dark:[--surface-fg-body:#e2e8f0] dark:[--surface-fg-muted:#cbd5e1] dark:[--surface-fg-subtle:#94a3b8] dark:[--surface-icon:#f8fafc] dark:[--surface-border:rgba(255,255,255,0.1)] lg:flex"
        >
          <div className="mb-8 px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-surface-subtle">
              فيتارو
            </p>
            <h1 className="mt-1 text-lg font-semibold text-surface-heading">لوحة التحكم</h1>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-surface-body transition hover:bg-zinc-50 hover:text-surface-heading dark:hover:bg-white/5 dark:hover:text-[#f8fafc]"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-2 border-t border-surface pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-surface-muted transition hover:bg-zinc-50 hover:text-surface-heading dark:hover:bg-white/5 dark:hover:text-[#f8fafc]"
            >
              <Home className="h-4 w-4" />
              المتجر
            </Link>
            <Link
              href="/api/auth/signout"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-border bg-card/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-subtle">
                  إدارة المنصة
                </p>
                <p className="text-sm text-muted-fg">
                  مرحباً، {session?.user?.name ?? "المسؤول"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  جلسة آمنة
                </span>
              </div>
            </div>
          </header>

          <div className="px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </div>
      </div>

      <AdminQuickActions />
    </div>
  );
}
