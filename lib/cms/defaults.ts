import {
  blogArticles,
  brand,
  navigation,
  policies,
} from "@/lib/data/content";
import { collections } from "@/lib/data/catalog";

export type NavItem = { label: string; href: string };

export const defaultHeader = {
  logoLetter: "V",
  logoText: "VITARO",
  ctaLabel: "شري دابا",
  productSlug: "smart-digital-body-scale",
};

export const defaultAnnouncement = {
  text: "عرض خاص: التوصيل مجاني + خلّص فالدار. ضمان استرجاع الفلوس 30 يوم.",
  chip1: "توصيل سريع",
  chip2: "خلّص فالدار",
  chip3: "تسوق آمن",
};

export const defaultFooter = {
  description:
    "ميزان ذكي كيعاونك تعرف جسمك بزاف ديال التفاصيل. توصيل لجميع المدن وخلاص فالدار.",
  whatsappCta: "تواصل معانا فواتساب",
  shopColumnTitle: "المتجر",
  helpColumnTitle: "مساعدة",
};

export const defaultHero = {
  badge: "⭐ الميزان الذكي رقم 1 فالمغرب",
  title: "اكتشف جسمك بدقة... فثوانٍ.",
  subtitle:
    "ماشي غير ميزان. فيتارو كيحلّل أكثر من 13 مؤشر فالجسم، بحال نسبة الدهون، العضلات، الماء، وكتلة العظام، وكيبعث النتائج مباشرة لتطبيق OKOK على تيليفونك.",
  cta_whatsapp: "طلب عبر واتساب",
  cta_buy: "شري دابا",
};

export const defaultHomeSections = {
  benefits_eyebrow: "شنو كيعطيك فيتارو؟",
  benefits_title: "تحليل شامل لجسمك فمكان واحد.",
  how_eyebrow: "كيفاش كيخدم؟",
  how_title: "3 خطوات ونتا جاهز.",
  metrics_eyebrow: "شنو كيعطيك فيتارو؟",
  metrics_title: "أكثر من 13 مؤشر صحي.",
  quality_eyebrow: "علاش تختار فيتارو؟",
  quality_title: "ميزات كتخليك مرتاح من أول استعمال.",
  reviews_eyebrow: "آراء الزبناء",
  reviews_title: "تجارب حقيقية من زبناء فيتارو.",
  faq_eyebrow: "الأسئلة الشائعة",
  faq_title: "كلشي واضح قبل ما تطلب.",
  cta_title: "جاهز تعرف جسمك بدقة؟",
  cta_subtitle: "ابدأ اليوم وخلي فيتارو يساعدك تتابع صحتك وتقدمك بكل سهولة.",
};

export const defaultTrustChips = [
  "توصيل لجميع المدن المغربية",
  "الدفع عند الاستلام",
  "ضمان سنتين",
];

export const defaultNavigation: NavItem[] = navigation;

export const defaultFooterHelpLinks: NavItem[] = [
  { label: "شكون حنا", href: "/about" },
  { label: "تواصل معانا", href: "/contact" },
  ...policies.slice(0, 3).map((policy) => ({
    label: policy.title,
    href: `/help/${policy.slug}`,
  })),
];

export const defaultCollectionLinks = collections.map((collection) => ({
  name: collection.name,
  href: `/collections/${collection.slug}`,
}));

export const defaultBlogArticles = blogArticles.map((article) => ({
  ...article,
  body:
    "هاد المقال جاهز للتحرير من لوحة التحكم. يمكنك إضافة محتوى تعليمي، روابط داخلية، ونصائح صحية مفصلة.",
}));

export { brand as defaultBrand };
