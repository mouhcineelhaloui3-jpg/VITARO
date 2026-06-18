export type CurrencyCode = "USD" | "EUR" | "GBP" | "SAR" | "AED" | "EGP" | "MAD";

export type ProductMetric = {
  label: string;
  value: string;
  description: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  color: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
};

export type ProductFeature = {
  title: string;
  description: string;
};

export type ProductSpecification = {
  group: string;
  items: {
    label: string;
    value: string;
  }[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  description: string;
  categoryId: string;
  collectionIds: string[];
  images: string[];
  price: number;
  compareAtPrice?: number;
  currency: CurrencyCode;
  rating: number;
  reviewCount: number;
  inventory: number;
  tags: string[];
  variants: ProductVariant[];
  metrics: ProductMetric[];
  features: ProductFeature[];
  specifications: ProductSpecification[];
  packageContents: string[];
  usageSteps: string[];
  seo: {
    title: string;
    description: string;
  };
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  productIds: string[];
  futureReady: boolean;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type PolicyPage = {
  slug: string;
  title: string;
  summary: string;
  sections: {
    title: string;
    body: string;
  }[];
};

export type AdminModule = {
  title: string;
  description: string;
  metric: string;
  status: "Ready" | "Planned" | "Connected";
};
