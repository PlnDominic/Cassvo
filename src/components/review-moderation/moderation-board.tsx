"use client";

import { useMemo, useState, useTransition } from "react";
import { ModerationTabs, type ModerationTab } from "./moderation-tabs";
import { ModerationToolbar } from "./moderation-toolbar";
import { ModerationListItem } from "./moderation-list-item";
import { ModerationDetailPanel } from "./moderation-detail-panel";
import { Pagination } from "./pagination";
import type { ModerationReview } from "./types";
import { approveAllPending, approveReview, rejectReview } from "@/lib/actions/reviews";

const PAGE_SIZE = 10;

function withinMonth(createdAt: string, filter: string): boolean {
  if (filter === "Month") return true;
  const date = new Date(createdAt);
  const now = new Date();
  if (filter === "This Week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return date >= weekAgo;
  }
  if (filter === "This Month") {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }
  if (filter === "This Year") {
    return date.getFullYear() === now.getFullYear();
  }
  return true;
}

export function ModerationBoard({ reviews: initialReviews }: { reviews: ModerationReview[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [tab, setTab] = useState<ModerationTab>("all");
  const [selectedId, setSelectedId] = useState(initialReviews[0]?.id);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Category");
  const [rating, setRating] = useState("Rating");
  const [month, setMonth] = useState("Month");
  const [page, setPage] = useState(1);

  const [actionPending, startAction] = useTransition();
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [approveAllInFlight, setApproveAllInFlight] = useState(false);

  const counts = useMemo(
    () => ({
      all: reviews.length,
      pending: reviews.filter((r) => r.status === "pending").length,
      approved: reviews.filter((r) => r.status === "approved").length,
      rejected: reviews.filter((r) => r.status === "rejected").length,
    }),
    [reviews],
  );

  const categories = useMemo(
    () => [...new Set(reviews.map((r) => r.businessCategory).filter(Boolean))].sort(),
    [reviews],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews.filter((r) => {
      if (tab !== "all" && r.status !== tab) return false;
      if (category !== "Category" && r.businessCategory !== category) return false;
      if (rating !== "Rating" && String(Math.round(r.rating)) !== rating.charAt(0)) return false;
      if (!withinMonth(r.createdAt, month)) return false;
      if (q) {
        const haystack = `${r.name} ${r.business} ${r.text}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [reviews, tab, category, rating, month, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const selected = reviews.find((r) => r.id === selectedId) ?? paged[0] ?? filtered[0];

  function changeFilter<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  function handleApprove(id: string) {
    setActionError(null);
    setActioningId(id);
    const previous = reviews;
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
    startAction(async () => {
      const result = await approveReview(id);
      if (!result.ok) {
        setReviews(previous);
        setActionError(result.message);
      }
      setActioningId(null);
    });
  }

  function handleReject(id: string) {
    setActionError(null);
    setActioningId(id);
    const previous = reviews;
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
    startAction(async () => {
      const result = await rejectReview(id);
      if (!result.ok) {
        setReviews(previous);
        setActionError(result.message);
      }
      setActioningId(null);
    });
  }

  async function handleApproveAll() {
    setActionError(null);
    setApproveAllInFlight(true);
    const previous = reviews;
    setReviews((prev) => prev.map((r) => (r.status === "pending" ? { ...r, status: "approved" } : r)));
    const result = await approveAllPending();
    if (!result.ok) {
      setReviews(previous);
      setActionError(result.message);
    }
    setApproveAllInFlight(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <ModerationTabs
        active={tab}
        onChange={(t) => {
          setTab(t);
          setPage(1);
        }}
        counts={counts}
      />

      <ModerationToolbar
        onApproveAll={handleApproveAll}
        approveAllDisabled={counts.pending === 0}
        approveAllPending={approveAllInFlight}
        search={search}
        onSearchChange={changeFilter(setSearch)}
        categories={categories}
        category={category}
        onCategoryChange={changeFilter(setCategory)}
        rating={rating}
        onRatingChange={changeFilter(setRating)}
        month={month}
        onMonthChange={changeFilter(setMonth)}
      />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[380px_1fr]">
        <div className="flex flex-col gap-3">
          {paged.map((review) => (
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
            onApprove={() => handleApprove(selected.id)}
            onReject={() => handleReject(selected.id)}
            pending={actionPending && actioningId === selected.id}
            error={actioningId === selected.id ? actionError : null}
          />
        ) : (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-[#939393]">Select a review to moderate.</div>
        )}
      </div>

      <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
    </div>
  );
}
