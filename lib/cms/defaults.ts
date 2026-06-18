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
  badge: "الميزان الذكي رقم 1 فالمغرب",
  title: "عرف جسمك بزاف ديال التفاصيل، فثواني.",
  subtitle:
    "ميزان ذكي كيقيس ليك الوزن، الشحم، العضلات، الماء وأكثر من 13 مؤشر. كولشي كيمشي مباشرة لتيليفونك.",
  cta_whatsapp: "طلب عبر واتساب",
  cta_buy: "شري دابا",
};

export const defaultHomeSections = {
  benefits_eyebrow: "علاش فيتارو",
  benefits_title: "ماشي غير ميزان، هو مدرب صحتك.",
  how_eyebrow: "كيفاش كيخدم",
  how_title: "ساهل بزاف. 3 خطوات.",
  metrics_eyebrow: "شنو كيقيس؟",
  metrics_title: "أكثر من 12 مؤشر باش تفهم جسمك مزيان.",
  quality_eyebrow: "جودة واستعمال يومي",
  quality_title: "مصنوع باش يكون قوي، واضح، وساهل فالاستعمال.",
  reviews_eyebrow: "رأي الزبناء",
  reviews_title: "الناس عجباتهم التجربة.",
  faq_eyebrow: "أسئلة",
  faq_title: "واش بقا عندك شي سؤال؟",
  cta_title: "بدا رحلتك نحو صحة أحسن اليوم.",
  cta_subtitle: "طلب دابا وخلّص فالدار. كنوصلو لجميع المدن المغربية.",
};

export const defaultTrustChips = [
  "توصيل لجميع المدن",
  "خلّص فالدار (COD)",
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
