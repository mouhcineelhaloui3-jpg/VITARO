import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Boxes,
  Database,
  FileText,
  ImageIcon,
  Lock,
  Megaphone,
  Palette,
  Shield,
  ShoppingBag,
} from "lucide-react";

import type { AdminDashboardDTO } from "@/types/admin";

export type ModuleStatusLabel = "جاهز" | "حي" | "متصل" | "مخطط";

export type AdminSystemModule = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  metric: ModuleStatusLabel;
};

export type AdminAreaItem = {
  label: string;
  href?: string;
  active: boolean;
};

export type AdminArea = {
  icon: LucideIcon;
  title: string;
  items: AdminAreaItem[];
};

export const adminSystemModules: AdminSystemModule[] = [
  {
    id: "homepage",
    title: "منشئ الصفحة الرئيسية",
    description: "بناء الأقسام، العروض، التقييمات، وتحسين محركات البحث.",
    href: "/admin/content?open=hero",
    icon: FileText,
    active: true,
    metric: "جاهز",
  },
  {
    id: "catalog",
    title: "المنتجات والمخزون",
    description: "المنتجات، المتغيرات، المجموعات، المخزون، والعروض المتقاطعة.",
    href: "/admin/products",
    icon: ShoppingBag,
    active: true,
    metric: "جاهز",
  },
  {
    id: "orders",
    title: "الطلبات والعملاء",
    description: "تتبع طلبات الدفع عند الاستلام (COD)، وملفات العملاء.",
    href: "/admin/orders",
    icon: Boxes,
    active: true,
    metric: "حي",
  },
  {
    id: "marketing",
    title: "التسويق والبكسل",
    description: "فيسبوك بكسل، تيك توك بكسل، وكوبونات الخصم.",
    href: "/admin/settings#pixels",
    icon: Megaphone,
    active: true,
    metric: "متصل",
  },
  {
    id: "appearance",
    title: "المظهر والتخصيص",
    description: "ألوان العلامة، الوضع الداكن، الخطوط.",
    href: "/admin/content?open=header",
    icon: Palette,
    active: true,
    metric: "جاهز",
  },
  {
    id: "security",
    title: "الأمان والسجلات",
    description: "سجلات النشاطات، الصلاحيات والمستخدمين.",
    href: "/admin",
    icon: Shield,
    active: false,
    metric: "مخطط",
  },
];

export const adminControlAreas: AdminArea[] = [
  {
    icon: Boxes,
    title: "التجارة",
    items: [
      { label: "الطلبات", href: "/admin/orders", active: true },
      { label: "العملاء", href: "/admin/orders", active: true },
      { label: "المنتجات", href: "/admin/products", active: true },
      { label: "المجموعات", href: "/admin/categories", active: true },
      { label: "المخزون", href: "/admin/products", active: true },
      { label: "الكوبونات", active: false },
    ],
  },
  {
    icon: BarChart3,
    title: "التحليلات",
    items: [
      { label: "الإيرادات", href: "/admin#analytics", active: true },
      { label: "التحويلات", href: "/admin#analytics", active: true },
      { label: "الزيارات", active: false },
      { label: "مشاهدات المنتج", href: "/admin#analytics", active: true },
      { label: "طلبات الواتساب", href: "/admin/orders", active: true },
    ],
  },
  {
    icon: Megaphone,
    title: "التسويق",
    items: [
      { label: "فيسبوك بكسل", href: "/admin/settings#pixels", active: true },
      { label: "تيك توك بكسل", href: "/admin/settings#pixels", active: true },
      { label: "جوجل أناليتيكس", href: "/admin/settings#pixels", active: true },
      { label: "الكوبونات", active: false },
      { label: "العروض", href: "/admin/content?open=announcement", active: true },
    ],
  },
  {
    icon: FileText,
    title: "المحتوى",
    items: [
      { label: "منشئ الصفحة الرئيسية", href: "/admin/content?open=hero", active: true },
      { label: "المدونة", href: "/admin/content?open=blog", active: true },
      { label: "SEO", href: "/admin/products", active: true },
      { label: "علامات الميتا", href: "/admin/content?open=settings", active: true },
      { label: "السياسات", href: "/help", active: true },
    ],
  },
  {
    icon: Palette,
    title: "المظهر",
    items: [
      { label: "ألوان العلامة", href: "/admin/content?open=settings", active: true },
      { label: "الوضع الداكن", active: false },
      { label: "القائمة", href: "/admin/content?open=navigation", active: true },
      { label: "الفوتر", href: "/admin/content?open=footer", active: true },
      { label: "تباعد الأقسام", href: "/admin#spacing", active: true },
    ],
  },
  {
    icon: Shield,
    title: "الأمان",
    items: [
      { label: "المستخدمين", active: false },
      { label: "الصلاحيات", active: false },
      { label: "سجلات المراجعة", active: false },
      { label: "النسخ الاحتياطي", active: false },
    ],
  },
];

export const adminOperationCards = [
  {
    icon: ImageIcon,
    title: "مكتبة الوسائط",
    body: "الصور، الفيديوهات، أصول المعرض مع تحسينات الأداء.",
    href: "/admin/products",
    active: true,
  },
  {
    icon: Database,
    title: "النسخ الاحتياطي",
    body: "لقطات قواعد البيانات، التصدير، الاستيراد، وأدوات التراجع.",
    active: false,
  },
  {
    icon: Lock,
    title: "الصلاحيات",
    body: "تحكم بالوصول مبني على الأدوار للملاك، المدراء، المحررين، والدعم.",
    active: false,
  },
] as const;

export function resolveAdminModules(
  stats: AdminDashboardDTO,
  options?: { pixelsConfigured?: boolean },
): AdminSystemModule[] {
  return adminSystemModules.map((module) => {
    if (module.id === "orders") {
      return {
        ...module,
        metric: stats.metrics.orders > 0 ? "حي" : "جاهز",
      };
    }
    if (module.id === "marketing") {
      return {
        ...module,
        metric: options?.pixelsConfigured ? "متصل" : "جاهز",
      };
    }
    return module;
  });
}

export function moduleBadgeVariant(metric: ModuleStatusLabel) {
  if (metric === "حي" || metric === "متصل") return "success" as const;
  if (metric === "جاهز") return "success" as const;
  return "neutral" as const;
}
