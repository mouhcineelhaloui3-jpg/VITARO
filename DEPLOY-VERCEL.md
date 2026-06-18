# نشر Vitaro على Vercel

دليل سريع لنشر المشروع (Next.js 16 + Prisma + PostgreSQL + NextAuth) على Vercel.

---

## 1. المتطلبات

- حساب [Vercel](https://vercel.com) مربوط بـ GitHub.
- قاعدة بيانات **PostgreSQL** سحابية (مثلاً [Neon](https://neon.tech) مجاني، أو Vercel Postgres، أو Supabase).
- المستودع على GitHub: `https://github.com/mouhcineelhaloui3-jpg/VITARO`

---

## 2. ربط المشروع بـ Vercel (من لوحة التحكم)

1. ادخل إلى [vercel.com/new](https://vercel.com/new).
2. اختر مستودع **VITARO**.
3. الإعدادات الافتراضية كافية (`vercel.json` موجود في المشروع).
4. **قبل Deploy** أضف متغيّرات البيئة (انظر القسم 3).
5. اضغط **Deploy**.

---

## 3. متغيّرات البيئة المطلوبة

| المتغيّر | مثال | ملاحظات |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` | من Neon أو Vercel Postgres |
| `NEXTAUTH_SECRET` | ناتج `openssl rand -base64 32` | **مطلوب** في الإنتاج |
| `NEXTAUTH_URL` | `https://vitaro.vercel.app` | عنوان النشر النهائي (مع `https://`) |
| `ADMIN_PASSWORD` | كلمة مرور قوية | لتسجيل الدخول `/admin/login` |
| `NEXT_PUBLIC_SITE_URL` | `https://vitaro.vercel.app` | نفس النطاق العام |

اختياري:

- `NEXT_PUBLIC_DEFAULT_LOCALE` = `ar`
- `NEXT_PUBLIC_DEFAULT_CURRENCY` = `MAD`
- `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### تهيئة قاعدة البيانات (مرة واحدة)

بعد ضبط `DATABASE_URL` على Vercel، نفّذ محلياً أو من CI:

```bash
DATABASE_URL="your-neon-url" npx prisma db push
```

---

## 4. النشر عبر CLI

```bash
npm i -g vercel   # أو استخدم npx vercel
vercel login
vercel link
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add ADMIN_PASSWORD production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel deploy --prod
```

---

## 5. استكشاف الأخطاء

| المشكلة | الحل |
|---|---|
| **Server error — server configuration** | أضف `NEXTAUTH_SECRET` و `NEXTAUTH_URL` في Vercel → Settings → Environment Variables ثم أعد النشر |
| فشل البناء (Prisma) | تأكد أن `DATABASE_URL` مضبوط؛ `postinstall` يشغّل `prisma generate` تلقائياً |
| خطأ اتصال DB عند التشغيل | راجع `DATABASE_URL` و SSL (`?sslmode=require` لـ Neon) |
| تسجيل الدخول لا يعمل | تأكد `ADMIN_PASSWORD` و `NEXTAUTH_URL` يطابقان نطاق Vercel |

---

## 6. تحديثات لاحقة

كل `git push` إلى `master` يُطلق نشراً تلقائياً إذا كان المشروع مربوطاً بـ Vercel عبر GitHub.

أو يدوياً:

```bash
vercel deploy --prod
```
