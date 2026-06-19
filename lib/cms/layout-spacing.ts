export const SECTION_SPACING_PRESETS = {
  compact: {
    label: "مضغوط",
    section: "py-8 sm:py-10 lg:py-12",
    header: "mb-8 lg:mb-10",
  },
  normal: {
    label: "عادي",
    section: "py-12 sm:py-14 lg:py-20",
    header: "mb-10 lg:mb-12",
  },
  relaxed: {
    label: "مريح",
    section: "py-16 sm:py-20 lg:py-24",
    header: "mb-12 lg:mb-14",
  },
  spacious: {
    label: "واسع",
    section: "py-20 sm:py-24 lg:py-32",
    header: "mb-14 lg:mb-16",
  },
} as const;

export type SectionSpacingPreset = keyof typeof SECTION_SPACING_PRESETS;

export const PAGE_SPACING_KEYS = [
  { key: "spacing.home", label: "الصفحة الرئيسية", route: "/" },
  { key: "spacing.about", label: "صفحة من نحن", route: "/about" },
  { key: "spacing.product", label: "صفحة المنتج", route: "/products/smart-digital-body-scale" },
  { key: "spacing.contact", label: "صفحة التواصل", route: "/contact" },
  { key: "spacing.help", label: "صفحة المساعدة", route: "/help" },
  { key: "spacing.blog", label: "المدونة", route: "/blog" },
  { key: "spacing.collections", label: "المجموعات", route: "/collections" },
  { key: "spacing.default", label: "باقي الصفحات (افتراضي)", route: "/" },
] as const;

export const STOREFRONT_PAGE_SPACING_KEYS = PAGE_SPACING_KEYS.filter(
  (page) => page.key === "spacing.home" || page.key === "spacing.product",
);

export const DEFAULT_PAGE_SPACING: Record<string, SectionSpacingPreset> = {
  "spacing.home": "normal",
  "spacing.about": "normal",
  "spacing.product": "normal",
  "spacing.contact": "normal",
  "spacing.help": "normal",
  "spacing.blog": "normal",
  "spacing.collections": "normal",
  "spacing.default": "normal",
};

export function resolveSectionSpacing(
  preset: string | undefined,
): (typeof SECTION_SPACING_PRESETS)[SectionSpacingPreset] {
  if (preset && preset in SECTION_SPACING_PRESETS) {
    return SECTION_SPACING_PRESETS[preset as SectionSpacingPreset];
  }
  return SECTION_SPACING_PRESETS.normal;
}

export function pageSpacingConfigKey(page: string): string {
  const map: Record<string, string> = {
    home: "spacing.home",
    about: "spacing.about",
    product: "spacing.product",
    contact: "spacing.contact",
    help: "spacing.help",
    blog: "spacing.blog",
    collections: "spacing.collections",
  };
  return map[page] ?? "spacing.default";
}
