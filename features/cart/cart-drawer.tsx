"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { products as staticProducts } from "@/lib/data/catalog";
import { formatCurrency } from "@/lib/utils";
import type { SiteChrome } from "@/lib/cms/site";

type CartProduct = NonNullable<SiteChrome["featuredProduct"]>;

type CartDrawerProps = {
  product?: CartProduct | null;
  whatsappPhone?: string;
};

export function CartDrawer({ product, whatsappPhone }: CartDrawerProps) {
  const fallback = staticProducts[0];
  const cartProduct: CartProduct = product ?? {
    title: fallback.title,
    slug: fallback.slug,
    price: fallback.price,
    currency: fallback.currency,
    images: fallback.images,
  };
  const phone = whatsappPhone ?? "212682217644";

  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const subtotal = useMemo(
    () => cartProduct.price * quantity,
    [cartProduct.price, quantity],
  );

  return (
    <>
      <button
        aria-label="Open cart"
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-heading transition-all hover:bg-section-bg hover:border-subtle"
        onClick={() => setOpen(true)}
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-white">
          {quantity}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close cart overlay"
            className="absolute inset-0 bg-heading/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-accent">
                  سلة التسوق
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-heading">
                  طلبك من فيتارو
                </h2>
              </div>
              <button
                aria-label="Close cart"
                className="rounded-xl border border-border p-2.5 text-heading transition-all hover:bg-section-bg"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Card className="mb-5 bg-emerald-50 p-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-bold text-heading">التوصيل مجاني</span>
                <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-white">
                  لجميع مدن المغرب
                </span>
              </div>
            </Card>

            <Card className="flex gap-5 p-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-section-bg">
                <Image
                  src={cartProduct.images[0]}
                  alt={cartProduct.title}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-heading">{cartProduct.title}</h3>
                <p className="mt-1 text-sm text-muted">الكمية {quantity}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-xl border border-border">
                    <button
                      aria-label="Decrease quantity"
                      className="p-2.5 text-heading"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-bold text-heading">
                      {quantity}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      className="p-2.5 text-heading"
                      onClick={() => setQuantity((value) => value + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-bold text-heading">
                    {formatCurrency(subtotal, cartProduct.currency as "MAD")}
                  </span>
                </div>
              </div>
            </Card>

            <div className="mt-auto space-y-5 border-t border-border pt-6">
              <div className="flex items-center justify-between text-lg font-bold text-heading">
                <span>الإجمالي الفرعي</span>
                <span>{formatCurrency(subtotal, cartProduct.currency as "MAD")}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  const params = new URLSearchParams({
                    product: cartProduct.slug,
                    qty: String(quantity),
                  });
                  window.location.href = `/checkout?${params.toString()}`;
                }}
              >
                إتمام الطلب بأمان
              </Button>
              <Button
                className="w-full"
                size="lg"
                variant="secondary"
                onClick={() => {
                  window.open(
                    `https://wa.me/${phone}?text=${encodeURIComponent(`مرحباً، أريد إتمام طلب ${quantity} من ${cartProduct.title} بسعر إجمالي ${subtotal} درهم`)}`,
                    "_blank",
                  );
                }}
              >
                أو اطلب عبر واتساب
              </Button>
              <p className="text-center text-sm text-muted">
                الدفع عند الاستلام والتوصيل مجاني لجميع المدن.
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
