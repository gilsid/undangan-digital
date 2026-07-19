# Upload UX Redesign — Design Doc

**Goal:** Hapus semua input teks URL mentah di dashboard, ganti dengan upload component yang reusable + preview, plus dukungan upload musik MP3 ke Cloudinary dengan folder per-customer.

**Architecture:** Komponen React reusable (`UploadField`) untuk semua jenis file (image/audio). API upload diperluas (accept audio, folder param). DashboardClient direfactor 4 field + gallery + musik pake UploadField. Cloudinary folder diatur per slug undangan.

**Tech Stack:** Next.js 16 App Router, Cloudinary SDK, Tailwind v4, shadcn/ui Input/Button

## 1. Upload API — `/api/upload/route.ts`

**Changes:**
- ALLOWED_TYPES tambah `audio/mpeg`, `audio/mp3`, `audio/wav`, `audio/ogg`
- `resource_type: "auto"` (Cloudinary detect otomatis image/audio/video)
- Accept `folder` field dari FormData — client kirim path folder (e.g. `undangan-digital/andi-sinta`)
- Format response tambah `publicId` untuk delete future

```ts
const fd = await req.formData();
const file = fd.get("file") as File;
const folder = fd.get("folder") as string || "undangan-digital";
// ... validate file ...
const result = await cloudinary.uploader.upload(dataUri, {
  folder,
  resource_type: "auto",
});
return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
```

**Error handling:**
- 413 — file > 5MB (sudah ada)
- 415 — tipe file tidak supported
- 429 — rate limit (sudah ada)
- 500 — Cloudinary error (return pesan user-friendly)

## 2. `components/upload/UploadField.tsx`

Reusable controlled component — preview + upload + hapus + loading + error.

### Props
```ts
interface UploadFieldProps {
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;              // default image/*
  label?: string;
  folder?: string;
  showPreview?: boolean;        // default true
  hint?: string;                // e.g. "MP3, max 5MB"
  aspectRatio?: "square" | "auto";  // preview crop
}
```

### Internal state
```ts
const [uploading, setUploading] = useState(false);
const [error, setError] = useState<string | null>(null);
const fileInputRef = useRef<HTMLInputElement>(null);
```

### Upload logic
```ts
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
    if (!res.ok) throw new Error((await res.json()).error || "Upload gagal");
    const data = await res.json();
    onChange(data.url);
  } catch (e) {
    setError(e instanceof Error ? e.message : "Upload gagal");
  } finally {
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
}
```

### Render preview logic

UploadField detect tipe file dari `accept` prop:
- `accept` includes "image" → preview pake `<Image>` (next/image), 128×128, object-cover
- `accept` includes "audio" → preview pake icon speaker/music note, dengan nama file di bawahnya
- Default: image preview

### Render states

**Empty (value === null):**
```
┌──────────────────────────┐
│  [label]                 │
│  ┌──────────────────┐    │
│  │  📷              │    │   ← placeholder icon (camera/note)
│  │  Klik untuk      │    │
│  │  upload          │    │
│  └──────────────────┘    │
│  [Upload]                │   ← actual hidden input, label styled as button
│  (hint)                  │
└──────────────────────────┘
```

**Has value:**
```
┌──────────────────────────┐
│  [label]                 │
│  ┌──────────────────┐    │
│  │                  │    │
│  │  <Image> preview │    │   ← next/image, 128×128, object-cover
│  │  128×128         │    │
│  └──────────────────┘    │
│  [Ganti] [Hapus]         │
└──────────────────────────┘
```

**Loading:**
- Tombol disabled + spinner icon
- Preview area kasih overlay loading (opacity + spinner)
- Upload baru bisa diklik setelah selesai

**Error:**
- Text merah di bawah komponen
- Auto-clear setelah 5 detik
- State tetap sebelumnya (ga ke-reset)

### CSS (Tailwind v4)
Base classes on container: `flex flex-col gap-2`.
Buttons: `btn`, `btn-outline`, `btn-destructive` pattern dari shadcn.

## 3. DashboardClient.tsx — perubahan per field

### 3a. heroImage (lines 419-440)
Before: Label + Input + Upload label-button
After:
```tsx
<UploadField
  label="Foto Hero (Background)"
  value={form.heroImage}
  folder={`undangan-digital/${invitation?.slug || ""}`}
  onChange={(url) => setForm(p => ({ ...p, heroImage: url }))}
/>
```

### 3b. groomImage (lines 456-478)
```tsx
<UploadField
  label="Foto Mempelai Pria"
  value={form.groomImage}
  folder={`undangan-digital/${invitation?.slug || ""}`}
  aspectRatio="square"
  onChange={(url) => setForm(p => ({ ...p, groomImage: url }))}
/>
```

### 3c. brideImage (lines 494-516)
```tsx
<UploadField
  label="Foto Mempelai Wanita"
  value={form.brideImage}
  folder={`undangan-digital/${invitation?.slug || ""}`}
  aspectRatio="square"
  onChange={(url) => setForm(p => ({ ...p, brideImage: url }))}
/>
```

### 3d. Gallery (lines 573-632)
Before: tiap item = Input text + Upload + Hapus + thumbnail 64px

After: each item jadi UploadField + Hapus
```tsx
{gallery.map((url, i) => (
  <div key={i} className="flex items-center gap-2">
    <UploadField
      value={url}
      folder={`undangan-digital/${invitation?.slug || ""}`}
      onChange={(val) => handleGalleryChange(i, val)}
    />
    <button onClick={() => removeGalleryItem(i)} className="btn-destructive">
      Hapus
    </button>
  </div>
))}
```

### 3e. Music URL (lines 538-548)
Before: Input text "https://..."

After:
```tsx
<UploadField
  label="Musik Latar (MP3)"
  value={form.musicUrl}
  accept="audio/mpeg,audio/mp3,audio/wav"
  folder={`undangan-digital/${invitation?.slug || ""}`}
  hint="MP3, maksimal 5MB"
  onChange={(url) => setForm(p => ({ ...p, musicUrl: url }))}
/>
```

## 4. Gallery — UX flow

Current problem: "+ Tambah Foto" push empty string ke array, user harus upload satu-satu terus manual paste URL.

New flow:
1. Klik "+ Tambah Foto" → muncul UploadField kosong
2. Klik Upload → pilih file → upload ke Cloudinary → URL langsung ke state
3. Bisa upload beberapa gambar sekaligus di sesi yang sama
4. Item bisa dihapus kapan aja

Empty state tetap "Belum ada foto galeri" dengan icon.

## 5. Cloudinary folder organization

UploadField kirim folder `undangan-digital/{slug}` (slug dari invitation).

Contoh struktur Cloudinary:
```
undangan-digital/
  andi-sinta/
    hero-ac3f4.jpg
    groom-b2d1e.jpg
    bride-f9c3a.jpg
    gallery-0-d4e5f.jpg
    gallery-1-a1b2c.jpg
    music-e7f8g.mp3
  budi-dewi/
    hero-h8i9j.jpg
    ...
```

Folder ditentukan saat upload, bukan setelahnya — jadi file langsung masuk folder yang bener.

## 6. File structure akhir

```
components/
  upload/
    UploadField.tsx          ← [CREATE] reusable upload + preview component
app/api/upload/
  route.ts                   ← [MODIFY] + audio accept, + folder param, resource_type auto
app/(dashboard)/admin/dashboard/
  DashboardClient.tsx        ← [MODIFY] ganti 5 field pake UploadField
```

## 7. Daftar perubahan per file

### `app/api/upload/route.ts`
- ALLOWED_TYPES tambah: `audio/mpeg`, `audio/mp3`, `audio/wav`, `audio/ogg`
- Baca `fd.get("folder")`, fallback `"undangan-digital"`
- Pass `resource_type: "auto"` ke Cloudinary
- Return `publicId` di response

### `components/upload/UploadField.tsx`
- File baru, komponen behavior-controlled
- 4 render states: empty, has-value, loading, error
- Internal state: uploading, error
- Props: value, onChange, accept, label, folder, hint, aspectRatio
- Upload via fetch POST /api/upload
- All file types validated client-side + server-side

### `app/(dashboard)/admin/dashboard/DashboardClient.tsx`
- Import UploadField
- Hapus inline `<Input>` untuk heroImage + groomImage + brideImage + gallery items + musicUrl
- Ganti pake `<UploadField>` di masing-masing
- Hapus function `uploadFile()` (lines 142-159) — pindah ke UploadField
- Hapus state `uploading` (line 38) — pindah per-field
- Tambah state `form.musicUrl` di initial form state

## 8. Migration

No migration needed — existing data tetap valid (URL Cloudinary masih sama). Cuma UX yang berubah.

## 9. Implementation order

1. `app/api/upload/route.ts` — perbarui ALLOWED_TYPES, folder param, resource_type auto
2. `components/upload/UploadField.tsx` — create
3. `DashboardClient.tsx` — ganti semua field + hapus code lama
4. Test: upload image, upload MP3, hapus, ganti, gallery multi-item
