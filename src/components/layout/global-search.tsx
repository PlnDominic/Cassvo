"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Store, UserPlus, Star, Loader2, X } from "lucide-react";
import { searchEverything, type SearchResult } from "@/lib/actions/search";

const TYPE_ICON = {
  business: Store,
  user: UserPlus,
  review: Star,
} as const;

const DEBOUNCE_MS = 300;

/**
 * The topbar's "search anything" box — debounced live search across
 * businesses/users/reviews via searchEverything() (src/lib/actions/search.ts);
 * click a result to navigate there, or see a "no results" state.
 *
 * On desktop (md+) it's an inline input with a dropdown. Below md there's no
 * room for the input, so a search icon button opens a full-screen overlay.
 */
export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setPending(false);
      return;
    }

    setPending(true);
    debounceRef.current = setTimeout(() => {
      const requestId = ++requestIdRef.current;
      searchEverything(trimmed).then((found) => {
        // Ignore a stale response that resolved after a newer keystroke's
        // request — otherwise a slow early result can clobber a later one.
        if (requestId !== requestIdRef.current) return;
        setResults(found);
        setPending(false);
      });
    }, DEBOUNCE_MS);
  }

  function closeAll() {
    setOpen(false);
    setMobileOpen(false);
  }

  function renderResults() {
    if (pending) {
      return (
        <p className="flex items-center gap-2 px-4 py-6 text-sm text-[#939393]">
          <Loader2 size={16} className="animate-spin" />
          Searching…
        </p>
      );
    }
    if (results.length === 0) {
      return <p className="px-4 py-6 text-center text-sm text-[#939393]">No results for &ldquo;{query.trim()}&rdquo;</p>;
    }
    return (
      <div className="max-h-[360px] overflow-y-auto">
        {results.map((result) => {
          const Icon = TYPE_ICON[result.type];
          return (
            <Link
              key={`${result.type}-${result.id}`}
              href={result.href}
              onClick={closeAll}
              className="flex items-center gap-3 border-b border-[#ececed] px-4 py-3 last:border-b-0 hover:bg-[#f7f7f8]"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f2f2f3] text-[#606060]">
                <Icon size={16} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#060606]">{result.title}</p>
                <p className="truncate text-xs text-[#939393]">{result.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  const hasQuery = query.trim().length >= 2;

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        onClick={() => setMobileOpen(true)}
        className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-[#ececed] md:hidden"
      >
        <Search size={18} className="text-black" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white md:hidden">
          <div className="flex items-center gap-2 border-b border-[#ececed] px-4 py-3">
            <label className="flex h-[40px] flex-1 items-center gap-2 rounded-[11px] border border-[#ececed] px-[10px]">
              <Search size={16} className="shrink-0 text-black/60" />
              <input
                autoFocus
                type="search"
                placeholder="search anything"
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                className="h-full w-full bg-transparent text-[16px] font-medium text-black placeholder:text-black/60 focus:outline-none"
              />
            </label>
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setMobileOpen(false)}
              className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5"
            >
              <X size={20} className="text-black" />
            </button>
          </div>
          {hasQuery && <div className="min-h-0 flex-1 overflow-y-auto">{renderResults()}</div>}
        </div>
      )}

      <div ref={containerRef} className="relative hidden md:block md:w-[180px] lg:w-[220px]">
        <label className="flex h-[38px] items-center gap-2 rounded-[11px] border border-[#ececed] px-[10px]">
          <Search size={16} className="shrink-0 text-black/60" />
          <input
            type="search"
            placeholder="search anything"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setOpen(true)}
            className="h-full w-full bg-transparent text-[16px] font-medium text-black placeholder:text-black/60 focus:outline-none"
          />
        </label>

        {open && hasQuery && (
          <div
            role="listbox"
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-[320px] overflow-hidden rounded-[14px] border border-[#ececed] bg-white shadow-[0px_12px_32px_0px_rgba(0,0,0,0.12)]"
          >
            {renderResults()}
          </div>
        )}
      </div>
    </>
  );
}
