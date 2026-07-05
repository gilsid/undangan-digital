# Undangan Digital

Platform undangan pernikahan digital multi-tenant. Pasangan (mempelai) punya dashboard sendiri, kelola konten undangan + daftar tamu. Tamu terima link personal via WA.

## Tech Stack

- **Next.js** (App Router, TypeScript)
- **Prisma** + **PostgreSQL**
- **NextAuth.js** (credential provider)
- **Tailwind CSS**
- **Framer Motion**

## Setup

1. `npm install`
2. Isi `.env` — `DATABASE_URL` (PostgreSQL), `AUTH_SECRET` (`openssl rand -base64 32`), `NEXTAUTH_URL`
3. `npx prisma migrate dev --name init`
4. Buat user superadmin via seed/DB langsung, lalu login di `/admin/login`
5. Sebagai superadmin: buka `/superadmin`, buat invitation + akun mempelai
6. Mempelai login, edit konten, tambah tamu, kirim undangan via WA

## Dev

```bash
npm run dev
```

## Halaman

| Route | Akses | Fungsi |
|---|---|---|
| `/[slug]` | Publik | Halaman undangan tamu (parsing `?to=code`) |
| `/admin/login` | Publik | Login mempelai / superadmin |
| `/admin/dashboard` | Mempelai | Edit konten undangan |
| `/admin/dashboard/guests` | Mempelai | Kelola tamu + import CSV + kirim WA |
| `/admin/dashboard/rsvp` | Mempelai | Lihat RSVP & ucapan |
| `/superadmin` | SUPERADMIN | Buat invitation baru, lihat semua |
