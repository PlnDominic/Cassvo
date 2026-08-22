"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  // Windowed page numbers around the current page, capped at 5 buttons.
  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  const visiblePages = Array.from({ length: Math.min(5, pageCount) }, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        aria-label="Previous page"
        className="flex size-8 items-center justify-center rounded-full border border-[#ececed] text-[#060606] disabled:opacity-40"
        disabled={page === 1}
      >
        <ChevronLeft size={16} />
      </button>

      {visiblePages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
            page === p ? "border border-brand-red text-brand-red" : "text-[#060606]"
          }`}
        >
          {p}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < pageCount && (
        <>
          <span className="px-1 text-sm text-[#939393]">…</span>
          <button
            type="button"
            onClick={() => onChange(pageCount)}
            className="flex size-8 items-center justify-center rounded-full text-sm font-medium text-[#060606]"
          >
            {pageCount}
          </button>
        </>
      )}

      <button
        type="button"
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        aria-label="Next page"
        className="flex size-8 items-center justify-center rounded-full border border-[#ececed] text-[#060606] disabled:opacity-40"
        disabled={page === pageCount}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
