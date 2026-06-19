import { Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Card, FeatureCard } from "@/components/ui/card";
import { LocationMap } from "@/components/site/location-map";
import { ContactForm } from "@/features/contact/contact-form";
import { brand, faqs } from "@/lib/data/content";

export const metadata = {
  title: "اتصل بنا",
  description: "تواصل مع فريق دعم فيتارو عبر النموذج، أو واتساب، أو البريد الإلكتروني.",
};

export default function ContactPage() {
  const contactMethods: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: MessageCircle, label: "واتساب", value: brand.whatsapp },
    { icon: Mail, label: "البريد الإلكتروني", value: brand.supportEmail },
    { icon: Phone, label: "الهاتف", value: brand.whatsapp },
    { icon: MapPin, label: "الموقع", value: brand.address },
  ];

  return (
    <>
      <Section
        background="white"
        eyebrow="اتصل بنا"
        title="دعم ممتاز للمنتجات والشحن والضمان."
        description="نحن هنا لمساعدتك. تواصل معنا وسنرد عليك في أقرب وقت."
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <Card className="p-0">
            <ContactForm />
          </Card>
          <div className="space-y-5">
            {contactMethods.map((item) => (
              <Card key={item.label} className="flex items-center gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-muted">
                    {item.label}
                  </p>
                  <p className="mt-1 font-bold text-heading" dir="ltr">
                    {item.value}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section 
        background="gray"
        eyebrow="الأسئلة الشائعة" 
        title="إجابات سريعة للدعم."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {faqs.slice(0, 4).map((faq) => (
            <FeatureCard key={faq.question}>
              <h2 className="text-xl font-bold tracking-tight text-heading">
                {faq.question}
              </h2>
              <p className="mt-4 leading-[1.75] text-body">{faq.answer}</p>
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section
        background="white"
        eyebrow="الموقع"
        title="نحن في بني ملال."
        description="اعثر علينا في بني ملال، المغرب — أو افتح الخريطة مباشرة في خرائط جوجل."
      >
        <LocationMap />
      </Section>
    </>
  );
}
