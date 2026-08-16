"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import type { AdditionalPhoto } from "./types";

export function PhotoGallery({
  photos,
  onAdd,
  editable = true,
  columns = 3,
}: {
  photos: AdditionalPhoto[];
  onAdd?: (preview: string) => void;
  editable?: boolean;
  columns?: 2 | 3;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file || !onAdd) return;
    onAdd(URL.createObjectURL(file));
  }

  return (
    <div className={`grid gap-3 ${columns === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
      {photos.map((photo) => (
        <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f8]">
          {/* eslint-disable-next-line @next/next/no-img-element -- mix of static assets and user-uploaded blob previews */}
          <img src={photo.preview} alt="" className="size-full object-cover" />
        </div>
      ))}
      {editable && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#c9c9cb] text-xs font-medium text-[#939393] hover:border-brand-red hover:text-brand-red"
          >
            <Plus size={18} />
            Add More
          </button>
        </>
      )}
    </div>
  );
}
