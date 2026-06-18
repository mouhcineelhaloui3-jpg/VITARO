import type { Collection, Product } from "@/types/commerce";

export const collections: Collection[] = [
  {
    id: "smart-body-scales",
    slug: "smart-body-scales",
    name: "الميزان الذكي",
    eyebrow: "تحليل الجسم",
    description:
      "ميزان ذكي كيحلل ليك جسمك كامل: الوزن، الشحم، العضلات والماء، ومباشرة فتيليفونك.",
    productIds: ["vitaro-body-scale"],
    futureReady: false,
  },
];

export const products: Product[] = [
  {
    id: "vitaro-body-scale",
    slug: "smart-digital-body-scale",
    title: "ميزان فيتارو الذكي لتحليل الجسم",
    eyebrow: "المنتج رقم 1 ديالنا",
    subtitle: "ماشي غير ميزان للوزن، هو مستشارك الصحي فالدار.",
    description:
      "واش بغيتي تتبع صحتك ورياضتك بدقة؟ هاد الميزان الذكي كيعطيك تحليل كامل لجسمك بضغطة وحدة فتيليفونك: الوزن، الشحم، العضلات، الماء، العظام وأكثر من 12 مؤشر.",
    categoryId: "smart-body-scales",
    collectionIds: ["smart-body-scales"],
    images: [
      "/products/scale-hero-ar.png",
      "/products/scale-main.png",
      "/products/scale-lifestyle.png",
      "/products/scale-display.png",
      "/products/scale-app.png",
      "/products/scale-size.png",
    ],
    price: 299,
    compareAtPrice: 499,
    currency: "MAD",
    rating: 4.9,
    reviewCount: 1284,
    inventory: 18,
    tags: ["ميزان ذكي", "OKOK", "بلوتوث", "تحليل الجسم"],
    variants: [
      {
        id: "obsidian",
        name: "أسود",
        sku: "VIT-SCALE-BLACK",
        color: "#111111",
        price: 299,
        compareAtPrice: 499,
        inventory: 18,
      },
      {
        id: "porcelain",
        name: "أبيض",
        sku: "VIT-SCALE-WHITE",
        color: "#F8F8F5",
        price: 299,
        compareAtPrice: 499,
        inventory: 22,
      },
    ],
    metrics: [
      {
        label: "+12 مؤشر",
        value: "تحليل كامل",
        description: "الشحم، العضلات، الماء، العظام وغيرهم، ماشي غير الوزن.",
      },
      {
        label: "تطبيق OKOK",
        value: "بلوتوث",
        description: "كيتربط أوتوماتيكياً مع أندرويد و آيفون فثواني.",
      },
      {
        label: "حسابات متعددة",
        value: "العائلة كاملة",
        description: "كل واحد فالدار عندو الحساب ديالو مستقل.",
      },
      {
        label: "4 مستشعرات",
        value: "دقة عالية",
        description: "زجاج مقسى و4 مستشعرات معدنية لقراءات صحيحة.",
      },
    ],
    features: [
      {
        title: "تحليل شامل للجسم",
        description:
          "ماشي غير الوزن، كيعطيك أكثر من 12 مؤشر حيوي: الشحم، العضلات، الماء، كتلة العظام وغيرهم.",
      },
      {
        title: "اتصال ذكي وسريع",
        description:
          "كيتربط أوتوماتيكياً عبر البلوتوث مع تطبيق OKOK المتوافق مع أندرويد و آيفون (iOS).",
      },
      {
        title: "تابع تطورك بسهولة",
        description:
          "التطبيق كيحفظ القراءات السابقة وكيرسم ليك مبيانات باش تشوف فين وصلتي فخسارة الشحم ولا ربح العضلات.",
      },
      {
        title: "تصميم عصري وآمن",
        description:
          "مصنوع من الزجاج المقسى عالي المقاومة، ب4 مستشعرات معدنية عالية الدقة لضمان قراءات موثوقة.",
      },
    ],
    specifications: [
      {
        group: "المؤشرات اللي كيقيس",
        items: [
          { label: "الوزن", value: "Weight" },
          { label: "مؤشر كتلة الجسم", value: "BMI" },
          { label: "نسبة الشحم", value: "Body Fat %" },
          { label: "الكتلة العضلية", value: "Muscle Mass" },
          { label: "نسبة الماء", value: "Body Water" },
          { label: "الدهون الحشوية", value: "Visceral Fat" },
          { label: "كتلة العظام", value: "Bone Mass" },
          { label: "معدل الأيض", value: "BMR" },
        ],
      },
      {
        group: "المواصفات التقنية",
        items: [
          { label: "السطح", value: "زجاج مقسى عالي المقاومة" },
          { label: "المستشعرات", value: "4 مستشعرات معدنية دقيقة" },
          { label: "السعة القصوى", value: "180 كجم" },
          { label: "البطارية", value: "تعمل بالبطاريات (متضمنة)" },
        ],
      },
      {
        group: "الاتصال والتطبيق",
        items: [
          { label: "التطبيق", value: "OKOK International" },
          { label: "الاتصال", value: "بلوتوث (Bluetooth)" },
          { label: "التوافق", value: "أندرويد و آيفون iOS" },
          { label: "المستخدمين", value: "حسابات متعددة للعائلة" },
        ],
      },
    ],
    packageContents: [
      "ميزان فيتارو الذكي",
      "بطاريات",
      "دليل الاستعمال",
      "تغليف آمن",
    ],
    usageSteps: [
      "حُط الميزان على أرض صلبة ومستوية (بعّد على الزربية ولا السجاد).",
      "حمّل تطبيق OKOK من المتجر وشعّل البلوتوث فتيليفونك.",
      "طلع فوق الميزان حافي القدمين باش رجليك يلامسو المستشعرات الأربعة الفضية، وغادي تجيك كل المؤشرات كاملة.",
    ],
    seo: {
      title: "ميزان فيتارو الذكي | أفضل ميزان رقمي لتحليل الجسم فالمغرب",
      description:
        "ميزان ذكي كيقيس الوزن، الشحم، العضلات و+12 مؤشر مع تطبيق OKOK. توصيل لجميع مدن المغرب وخلّص فالدار.",
    },
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCollectionBySlug(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getProductsForCollection(collectionId: string) {
  return products.filter((product) => product.collectionIds.includes(collectionId));
}
