"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Trash2, TriangleAlert } from "lucide-react";
import { FeaturedBusinessCard } from "./featured-business-card";
import { BusinessTabs, type BusinessTab } from "./business-tabs";
import { BusinessesToolbar } from "./businesses-toolbar";
import { BusinessesTable } from "./businesses-table";
import { deleteBusiness, deleteBusinesses } from "@/lib/actions/businesses";
import type { ActionResult } from "@/lib/actions/settings";
import type { Business, BusinessStatus } from "./types";

const MAX_FEATURED = 2;
const ALL_CATEGORIES = "All Categories";

export function BusinessesBoard({
  businesses: initialBusinesses,
  initialFeaturedIds,
  categoryOptions,
  viewerIsAdmin,
}: {
  businesses: Business[];
  initialFeaturedIds: string[];
  /** Real category titles — see getCategories(); this page doesn't need "Uncategorized" as a filterable option since it's a fallback label, not a real category. */
  categoryOptions: string[];
  /** Passed through to BusinessesToolbar to gate the Batch Upload link. */
  viewerIsAdmin: boolean;
}) {
  const [tab, setTab] = useState<BusinessTab>("all");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [featuredIds, setFeaturedIds] = useState(initialFeaturedIds);
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const counts = useMemo(
    () => ({
      all: businesses.length,
      pending: businesses.filter((b) => b.status === "pending").length,
      confirmed: businesses.filter((b) => b.status === "confirmed").length,
      suspended: businesses.filter((b) => b.status === "suspended").length,
    }),
    [businesses]
  );

  const filtered = businesses
    .filter((b) => tab === "all" || b.status === tab)
    .filter((b) => category === ALL_CATEGORIES || b.category === category);

  const featured = featuredIds.map((id) => businesses.find((b) => b.id === id)).filter((b): b is Business => Boolean(b));

  function removeFeatured(id: string) {
    setFeaturedIds((prev) => prev.filter((f) => f !== id));
  }

  function addFeatured() {
    const next = businesses.find((b) => !featuredIds.includes(b.id));
    if (next && featuredIds.length < MAX_FEATURED) {
      setFeaturedIds((prev) => [...prev, next.id]);
    }
  }

  function setStatus(id: string, status: BusinessStatus) {
    setBusinesses((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  function announce(outcome: ActionResult) {
    setResult(outcome);
    if (outcome.ok) window.setTimeout(() => setResult(null), 3000);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function toggleSelectAll() {
    const visibleIds = filtered.map((b) => b.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : visibleIds);
  }

  function handleDeleteOne(id: string) {
    const previous = businesses;
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
    setSelectedIds((prev) => prev.filter((s) => s !== id));
    startTransition(async () => {
      const outcome = await deleteBusiness(id);
      if (!outcome.ok) setBusinesses(previous);
      announce(outcome);
    });
  }

  function handleDeleteSelected() {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected business${selectedIds.length === 1 ? "" : "es"}? This cannot be undone.`)) {
      return;
    }
    const ids = selectedIds;
    const previous = businesses;
    setBusinesses((prev) => prev.filter((b) => !ids.includes(b.id)));
    setSelectedIds([]);
    startTransition(async () => {
      const outcome = await deleteBusinesses(ids);
      if (!outcome.ok) setBusinesses(previous);
      announce(outcome);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <FeaturedBusinessCard featured={featured} maxFeatured={MAX_FEATURED} onRemove={removeFeatured} onAdd={addFeatured} />

      <div className="flex flex-col gap-4">
        <BusinessTabs active={tab} onChange={setTab} counts={counts} />
        <BusinessesToolbar
          categoryOptions={[ALL_CATEGORIES, ...categoryOptions]}
          categoryValue={category}
          onCategoryChange={setCategory}
          statusTab={tab}
          onStatusChange={setTab}
          viewerIsAdmin={viewerIsAdmin}
        />

        <div className="flex items-center justify-between gap-3">
          {selectedIds.length > 0 ? (
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={pending}
              className="flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={16} />
              Delete Selected ({selectedIds.length})
            </button>
          ) : (
            <span />
          )}
          {result && (
            <span
              className={`flex items-center gap-1.5 text-sm font-medium ${result.ok ? "text-emerald-600" : "text-brand-red"}`}
            >
              {result.ok ? <Check size={16} /> : <TriangleAlert size={16} />}
              {result.message}
            </span>
          )}
        </div>

        <BusinessesTable
          businesses={filtered}
          onSetStatus={setStatus}
          onDelete={handleDeleteOne}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
        />
      </div>
    </div>
  );
}
