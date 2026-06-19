"use client";

import { MessageCircle } from "lucide-react";

import { trackEvent } from "@/lib/analytics";

type FloatingWhatsAppProps = {
  whatsappUrl: string;
};

export function FloatingWhatsApp({ whatsappUrl }: FloatingWhatsAppProps) {
  const handleClick = () => {
    trackEvent("whatsapp_click", { location: "floating_button" });
    window.open(
      `${whatsappUrl}${whatsappUrl.includes("?") ? "&" : "?"}text=${encodeURIComponent("مرحباً، أريد الاستفسار عن ميزان فيتارو الذكي")}`,
      "_blank",
    );
  };

  return (
    <button
      onClick={handleClick}
      aria-label="تواصل عبر الواتساب"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)] transition-colors hover:bg-[#1fb85a]"
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  );
}
