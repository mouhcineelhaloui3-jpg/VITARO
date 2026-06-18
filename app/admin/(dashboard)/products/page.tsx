"use client";

import useSWR from "swr";
import Image from "next/image";
import {
  Edit,
  ExternalLink,
  Package,
  ShoppingBag,
  Star,
  Tag,
  Layers,
} from "lucide-react";
import { products as catalogProducts } from "@/lib/data/catalog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type ProductRow = {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  status: string;
  rating?: number;
  reviewCount?: number;
  inventory?: number;
  variants?: { name: string; color: string; inventory: number }[];
  images?: string[];
};

export default function AdminProductsPage() {
  const { data: dbProducts } = useSWR<ProductRow[]>("/api/admin/products", fetcher);
  const [editing, setEditing] = useState<string | null>(null);

  // Merge catalog + DB products (catalog is source of truth for display)
  const displayProducts: ProductRow[] = catalogProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    currency: p.currency,
    status: "active",
    rating: p.rating,
    reviewCount: p.reviewCount,
    inventory: p.variants?.reduce((sum, v) => sum + v.inventory, 0),
    variants: p.variants?.map((v) => ({ name: v.name, color: v.color, inventory: v.inventory })),
    images: p.images,
  }));

  // Add any DB-only products
  if (dbProducts) {
    for (const dbP of dbProducts) {
      if (!displayProducts.find((p) => p.slug === dbP.slug)) {
        displayProducts.push(dbP);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">المنتجات</h1>
          <p className="text-sm text-muted-fg">
            {displayProducts.length} منتج — التحكم في الأسعار، الصور، والمخزون.
          </p>
        </div>
        <a
          href="/products/smart-digital-body-scale"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
        >
          <ExternalLink className="h-4 w-4" />
          معاينة المتجر
        </a>
      </div>

      <div className="space-y-4">
        {displayProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="flex flex-col gap-6 p-6 sm:flex-row">
              {/* Product image */}
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/5">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    onError={() => {}}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-10 w-10 text-slate-300" />
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-heading">
                        {product.title}
                      </h2>
                      <Badge variant="success">نشط</Badge>
                    </div>
                    <p className="mt-1 text-xs text-subtle">/{product.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/products/${product.slug}`}
                      target="_blank"
                      className="rounded-lg p-2 text-subtle hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => setEditing(editing === product.id ? null : product.id)}
                      className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400"
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
                      {product.compareAtPrice && (
                        <span className="text-sm text-subtle line-through">
                          {formatCurrency(product.compareAtPrice, product.currency)}
                        </span>
                      )}
                    </div>
                  </div>
                  {product.inventory !== undefined && (
                    <div>
                      <span className="text-muted-fg">المخزون</span>
                      <div className="mt-0.5 font-semibold text-heading">
                        {product.inventory} وحدة
                      </div>
                    </div>
                  )}
                  {product.rating && (
                    <div>
                      <span className="text-muted-fg">التقييم</span>
                      <div className="mt-0.5 flex items-center gap-1 font-semibold text-heading">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {product.rating} ({product.reviewCount?.toLocaleString()})
                      </div>
                    </div>
                  )}
                </div>

                {product.variants && product.variants.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-subtle" />
                    <span className="text-xs text-muted-fg">الألوان:</span>
                    {product.variants.map((v) => (
                      <span
                        key={v.name}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs dark:border-white/10 dark:bg-white/5"
                      >
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full border border-slate-300"
                          style={{ background: v.color }}
                        />
                        {v.name} ({v.inventory})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Edit panel */}
            {editing === product.id && (
              <div className="border-t border-slate-100 bg-slate-50 p-6 dark:border-white/5 dark:bg-white/8">
                <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  تعديل المنتج
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-muted-fg">اسم المنتج</span>
                    <input
                      defaultValue={product.title}
                      className="form-input"
                      placeholder="اسم المنتج"
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-muted-fg">السعر (MAD)</span>
                    <input
                      defaultValue={product.price}
                      type="number"
                      className="form-input"
                      placeholder="299"
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-muted-fg">السعر قبل (MAD)</span>
                    <input
                      defaultValue={product.compareAtPrice}
                      type="number"
                      className="form-input"
                      placeholder="499"
                    />
                  </label>
                </div>
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                  <Tag className="mb-1 inline h-3.5 w-3.5" /> التعديلات الكاملة (صور، وصف، مؤشرات) تتطلب تفعيل CMS متصل بقاعدة البيانات — سيُضاف قريباً.
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
                    حفظ
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {displayProducts.length === 0 && (
        <Card className="p-12 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-4 font-semibold text-heading">لا توجد منتجات</h3>
          <p className="mt-2 text-sm text-muted-fg">أضف منتجك الأول لبدء البيع.</p>
        </Card>
      )}
    </div>
  );
}
