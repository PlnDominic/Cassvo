"use client";

import { useMemo, useState } from "react";
import { FeaturedBusinessCard } from "./featured-business-card";
import { BusinessTabs, type BusinessTab } from "./business-tabs";
import { BusinessesToolbar } from "./businesses-toolbar";
import { BusinessesTable } from "./businesses-table";
import type { Business } from "./types";

const MAX_FEATURED = 2;

export function BusinessesBoard({
  businesses,
  initialFeaturedIds,
}: {
  businesses: Business[];
  initialFeaturedIds: string[];
}) {
  const [tab, setTab] = useState<BusinessTab>("all");
  const [featuredIds, setFeaturedIds] = useState(initialFeaturedIds);

  const counts = useMemo(
    () => ({
      all: businesses.length,
      pending: businesses.filter((b) => b.status === "pending").length,
      confirmed: businesses.filter((b) => b.status === "confirmed").length,
      suspended: businesses.filter((b) => b.status === "suspended").length,
    }),
    [businesses]
  );

  const filtered = tab === "all" ? businesses : businesses.filter((b) => b.status === tab);
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

  return (
    <div className="flex flex-col gap-6">
      <FeaturedBusinessCard featured={featured} maxFeatured={MAX_FEATURED} onRemove={removeFeatured} onAdd={addFeatured} />

      <div className="flex flex-col gap-4">
        <BusinessTabs active={tab} onChange={setTab} counts={counts} />
        <BusinessesToolbar onAddBusiness={() => {}} />
        <BusinessesTable businesses={filtered} />
      </div>
    </div>
  );
}
