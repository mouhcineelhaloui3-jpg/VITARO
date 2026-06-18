# Vitaro Store

Premium DTC ecommerce brand build for Vitaro, a scalable connected health-tech store launching with one flagship Smart Digital Body Scale.

## Getting Started

Install dependencies and create local environment variables:

```sh
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Framer Motion
- React Hook Form
- Zod
- Prisma ORM
- PostgreSQL
- NextAuth
- Server Components by default

## Architecture

- `app/` contains storefront, collection, product, admin, help, blog, checkout, API, SEO, and route-state files.
- `components/` contains shared layout, UI, site shell, providers, motion, and commerce components.
- `features/` contains interactive domain components such as cart, search, contact, and product purchase flows.
- `lib/data/` contains CMS-ready brand, content, catalog, policy, testimonial, FAQ, and article records.
- `lib/cms/registry.ts` documents editable CMS/admin areas.
- `prisma/schema.prisma` defines the production database foundation.
- `store/`, `hooks/`, and `types/` provide scalable shared architecture.

## Quality

```sh
npm run lint
npm run typecheck
npm run build
```

## Production Notes

- Replace `.env.example` values before deployment.
- Connect PostgreSQL before running Prisma migrations.
- Connect payment, shipping, email, CRM, analytics, and pixel providers.
- Replace CSS-rendered placeholders with original product, app, lifestyle, video, and social assets.
- Treat all health data features as privacy-sensitive and consent-driven.

## Hostinger Deployment Notes

- Frontend/backend: deploy the Next.js app on Hostinger VPS or Node.js hosting with `npm run build` and `npm run start`.
- Database: use PostgreSQL and set `DATABASE_URL` in Hostinger environment variables.
- Admin login: set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` manually. Leave `ADMIN_PASSWORD` empty to disable admin access.
- WhatsApp conversion number: customer CTAs currently use `212682217644`.
- Shipping promise: public UX is configured around free shipping and cash on delivery for Morocco.

