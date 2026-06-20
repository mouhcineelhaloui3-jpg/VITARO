"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Minus, Plus, ShieldCheck, Truck, Wallet } from "lucide-react";

import {
  BuyBoxReveal,
  CtaFocus,
  StickyBuyBar,
  UrgencyPulse,
} from "@/components/motion/dtc-motion";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { productPageCopy } from "@/lib/data/product-page-copy";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/commerce";
import { trackEvent } from "@/lib/analytics";

type PremiumBuyBoxProps = {
  product: Product;
  whatsappUrl: string;
};

function checkoutHref(product: Product, variantId: string, quantity: number) {
  const params = new URLSearchParams({
    product: product.slug,
    variant: variantId,
    qty: String(quantity),
  });
  return `/checkout?${params.toString()}`;
}

function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function PremiumBuyBox({ product, whatsappUrl }: PremiumBuyBoxProps) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === variantId) ?? product.variants[0],
    [product.variants, variantId],
  );

  const orderUrl = selectedVariant
    ? checkoutHref(product, selectedVariant.id, quantity)
    : `/checkout?product=${product.slug}`;

  const discount = discountPercent(
    selectedVariant?.price ?? product.price,
    selectedVariant?.compareAtPrice ?? product.compareAtPrice,
  );

  const stock = selectedVariant?.inventory ?? product.inventory;
  const lowStock = stock > 0 && stock < 20;

  const shortDescription =
    product.subtitle ||
    "ميزان ذكي كيحلّل جسمك وكيرسل النتائج مباشرة لتطبيق OKOK على تيليفونك.";

  const trustIcons = [Wallet, Truck, ShieldCheck] as const;

  return (
    <>
      <BuyBoxReveal className="lg:sticky lg:top-28 lg:space-y-8">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {discount ? (
              <UrgencyPulse>
                <Badge variant="accent">
                  -{discount}% {productPageCopy.hero.discountLabel}
                </Badge>
              </UrgencyPulse>
            ) : null}
            {lowStock ? (
              <UrgencyPulse>
                <Badge variant="neutral">{productPageCopy.hero.lowStock}</Badge>
              </UrgencyPulse>
            ) : (
              <Badge variant="success">{productPageCopy.hero.inStock}</Badge>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              {product.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-heading sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              {product.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-body">{shortDescription}</p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <span className="text-4xl font-extrabold tracking-tight text-heading sm:text-5xl">
              {formatCurrency(selectedVariant?.price ?? product.price, product.currency)}
            </span>
            {selectedVariant?.compareAtPrice ? (
              <span className="pb-1 text-lg text-subtle line-through">
                {formatCurrency(selectedVariant.compareAtPrice, product.currency)}
              </span>
            ) : null}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-heading">اللون</p>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setVariantId(variant.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                  variant.id === selectedVariant?.id
                    ? "border-heading bg-heading text-white"
                    : "border-border bg-white text-heading hover:border-slate-300"
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full border border-white/20"
                  style={{ backgroundColor: variant.color }}
                />
                {variant.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-white/80 px-3 py-2 backdrop-blur-sm">
          <span className="px-2 text-sm font-medium text-muted-fg">الكمية</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="نقص الكمية"
              className="grid h-10 w-10 place-items-center rounded-xl bg-section-bg"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-8 text-center font-semibold">{quantity}</span>
            <button
              type="button"
              aria-label="زيد الكمية"
              className="grid h-10 w-10 place-items-center rounded-xl bg-section-bg"
              onClick={() => setQuantity((value) => value + 1)}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          <CtaFocus fullWidth>
            <ButtonLink
              href={orderUrl}
              size="lg"
              className="w-full hover:translate-y-0"
              onClick={() =>
                trackEvent("begin_checkout", {
                  productId: product.id,
                  variantId: selectedVariant?.id,
                  quantity,
                })
              }
            >
              {productPageCopy.hero.ctaBuy}
            </ButtonLink>
          </CtaFocus>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-[0.875rem] border-[1.5px] border-border bg-background px-9 py-4 text-base font-semibold tracking-tight text-heading transition-colors hover:border-subtle hover:bg-section-bg"
            onClick={() =>
              trackEvent("whatsapp_click", {
                productId: product.id,
                location: "product_hero",
              })
            }
          >
            <MessageCircle className="h-5 w-5" />
            {productPageCopy.hero.ctaWhatsapp}
          </a>
        </div>

        <div className="grid gap-2.5">
          {productPageCopy.hero.trust.map((label, index) => {
            const Icon = trustIcons[index];
            return (
              <p key={label} className="flex items-center gap-2.5 text-sm text-body">
                <Icon className="h-4 w-4 text-emerald-600" />
                {label}
              </p>
            );
          })}
        </div>
      </BuyBoxReveal>

      <StickyBuyBar className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-white/90 p-3 shadow-[0_-12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-heading">{product.title}</p>
            <p className="text-sm font-bold text-emerald-700">
              {formatCurrency(selectedVariant?.price ?? product.price, product.currency)}
            </p>
          </div>
          <CtaFocus>
            <ButtonLink href={orderUrl} size="sm" className="hover:translate-y-0">
              {productPageCopy.hero.ctaBuy}
            </ButtonLink>
          </CtaFocus>
        </div>
      </StickyBuyBar>
    </>
  );
}
