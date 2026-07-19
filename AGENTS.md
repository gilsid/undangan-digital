<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-context -->
# Project: Undangan Digital

**Stack:** Next.js 16 App Router, Prisma 7 + PostgreSQL, NextAuth v5 (Credentials), bcryptjs, Tailwind v4, shadcn/ui, Framer Motion, pnpm
**Infra:** PostgreSQL, Upstash Redis (rate limit), Cloudinary (upload foto + audio)

## Commands
- `pnpm dev` — dev server
- `pnpm build` — production build
- `pnpm db:migrate` — Prisma migrate dev
- `pnpm db:seed` — seed database
- `pnpm db:studio` — Prisma Studio

## Auth pattern
- NextAuth v5 Credentials provider. JWT stores `id` + `role`.
- Middleware `proxy.ts` gates `/admin/dashboard/*` and `/superadmin/*`.
- Rate limit: 10 attempts/60s per IP+email via Upstash Redis.
- bcryptjs (not bcrypt) for password hashing.

## Route structure
- `/(dashboard)/admin/login` — login page
- `/(dashboard)/admin/dashboard` — invitation content editor (server → `DashboardClient.tsx`)
- `/(dashboard)/admin/dashboard/guests` — guest manager (server → `GuestsClient.tsx`)
- `/(dashboard)/admin/dashboard/rsvp` — RSVP + wishes viewer (server → `RsvpClient.tsx`)
- `/(dashboard)/superadmin` — client CRUD (server → `SuperadminClient.tsx`)
- `/[slug]` — public invitation page with theme rendering

## DB schema (5 models)
User, Invitation (owner FK→User), Guest (FK→Invitation), Rsvp (FK→Invitation), Wish (FK→Invitation)
- No cascade deletes — manual `$transaction` in delete routes.
- No FK indexes — only `@unique` fields are indexed.
- `bankAccounts`, `parentsInfo` are Prisma `Json` — no runtime type enforcement.

## Key patterns
- Server components fetch data → pass to Client components via props.
- All theme files are "use client" — use Framer Motion for animations.
- shadcn/ui components in `components/ui/` with cn() utility.
- Toast via `components/Toast.tsx` (Framer Motion wrapper).
- **Upload:** `components/upload/UploadField.tsx` reusable component. POST to `/api/upload` → Cloudinary. Accept image/audio, max 5MB. Folder: `undangan-digital/{slug}/`.
- **Cloudinary config:** 3 env vars — `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. Diupload via base64 data URI.
- `.env.example` di repo — salin ke `.env` buat dev.

## Known issues
- Theme sections (Cover/Hero/Couple/Gallery/Event) repeat ~60% code across 4 themes. Fase 1 (shared hooks) done. Fase 2 (consolidation) partial.
- `tsconfig.tsbuildinfo` committed & gitignored — generate ulang tiap build, harmless.
- `papaparse` in dependencies — cuma dipake server, bukan client.
<!-- END:project-context -->

<!-- BEGIN:workflow -->
## Git workflow (Wajib!)
- **GitHub Flow:** `main` = production. Setiap kerja bikin branch baru dari `main`.
- Saat user bilang "kerjain X" / "bikin Y": `git checkout main && git pull && git checkout -b feat/<nama>` otomatis.
- Selesai → push + buat PR ke `main`. Jangan merge sendiri. Delete branch setelah merge.
- `dev` branch udah ga dipake. Pakai `main` sebagai base.
<!-- END:workflow -->
