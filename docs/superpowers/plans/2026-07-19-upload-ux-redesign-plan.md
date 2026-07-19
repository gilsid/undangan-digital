# Upload UX Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hapus semua input teks URL mentah di dashboard, ganti dengan upload component yang reusable + preview, plus dukungan upload musik MP3 ke Cloudinary dengan folder per-customer.

**Architecture:** Upload API diperluas (accept audio, folder param). Komponen `UploadField` reusable handle semua file upload + preview + state. DashboardClient dipotong ~200 baris kode upload inline, diganti 5 pemanggilan UploadField.

**Tech Stack:** Next.js 16 App Router, Cloudinary SDK, Tailwind v4, shadcn/ui

## Global Constraints

- ALLOWED_TYPES di upload API: image/jpeg, image/png, image/webp, image/gif, audio/mpeg, audio/mp3
- Upload API harus tetap mutex per-user (rate limit 10/60s via Redis)
- Folder Cloudinary: `undangan-digital/{slug}/`
- resource_type: "auto" (Cloudinary detect file type)
- Response: `{ url: string, publicId: string }`
- Existing data tetap valid — cuma UX berubah

---
### Task 1: Perluas Upload API — `/api/upload/route.ts`

**Files:**
- Modify: `app/api/upload/route.ts` (entire file)

**Interfaces:**
- Produces: `POST /api/upload` accept `file` (File) + `folder` (string, optional). Returns `{ url: string, publicId: string }`

- [ ] **Step 1: Write the replacement**

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { isRateLimited } from "@/lib/rateLimit";

const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg",
];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (await isRateLimited(`upload:${session.user.id}`, 10, 60000)) {
      return NextResponse.json({ error: "Terlalu banyak upload. Silakan coba lagi nanti." }, { status: 429 });
    }

    const fd = await req.formData();
    const file = fd.get("file") as File;
    if (!file) return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Tipe file tidak didukung. Gunakan JPEG, PNG, WebP, GIF, atau MP3." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Ukuran file terlalu besar. Maksimum 5 MB." }, { status: 400 });
    }

    // Detect isAudio from mime type
    const isAudio = file.type.startsWith("audio/");
    const folder = (fd.get("folder") as string) || "undangan-digital";

    const buffer = Buffer.from(await file.arrayBuffer());
    const b64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "auto",
    });

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengunggah file" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build 2>&1 | tail -5
```

Expected: no TS errors, build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/api/upload/route.ts
git commit -m "feat(upload): accept audio, folder param, resource_type auto"
```

---
### Task 2: Create `UploadField` Component

**Files:**
- Create: `components/upload/UploadField.tsx`

**Interfaces:**
- Consumes: Task 1's API endpoint (`POST /api/upload` with `file` + `folder` fields)
- Produces: `<UploadField>` component with signature:
  ```ts
  interface UploadFieldProps {
    value: string | null;
    onChange: (url: string | null) => void;
    accept?: string;
    label?: string;
    folder?: string;
    showPreview?: boolean;
    hint?: string;
    aspectRatio?: "square" | "auto";
  }
  ```

- [ ] **Step 1: Write component**

```tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface UploadFieldProps {
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  label?: string;
  folder?: string;
  showPreview?: boolean;
  hint?: string;
  aspectRatio?: "square" | "auto";
}

export default function UploadField({
  value,
  onChange,
  accept = "image/*",
  label,
  folder,
  showPreview = true,
  hint,
  aspectRatio = "auto",
}: UploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (folder) fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
      setTimeout(() => setError(null), 5000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const isAudio = accept.startsWith("audio");
  const previewClass =
    aspectRatio === "square"
      ? "w-28 h-28 object-cover rounded-lg"
      : "w-full max-w-[180px] h-28 object-cover rounded-lg";

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs text-[var(--text-muted)] block">{label}</label>
      )}

      {showPreview && value && !isAudio && (
        <div className="relative w-fit">
          <Image
            src={value}
            alt={label || "Preview"}
            width={112}
            height={112}
            className={previewClass + (uploading ? " opacity-40" : "")}
            unoptimized
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-[var(--foil-gold)] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      {showPreview && value && isAudio && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--ink-surface-raised)] border border-[var(--ink-border)] w-fit min-w-[180px]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-muted)]">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <audio src={value} controls className="h-8 max-w-[180px]" />
        </div>
      )}

      <div className="flex items-center gap-2">
        <label
          className={`cursor-pointer px-3 py-1.5 text-xs rounded-md border font-medium transition-colors ${
            uploading
              ? "opacity-50 pointer-events-none bg-[var(--ink-surface)] border-[var(--ink-border)] text-[var(--text-muted)]"
              : "bg-[var(--ink-surface-raised)] hover:bg-[var(--ink-surface-raised)]/80 border-[var(--ink-border)] text-[var(--text-secondary)]"
          }`}
        >
          {uploading ? (
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Mengupload...
            </span>
          ) : value ? (
            "Ganti"
          ) : (
            "Upload"
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>

        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="px-3 py-1.5 text-xs rounded-md border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"
          >
            Hapus
          </button>
        )}
      </div>

      {hint && !error && (
        <p className="text-[10px] text-[var(--text-muted)]">{hint}</p>
      )}
      {error && (
        <p className="text-[10px] text-red-500">{error}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build 2>&1 | tail -5
```

Expected: build succeeds, no TS errors.

- [ ] **Step 3: Commit**

```bash
git add components/upload/UploadField.tsx
git commit -m "feat: create UploadField reusable component"
```

---
### Task 3: Refactor DashboardClient — Ganti Image Fields

**Files:**
- Modify: `app/(dashboard)/admin/dashboard/DashboardClient.tsx`
  - Remove `uploading` state (line 38)
  - Remove `uploadFile()` function (lines 142-159)
  - Replace heroImage input (lines 414-450) with UploadField
  - Replace groomImage input (lines 452-488) with UploadField
  - Replace brideImage input (lines 490-526) with UploadField
  - Add `import UploadField from "@/components/upload/UploadField"`

- [ ] **Step 1: Apply changes**

Add import after line 20:
```ts
import UploadField from "@/components/upload/UploadField";
```

Remove line 38 `const [uploading, setUploading] = useState(false);`.

Remove lines 142-159 (the `uploadFile` function).

Replace heroImage block (lines 414-450):
```tsx
<UploadField
  label="Foto Hero / Latar Belakang"
  value={form.heroImage}
  folder={`undangan-digital/${invitation.slug}`}
  onChange={(url) => setForm((p) => ({ ...p, heroImage: url }))}
/>
{form.heroImage?.startsWith("/placeholders/") && (
  <Badge variant="outline" className="mt-1 bg-[var(--status-warning)]/15 text-[var(--status-warning)] border-[var(--status-warning)]/30 w-fit">
    Foto contoh — silakan ganti dengan foto Anda sebelum dipublikasi.
  </Badge>
)}
```

Replace groomImage block (lines 452-488):
```tsx
<UploadField
  label="Foto Profil Pria (Groom)"
  value={form.groomImage}
  folder={`undangan-digital/${invitation.slug}`}
  aspectRatio="square"
  onChange={(url) => setForm((p) => ({ ...p, groomImage: url }))}
/>
{form.groomImage?.startsWith("/placeholders/") && (
  <Badge variant="outline" className="mt-1 bg-[var(--status-warning)]/15 text-[var(--status-warning)] border-[var(--status-warning)]/30 w-fit">
    Foto contoh — silakan ganti dengan foto Anda sebelum dipublikasi.
  </Badge>
)}
```

Replace brideImage block (lines 490-526):
```tsx
<UploadField
  label="Foto Profil Wanita (Bride)"
  value={form.brideImage}
  folder={`undangan-digital/${invitation.slug}`}
  aspectRatio="square"
  onChange={(url) => setForm((p) => ({ ...p, brideImage: url }))}
/>
{form.brideImage?.startsWith("/placeholders/") && (
  <Badge variant="outline" className="mt-1 bg-[var(--status-warning)]/15 text-[var(--status-warning)] border-[var(--status-warning)]/30 w-fit">
    Foto contoh — silakan ganti dengan foto Anda sebelum dipublikasi.
  </Badge>
)}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build 2>&1 | tail -10
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/(dashboard)/admin/dashboard/DashboardClient.tsx
git commit -m "refactor: replace hero/groom/bride URL inputs with UploadField"
```

---
### Task 4: Refactor DashboardClient — Gallery + Music

**Files:**
- Modify: `app/(dashboard)/admin/dashboard/DashboardClient.tsx`
  - Replace gallery editing UI (lines 573-632) with UploadField per item
  - Replace music URL input (lines 538-548) with UploadField(accept audio)

- [ ] **Step 1: Replace gallery section**

Replace lines 573-632:
```tsx
<div>
  <div className="flex justify-between items-center mb-2">
    <Label className="text-xs font-medium text-[var(--text-muted)]">
      Galeri Foto
    </Label>
    <button
      type="button"
      onClick={addGalleryItem}
      className="text-xs text-[var(--foil-gold)] hover:underline"
    >
      + Tambah Foto
    </button>
  </div>
  <div className="space-y-2">
    {gallery.map((url, i) => (
      <div key={i} className="flex items-start gap-2 border border-[var(--ink-border)] p-2.5 rounded-lg bg-[var(--ink-surface-raised)]/50">
        <UploadField
          value={url}
          folder={`undangan-digital/${invitation.slug}`}
          onChange={(val) => handleGalleryChange(i, val)}
        />
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => removeGalleryItem(i)}
          className="mt-1"
        >
          Hapus
        </Button>
      </div>
    ))}
    {gallery.length === 0 && (
      <div className="flex flex-col items-center gap-2 py-6 text-[var(--text-muted)]">
        <ImageIcon size={32} className="text-[var(--text-muted)]" />
        <p className="text-xs">Belum ada foto galeri.</p>
      </div>
    )}
  </div>
</div>
```

- [ ] **Step 2: Replace music URL input**

Replace lines 538-548:
```tsx
<UploadField
  label="Musik Latar (MP3)"
  value={form.musicUrl}
  accept="audio/mpeg,audio/mp3,audio/wav"
  folder={`undangan-digital/${invitation.slug}`}
  hint="MP3, maksimal 5MB"
  onChange={(url) => setForm((p) => ({ ...p, musicUrl: url }))}
/>
```

- [ ] **Step 3: Verify build**

```bash
pnpm build 2>&1 | tail -10
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/(dashboard)/admin/dashboard/DashboardClient.tsx
git commit -m "refactor: replace gallery + music URL inputs with UploadField"
```

---
### Task 5: Final Verification

- [ ] **Step 1: Build**

```bash
pnpm build 2>&1
```

Expected: build succeeds with no errors.

- [ ] **Step 2: Run dev server and manual test**

```bash
pnpm dev &
sleep 3
# Wait for server start
```

Test cases:
1. Login as couple → dashboard loads
2. Hero image upload → preview appears, no URL text visible
3. Groom image upload → square preview appears
4. Bride image upload → same
5. Gallery: add 2 photos → upload each → previews appear
6. Gallery: add empty → delete → disappears
7. Music: upload MP3 → audio player preview with controls
8. Save form → success toast → refresh → data persists
9. Hapus button on each field → value cleared

Stop dev server:
```bash
kill %1 2>/dev/null; true
```
