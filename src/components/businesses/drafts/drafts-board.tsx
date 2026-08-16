"use client";

import { useMemo, useState } from "react";
import { DraftFilterPills, type DraftFilter } from "./draft-filter-pills";
import { DraftsTable } from "./drafts-table";
import { Pagination } from "../../review-moderation/pagination";
import type { BusinessDraft } from "./types";

export function DraftsBoard({ drafts: initialDrafts }: { drafts: BusinessDraft[] }) {
  const [drafts, setDrafts] = useState(initialDrafts);
  const [filter, setFilter] = useState<DraftFilter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? drafts : drafts.filter((d) => d.status === filter)),
    [drafts, filter]
  );

  function removeDraft(id: string) {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      <DraftFilterPills active={filter} onChange={setFilter} />
      <DraftsTable drafts={filtered} onDelete={removeDraft} />
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-[#939393]">
          Showing {filtered.length} of {drafts.length}
        </p>
        <Pagination pageCount={6} />
      </div>
    </div>
  );
}
