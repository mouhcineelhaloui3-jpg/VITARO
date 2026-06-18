import type { Metadata } from "next";
import { Cairo } from "next/font/google";

import { StorefrontChrome } from "@/components/layout/storefront-chrome";
import { getBrand } from "@/lib/cms/db";

import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://vitaro.health"),
    title: {
      default: `${brand.name} | ميزان ذكي للجسم فالمغرب`,
      template: `%s | ${brand.name}`,
    },
    description:
      "ميزان ذكي كيقيس الوزن، الشحم، العضلات وأكثر من 13 مؤشر. توصيل لجميع مدن المغرب وخلّص فالدار.",
    keywords: [
      "ميزان ذكي المغرب",
      "ميزان رقمي للجسم",
      "شراء ميزان ذكي",
      "ميزان الوزن المغرب",
      brand.name,
    ],
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: "/favicon.svg",
    },
    openGraph: {
      title: `${brand.name} | ميزان ذكي للجسم فالمغرب`,
      description: brand.description,
      siteName: brand.name,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-body selection:bg-accent-light">
        <StorefrontChrome>{children}</StorefrontChrome>
      </body>
    </html>
  );
}
