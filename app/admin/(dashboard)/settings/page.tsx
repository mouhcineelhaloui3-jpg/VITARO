import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-heading">الإعدادات</h1>
        <p className="text-sm text-muted-fg">تكوين إعدادات المتجر العامة.</p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-white/10 dark:bg-zinc-900">
        <Settings className="mx-auto h-8 w-8 text-subtle" />
        <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">إعدادات المتجر</h3>
        <p className="mt-2 text-sm text-muted-fg">سيتم إضافة إعدادات العملة، الضرائب، التوصيل، والبكسل هنا.</p>
      </div>
    </div>
  );
}
