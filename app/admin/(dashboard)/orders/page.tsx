import { ClipboardList } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">الطلبات</h1>
          <p className="text-sm text-muted-fg">تتبع وإدارة طلبات المتجر.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-white/10 dark:bg-zinc-900">
        <ClipboardList className="mx-auto h-8 w-8 text-subtle" />
        <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">جاري برمجة واجهة الطلبات</h3>
        <p className="mt-2 text-sm text-muted-fg">سيتم عرض قائمة الطلبات وحالات التوصيل والدفع هنا.</p>
      </div>
    </div>
  );
}
