"use client";

import { useState, useTransition, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { submitContactForm, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/validation/contact";

export function ContactForm() {
  const [state, setState] = useState<ContactState | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      topic: "استفسار عن المنتج",
      message: "",
    },
  });

  function onSubmit(values: ContactFormValues) {
    setState(null);
    startTransition(async () => {
      const result = await submitContactForm(values);
      setState(result);
      if (result.ok) {
        reset({
          name: "",
          phone: "",
          email: "",
          topic: "استفسار عن المنتج",
          message: "",
        });
      }
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field label="الاسم" error={errors.name?.message}>
        <input {...register("name")} className="form-input" placeholder="اسمك الكريم" autoComplete="name" />
      </Field>
      <Field label="الهاتف" error={errors.phone?.message}>
        <input
          {...register("phone")}
          className="form-input text-right"
          placeholder="06XXXXXXXX"
          type="tel"
          dir="ltr"
          autoComplete="tel"
        />
      </Field>
      <Field label="البريد الإلكتروني (اختياري)" error={errors.email?.message}>
        <input
          {...register("email")}
          className="form-input text-right"
          placeholder="you@example.com"
          type="email"
          dir="ltr"
          autoComplete="email"
        />
      </Field>
      <Field label="الموضوع" error={errors.topic?.message}>
        <select {...register("topic")} className="form-input">
          <option value="استفسار عن المنتج">استفسار عن المنتج</option>
          <option value="الشحن">الشحن</option>
          <option value="الإرجاع">الإرجاع</option>
          <option value="الضمان">الضمان</option>
          <option value="شراكة">شراكة</option>
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
          {state.message}
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
      <span className="mb-2 block text-sm font-semibold text-heading">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
