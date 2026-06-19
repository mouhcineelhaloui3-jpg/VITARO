"use client";

import useSWR, { mutate } from "swr";
import { Boxes, Check, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { collections as staticCollections } from "@/lib/data/catalog";

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  active: boolean;
  sortOrder: number;
  productCount: number;
};

const fetcher = async (url: string): Promise<CategoryRow[]> => {
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

const emptyForm = {
  slug: "",
  name: "",
  eyebrow: "",
  description: "",
  active: true,
};

export default function AdminCategoriesPage() {
  const { data: dbItems = [], isLoading } = useSWR<CategoryRow[]>(
    "/api/admin/categories",
    fetcher,
  );
  const displayItems =
    dbItems.length > 0
      ? dbItems
      : staticCollections.map((collection, index) => ({
          id: collection.id,
          slug: collection.slug,
          name: collection.name,
          eyebrow: collection.eyebrow,
          description: collection.description,
          active: !collection.futureReady,
          sortOrder: index,
          productCount: collection.productIds.length,
        }));

  const [editing, setEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<CategoryRow>>({});
  const [adding, setAdding] = useState(false);
  const [newCategory, setNewCategory] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  async function saveEdit(id: string) {
    setSaving(true);
    setFeedback(null);
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editValues),
    });
    setSaving(false);

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      setFeedback({ type: "error", text: payload?.error ?? "فشل حفظ التعديلات" });
      return;
    }

    setEditing(null);
    setFeedback({ type: "success", text: "تم حفظ القسم" });
    await mutate("/api/admin/categories");
  }

  async function deleteItem(id: string) {
    setFeedback(null);
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      setFeedback({ type: "error", text: payload?.error ?? "تعذّر حذف القسم" });
      return;
    }
    setFeedback({ type: "success", text: "تم حذف القسم" });
    await mutate("/api/admin/categories");
  }

  async function addCategory() {
    if (!newCategory.slug.trim() || !newCategory.name.trim()) {
      setFeedback({ type: "error", text: "الاسم والـ slug مطلوبان" });
      return;
    }

    setSaving(true);
    setFeedback(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newCategory,
        sortOrder: displayItems.length,
      }),
    });
    setSaving(false);

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      setFeedback({ type: "error", text: payload?.error ?? "فشل إضافة القسم" });
      return;
    }

    setAdding(false);
    setNewCategory(emptyForm);
    setFeedback({ type: "success", text: "تم إضافة القسم" });
    await mutate("/api/admin/categories");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-heading">الأقسام</h1>
          <p className="text-sm text-muted-fg">إدارة تصنيفات ومجموعات المنتجات.</p>
        </div>
        <button
          onClick={() => {
            setAdding(true);
            setFeedback(null);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4" />
          إضافة قسم
        </button>
      </div>

      {feedback ? (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.text}
        </div>
      ) : null}

      {dbItems.length === 0 && !isLoading ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          تعرض البيانات الافتراضية. من <strong>المحتوى والصفحات</strong> اضغط «تهيئة المحتوى» لنقل
          الأقسام إلى قاعدة البيانات، أو أضف قسماً جديداً أدناه.
        </div>
      ) : null}

      {adding ? (
        <Card className="space-y-4 p-5">
          <h2 className="font-medium text-heading">قسم جديد</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-fg">الاسم</span>
              <input
                className="form-input"
                value={newCategory.name}
                onChange={(e) => setNewCategory((v) => ({ ...v, name: e.target.value }))}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-fg">Slug (رابط)</span>
              <input
                className="form-input"
                dir="ltr"
                placeholder="smart-body-scales"
                value={newCategory.slug}
                onChange={(e) => setNewCategory((v) => ({ ...v, slug: e.target.value }))}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-fg">العنوان الفرعي</span>
              <input
                className="form-input"
                value={newCategory.eyebrow}
                onChange={(e) => setNewCategory((v) => ({ ...v, eyebrow: e.target.value }))}
              />
            </label>
            <label className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={newCategory.active}
                onChange={(e) => setNewCategory((v) => ({ ...v, active: e.target.checked }))}
              />
              <span className="text-sm text-body">قسم نشط (يظهر في المتجر)</span>
            </label>
          </div>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">الوصف</span>
            <textarea
              rows={3}
              className="form-input resize-none"
              value={newCategory.description}
              onChange={(e) => setNewCategory((v) => ({ ...v, description: e.target.value }))}
            />
          </label>
          <div className="flex gap-2">
            <button
              onClick={addCategory}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              حفظ القسم
            </button>
            <button
              onClick={() => setAdding(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm dark:border-white/10"
            >
              إلغاء
            </button>
          </div>
        </Card>
      ) : null}

      {isLoading ? (
        <div className="py-12 text-center text-sm text-subtle">
          <Loader2 className="inline h-5 w-5 animate-spin" />
        </div>
      ) : displayItems.length === 0 ? (
        <Card className="p-8 text-center">
          <Boxes className="mx-auto h-8 w-8 text-subtle" />
          <h3 className="mt-4 font-semibold text-heading">لا توجد أقسام بعد</h3>
          <p className="mt-2 text-sm text-muted-fg">أضف أول قسم لتنظيم منتجاتك.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {displayItems.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              {editing === category.id ? (
                <div className="space-y-4 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-muted-fg">الاسم</span>
                      <input
                        className="form-input"
                        defaultValue={category.name}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, name: e.target.value }))
                        }
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-muted-fg">Slug</span>
                      <input
                        className="form-input"
                        dir="ltr"
                        defaultValue={category.slug}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, slug: e.target.value }))
                        }
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-muted-fg">العنوان الفرعي</span>
                      <input
                        className="form-input"
                        defaultValue={category.eyebrow}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, eyebrow: e.target.value }))
                        }
                      />
                    </label>
                    <label className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        defaultChecked={category.active}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, active: e.target.checked }))
                        }
                      />
                      <span className="text-sm text-body">قسم نشط</span>
                    </label>
                  </div>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-muted-fg">الوصف</span>
                    <textarea
                      rows={3}
                      className="form-input resize-none"
                      defaultValue={category.description}
                      onChange={(e) =>
                        setEditValues((v) => ({ ...v, description: e.target.value }))
                      }
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(category.id)}
                      disabled={saving}
                      className="rounded-xl bg-emerald-500 px-4 py-2 text-sm text-white hover:bg-emerald-600 disabled:opacity-60"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm dark:border-white/10"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-heading">{category.name}</h3>
                      <Badge variant={category.active ? "success" : "neutral"}>
                        {category.active ? "نشط" : "قريباً"}
                      </Badge>
                      <Badge variant="neutral">{category.productCount} منتج</Badge>
                    </div>
                    {category.eyebrow ? (
                      <p className="mt-1 text-xs text-subtle">{category.eyebrow}</p>
                    ) : null}
                    <p className="mt-2 text-sm text-body line-clamp-2">
                      {category.description || "بدون وصف"}
                    </p>
                    <p className="mt-2 text-xs text-subtle" dir="ltr">
                      /collections/{category.slug}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      href={`/collections/${category.slug}`}
                      target="_blank"
                      className="rounded-lg p-2 text-subtle hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    {dbItems.length > 0 ? (
                      <>
                        <button
                          onClick={() => {
                            setEditing(category.id);
                            setEditValues({});
                            setFeedback(null);
                          }}
                          className="rounded-lg px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => deleteItem(category.id)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
