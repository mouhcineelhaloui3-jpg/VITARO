import Link from "next/link";
import type { ReactNode } from "react";
import { LayoutDashboard, Mail, MessageCircle, Phone } from "lucide-react";

import { collections } from "@/lib/data/catalog";
import { brand, policies } from "@/lib/data/content";

export function Footer() {
  return (
    <footer className="border-t border-border bg-section-bg px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <Link
            className="flex items-center gap-3.5"
            href="/"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-heading">
              <span className="text-2xl font-bold text-white">V</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-heading">
              {brand.name}
            </span>
          </Link>
          <p className="mt-6 max-w-sm text-[0.9375rem] leading-[1.75] text-body">
            ميزان ذكي كيعاونك تعرف جسمك بزاف ديال التفاصيل. توصيل لجميع المدن وخلاص فالدار.
          </p>
          <a
            href="https://wa.me/212682217644"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5 text-[0.9375rem] font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <MessageCircle className="h-5 w-5" />
            تواصل معانا فواتساب
          </a>
        </div>

        <FooterColumn title="المتجر">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collections/${collection.slug}`}>
              {collection.name}
            </Link>
          ))}
        </FooterColumn>

        <FooterColumn title="مساعدة">
          <Link href="/about">شكون حنا</Link>
          <Link href="/contact">تواصل معانا</Link>
          {policies.slice(0, 3).map((policy) => (
            <Link key={policy.slug} href={`/help/${policy.slug}`}>
              {policy.title}
            </Link>
          ))}
        </FooterColumn>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col items-center justify-between gap-5 border-t border-border pt-10 text-sm text-muted sm:flex-row">
        <div className="flex items-center gap-5">
          <p className="flex items-center gap-2" dir="ltr">
            <Phone className="h-4 w-4 text-accent" />
            <span className="font-medium">{brand.whatsapp}</span>
          </p>
          <p className="flex items-center gap-2" dir="ltr">
            <Mail className="h-4 w-4 text-accent" />
            <span className="font-medium">{brand.supportEmail}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-medium">© {new Date().getFullYear()} {brand.name}</p>
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
