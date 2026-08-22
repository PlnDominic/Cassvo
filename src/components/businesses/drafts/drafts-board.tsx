"use client";

import { useMemo, useState } from "react";
import { DraftFilterPills, type DraftFilter } from "./draft-filter-pills";
import { DraftsTable } from "./drafts-table";
import { Pagination } from "../../review-moderation/pagination";
import type { BusinessDraft } from "./types";

const PAGE_SIZE = 10;

export function DraftsBoard({ drafts: initialDrafts }: { drafts: BusinessDraft[] }) {
  const [drafts, setDrafts] = useState(initialDrafts);
  const [filter, setFilter] = useState<DraftFilter>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (filter === "all" ? drafts : drafts.filter((d) => d.status === filter)),
    [drafts, filter]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function removeDraft(id: string) {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      <DraftFilterPills
        active={filter}
        onChange={(f) => {
          setFilter(f);
          setPage(1);
        }}
      />
      <DraftsTable drafts={paged} onDelete={removeDraft} />
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-[#939393]">
          Showing {paged.length} of {filtered.length}
        </p>
        <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
      </div>
    </div>
  );
}
