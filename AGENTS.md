<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-context -->
# Project: Undangan Digital

**Stack:** Next.js 16 App Router, Prisma 7 + PostgreSQL, NextAuth v5 (Credentials), bcryptjs, Tailwind v4, shadcn/ui, Framer Motion, pnpm
**Infra deps:** PostgreSQL, Upstash Redis (rate limit, no fallback), Cloudflare R2 (upload)

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

## Known issues to avoid
- `UPSTASH_REDIS_*` + `R2_*` env vars **required** by code but not in `.env.example`.
- `"unoptimized": true` + `images.remotePatterns: "**"` in next.config.ts.
- Mixed lock files exist (pnpm-lock.yaml + package-lock.json).
- `tsconfig.tsbuildinfo` committed — should be gitignored.
- Theme files repeat ~60% code (useCountdown, SectionReveal, RSVP/wish submit, music toggle).
- No Zod/Yup — validation is ad-hoc `if` checks.
- No error boundaries or loading.tsx anywhere.
- Silent `catch(() => {})` in TrackOpened, RSVP, wish submissions.
- `papaparse` imported in client-side GuestsClient — prefer native FileReader for CSV.
<!-- END:project-context -->
