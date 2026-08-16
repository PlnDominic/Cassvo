"use client";

import { useMemo, useState } from "react";
import { ModerationTabs, type ModerationTab } from "./moderation-tabs";
import { ModerationToolbar } from "./moderation-toolbar";
import { ModerationListItem } from "./moderation-list-item";
import { ModerationDetailPanel } from "./moderation-detail-panel";
import { Pagination } from "./pagination";
import type { ModerationReview, ModerationStatus } from "./types";

export function ModerationBoard({ reviews: initialReviews }: { reviews: ModerationReview[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [tab, setTab] = useState<ModerationTab>("all");
  const [selectedId, setSelectedId] = useState(initialReviews[0]?.id);

  const counts = useMemo(
    () => ({
      all: reviews.length,
      pending: reviews.filter((r) => r.status === "pending").length,
      approved: reviews.filter((r) => r.status === "approved").length,
      rejected: reviews.filter((r) => r.status === "rejected").length,
    }),
    [reviews]
  );

  const filtered = tab === "all" ? reviews : reviews.filter((r) => r.status === tab);
  const selected = reviews.find((r) => r.id === selectedId) ?? filtered[0];

  function setStatus(id: string, status: ModerationStatus) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  function approveAll() {
    setReviews((prev) => prev.map((r) => (r.status === "pending" ? { ...r, status: "approved" } : r)));
  }

  return (
    <div className="flex flex-col gap-4">
      <ModerationTabs active={tab} onChange={setTab} counts={counts} />

      <ModerationToolbar onApproveAll={approveAll} approveAllDisabled={counts.pending === 0} />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[380px_1fr]">
        <div className="flex flex-col gap-3">
          {filtered.map((review) => (
            <ModerationListItem
              key={review.id}
              review={review}
              selected={review.id === selected?.id}
              onSelect={() => setSelectedId(review.id)}
            />
          ))}
          {filtered.length === 0 && (
            <p className="rounded-2xl bg-white p-6 text-center text-sm text-[#939393]">No reviews in this queue.</p>
          )}
        </div>

        {selected ? (
          <ModerationDetailPanel
            review={selected}
            onApprove={() => setStatus(selected.id, "approved")}
            onReject={() => setStatus(selected.id, "rejected")}
          />
        ) : (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-[#939393]">Select a review to moderate.</div>
        )}
      </div>

      <Pagination />
    </div>
  );
}
