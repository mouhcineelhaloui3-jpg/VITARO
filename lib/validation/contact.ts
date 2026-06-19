import { z } from "zod";

function optionalEmail(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return z.email().safeParse(trimmed).success;
}

export const contactSchema = z.object({
  name: z.string().trim().min(2, "أدخل اسمك الكامل"),
  phone: z.string().trim().min(9, "أدخل رقم هاتف صحيح"),
  email: z
    .string()
    .trim()
    .refine(optionalEmail, "أدخل بريد إلكتروني صحيح"),
  topic: z.string().trim().min(2, "اختر موضوعاً"),
  message: z.string().trim().min(10, "اكتب رسالة أوضح (10 أحرف على الأقل)"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export function contactFieldErrors(error: z.ZodError<ContactFormValues>) {
  const fields: Partial<Record<keyof ContactFormValues, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fields[key as keyof ContactFormValues]) {
      fields[key as keyof ContactFormValues] = issue.message;
    }
  }
  return fields;
}
