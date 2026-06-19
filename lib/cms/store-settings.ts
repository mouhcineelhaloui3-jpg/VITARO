import type { CurrencyCode } from "@/types/commerce";

export type StoreSettings = {
  currency: CurrencyCode;
  currencyLabel: string;
  locale: string;
  taxEnabled: boolean;
  taxRate: number;
  shippingFlatRate: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
  cardEnabled: boolean;
  walletEnabled: boolean;
  metaPixelId: string;
  tiktokPixelId: string;
  gaMeasurementId: string;
};

export const CURRENCY_OPTIONS: { code: CurrencyCode; label: string }[] = [
  { code: "MAD", label: "درهم مغربي (MAD)" },
  { code: "USD", label: "دولار أمريكي (USD)" },
  { code: "EUR", label: "يورو (EUR)" },
  { code: "SAR", label: "ريال سعودي (SAR)" },
  { code: "AED", label: "درهم إماراتي (AED)" },
  { code: "EGP", label: "جنيه مصري (EGP)" },
  { code: "GBP", label: "جنيه إسترليني (GBP)" },
];

const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  MAD: "درهم",
  USD: "$",
  EUR: "€",
  SAR: "ر.س",
  AED: "د.إ",
  EGP: "ج.م",
  GBP: "£",
};

export const defaultStoreSettings: StoreSettings = {
  currency: (process.env.NEXT_PUBLIC_DEFAULT_CURRENCY as CurrencyCode) || "MAD",
  currencyLabel:
    CURRENCY_LABELS[(process.env.NEXT_PUBLIC_DEFAULT_CURRENCY as CurrencyCode) || "MAD"],
  locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "ar",
  taxEnabled: false,
  taxRate: 0,
  shippingFlatRate: 0,
  freeShippingThreshold: 499,
  codEnabled: true,
  cardEnabled: true,
  walletEnabled: true,
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
};

export const STORE_SETTING_KEYS = [
  "currency",
  "currencyLabel",
  "locale",
  "taxEnabled",
  "taxRate",
  "shippingFlatRate",
  "freeShippingThreshold",
  "codEnabled",
  "cardEnabled",
  "walletEnabled",
  "metaPixelId",
  "tiktokPixelId",
  "gaMeasurementId",
] as const;

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function configValue(map: Record<string, string>, key: string, fallback: string): string {
  return map[key] ?? fallback;
}

export function storeSettingsToConfig(settings: StoreSettings) {
  return [
    { key: "currency", value: settings.currency, group: "store" },
    { key: "currencyLabel", value: settings.currencyLabel, group: "store" },
    { key: "locale", value: settings.locale, group: "store" },
    { key: "taxEnabled", value: String(settings.taxEnabled), group: "store" },
    { key: "taxRate", value: String(settings.taxRate), group: "store" },
    { key: "shippingFlatRate", value: String(settings.shippingFlatRate), group: "store" },
    {
      key: "freeShippingThreshold",
      value: String(settings.freeShippingThreshold),
      group: "store",
    },
    { key: "codEnabled", value: String(settings.codEnabled), group: "store" },
    { key: "cardEnabled", value: String(settings.cardEnabled), group: "store" },
    { key: "walletEnabled", value: String(settings.walletEnabled), group: "store" },
    { key: "metaPixelId", value: settings.metaPixelId, group: "store" },
    { key: "tiktokPixelId", value: settings.tiktokPixelId, group: "store" },
    { key: "gaMeasurementId", value: settings.gaMeasurementId, group: "store" },
  ];
}

export function mapStoreSettings(map: Record<string, string>): StoreSettings {
  const currency =
    (configValue(map, "currency", defaultStoreSettings.currency) as CurrencyCode) ||
    defaultStoreSettings.currency;

  return {
    currency,
    currencyLabel:
      configValue(map, "currencyLabel", CURRENCY_LABELS[currency] ?? defaultStoreSettings.currencyLabel),
    locale: configValue(map, "locale", defaultStoreSettings.locale),
    taxEnabled: parseBool(map.taxEnabled, defaultStoreSettings.taxEnabled),
    taxRate: parseNumber(map.taxRate, defaultStoreSettings.taxRate),
    shippingFlatRate: parseNumber(map.shippingFlatRate, defaultStoreSettings.shippingFlatRate),
    freeShippingThreshold: parseNumber(
      map.freeShippingThreshold,
      defaultStoreSettings.freeShippingThreshold,
    ),
    codEnabled: parseBool(map.codEnabled, defaultStoreSettings.codEnabled),
    cardEnabled: parseBool(map.cardEnabled, defaultStoreSettings.cardEnabled),
    walletEnabled: parseBool(map.walletEnabled, defaultStoreSettings.walletEnabled),
    metaPixelId: configValue(map, "metaPixelId", defaultStoreSettings.metaPixelId),
    tiktokPixelId: configValue(map, "tiktokPixelId", defaultStoreSettings.tiktokPixelId),
    gaMeasurementId: configValue(map, "gaMeasurementId", defaultStoreSettings.gaMeasurementId),
  };
}

function hasDb(): boolean {
  const url = process.env.DATABASE_URL;
  return !!url && !url.startsWith("file:");
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const { cmsNoStore } = await import("@/lib/cms/runtime");
  cmsNoStore();
  if (!hasDb()) return defaultStoreSettings;

  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.siteConfig.findMany({ where: { group: "store" } });
    if (rows.length === 0) return defaultStoreSettings;
    return mapStoreSettings(Object.fromEntries(rows.map((row) => [row.key, row.value])));
  } catch {
    return defaultStoreSettings;
  }
}

export function calculateOrderTotals(
  subtotal: number,
  settings: StoreSettings,
): { shipping: number; tax: number; total: number } {
  const shipping =
    settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold
      ? 0
      : settings.shippingFlatRate;

  const tax = settings.taxEnabled
    ? Math.round(subtotal * (settings.taxRate / 100) * 100) / 100
    : 0;

  return {
    shipping,
    tax,
    total: subtotal + shipping + tax,
  };
}
