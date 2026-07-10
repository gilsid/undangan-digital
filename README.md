# Undangan Digital

Platform undangan pernikahan digital multi-tenant. Setiap pasangan memiliki dashboard terpisah untuk mengelola konten undangan, daftar tamu, dan RSVP. Tersedia 4 tema tampilan undangan publik. Tamu menerima link personal melalui WhatsApp.

## Tech Stack

- **Next.js 16** — App Router, TypeScript, Turbopack
- **Prisma 7** — ORM + PostgreSQL
- **NextAuth.js v5** — credential-based authentication
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — component library (Foil Blueprint theme)
- **Framer Motion** — animations
- **pnpm** (npm also supported)

## Tema Undangan Publik

| Tema | ID | Gaya |
|---|---|---|
| Elegant | `elegant` | Dusty sage & ivory, gold-leaf accents |
| Rustic | `rustic` | Earthy terracotta, warm neutrals |
| Minimalist | `minimalist` | Clean monochrome, sans-serif |
| Foil Blueprint | `foil-blueprint` | Dark navy, champagne gold, blueprint grid |

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** — local or remote
- **Package manager** — npm (bawaan Node.js) atau pnpm (direkomendasikan)

### 1. Clone & Install

```bash
git clone https://github.com/gilsid/undangan-digital.git
cd undangan-digital

# pnpm (lebih cepat)
pnpm install

# atau npm
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` dan isi nilai berikut:

| Variable | Deskripsi | Contoh |
|---|---|---|
| `DATABASE_URL` | Koneksi PostgreSQL | `postgresql://user:pass@localhost:5432/undangan_digital` |
| `AUTH_SECRET` | Secret untuk NextAuth (≥ 32 karakter) | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | (Opsional) Hanya untuk production di domain tetap | — |

> **Catatan:** Untuk development lokal, `NEXTAUTH_URL` tidak perlu diisi. NextAuth otomatis mendeteksi origin dari header Host.

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Jalankan migrasi
npx prisma migrate dev --name init
```

### 4. Create Superadmin User

Buat user pertama dengan role `SUPERADMIN`:

```sql
INSERT INTO "User" (id, email, password, role, "createdAt", "updatedAt")
VALUES (
  'superadmin-id',
  'admin@example.com',
  '<hashed-password-with-bcrypt>',
  'SUPERADMIN',
  NOW(),
  NOW()
);
```

Password harus di-hash menggunakan bcrypt sebelum disimpan.

### 5. Start Development Server

```bash
pnpm run dev
# atau
npm run dev
```

Akses aplikasi di `http://localhost:3000`.

## Usage

### For Superadmin

1. Login di `/admin/login`
2. Buka `/superadmin` untuk:
   - Membuat invitation baru (otomatis membuat akun mempelai)
   - Melihat daftar semua invitation
   - **Nonaktifkan/Aktifkan Kembali** invitation (reversibel, data tetap aman)
   - **Hapus Permanen** invitation (konfirmasi ketat dengan ketik slug)

### For Mempelai (Couple)

1. Login di `/admin/login` menggunakan credentials dari superadmin
2. Edit konten undangan di `/admin/dashboard` (4 tema tersedia)
3. Kelola daftar tamu di `/admin/dashboard/guests`
   - Tambah tamu manual atau import CSV
   - Kirim undangan via WhatsApp
   - Copy link undangan personal
   - Filter & export CSV
4. Lihat RSVP & ucapan di `/admin/dashboard/rsvp`

Jika invitation diarsipkan oleh superadmin, dashboard mempelai akan menampilkan pesan "Akun sedang tidak aktif".

### For Guests

- Buka link undangan personal (`/[slug]?to=[code]`)
- Lihat halaman undangan dengan tema yang dipilih mempelai
- Kirim konfirmasi kehadiran (RSVP)
- Kirim ucapan & doa
- Lihat info rekening untuk amplop digital

## Project Structure

```
├── app/
│   ├── [slug]/                    # Public invitation page
│   ├── (dashboard)/               # Route group — tidak mempengaruhi URL
│   │   ├── admin/
│   │   │   ├── dashboard/         # Couple dashboard (content, guests, RSVP)
│   │   │   └── login/             # Authentication
│   │   └── superadmin/            # Superadmin dashboard
│   └── api/                       # API routes
│       ├── guests/                # CRUD tamu + mark sent + import CSV
│       ├── invitations/           # Update invitation (couple)
│       ├── superadmin/
│       │   └── invitations/       # Delete + archive (superadmin)
│       ├── rsvp/                  # RSVP submission
│       ├── wishes/                # Wishes submission
│       ├── track/                 # Open tracking
│       └── upload/                # File upload
├── components/
│   ├── admin/                     # Sidebar, shared admin components
│   ├── themes/                    # 4 invitation themes
│   │   ├── Elegant.tsx
│   │   ├── Rustic.tsx
│   │   ├── Minimalist.tsx
│   │   └── FoilBlueprint.tsx
│   └── ui/                        # shadcn/ui + custom components
│       ├── ledger-card.tsx        # Registration-mark card (signature)
│       ├── status-stamp.tsx       # Cap-stempel badge
│       ├── icon-badge.tsx         # Circular foil outline icon
│       └── ...                    # Button, Input, Table, Dialog, dll.
├── lib/
│   ├── auth.ts                    # NextAuth configuration
│   ├── prisma.ts                  # Prisma client
│   ├── api-error.ts               # Prisma error handler
│   ├── maps.ts                    # Google Maps embed extractor
│   ├── whatsapp.ts                # WA link generator
│   └── rateLimit.ts               # Rate limiter
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Migration history
└── proxy.ts                       # Route protection middleware
```

## Routes

| Route | Access | Description |
|---|---|---|
| `/[slug]` | Public | Guest invitation page (4 themes) |
| `/admin/login` | Public | Login page |
| `/admin/dashboard` | Couple | Edit invitation content |
| `/admin/dashboard/guests` | Couple | Manage guests + CSV import + WhatsApp |
| `/admin/dashboard/rsvp` | Couple | View RSVP & wishes |
| `/superadmin` | Superadmin | Manage all invitations + archive/delete |

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/rsvp` | Submit RSVP (rate-limited) |
| POST | `/api/wishes` | Submit wish (rate-limited) |
| GET | `/api/wishes` | Get wishes by invitationId |
| POST | `/api/guests` | Add single guest |
| POST | `/api/guests/import` | Bulk import CSV |
| DELETE | `/api/guests/[id]` | Delete guest |
| POST | `/api/guests/[id]/sent` | Mark guest as sent |
| PUT | `/api/invitations/[id]` | Update invitation content |
| POST | `/api/superadmin/create-invitation` | Create new invitation |
| DELETE | `/api/superadmin/invitations/[id]` | Permanently delete invitation |
| PATCH | `/api/superadmin/invitations/[id]/archive` | Toggle archive status |
| GET | `/api/track/[code]` | Track invitation open |

## Scripts

```bash
pnpm dev          # Start development server (Turbopack)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm prisma       # Prisma CLI

## Deploy ke Vercel

### Yang sudah siap dari kode

- Upload foto → Cloudflare R2 (S3-compatible)
- Rate limiter → Upstash Redis (shared across serverless instances)
- Security headers (X-Frame-Options, X-Content-Type, dll.)
- Import tamu dibatasi maks 1000 baris
- `.env.example` sudah berisi semua variable yang dibutuhkan

### Yang harus kamu lakukan manual

Buka panduan lengkap: [`tutorial-deploy-vercel.md`](./tutorial-deploy-vercel.md)
```
