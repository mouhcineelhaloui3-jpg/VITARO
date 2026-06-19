"use client";

import { usePathname } from "next/navigation";

import { FloatingWhatsApp } from "@/components/commerce/whatsapp-button";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import type { SiteChrome } from "@/lib/cms/site";

export function ConditionalSiteChrome({
  children,
  chrome,
}: {
  children: React.ReactNode;
  chrome: SiteChrome;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementBar announcement={chrome.announcement} />
      <Header
        header={chrome.header}
        brandName={chrome.brand.name}
        featuredProduct={chrome.featuredProduct}
        whatsappPhone={chrome.brand.whatsapp}
      />
      <main className="flex-1">{children}</main>
      <Footer footer={chrome.footer} />
      <FloatingWhatsApp whatsappUrl={chrome.whatsappUrl} />
    </>
  );
}
