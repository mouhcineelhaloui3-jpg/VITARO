"use server";

import {
  contactFieldErrors,
  contactSchema,
  type ContactFormValues,
} from "@/lib/validation/contact";

export type ContactState = {
  ok: boolean;
  message: string;
};

export async function submitContactForm(values: ContactFormValues): Promise<ContactState> {
  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    const fields = contactFieldErrors(parsed.error);
    const firstMessage =
      fields.name ??
      fields.phone ??
      fields.email ??
      fields.topic ??
      fields.message ??
      "يرجى مراجعة الحقول المطلوبة.";

    return {
      ok: false,
      message: firstMessage,
    };
  }

  return {
    ok: true,
    message: "شكراً لك. فريقنا سيتواصل معك قريباً.",
  };
}
