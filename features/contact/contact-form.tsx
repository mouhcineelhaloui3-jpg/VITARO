"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { submitContactForm, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(2, "أدخل اسمك الكامل"),
  email: z.string().email("أدخل بريد إلكتروني صحيح"),
  topic: z.string().min(2, "اختر موضوعاً"),
  message: z.string().min(10, "أخبرنا كيف يمكننا مساعدتك"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [state, setState] = useState<ContactState | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      topic: "استفسار عن المنتج",
    },
  });

  function onSubmit(values: ContactFormValues) {
    const parsed = contactSchema.safeParse(values);

    if (!parsed.success) {
      setState({ ok: false, message: "يرجى مراجعة الحقول المطلوبة." });
      return;
    }

    startTransition(async () => {
      setState(await submitContactForm(parsed.data));
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Field label="الاسم" error={errors.name?.message}>
        <input {...register("name")} className="form-input" placeholder="اسمك الكريم" />
      </Field>
      <Field label="البريد الإلكتروني" error={errors.email?.message}>
        <input {...register("email")} className="form-input text-right" placeholder="you@example.com" type="email" dir="ltr" />
      </Field>
      <Field label="الموضوع" error={errors.topic?.message}>
        <select {...register("topic")} className="form-input">
          <option>استفسار عن المنتج</option>
          <option>الشحن</option>
          <option>الإرجاع</option>
          <option>الضمان</option>
          <option>شراكة</option>
        </select>
      </Field>
      <Field label="الرسالة" error={errors.message?.message}>
        <textarea
          {...register("message")}
          className="form-input min-h-36 resize-none rounded-[1.5rem] py-4"
          placeholder="كيف يمكننا مساعدتك؟"
        />
      </Field>
      {state && (
        <p className={state.ok ? "text-sm text-emerald-600" : "text-sm text-red-600"}>
          {state.ok ? "شكراً لك. فريقنا سيتواصل معك قريباً." : state.message}
        </p>
      )}
      <Button disabled={isPending} size="lg" type="submit">
        {isPending ? "جاري الإرسال..." : "إرسال الرسالة"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-heading">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
