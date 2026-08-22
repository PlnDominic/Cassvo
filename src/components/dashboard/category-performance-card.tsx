import { PeriodDropdown } from "./period-dropdown";

export interface CategoryRow {
  name: string;
  reviews: number;
  rating: number | null;
  percent: number;
}

export function CategoryPerformanceCard({ categories }: { categories: CategoryRow[] }) {
  return (
    <div className="w-full rounded-[10px] bg-white p-5 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-medium tracking-[0.01em] text-[#060606]">Category Performance</p>
        <PeriodDropdown />
      </div>

      {categories.length === 0 ? (
        <p className="py-6 text-center text-xs text-[#939393]">No category data yet.</p>
      ) : (
        <>
          <div className="flex justify-between text-[10px] font-medium tracking-[0.01em] text-[#939393]">
            <span>Category</span>
            <div className="flex gap-9">
              <span>Reviews</span>
              <span>Avg. Rating</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {categories.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between text-xs font-medium tracking-[0.01em] text-[#060606]"
              >
                <div className="flex items-center gap-1.5">
                  <span className="size-[11px] shrink-0 rounded-full bg-brand-red" />
                  <span>{c.name}</span>
                </div>
                <div className="flex gap-9">
                  <span className="w-[45px]">{c.reviews.toLocaleString()}</span>
                  <span className="w-[60px]">{c.rating ?? "–"}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
