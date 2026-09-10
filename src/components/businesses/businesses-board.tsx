"use client";

import { useMemo, useState } from "react";
import { FeaturedBusinessCard } from "./featured-business-card";
import { BusinessTabs, type BusinessTab } from "./business-tabs";
import { BusinessesToolbar } from "./businesses-toolbar";
import { BusinessesTable } from "./businesses-table";
import type { Business, BusinessStatus } from "./types";

const MAX_FEATURED = 2;
const ALL_CATEGORIES = "All Categories";

export function BusinessesBoard({
  businesses: initialBusinesses,
  initialFeaturedIds,
  categoryOptions,
}: {
  businesses: Business[];
  initialFeaturedIds: string[];
  /** Real category titles — see getCategories(); this page doesn't need "Uncategorized" as a filterable option since it's a fallback label, not a real category. */
  categoryOptions: string[];
}) {
  const [tab, setTab] = useState<BusinessTab>("all");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [featuredIds, setFeaturedIds] = useState(initialFeaturedIds);
  const [businesses, setBusinesses] = useState(initialBusinesses);

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
        />
        <BusinessesTable businesses={filtered} onSetStatus={setStatus} />
      </div>
    </div>
  );
}
