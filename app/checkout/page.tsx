import { Lock, ShieldCheck, Truck, WalletCards, type LucideIcon } from "lucide-react";
import Image from "next/image";

import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { products } from "@/lib/data/catalog";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "إتمام الطلب",
  description: "إتمام الطلب في فيتارو، دفع آمن أو الدفع عند الاستلام.",
};

export default function CheckoutPage() {
  const product = products[0];
  const paymentMethods: { label: string; icon: LucideIcon; id: string }[] = [
    { label: "الدفع عند الاستلام", icon: Truck, id: "cod" },
    { label: "البطاقة البنكية", icon: WalletCards, id: "card" },
    { label: "المحفظة الإلكترونية", icon: ShieldCheck, id: "wallet" },
  ];

  return (
    <Section
      eyebrow="إتمام الطلب"
      title="سريع، بسيط، ومضمون."
      description="أدخل معلوماتك للشحن في المغرب. يمكنك الدفع عند الاستلام أو استخدام وسائل الدفع الإلكترونية."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
        <Card>
          <div className="mb-8 flex items-center gap-3">
            <Lock className="h-5 w-5 text-emerald-500" />
            <p className="font-semibold">دفع آمن 100%</p>
          </div>
          <form className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="form-input" placeholder="الاسم الشخصي" />
              <input className="form-input" placeholder="الاسم العائلي" />
            </div>
            <input className="form-input text-right" placeholder="رقم الهاتف (مثال: 0600000000)" dir="rtl" />
            <input className="form-input" placeholder="عنوان التوصيل بالتفصيل" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="form-input" placeholder="المدينة" />
              <input className="form-input" placeholder="الرمز البريدي" />
            </div>
            <p className="mt-4 font-semibold text-heading">طريقة الدفع</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className={`rounded-3xl border ${method.id === 'cod' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10' : 'border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5'} p-4 text-right font-semibold transition hover:border-emerald-300`}
                  type="button"
                >
                  <method.icon className="mb-3 h-5 w-5 text-emerald-500" />
                  {method.label}
                </button>
              ))}
            </div>
            <Button size="lg" type="button" className="mt-4">
              تأكيد الطلب
            </Button>
            <p className="text-center text-xs text-muted-fg">سنتواصل معك عبر الواتساب لتأكيد الطلب قبل الشحن.</p>
          </form>
        </Card>

        <Card className="h-fit">
          <Badge variant="success">ملخص الطلب</Badge>
          <div className="mt-6 flex gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl bg-white dark:bg-white/10">
              <Image src={product.images[0]} alt={product.title} fill sizes="80px" className="object-contain p-1" />
            </div>
            <div>
              <h2 className="font-semibold">{product.title}</h2>
              <p className="mt-1 text-sm text-muted-fg">أسود داكن · الكمية 1</p>
            </div>
          </div>
          <div className="mt-8 space-y-3 border-t border-zinc-200 pt-6 text-sm dark:border-white/10">
            <div className="flex justify-between">
              <span>المجموع الفرعي</span>
              <span>{formatCurrency(product.price, product.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>الشحن</span>
              <span className="text-emerald-600 font-semibold">مجاني</span>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-4 text-lg font-semibold dark:border-white/10">
              <span>الإجمالي</span>
              <span>{formatCurrency(product.price, product.currency)}</span>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}
