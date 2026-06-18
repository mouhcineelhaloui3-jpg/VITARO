"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, MessageCircle, Minus, Plus, ShieldCheck, Timer, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/commerce";
import { trackEvent } from "@/lib/analytics";

export function BuyBox({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === variantId) ?? product.variants[0],
    [product.variants, variantId],
  );

  return (
    <>
      <Card className="sticky top-28 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="success">عرض الإطلاق</Badge>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400">
            <Timer className="h-4 w-4" />
            ينتهي العرض قريباً
          </span>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            {product.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-surface-heading">
            {product.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-surface-body">{product.description}</p>
        </div>

        <div className="flex items-end gap-3">
          <span className="text-4xl font-semibold tracking-[-0.06em] text-surface-heading">
            {formatCurrency(selectedVariant.price, product.currency)}
          </span>
          {selectedVariant.compareAtPrice ? (
            <span className="pb-1 text-lg text-subtle line-through">
              {formatCurrency(selectedVariant.compareAtPrice, product.currency)}
            </span>
          ) : null}
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-surface-heading">اللون</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                className={`rounded-3xl border p-4 text-left transition ${
                  variant.id === selectedVariant.id
                    ? "border-[#020617] bg-[#020617] text-white dark:border-white dark:bg-white dark:text-[#0f172a]"
                    : "border-border bg-card text-heading hover:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:text-[#f8fafc]"
                }`}
                onClick={() => setVariantId(variant.id)}
              >
                <span
                  className="mb-3 block h-5 w-5 rounded-full border border-border"
                  style={{ backgroundColor: variant.color }}
                />
                <span className="block font-semibold">{variant.name}</span>
                <span className="text-sm opacity-70">{variant.inventory} متوفر</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-full border border-border bg-card p-2">
          <button
            aria-label="Decrease quantity"
            className="grid h-10 w-10 place-items-center rounded-full bg-zinc-100 text-heading dark:bg-white/10 dark:text-[#f8fafc]"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="font-semibold text-surface-heading">{quantity}</span>
          <button
            aria-label="Increase quantity"
            className="grid h-10 w-10 place-items-center rounded-full bg-zinc-100 text-heading dark:bg-white/10 dark:text-[#f8fafc]"
            onClick={() => setQuantity((value) => value + 1)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            size="lg"
            onClick={() =>
              trackEvent("add_to_cart", {
                productId: product.id,
                variantId: selectedVariant.id,
                quantity,
              })
            }
          >
            زيدو للسلة
          </Button>
          <Button
            size="lg"
            variant="accent"
            onClick={() => {
              trackEvent("whatsapp_click", {
                productId: product.id,
                variantId: selectedVariant.id,
                quantity,
              });
              window.open(
                `https://wa.me/212682217644?text=${encodeURIComponent(`مرحباً، أريد طلب المنتج: ${product.title} بسعر ${selectedVariant.price} درهم`)}`,
                "_blank",
              );
            }}
          >
            <MessageCircle className="ms-2 h-5 w-5" />
            اطلب عبر واتساب الآن
          </Button>
        </div>

        <div className="grid gap-3 text-sm text-surface-body">
          <p className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-emerald-500" />
            توصيل مجاني لجميع مدن المغرب
          </p>
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            الدفع عند الاستلام (COD)، ضمان 30 يوماً
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            {selectedVariant.inventory < 20 ? "مخزون منخفض، يشحن اليوم" : "متوفر في المخزون"}
          </p>
        </div>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-heading">{product.title}</p>
            <p className="text-sm text-muted-fg">
              {formatCurrency(selectedVariant.price, product.currency)}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              trackEvent("whatsapp_click", {
                productId: product.id,
                variantId: selectedVariant.id,
                quantity,
              });
              window.open(
                `https://wa.me/212682217644?text=${encodeURIComponent(`مرحباً، أريد طلب المنتج: ${product.title} بسعر ${selectedVariant.price} درهم`)}`,
                "_blank",
              );
            }}
          >
            اطلب عبر واتساب
          </Button>
        </div>
      </div>
    </>
  );
}
