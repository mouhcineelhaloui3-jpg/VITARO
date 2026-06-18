# نشر Vitaro على Hostinger VPS

دليل كامل لتشغيل المشروع (Next.js 16 + Prisma + PostgreSQL + NextAuth) على Hostinger VPS مع Nginx و PM2 و SSL.

> ملاحظة: هذا المشروع تطبيق خادمي (SSR + API + Auth)، لذا يجب استخدام **VPS** وليس الاستضافة المشتركة.

---

## طريقة سريعة (سكربت آلي كامل)

بدل تنفيذ الخطوات يدوياً، يمكنك استخدام سكربت الإعداد الجاهز الذي يثبّت كل شيء (Node + PostgreSQL + Nginx + PM2 + SSL):

```bash
wget https://raw.githubusercontent.com/mouhcineelhaloui3-jpg/VITARO/master/deploy/server-setup.sh
nano server-setup.sh    # عدّل المتغيّرات في الأعلى (DOMAIN, DB_PASSWORD, ADMIN_PASSWORD)
chmod +x server-setup.sh
./server-setup.sh
```

السكربت يقوم بكل شيء تلقائياً حتى تشغيل الموقع مع HTTPS. إن أردت التحكم اليدوي، اتبع الخطوات التفصيلية أدناه.

---

## 0. المتطلبات

- Hostinger VPS (Ubuntu 22.04 أو 24.04).
- اسم نطاق (Domain) موجّه إلى IP الخاص بالـ VPS (سجل A).
- وصول SSH إلى الخادم.

---

## 1. تجهيز الخادم

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# أدوات إضافية
sudo apt install -y git nginx postgresql postgresql-contrib

# PM2 لإدارة العملية
sudo npm install -g pm2
```

تأكد من الإصدارات:

```bash
node -v   # يجب أن يكون 20+
npm -v
```

---

## 2. إعداد قاعدة بيانات PostgreSQL

```bash
sudo -u postgres psql
```

داخل psql:

```sql
CREATE DATABASE vitaro;
CREATE USER vitaro_user WITH ENCRYPTED PASSWORD 'STRONG_DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE vitaro TO vitaro_user;
\c vitaro
GRANT ALL ON SCHEMA public TO vitaro_user;
\q
```

---

## 3. جلب الكود

```bash
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/mouhcineelhaloui3-jpg/VITARO.git vitaro
sudo chown -R $USER:$USER /var/www/vitaro
cd /var/www/vitaro
```

---

## 4. متغيّرات البيئة

```bash
cp .env.production.example .env
nano .env
```

املأ القيم الحقيقية:

- `DATABASE_URL` = `postgresql://vitaro_user:STRONG_DB_PASSWORD@localhost:5432/vitaro`
- `NEXTAUTH_SECRET` = ناتج الأمر: `openssl rand -base64 32`
- `NEXTAUTH_URL` = `https://your-domain.com`
- `ADMIN_PASSWORD` = كلمة مرور قوية للوحة التحكم
- `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com`

---

## 5. التثبيت والبناء

```bash
npm ci
npx prisma db push      # ينشئ الجداول في قاعدة البيانات
npm run build
```

> `npm ci` يشغّل تلقائياً `prisma generate` عبر سكربت `postinstall`.

---

## 6. التشغيل عبر PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup          # نفّذ الأمر الذي يظهره لتشغيل PM2 عند الإقلاع
```

تحقق:

```bash
pm2 status
pm2 logs vitaro
curl http://localhost:3000   # يجب أن يرجع HTML
```

---

## 7. إعداد Nginx

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/vitaro
sudo nano /etc/nginx/sites-available/vitaro   # غيّر your-domain.com
sudo ln -s /etc/nginx/sites-available/vitaro /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 8. شهادة SSL مجانية (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

certbot سيعدّل إعداد Nginx تلقائياً ويفعّل التجديد الذاتي.

---

## 9. الجدار الناري (اختياري لكن مُستحسن)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 10. التحديثات لاحقاً

في كل مرة تدفع تغييرات إلى GitHub:

```bash
cd /var/www/vitaro
bash deploy/deploy.sh
```

السكربت يقوم بـ: `git pull` → `npm ci` → `prisma db push` → `npm run build` → `pm2 reload`.

---

## استكشاف الأخطاء

| المشكلة | الحل |
|---|---|
| 502 Bad Gateway | تحقق `pm2 status` و `pm2 logs vitaro`؛ تأكد أن التطبيق يعمل على المنفذ 3000 |
| خطأ اتصال قاعدة البيانات | راجع `DATABASE_URL` و `sudo systemctl status postgresql` |
| تسجيل دخول الأدمن لا يعمل | تأكد من ضبط `ADMIN_PASSWORD` و `NEXTAUTH_SECRET` في `.env` ثم `pm2 reload vitaro` |
| تغييرات `.env` لا تظهر | بعد أي تعديل: `pm2 reload vitaro` |
| نفاد الذاكرة | راجع `max_memory_restart` في `ecosystem.config.js` |

---

## ملخّص الملفات المضافة للنشر

- `ecosystem.config.js` — إعداد PM2.
- `deploy/nginx.conf.example` — إعداد Nginx reverse proxy.
- `deploy/deploy.sh` — سكربت التحديث التلقائي.
- `.env.production.example` — قالب متغيّرات الإنتاج.
- `next.config.ts` — مُفعّل عليه `output: "standalone"` للأداء.
