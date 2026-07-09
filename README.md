# Undangan Digital

Platform undangan pernikahan digital multi-tenant. Pasangan (mempelai) punya dashboard sendiri, kelola konten undangan + daftar tamu. Tamu terima link personal via WA.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Prisma** + **PostgreSQL**
- **NextAuth.js** (credential provider)
- **Tailwind CSS v4**
- **shadcn/ui** (Foil Blueprint theme)
- **Framer Motion**
- **pnpm** (package manager)

## Setup (Laptop Baru)

### Prasyarat

- Node.js ≥ 18
- pnpm (`corepack enable && corepack prepare pnpm@latest --activate`)
- PostgreSQL

### Instalasi

```bash
# Clone repo
git clone https://github.com/gilsid/undangan-digital.git
cd undangan-digital

# Install dependencies (otomatis pakai pnpm dari packageManager field)
pnpm install

# Setup environment
cp .env.example .env
```

Edit `.env`, isi:

| Variable | Nilai |
|---|---|
| `DATABASE_URL` | `postgresql://user:password@localhost:5432/undangan_digital?schema=public` |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` |

```bash
# Generate Prisma client
pnpm prisma generate

# Jalankan migrasi database
pnpm prisma migrate dev --name init

# Jalankan dev server
pnpm run dev
```

Buka `http://localhost:3000`.

### Buat user pertama

Buka PostgreSQL, buat user dengan role `SUPERADMIN`:

```sql
INSERT INTO "User" (id, email, password, role, "createdAt", "updatedAt")
VALUES ('admin-id', 'admin@example.com', '<hashed-password>', 'SUPERADMIN', NOW(), NOW());
```

Password di-hash pakai bcrypt. Atau lewat Prisma seed.

### Alur penggunaan

1. Login sebagai superadmin di `/admin/login`
2. Buka `/superadmin`, buat invitation + akun mempelai
3. Mempelai login, edit konten, tambah tamu, kirim undangan via WA

## Halaman

| Route | Akses | Fungsi |
|---|---|---|
| `/[slug]` | Publik | Halaman undangan tamu (parsing `?to=code`) |
| `/admin/login` | Publik | Login mempelai / superadmin |
| `/admin/dashboard` | Mempelai | Edit konten undangan |
| `/admin/dashboard/guests` | Mempelai | Kelola tamu + import CSV + kirim WA |
| `/admin/dashboard/rsvp` | Mempelai | Lihat RSVP & ucapan |
| `/superadmin` | SUPERADMIN | Buat invitation baru, lihat semua |
