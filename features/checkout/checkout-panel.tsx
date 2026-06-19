"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, MessageCircle, ShieldCheck, Truck, WalletCards } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildWhatsAppUrl } from "@/lib/cms/whatsapp";
import { buildOrderWhatsAppMessage } from "@/lib/services/order-storefront";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/commerce";
import type { StoreSettings } from "@/lib/cms/store-settings";

type CheckoutPanelProps = {
  product: Product;
  brandWhatsapp: string;
  settings: StoreSettings;
  initialVariantId?: string;
  initialQuantity?: number;
};

const GENDER_OPTIONS = [
  { value: "ذكر", label: "ذكر" },
  { value: "أنثى", label: "أنثى" },
  { value: "أفضل عدم التصريح", label: "أفضل عدم التصريح" },
];

export function CheckoutPanel({
  product,
  brandWhatsapp,
  settings,
  initialVariantId,
  initialQuantity = 1,
}: CheckoutPanelProps) {
  const [variantId, setVariantId] = useState(
    initialVariantId ?? product.variants[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(initialQuantity);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD" | "WALLET">(
    settings.codEnabled ? "COD" : settings.cardEnabled ? "CARD" : "WALLET",
  );
  const [customerName, setCustomerName] = useState("");
  const [gender, setGender] = useState(GENDER_OPTIONS[0].value);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === variantId) ?? product.variants[0],
    [product.variants, variantId],
  );

  const subtotal = (selectedVariant?.price ?? product.price) * quantity;
  const shipping =
    settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold
      ? 0
      : settings.shippingFlatRate;
  const tax = settings.taxEnabled
    ? Math.round(subtotal * (settings.taxRate / 100) * 100) / 100
    : 0;
  const total = subtotal + shipping + tax;

  const paymentMethods = [
    { label: "الدفع عند الاستلام", icon: Truck, id: "COD" as const },
    { label: "البطاقة البنكية", icon: WalletCards, id: "CARD" as const },
    { label: "المحفظة الإلكترونية", icon: ShieldCheck, id: "WALLET" as const },
  ].filter((method) => {
    if (method.id === "COD") return settings.codEnabled;
    if (method.id === "CARD") return settings.cardEnabled;
    return settings.walletEnabled;
  });

  const paymentLabel =
    paymentMethods.find((method) => method.id === paymentMethod)?.label ?? "الدفع عند الاستلام";

  function validateForm(): string | null {
    if (!phone.trim()) return "رقم الهاتف مطلوب";
    if (product.variants.length > 0 && !selectedVariant) return "اختر لون المنتج";
    return null;
  }

  async function submitWebsiteOrder() {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          variantId: selectedVariant?.id,
          quantity,
          customerName: customerName.trim() || "زبون",
          gender: gender || "غير محدد",
          phone: phone.trim(),
          address: address.trim() || "غير محدد",
          city: city.trim() || undefined,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "تعذّر إرسال الطلب");
        return;
      }

      setSuccess("تم استلام طلبك بنجاح! سنتواصل معك قريباً لتأكيد التوصيل.");
    } catch {
      setError("تعذّر الاتصال بالخادم. حاول مرة أخرى أو اطلب عبر واتساب.");
    } finally {
      setSubmitting(false);
    }
  }

  function openWhatsAppOrder() {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const message = buildOrderWhatsAppMessage({
      customerName: customerName.trim() || "زبون",
      gender: gender || "غير محدد",
      phone: phone.trim(),
      address: address.trim() || "غير محدد",
      city: city.trim() || undefined,
      productTitle: product.title,
      variantName: selectedVariant?.name ?? "افتراضي",
      quantity,
      total,
      currency: product.currency,
      paymentLabel,
    });

    window.open(buildWhatsAppUrl(brandWhatsapp, message), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
      <Card>
        <div className="mb-6 flex items-center gap-3">
          <Lock className="h-5 w-5 text-emerald-500" />
          <p className="font-semibold">طلب آمن عبر الموقع أو واتساب</p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={submitWebsiteOrder}
            disabled={submitting}
            className="rounded-2xl border border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
          >
            تأكيد الطلب عبر الموقع
          </button>
          <button
            type="button"
            onClick={openWhatsAppOrder}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#25D366] bg-[#25D366]/10 px-4 py-3 text-sm font-semibold text-[#128C7E]"
          >
            <MessageCircle className="h-4 w-4" />
            إرسال الطلب عبر واتساب
          </button>
        </div>

        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            submitWebsiteOrder();
          }}
        >
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">الاسم الكامل</span>
            <input
              className="form-input"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="الاسم واللقب (اختياري)"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">الجنس</span>
            <select
              className="form-input"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">رقم الهاتف</span>
            <input
              className="form-input text-right"
              dir="rtl"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="06XXXXXXXX"
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">العنوان الشخصي</span>
            <textarea
              rows={3}
              className="form-input resize-none"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="الحي، الشارع، رقم المنزل... (اختياري)"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">المدينة</span>
            <input
              className="form-input"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="الدار البيضاء"
            />
          </label>

          <div>
            <p className="mb-2 text-sm font-semibold text-heading">اللون</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setVariantId(variant.id)}
                  className={`rounded-2xl border p-3 text-right transition ${
                    variant.id === selectedVariant?.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200"
                  }`}
                >
                  <span
                    className="mb-2 inline-block h-4 w-4 rounded-full border"
                    style={{ background: variant.color }}
                  />
                  <span className="block text-sm font-semibold">{variant.name}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">الكمية</span>
            <input
              type="number"
              min={1}
              max={20}
              className="form-input"
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            />
          </label>

          {paymentMethods.length > 0 ? (
            <>
              <p className="mt-2 font-semibold text-heading">طريقة الدفع</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`rounded-3xl border p-4 text-right font-semibold transition ${
                      paymentMethod === method.id
                        ? "border-emerald-500 bg-emerald-50/50"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    <method.icon className="mb-3 h-5 w-5 text-emerald-500" />
                    {method.label}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {success}
            </div>
          ) : null}

          <Button size="lg" type="submit" disabled={submitting}>
            {submitting ? "جاري إرسال الطلب..." : "تأكيد الطلب عبر الموقع"}
          </Button>

          <p className="text-center text-xs text-muted-fg">
            يمكنك أيضاً إرسال نفس البيانات عبر واتساب إذا فضّلت التواصل مباشرة.
          </p>
        </form>
      </Card>

      <Card className="h-fit">
        <Badge variant="success">ملخص الطلب</Badge>
        <div className="mt-6 flex gap-4">
          {product.images[0] ? (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl bg-white">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </div>
          ) : null}
          <div>
            <h2 className="font-semibold">{product.title}</h2>
            <p className="mt-1 text-sm text-muted-fg">
              {selectedVariant?.name ?? "—"} · الكمية {quantity}
            </p>
          </div>
        </div>
        <div className="mt-8 space-y-3 border-t border-zinc-200 pt-6 text-sm dark:border-white/10">
          <div className="flex justify-between">
            <span>المجموع الفرعي</span>
            <span>{formatCurrency(subtotal, product.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>الشحن</span>
            <span className={shipping === 0 ? "font-semibold text-emerald-600" : ""}>
              {shipping === 0 ? "مجاني" : formatCurrency(shipping, product.currency)}
            </span>
          </div>
          {tax > 0 ? (
            <div className="flex justify-between">
              <span>الضريبة</span>
              <span>{formatCurrency(tax, product.currency)}</span>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-zinc-200 pt-4 text-lg font-semibold dark:border-white/10">
            <span>الإجمالي</span>
            <span>{formatCurrency(total, product.currency)}</span>
          </div>
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="mt-6 inline-block text-sm text-emerald-700 hover:underline"
        >
          العودة لصفحة المنتج
        </Link>
      </Card>
    </div>
  );
}
