"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import { Check, ExternalLink, Loader2, Rows3 } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  DEFAULT_PAGE_SPACING,
  SECTION_SPACING_PRESETS,
  STOREFRONT_PAGE_SPACING_KEYS,
  type SectionSpacingPreset,
} from "@/lib/cms/layout-spacing";

type ConfigItem = { key: string; value: string; group: string };

const fetcher = (url: string) => fetch(url).then((r) => (r.ok ? r.json() : []));

const PRESET_HEIGHT: Record<SectionSpacingPreset, string> = {
  compact: "h-8",
  normal: "h-12",
  relaxed: "h-16",
  spacious: "h-20",
};

async function saveSettings(items: { key: string; value: string; group: string }[]) {
  const res = await fetch("/api/admin/cms/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  });
  return res.ok;
}

export function StorefrontSpacingPanel() {
  const { data: configs = [], isLoading } = useSWR<ConfigItem[]>("/api/admin/cms/settings", fetcher);
  const layoutConfigs = configs.filter((c) => c.group === "layout");

  const current = (key: string) =>
    (layoutConfigs.find((c) => c.key === key)?.value as SectionSpacingPreset | undefined) ??
    DEFAULT_PAGE_SPACING[key] ??
    "normal";

  const [values, setValues] = useState<Record<string, SectionSpacingPreset>>({
    "spacing.home": "normal",
    "spacing.product": "normal",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setValues(
        Object.fromEntries(
          STOREFRONT_PAGE_SPACING_KEYS.map((page) => [page.key, current(page.key)]),
        ) as Record<string, SectionSpacingPreset>,
      );
    }
  }, [isLoading, configs]);

  async function handleSave() {
    setSaving(true);
    const ok = await saveSettings(
      STOREFRONT_PAGE_SPACING_KEYS.map((page) => ({
        key: page.key,
        value: values[page.key] ?? "normal",
        group: "layout",
      })),
    );
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await mutate("/api/admin/cms/settings");
    }
  }

  return (
    <Card id="spacing" className="overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Rows3 className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-heading">تباعد الأقسام</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-fg">
              تحكم فالمسافة بين أقسام الصفحة الرئيسية وصفحة المنتج. جرّب &quot;مضغوط&quot; باش
              تقلّص الفراغ الكبير.
            </p>
          </div>
        </div>
        <Link
          href="/admin/content?open=layout-spacing"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:underline"
        >
          إعدادات كل الصفحات
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-sm text-subtle">
          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {STOREFRONT_PAGE_SPACING_KEYS.map((page) => {
            const preset = values[page.key] ?? "normal";
            return (
              <div
                key={page.key}
                className="rounded-2xl border border-border bg-section-bg/50 p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-heading">{page.label}</p>
                    <p className="mt-1 text-xs text-muted-fg">
                      {SECTION_SPACING_PRESETS[preset].label} — معاينة التباعد
                    </p>
                  </div>
                  <a
                    href={page.route}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-body hover:border-emerald-300"
                  >
                    معاينة
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="mb-4 flex items-end gap-2 rounded-xl bg-card p-4">
                  <div className={`flex-1 rounded-md bg-emerald-100 ${PRESET_HEIGHT[preset]}`} />
                  <div className={`flex-[1.4] rounded-md bg-emerald-500/20 ${PRESET_HEIGHT[preset]}`} />
                  <div className={`flex-1 rounded-md bg-emerald-100 ${PRESET_HEIGHT[preset]}`} />
                </div>

                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-muted-fg">مستوى التباعد</span>
                  <select
                    className="form-input"
                    value={preset}
                    onChange={(e) =>
                      setValues((currentValues) => ({
                        ...currentValues,
                        [page.key]: e.target.value as SectionSpacingPreset,
                      }))
                    }
                  >
                    {Object.entries(SECTION_SPACING_PRESETS).map(([key, option]) => (
                      <option key={key} value={key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || isLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
          {saving ? "جاري الحفظ..." : saved ? "تم الحفظ ✓" : "حفظ التباعد"}
        </button>
      </div>
    </Card>
  );
}
