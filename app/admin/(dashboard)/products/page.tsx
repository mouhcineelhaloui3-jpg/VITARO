"use client";

import useSWR, { mutate } from "swr";
import Image from "next/image";
import {
  Check,
  Edit,
  ExternalLink,
  Loader2,
  Package,
  Plus,
  ShoppingBag,
  Star,
  Tag,
  Layers,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { AdminProductRow, AdminProductVariant } from "@/lib/services/product-admin";

type ProductDraft = {
  title: string;
  price: string;
  compareAtPrice: string;
  variants: AdminProductVariant[];
};

type CreateProductDraft = {
  title: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string;
  variants: AdminProductVariant[];
};

const emptyCreateDraft = (): CreateProductDraft => ({
  title: "",
  slug: "",
  description: "",
  price: "",
  compareAtPrice: "",
  variants: [{ name: "افتراضي", color: "#111111", inventory: 10 }],
});

const fetcher = async (url: string): Promise<AdminProductRow[]> => {
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export default function AdminProductsPage() {
  const { data: products = [], isLoading, error } = useSWR<AdminProductRow[]>(
    "/api/admin/products",
    fetcher,
  );
  const [editing, setEditing] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ProductDraft>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );
  const [seeding, setSeeding] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createDraft, setCreateDraft] = useState<CreateProductDraft>(emptyCreateDraft);
  const [creating, setCreating] = useState(false);

  const databaseReady = products.some((product) => product.persisted);

  function openEditor(product: AdminProductRow) {
    setEditing(product.id);
    setDrafts((current) => ({
      ...current,
      [product.id]: {
        title: product.title,
        price: String(product.price),
        compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
        variants:
          product.variants && product.variants.length > 0
            ? product.variants.map((variant) => ({
                id: variant.id,
                name: variant.name,
                color: variant.color,
                inventory: variant.inventory,
                sku: variant.sku,
              }))
            : [{ name: "افتراضي", color: "#111111", inventory: 0 }],
      },
    }));
    setFeedback(null);
  }

  function updateDraft(productId: string, field: keyof Omit<ProductDraft, "variants">, value: string) {
    setDrafts((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        [field]: value,
      },
    }));
  }

  function updateVariant(
    productId: string,
    index: number,
    field: keyof AdminProductVariant,
    value: string | number,
  ) {
    setDrafts((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        variants: current[productId].variants.map((variant, i) =>
          i === index ? { ...variant, [field]: value } : variant,
        ),
      },
    }));
  }

  function addVariant(productId: string) {
    setDrafts((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        variants: [
          ...current[productId].variants,
          { name: "لون جديد", color: "#111111", inventory: 0 },
        ],
      },
    }));
  }

  function removeVariant(productId: string, index: number) {
    setDrafts((current) => {
      if (current[productId].variants.length <= 1) return current;
      return {
        ...current,
        [productId]: {
          ...current[productId],
          variants: current[productId].variants.filter((_, i) => i !== index),
        },
      };
    });
  }

  async function handleSeed() {
    setSeeding(true);
    setFeedback(null);

    const res = await fetch("/api/admin/cms/seed", { method: "POST" });
    setSeeding(false);

    if (res.ok) {
      await mutate("/api/admin/products");
      setFeedback({ type: "success", text: "تم تجهيز قاعدة البيانات. يمكنك الآن حفظ الأسعار." });
      return;
    }

    const payload = (await res.json().catch(() => null)) as { error?: string } | null;
    setFeedback({
      type: "error",
      text:
        payload?.error ??
        "تعذّر تجهيز قاعدة البيانات. تأكد من إعداد DATABASE_URL في Vercel.",
    });
  }

  async function handleCreate() {
    const price = Number(createDraft.price);
    const compareAtPrice = createDraft.compareAtPrice ? Number(createDraft.compareAtPrice) : null;

    if (!createDraft.title.trim()) {
      setFeedback({ type: "error", text: "اسم المنتج مطلوب." });
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setFeedback({ type: "error", text: "أدخل سعراً صالحاً أكبر من 0." });
      return;
    }

    if (!createDraft.variants.length) {
      setFeedback({ type: "error", text: "أضف لوناً واحداً على الأقل." });
      return;
    }

    for (const variant of createDraft.variants) {
      if (!variant.name.trim()) {
        setFeedback({ type: "error", text: "اسم اللون مطلوب لكل متغير." });
        return;
      }
      if (!/^#[0-9A-Fa-f]{6}$/.test(variant.color)) {
        setFeedback({ type: "error", text: "استخدم كود لون صالح مثل #111111." });
        return;
      }
    }

    setCreating(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: createDraft.title.trim(),
          slug: createDraft.slug.trim() || undefined,
          description: createDraft.description.trim() || undefined,
          price,
          compareAtPrice,
          variants: createDraft.variants.map((variant) => ({
            name: variant.name.trim(),
            color: variant.color,
            inventory: Number(variant.inventory) || 0,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({
          type: "error",
          text: data.error ?? "فشل إنشاء المنتج. حاول مرة أخرى.",
        });
        return;
      }

      await mutate("/api/admin/products");
      setShowCreate(false);
      setCreateDraft(emptyCreateDraft());
      setFeedback({ type: "success", text: "تم إنشاء المنتج بنجاح." });
    } catch {
      setFeedback({ type: "error", text: "تعذّر الاتصال بالخادم أثناء الإنشاء." });
    } finally {
      setCreating(false);
    }
  }

  function updateCreateVariant(
    index: number,
    field: keyof AdminProductVariant,
    value: string | number,
  ) {
    setCreateDraft((current) => ({
      ...current,
      variants: current.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant,
      ),
    }));
  }

  async function handleSave(product: AdminProductRow) {
    const draft = drafts[product.id];
    if (!draft) return;

    const price = Number(draft.price);
    const compareAtPrice = draft.compareAtPrice ? Number(draft.compareAtPrice) : null;

    if (!draft.title.trim()) {
      setFeedback({ type: "error", text: "اسم المنتج مطلوب." });
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setFeedback({ type: "error", text: "أدخل سعراً صالحاً أكبر من 0." });
      return;
    }

    if (compareAtPrice !== null && (!Number.isFinite(compareAtPrice) || compareAtPrice <= 0)) {
      setFeedback({ type: "error", text: "أدخل سعراً قبل الخصم صالحاً." });
      return;
    }

    if (!draft.variants.length) {
      setFeedback({ type: "error", text: "أضف لوناً واحداً على الأقل." });
      return;
    }

    for (const variant of draft.variants) {
      if (!variant.name.trim()) {
        setFeedback({ type: "error", text: "اسم اللون مطلوب لكل متغير." });
        return;
      }
      if (!/^#[0-9A-Fa-f]{6}$/.test(variant.color)) {
        setFeedback({ type: "error", text: "استخدم كود لون صالح مثل #111111." });
        return;
      }
    }

    setSavingId(product.id);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: product.slug,
          title: draft.title.trim(),
          price,
          compareAtPrice,
          variants: draft.variants.map((variant) => ({
            id: variant.id,
            name: variant.name.trim(),
            color: variant.color,
            inventory: Number(variant.inventory) || 0,
            sku: variant.sku,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({
          type: "error",
          text: data.error ?? "فشل حفظ المنتج. حاول مرة أخرى.",
        });
        return;
      }

      await mutate("/api/admin/products");
      setEditing(null);
      setFeedback({ type: "success", text: "تم حفظ التعديلات بنجاح." });
    } catch {
      setFeedback({ type: "error", text: "تعذّر الاتصال بالخادم أثناء الحفظ." });
    } finally {
      setSavingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-fg">
        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
        جاري تحميل المنتجات...
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-600">تعذّر تحميل المنتجات. أعد تحميل الصفحة.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">المنتجات</h1>
          <p className="text-sm text-muted-fg">
            {products.length} منتج — التحكم في الأسعار، الصور، والمخزون.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowCreate((current) => !current);
              setCreateDraft(emptyCreateDraft());
              setFeedback(null);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
            إضافة منتج
          </button>
          <a
            href="/products/smart-digital-body-scale"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            <ExternalLink className="h-4 w-4" />
            معاينة المتجر
          </a>
        </div>
      </div>

      {showCreate ? (
        <Card className="border-emerald-200 bg-emerald-50/40 p-6">
          <h2 className="text-lg font-semibold text-heading">إضافة منتج جديد</h2>
          <p className="mt-1 text-sm text-muted-fg">
            سيظهر المنتج مباشرة في المتجر بعد الإنشاء.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-fg">اسم المنتج</span>
              <input
                value={createDraft.title}
                onChange={(event) =>
                  setCreateDraft((current) => ({ ...current, title: event.target.value }))
                }
                className="form-input"
                placeholder="ميزان ذكي جديد"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-fg">رابط المنتج (اختياري)</span>
              <input
                value={createDraft.slug}
                onChange={(event) =>
                  setCreateDraft((current) => ({ ...current, slug: event.target.value }))
                }
                className="form-input"
                dir="ltr"
                placeholder="smart-scale-pro"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-fg">السعر (MAD)</span>
              <input
                value={createDraft.price}
                onChange={(event) =>
                  setCreateDraft((current) => ({ ...current, price: event.target.value }))
                }
                type="number"
                min="1"
                className="form-input"
                placeholder="299"
              />
            </label>
            <label className="block space-y-1.5 sm:col-span-2 lg:col-span-3">
              <span className="text-xs font-medium text-muted-fg">الوصف (اختياري)</span>
              <textarea
                rows={2}
                value={createDraft.description}
                onChange={(event) =>
                  setCreateDraft((current) => ({ ...current, description: event.target.value }))
                }
                className="form-input resize-none"
                placeholder="وصف قصير للمنتج"
              />
            </label>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">ألوان المنتج</p>
              <button
                type="button"
                onClick={() =>
                  setCreateDraft((current) => ({
                    ...current,
                    variants: [
                      ...current.variants,
                      { name: "لون جديد", color: "#111111", inventory: 0 },
                    ],
                  }))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs text-muted-fg hover:border-emerald-400 hover:text-emerald-600"
              >
                <Plus className="h-3.5 w-3.5" />
                إضافة لون
              </button>
            </div>
            {createDraft.variants.map((variant, index) => (
              <div
                key={`create-${index}`}
                className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_120px_100px_auto]"
              >
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-muted-fg">اسم اللون</span>
                  <input
                    value={variant.name}
                    onChange={(event) => updateCreateVariant(index, "name", event.target.value)}
                    className="form-input"
                    placeholder="أسود"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-muted-fg">اللون</span>
                  <input
                    type="color"
                    value={variant.color}
                    onChange={(event) => updateCreateVariant(index, "color", event.target.value)}
                    className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-muted-fg">المخزون</span>
                  <input
                    type="number"
                    min="0"
                    value={variant.inventory}
                    onChange={(event) =>
                      updateCreateVariant(index, "inventory", Number(event.target.value))
                    }
                    className="form-input"
                  />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setCreateDraft((current) => ({
                      ...current,
                      variants:
                        current.variants.length <= 1
                          ? current.variants
                          : current.variants.filter((_, i) => i !== index),
                    }))
                  }
                  disabled={createDraft.variants.length <= 1}
                  className="self-end rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleCreate}
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {creating ? "جاري الإنشاء..." : "إنشاء المنتج"}
            </button>
            <button
              onClick={() => {
                setShowCreate(false);
                setCreateDraft(emptyCreateDraft());
              }}
              disabled={creating}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              إلغاء
            </button>
          </div>
        </Card>
      ) : null}

      {!databaseReady ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-amber-900">حفظ الأسعار يحتاج قاعدة بيانات</p>
            <p className="mt-1 text-sm text-amber-800">
              أضف `DATABASE_URL` في Vercel، ثم اضغط «تجهيز قاعدة البيانات» قبل حفظ أي تعديل.
            </p>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-60"
          >
            {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            تجهيز قاعدة البيانات
          </button>
        </div>
      ) : null}

      {feedback ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.text}
        </div>
      ) : null}

      <div className="space-y-4">
        {products.map((product) => {
          const draft = drafts[product.id];
          const isEditing = editing === product.id;
          const isSaving = savingId === product.id;

          return (
            <Card key={product.id} className="overflow-hidden">
              <div className="flex flex-col gap-6 p-6 sm:flex-row">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-10 w-10 text-slate-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-heading">{product.title}</h2>
                        <Badge variant="success">نشط</Badge>
                        {product.persisted ? (
                          <Badge variant="neutral">محفوظ في قاعدة البيانات</Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-subtle">/{product.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/products/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-2 text-subtle hover:bg-slate-100 hover:text-slate-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => (isEditing ? setEditing(null) : openEditor(product))}
                        className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        تعديل
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-muted-fg">السعر</span>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-lg font-bold text-heading">
                          {formatCurrency(product.price, product.currency)}
                        </span>
                        {product.compareAtPrice ? (
                          <span className="text-sm text-subtle line-through">
                            {formatCurrency(product.compareAtPrice, product.currency)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {product.inventory !== undefined ? (
                      <div>
                        <span className="text-muted-fg">المخزون</span>
                        <div className="mt-0.5 font-semibold text-heading">
                          {product.inventory} وحدة
                        </div>
                      </div>
                    ) : null}
                    {product.rating ? (
                      <div>
                        <span className="text-muted-fg">التقييم</span>
                        <div className="mt-0.5 flex items-center gap-1 font-semibold text-heading">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {product.rating} ({product.reviewCount?.toLocaleString()})
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {product.variants && product.variants.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-subtle" />
                      <span className="text-xs text-muted-fg">الألوان:</span>
                      {product.variants.map((variant) => (
                        <span
                          key={variant.id ?? variant.name}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs"
                        >
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full border border-slate-300"
                            style={{ background: variant.color }}
                          />
                          {variant.name} ({variant.inventory})
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {isEditing && draft ? (
                <div className="border-t border-slate-100 bg-slate-50 p-6">
                  <h3 className="mb-4 text-sm font-semibold text-slate-700">تعديل المنتج</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-muted-fg">اسم المنتج</span>
                      <input
                        value={draft.title}
                        onChange={(event) =>
                          updateDraft(product.id, "title", event.target.value)
                        }
                        className="form-input"
                        placeholder="اسم المنتج"
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-muted-fg">السعر (MAD)</span>
                      <input
                        value={draft.price}
                        onChange={(event) =>
                          updateDraft(product.id, "price", event.target.value)
                        }
                        type="number"
                        min="1"
                        className="form-input"
                        placeholder="299"
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-muted-fg">السعر قبل (MAD)</span>
                      <input
                        value={draft.compareAtPrice}
                        onChange={(event) =>
                          updateDraft(product.id, "compareAtPrice", event.target.value)
                        }
                        type="number"
                        min="1"
                        className="form-input"
                        placeholder="499"
                      />
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">ألوان المنتج</p>
                      <button
                        type="button"
                        onClick={() => addVariant(product.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs text-muted-fg hover:border-emerald-400 hover:text-emerald-600"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        إضافة لون
                      </button>
                    </div>
                    {draft.variants.map((variant, index) => (
                      <div
                        key={variant.id ?? `new-${index}`}
                        className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_120px_100px_auto]"
                      >
                        <label className="block space-y-1">
                          <span className="text-xs font-medium text-muted-fg">اسم اللون</span>
                          <input
                            value={variant.name}
                            onChange={(event) =>
                              updateVariant(product.id, index, "name", event.target.value)
                            }
                            className="form-input"
                            placeholder="أسود"
                          />
                        </label>
                        <label className="block space-y-1">
                          <span className="text-xs font-medium text-muted-fg">اللون</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={variant.color}
                              onChange={(event) =>
                                updateVariant(product.id, index, "color", event.target.value)
                              }
                              className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white"
                            />
                            <input
                              value={variant.color}
                              onChange={(event) =>
                                updateVariant(product.id, index, "color", event.target.value)
                              }
                              className="form-input font-mono text-xs"
                              dir="ltr"
                              placeholder="#111111"
                            />
                          </div>
                        </label>
                        <label className="block space-y-1">
                          <span className="text-xs font-medium text-muted-fg">المخزون</span>
                          <input
                            type="number"
                            min="0"
                            value={variant.inventory}
                            onChange={(event) =>
                              updateVariant(
                                product.id,
                                index,
                                "inventory",
                                Number(event.target.value),
                              )
                            }
                            className="form-input"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeVariant(product.id, index)}
                          disabled={draft.variants.length <= 1}
                          className="self-end rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-40"
                          title="حذف اللون"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
                    <Tag className="mb-1 inline h-3.5 w-3.5" /> بعد الحفظ، سيظهر السعر والألوان
                    الجديدة في المتجر ولوحة التحكم.
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleSave(product)}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      disabled={isSaving}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>

      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-4 font-semibold text-heading">لا توجد منتجات</h3>
          <p className="mt-2 text-sm text-muted-fg">أضف منتجك الأول لبدء البيع.</p>
        </Card>
      ) : null}
    </div>
  );
}
