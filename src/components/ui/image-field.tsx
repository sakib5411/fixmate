"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { ApiError, uploadImage } from "@/lib/api";

export function ImageField({
  value,
  onChange,
  label = "Image",
  hint = "JPG, PNG or WebP · up to 5 MB",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not upload the image");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="label">{label}</span>

      <div className="flex items-center gap-4">
        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-ink-300 bg-ink-50">
          {uploading ? (
            <Loader2 className="size-5 animate-spin text-brand-500" />
          ) : value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="size-full object-cover" />
          ) : (
            <ImagePlus className="size-5 text-ink-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            id="image-field-input"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn-outline btn-sm"
              disabled={uploading}
            >
              {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="btn-ghost btn-sm text-red-600 hover:bg-red-50"
              >
                <X className="size-3.5" /> Remove
              </button>
            )}
          </div>
          <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
        </div>
      </div>
    </div>
  );
}
