"use client";

import { useId, useRef } from "react";
import { Plus } from "lucide-react";

export function ImageUploadBox({
  label,
  placeholder,
  preview,
  onChange,
}: {
  label: string;
  placeholder: string;
  preview: string | null;
  onChange: (preview: string | null) => void;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    onChange(URL.createObjectURL(file));
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-[#060606]">{label}</p>

      <div className="relative flex h-[220px] w-full items-center justify-center overflow-hidden rounded-xl border border-[#ececed] bg-white">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- user-uploaded blob preview, not a static asset
          <img src={preview} alt={placeholder} className="size-full object-cover" />
        ) : (
          <p className="text-sm font-medium text-[#939393]">{placeholder}</p>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#f2f2f3] px-5 py-2.5 text-sm font-medium text-[#939393] hover:text-[#060606]"
      >
        <Plus size={16} />
        Upload Image
      </button>
    </div>
  );
}
