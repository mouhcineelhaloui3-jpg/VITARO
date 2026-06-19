import { companionApp } from "@/lib/data/companion-app";

export const productPageCopy = {
  hero: {
    ctaBuy: "اطلب الآن",
    ctaWhatsapp: "طلب عبر واتساب",
    trust: ["الدفع عند الاستلام", "توصيل سريع", "ضمان سنتين"],
    inStock: "متوفر",
    lowStock: "مخزون محدود",
    discountLabel: "توفير",
  },
  why: {
    eyebrow: "علاش فيتارو",
    title: "مصمم باش يعطيك وضوح، بلا تعقيد.",
    cards: [
      { title: "تحليل أكثر من 13 مؤشر", body: "وزن، دهون، عضلات، ماء وأكثر." },
      { title: "مزامنة تلقائية مع التطبيق", body: "النتائج كتوصل فثواني عبر Bluetooth." },
      { title: "دقة عالية", body: "4 مستشعرات وزجاج مقسّى لقراءات ثابتة." },
      { title: "تصميم فاخر", body: "شكل عصري يليق بأي دار." },
    ],
  },
  included: {
    eyebrow: "شنو كاين فالعلبة",
    title: "كل ما تحتاجه للبداية.",
    items: [
      { label: "الميزان", image: "/products/product-included-scale.png" },
      { label: "البطاريات", image: "/products/product-included-batteries.png" },
      { label: "دليل الاستعمال", image: "/products/product-included-manual.png" },
    ],
  },
  how: {
    eyebrow: "كيفاش كيخدم",
    title: "ثلاث خطوات. بلا تعقيد.",
    steps: [
      {
        title: "وقف حافي القدمين",
        body: "على أرض صلبة.",
        image: "/products/product-step-1.png",
      },
      {
        title: "النتائج كتسجل",
        body: "مزامنة تلقائية مع OKOK.",
        image: "/products/product-step-2.png",
      },
      {
        title: "تابع تطورك",
        body: "رسوم بيانية واضحة.",
        image: "/products/product-step-3.png",
      },
    ],
  },
  bia: {
    eyebrow: "تحليل الجسم",
    title: "تقنية BIA — مرة واحدة، بوضوح.",
    body: "الميزان كيستعمل إشارة كهربائية خفيفة جداً وغير محسوسة. كل نوع من أنسجة الجسم كيقاوم الإشارة بطريقة مختلفة، وهكذا كتحصل على تقدير دقيق لمكونات جسمك. آمن للاستعمال اليومي — بلا ألم ولا إزعاج.",
    image: "/products/product-bia-lifestyle.png",
  },
  app: {
    eyebrow: "تجربة التطبيق",
    title: "كلشي فمكان واحد.",
    image: "/products/product-app-premium.png",
    features: ["رسوم بيانية", "متابعة التقدم", "Bluetooth", "سجل القياسات", "حسابات العائلة"],
    playStoreLabel: "Google Play",
    appStoreLabel: "App Store",
    playStoreUrl: companionApp.playStoreUrl,
    appStoreUrl: companionApp.appStoreUrl,
  },
  specs: {
    eyebrow: "المواصفات",
    title: "التفاصيل، بلا فقرات.",
  },
  faq: {
    eyebrow: "أسئلة سريعة",
    title: "جواب مختصر، قرار أسهل.",
    items: [
      { q: "واش خاصني التطبيق؟", a: "نعم، باش تشوف كل المؤشرات وتتابع التقدم." },
      { q: "واش كاين الدفع عند الاستلام؟", a: "نعم، تخلّص ملي توصلك الطلبية." },
      { q: "واش كيوصل لجميع المدن؟", a: "نعم، التوصيل متوفر فالمغرب." },
      { q: "واش التقنية آمنة؟", a: "نعم، الإشارة خفيفة جداً وغير محسوسة." },
      { q: "واش مناسب للعائلة؟", a: "نعم، حسابات متعددة فالتطبيق." },
      { q: "واش عندو ضمان؟", a: "نعم، ضمان سنتين ضد عيوب التصنيع." },
    ],
  },
  reviews: {
    eyebrow: "آراء الزبناء",
    title: "من زبناء فالمغرب.",
    items: [
      { name: "سارة", city: "الدار البيضاء", quote: "ساهل بزاف، والنتائج واضحة من أول استعمال." },
      { name: "يوسف", city: "الرباط", quote: "التطبيق كيعاونني نتابع الوزن والتقدم ديالي." },
      { name: "نادية", city: "مراكش", quote: "جودة ممتازة وثمن مناسب مقارنة بالميزانات الأخرى." },
    ],
  },
} as const;
