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
