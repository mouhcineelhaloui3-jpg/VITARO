import Link from "next/link";
import { Menu, MessageCircle } from "lucide-react";

import { VitaroLogo } from "@/components/brand/vitaro-logo";
import { ButtonLink } from "@/components/ui/button";
import { CartDrawer } from "@/features/cart/cart-drawer";
import type { SiteChrome } from "@/lib/cms/site";

type HeaderProps = {
  header: SiteChrome["header"];
  brandName: string;
  featuredProduct: SiteChrome["featuredProduct"];
  whatsappPhone: string;
};

export function Header({ header, featuredProduct, whatsappPhone }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <VitaroLogo priority />

        <nav className="mr-4 hidden items-center gap-1 lg:flex" aria-label="القائمة الرئيسية">
          {header.navigation.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              className="inline-flex h-10 items-center rounded-xl px-4 text-[0.9375rem] font-medium text-body transition-all hover:bg-section-bg hover:text-heading"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={header.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="واتساب"
            className="hidden h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-[#25D366] transition-all hover:bg-section-bg hover:border-subtle sm:inline-flex"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <CartDrawer product={featuredProduct} whatsappPhone={whatsappPhone} />
          <ButtonLink
            className="hidden sm:inline-flex hover:translate-y-0 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
            href={header.productHref}
            variant="primary"
            size="sm"
          >
            {header.ctaLabel}
          </ButtonLink>
          <button
            aria-label="القائمة"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-heading transition-all hover:bg-section-bg lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
