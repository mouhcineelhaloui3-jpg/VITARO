"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  topic: z.string().min(2),
  message: z.string().min(10),
});

export type ContactState = {
  ok: boolean;
  message: string;
};

export async function submitContactForm(values: unknown): Promise<ContactState> {
  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please complete all fields with valid information.",
    };
  }

  return {
    ok: true,
    message:
      "Thanks. The support workflow is ready for CRM, email, and WhatsApp integration.",
  };
}
