# Undangan Digital

Platform undangan pernikahan digital multi-tenant. Setiap pasangan memiliki dashboard terpisah untuk mengelola konten undangan, daftar tamu, dan RSVP. Tamu menerima link personal melalui WhatsApp.

## Tech Stack

- **Next.js 16** — App Router, TypeScript
- **Prisma 7** — ORM + PostgreSQL
- **NextAuth.js v5** — credential-based authentication
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — component library (Foil Blueprint theme)
- **Framer Motion** — animations

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** — local or remote
- **Package manager** — npm (bawaan Node.js) atau pnpm

### 1. Clone & Install

```bash
git clone https://github.com/gilsid/undangan-digital.git
cd undangan-digital
```

Pilih salah satu package manager:

```bash
# npm
npm install

# pnpm (lebih cepat, direkomendasikan)
pnpm install
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
| `NEXTAUTH_URL` | Base URL aplikasi | `http://localhost:3000` |

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Jalankan migrasi
npx prisma migrate dev --name init
```

### 4. Create Superadmin User

Buat user pertama dengan role `SUPERADMIN` langsung di PostgreSQL:

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
# npm
npm run dev

# pnpm
pnpm run dev
```

Akses aplikasi di `http://localhost:3000`.

## Usage

### For Superadmin

1. Login di `/admin/login`
2. Buka `/superadmin` untuk membuat invitation baru
3. Setiap invitation otomatis membuat akun mempelai

### For Mempelai (Couple)

1. Login di `/admin/login` menggunakan credentials dari superadmin
2. Edit konten undangan di `/admin/dashboard`
3. Kelola daftar tamu di `/admin/dashboard/guests`
4. Lihat RSVP & ucapan di `/admin/dashboard/rsvp`

### For Guests

- Buka link undangan personal (`/[slug]?to=[code]`)
- Isi form RSVP (konfirmasi kehadiran + ucapan)

## Project Structure

```
├── app/
│   ├── [slug]/              # Public invitation page
│   ├── admin/
│   │   ├── dashboard/       # Couple dashboard (content, guests, RSVP)
│   │   └── login/           # Authentication
│   └── superadmin/          # Superadmin dashboard
├── components/
│   ├── admin/               # Sidebar, shared admin components
│   ├── themes/              # Invitation themes (Elegant, Minimalist, Rustic)
│   └── ui/                  # shadcn/ui components
├── lib/                     # Utilities (whatsapp, maps, auth)
├── prisma/                  # Database schema & migrations
└── proxy.ts                 # Route protection middleware
```

## Routes

| Route | Access | Description |
|---|---|---|
| `/[slug]` | Public | Guest invitation page |
| `/admin/login` | Public | Login page |
| `/admin/dashboard` | Couple | Edit invitation content |
| `/admin/dashboard/guests` | Couple | Manage guests + CSV import + WhatsApp |
| `/admin/dashboard/rsvp` | Couple | View RSVP & wishes |
| `/superadmin` | Superadmin | Manage all invitations |

## Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```
