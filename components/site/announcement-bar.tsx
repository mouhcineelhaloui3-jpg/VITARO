import { ShieldCheck, Truck, WalletCards } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="border-b border-border/40 bg-heading px-4 py-3 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 text-center text-[0.8125rem] font-medium sm:justify-between">
        <span className="font-semibold">
          عرض خاص: التوصيل مجاني + خلّص فالدار. ضمان استرجاع الفلوس 30 يوم.
        </span>
        <div className="hidden items-center gap-5 sm:flex">
          <span className="inline-flex items-center gap-2">
            <Truck className="h-4 w-4 text-success" />
            توصيل سريع
          </span>
          <span className="inline-flex items-center gap-2">
            <WalletCards className="h-4 w-4 text-success" />
            خلّص فالدار
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success" />
            تسوق آمن
          </span>
        </div>
      </div>
    </div>
  );
}
