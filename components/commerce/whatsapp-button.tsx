"use client";

import { MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function FloatingWhatsApp() {
  const handleClick = () => {
    trackEvent("whatsapp_click", { location: "floating_button" });
    window.open("https://wa.me/212682217644?text=مرحباً، أريد الاستفسار عن ميزان فيتارو الذكي", "_blank");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="تواصل عبر الواتساب"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_rgba(37,211,102,0.4)] transition hover:-translate-y-1 hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  );
}
