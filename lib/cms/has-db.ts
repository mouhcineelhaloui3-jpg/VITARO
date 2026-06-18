/** True when a serverless PostgreSQL URL is configured (not local SQLite). */
export function hasProductionDb(): boolean {
  const url = process.env.DATABASE_URL;
  return !!url && !url.startsWith("file:");
}

export function missingDbMessage(): string {
  return "قاعدة البيانات غير مفعّلة. أضف DATABASE_URL في Vercel (Neon أو Vercel Postgres) ثم أعد النشر.";
}
