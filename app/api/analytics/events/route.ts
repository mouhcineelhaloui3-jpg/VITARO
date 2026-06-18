import { NextResponse } from "next/server";
import { z } from "zod";

const eventSchema = z.object({
  eventName: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9_]+$/),
  url: z.string().max(512).optional(),
  source: z.string().max(128).optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ ok: true });
    }

    const { prisma } = await import("@/lib/prisma");

    await prisma.analyticsEvent.create({
      data: {
        eventName: parsed.data.eventName,
        url: parsed.data.url,
        source: parsed.data.source,
        metadata: parsed.data.metadata ?? {},
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
