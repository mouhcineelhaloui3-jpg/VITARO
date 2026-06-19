import Link from "next/link";
import type { ReactNode } from "react";
import { LayoutDashboard, Mail, MessageCircle, Phone } from "lucide-react";

import { VitaroLogo } from "@/components/brand/vitaro-logo";
import type { SiteChrome } from "@/lib/cms/site";

type FooterProps = {
  footer: SiteChrome["footer"];
};

export function Footer({ footer }: FooterProps) {
  return (
    <footer className="border-t border-border bg-section-bg px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <VitaroLogo />
          <p className="mt-6 max-w-sm text-[0.9375rem] leading-[1.75] text-body">
            {footer.description}
          </p>
          <a
            href={footer.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#1fb85a]"
          >
            <MessageCircle className="h-5 w-5" />
            {footer.whatsappCta}
          </a>
        </div>

        <FooterColumn title={footer.shopColumnTitle}>
          {footer.collectionLinks.map((collection) => (
            <Link key={collection.href} href={collection.href}>
              {collection.name}
            </Link>
          ))}
        </FooterColumn>

        <FooterColumn title={footer.helpColumnTitle}>
          {footer.helpLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </FooterColumn>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col items-center justify-between gap-5 border-t border-border pt-10 text-sm text-muted sm:flex-row">
        <div className="flex items-center gap-5">
          <p className="flex items-center gap-2" dir="ltr">
            <Phone className="h-4 w-4 text-accent" />
            <span className="font-medium">{footer.whatsappDisplay}</span>
          </p>
          <p className="flex items-center gap-2" dir="ltr">
            <Mail className="h-4 w-4 text-accent" />
            <span className="font-medium">{footer.supportEmail}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-medium">
            © {new Date().getFullYear()} {footer.brandName}
          </p>
          <Link
            href="/admin"
            aria-label="لوحة التحكم"
            title="لوحة التحكم"
            className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted transition-all hover:border-accent hover:text-accent"
          >
            <LayoutDashboard className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[0.9375rem] font-bold text-heading">{title}</h3>
      <div className="mt-6 flex flex-col gap-3.5 text-[0.9375rem] text-body [&_a]:transition-colors [&_a:hover]:text-heading">
        {children}
      </div>
    </div>
  );
}
