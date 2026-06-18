import { Boxes } from "lucide-react";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">الأقسام</h1>
          <p className="text-sm text-muted-fg">إدارة تصنيفات ومجموعات المنتجات.</p>
        </div>
        <button className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
          إضافة قسم
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-white/10 dark:bg-zinc-900">
        <Boxes className="mx-auto h-8 w-8 text-subtle" />
        <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">جاري برمجة الأقسام</h3>
        <p className="mt-2 text-sm text-muted-fg">سيتم إضافة نظام إدارة الأقسام قريباً.</p>
      </div>
    </div>
  );
}
