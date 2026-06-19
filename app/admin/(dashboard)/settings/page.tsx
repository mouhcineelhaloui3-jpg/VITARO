"use client";

import useSWR, { mutate } from "swr";
import { useEffect, useState } from "react";
import {
  Banknote,
  Check,
  Globe,
  Loader2,
  Percent,
  Settings,
  Truck,
  BarChart3,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  CURRENCY_OPTIONS,
  mapStoreSettings,
  storeSettingsToConfig,
  type StoreSettings,
} from "@/lib/cms/store-settings";
import type { CurrencyCode } from "@/types/commerce";

type ConfigItem = { key: string; value: string; group: string };

const fetcher = (url: string) => fetch(url).then((r) => (r.ok ? r.json() : []));

async function saveSettings(items: { key: string; value: string; group: string }[]) {
  const res = await fetch("/api/admin/cms/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  });
  return res.ok;
}

function SaveButton({
  saving,
  saved,
  onSave,
}: {
  saving: boolean;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
    >
      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
      {saving ? "جاري الحفظ..." : saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
    </button>
  );
}

export default function AdminSettingsPage() {
  const { data: configs = [], isLoading } = useSWR<ConfigItem[]>("/api/admin/cms/settings", fetcher);
  const storeConfigs = configs.filter((c) => c.group === "store");
  const configMap = Object.fromEntries(storeConfigs.map((c) => [c.key, c.value]));
  const current = mapStoreSettings(configMap);

  const [values, setValues] = useState<StoreSettings>(current);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setValues(mapStoreSettings(configMap));
    }
  }, [isLoading, configs]);

  function update<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "currency") {
        const option = CURRENCY_OPTIONS.find((entry) => entry.code === value);
        if (option) {
          next.currencyLabel =
            value === "MAD"
              ? "درهم"
              : value === "USD"
                ? "$"
                : value === "EUR"
                  ? "€"
                  : next.currencyLabel;
        }
      }
      return next;
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const ok = await saveSettings(storeSettingsToConfig(values));
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await mutate("/api/admin/cms/settings");
    }
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-subtle">
        <Loader2 className="inline h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-heading">الإعدادات</h1>
          <p className="text-sm text-muted-fg">تكوين العملة، الضرائب، التوصيل، والبكسل.</p>
        </div>
        <SaveButton saving={saving} saved={saved} onSave={handleSave} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-emerald-600" />
            <h2 className="font-semibold text-heading">العملة واللغة</h2>
          </div>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">عملة المتجر</span>
            <select
              className="form-input"
              value={values.currency}
              onChange={(e) => update("currency", e.target.value as CurrencyCode)}
            >
              {CURRENCY_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">تسمية العملة (في الواجهة)</span>
            <input
              className="form-input"
              value={values.currencyLabel}
              onChange={(e) => update("currencyLabel", e.target.value)}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">اللغة الافتراضية</span>
            <select
              className="form-input"
              value={values.locale}
              onChange={(e) => update("locale", e.target.value)}
            >
              <option value="ar">العربية</option>
              <option value="fr">الفرنسية</option>
              <option value="en">الإنجليزية</option>
            </select>
          </label>
        </Card>

        <Card className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-emerald-600" />
            <h2 className="font-semibold text-heading">الضرائب</h2>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={values.taxEnabled}
              onChange={(e) => update("taxEnabled", e.target.checked)}
            />
            <span className="text-sm text-body">تفعيل الضريبة على الطلبات</span>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">نسبة الضريبة (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              step={0.5}
              className="form-input"
              value={values.taxRate}
              onChange={(e) => update("taxRate", Number(e.target.value))}
              disabled={!values.taxEnabled}
            />
          </label>
        </Card>

        <Card className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-600" />
            <h2 className="font-semibold text-heading">التوصيل والدفع</h2>
          </div>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">تكلفة الشحن الثابتة</span>
            <input
              type="number"
              min={0}
              className="form-input"
              value={values.shippingFlatRate}
              onChange={(e) => update("shippingFlatRate", Number(e.target.value))}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">حد التوصيل المجاني (0 = معطّل)</span>
            <input
              type="number"
              min={0}
              className="form-input"
              value={values.freeShippingThreshold}
              onChange={(e) => update("freeShippingThreshold", Number(e.target.value))}
            />
          </label>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-fg">طرق الدفع المتاحة</p>
            {[
              { key: "codEnabled" as const, label: "الدفع عند الاستلام (COD)" },
              { key: "cardEnabled" as const, label: "البطاقة البنكية" },
              { key: "walletEnabled" as const, label: "المحفظة الإلكترونية" },
            ].map((method) => (
              <label key={method.key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={values[method.key]}
                  onChange={(e) => update(method.key, e.target.checked)}
                />
                <span className="text-sm text-body">{method.label}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            <h2 className="font-semibold text-heading">بكسل التتبع والتحليلات</h2>
          </div>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">Meta Pixel ID</span>
            <input
              className="form-input"
              dir="ltr"
              placeholder="1234567890"
              value={values.metaPixelId}
              onChange={(e) => update("metaPixelId", e.target.value)}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">TikTok Pixel ID</span>
            <input
              className="form-input"
              dir="ltr"
              placeholder="CXXXXXXXXXXXXXXX"
              value={values.tiktokPixelId}
              onChange={(e) => update("tiktokPixelId", e.target.value)}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">Google Analytics ID</span>
            <input
              className="form-input"
              dir="ltr"
              placeholder="G-XXXXXXXXXX"
              value={values.gaMeasurementId}
              onChange={(e) => update("gaMeasurementId", e.target.value)}
            />
          </label>
          <p className="text-xs text-subtle">
            تُطبَّق البكسلات على الموقع مباشرة بعد الحفظ. تبقى قيم .env احتياطية إذا تركت الحقول فارغة.
          </p>
        </Card>
      </div>

      <Card className="flex items-start gap-3 p-5">
        <Globe className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <h3 className="font-medium text-heading">معاينة الإعدادات الحالية</h3>
          <ul className="mt-2 space-y-1 text-sm text-body">
            <li>العملة: {values.currency} ({values.currencyLabel})</li>
            <li>
              الضريبة: {values.taxEnabled ? `${values.taxRate}%` : "معطّلة"}
            </li>
            <li>
              الشحن: {values.shippingFlatRate} {values.currencyLabel}
              {values.freeShippingThreshold > 0
                ? ` — مجاني فوق ${values.freeShippingThreshold} ${values.currencyLabel}`
                : ""}
            </li>
            <li>
              البكسلات:{" "}
              {[values.metaPixelId && "Meta", values.tiktokPixelId && "TikTok", values.gaMeasurementId && "GA"]
                .filter(Boolean)
                .join("، ") || "غير مفعّلة"}
            </li>
          </ul>
        </div>
        <Settings className="mr-auto h-5 w-5 text-subtle" />
      </Card>
    </div>
  );
}
