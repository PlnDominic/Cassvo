"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ pageCount = 16 }: { pageCount?: number }) {
  const [page, setPage] = useState(1);
  const visiblePages = [1, 2, 3];

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
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
          onClick={() => setPage(p)}
          className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
            page === p ? "border border-brand-red text-brand-red" : "text-[#060606]"
          }`}
        >
          {p}
        </button>
      ))}

      <span className="px-1 text-sm text-[#939393]">…</span>

      <button
        type="button"
        onClick={() => setPage(pageCount)}
        className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
          page === pageCount ? "border border-brand-red text-brand-red" : "text-[#060606]"
        }`}
      >
        {pageCount}
      </button>

      <button
        type="button"
        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
        aria-label="Next page"
        className="flex size-8 items-center justify-center rounded-full border border-[#ececed] text-[#060606] disabled:opacity-40"
        disabled={page === pageCount}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
