"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Trash2, TriangleAlert, Upload, UploadCloud } from "lucide-react";
import { normalizeBusinessName, stripExtension } from "@/lib/business-name-match";
import { uploadImage } from "@/lib/upload-image";
import { batchSetBusinessCovers } from "@/lib/actions/businesses";

export interface BusinessOption {
  id: string;
  name: string;
}

type MatchState =
  | { kind: "matched"; business: BusinessOption }
  | { kind: "unmatched" }
  | { kind: "ambiguous"; candidates: BusinessOption[] };

interface QueueItem {
  id: string;
  file: File;
  preview: string;
  match: MatchState;
  /** Set once this item has actually been sent to Storage/the action. */
  result: "pending" | "uploading" | "saved" | "failed";
  resultMessage?: string;
}

const MAX_FILES = 60;

/**
 * "Could add a feature in the admin system that helps batch select
 * businesses for picture uploads... rename the image files to match a
 * unique Business ID or code... backend reads the filename, strips the
 * extension, queries for the matching business code, and automatically
 * attaches the image" - the team's own request. Matches by business
 * NAME rather than a code (there's no code column on the real schema),
 * normalized so case/spacing/punctuation/accents don't matter. Sets
 * each matched business's cover image, the picture referenced as "the
 * hassle" in that thread.
 */
export function BatchUploadBoard({ businesses }: { businesses: BusinessOption[] }) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const byNormalizedName = useMemo(() => {
    const map = new Map<string, BusinessOption[]>();
    for (const b of businesses) {
      const key = normalizeBusinessName(b.name);
      const existing = map.get(key);
      if (existing) existing.push(b);
      else map.set(key, [b]);
    }
    return map;
  }, [businesses]);

  function matchFile(file: File): MatchState {
    const key = normalizeBusinessName(stripExtension(file.name));
    const candidates = byNormalizedName.get(key) ?? [];
    if (candidates.length === 0) return { kind: "unmatched" };
    if (candidates.length === 1) return { kind: "matched", business: candidates[0] };
    return { kind: "ambiguous", candidates };
  }

  function addFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setItems((prev) => {
      const room = MAX_FILES - prev.length;
      const toAdd = list.slice(0, Math.max(0, room)).map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        match: matchFile(file),
        result: "pending" as const,
      }));
      return [...prev, ...toAdd];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearAll() {
    setItems([]);
  }

  const matched = items.filter((i) => i.match.kind === "matched");
  const unmatched = items.filter((i) => i.match.kind !== "matched");
  const savedCount = items.filter((i) => i.result === "saved").length;

  async function handleUploadAll() {
    setSubmitting(true);

    // Upload every matched file to Storage first, marking each item
    // "uploading" as it starts so the list shows real progress.
    setItems((prev) => prev.map((i) => (i.match.kind === "matched" ? { ...i, result: "uploading" } : i)));

    const uploads = await Promise.all(
      matched.map(async (item) => {
        const url = await uploadImage("business-covers", item.file);
        return { item, url };
      }),
    );

    const uploadFailures = uploads.filter((u) => !u.url);
    const uploadSuccesses = uploads.filter((u): u is { item: QueueItem; url: string } => Boolean(u.url));

    const results = uploadSuccesses.length
      ? await batchSetBusinessCovers(
          uploadSuccesses.map(({ item, url }) => ({
            businessId: item.match.kind === "matched" ? item.match.business.id : "",
            coverImageUrl: url,
          })),
        )
      : [];

    // batchSetBusinessCovers() returns results in the same order it
    // received them, so pair by position - matching back by businessId
    // instead would collide whenever two different files happen to
    // resolve to the same business (both entries share that id).
    const resultByItemId = new Map(uploadSuccesses.map(({ item }, i) => [item.id, results[i]]));

    setItems((prev) =>
      prev.map((i) => {
        const failedUpload = uploadFailures.find((u) => u.item.id === i.id);
        if (failedUpload) return { ...i, result: "failed", resultMessage: "Upload to Storage failed" };

        const result = resultByItemId.get(i.id);
        if (!result) return i;
        return { ...i, result: result.ok ? "saved" : "failed", resultMessage: result.message };
      }),
    );

    setSubmitting(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
          dragOver ? "border-brand-red bg-brand-red/5" : "border-[#ececed] bg-white"
        }`}
      >
        <UploadCloud size={32} className="text-[#939393]" />
        <div>
          <p className="text-sm font-medium text-[#060606]">Drop up to {MAX_FILES} photos here</p>
          <p className="mt-1 text-xs text-[#939393]">
            Name each file to match the business it belongs to - e.g. <code>Aura Street Café.jpg</code>. Spacing,
            capitalization, and punctuation don&apos;t need to match exactly.
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-xl bg-[#f2f2f3] px-5 py-2.5 text-sm font-medium text-[#060606] hover:bg-[#ececed]"
        >
          Browse Files
        </button>
      </div>

      {items.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)] sm:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-[#060606]">
              {items.length} file{items.length === 1 ? "" : "s"} - {matched.length} matched, {unmatched.length} need attention
              {savedCount > 0 && `, ${savedCount} saved`}
            </p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={clearAll} className="text-xs font-medium text-[#939393] hover:text-[#060606]">
                Clear all
              </button>
              <button
                type="button"
                onClick={handleUploadAll}
                disabled={submitting || matched.length === 0}
                className="flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {submitting ? "Uploading…" : `Upload ${matched.length} Matched Photo${matched.length === 1 ? "" : "s"}`}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-[#ececed] p-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                <img src={item.preview} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#060606]">{item.file.name}</p>
                  {item.match.kind === "matched" && (
                    <p className="truncate text-xs text-emerald-600">→ {item.match.business.name}</p>
                  )}
                  {item.match.kind === "unmatched" && (
                    <p className="text-xs text-[#939393]">No matching business - rename to match its name</p>
                  )}
                  {item.match.kind === "ambiguous" && (
                    <p className="truncate text-xs text-amber-600">
                      Matches {item.match.candidates.length} businesses - rename to be more specific
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {item.result === "uploading" && <Loader2 size={16} className="animate-spin text-[#939393]" />}
                  {item.result === "saved" && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <Check size={14} />
                      Saved
                    </span>
                  )}
                  {item.result === "failed" && (
                    <span className="flex items-center gap-1 text-xs font-medium text-brand-red" title={item.resultMessage}>
                      <TriangleAlert size={14} />
                      Failed
                    </span>
                  )}
                  {item.match.kind === "matched" && item.result === "pending" && (
                    <Link
                      href={`/businesses/${item.match.business.id}`}
                      className="text-xs font-medium text-[#939393] hover:text-brand-red"
                    >
                      View
                    </Link>
                  )}
                  {item.result === "pending" && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove"
                      className="text-[#939393] hover:text-brand-red"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
