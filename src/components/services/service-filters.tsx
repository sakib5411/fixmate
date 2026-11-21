"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORY_NAMES, SERVICE_MODES } from "@/lib/constants";

export function ServiceFilters({ total }: { total: number }) {
  const router = useRouter();
  const params = useSearchParams();

  const currentSearch = params.get("search") ?? "";
  const category = params.get("category") ?? "";
  const serviceMode = params.get("serviceMode") ?? "";
  const sort = params.get("sort") ?? "newest";

  const [search, setSearch] = useState(currentSearch);
  const [syncedSearch, setSyncedSearch] = useState(currentSearch);

  // Keep the input in sync when the URL changes (back/forward or a shared link)
  // without an extra effect render pass.
  if (syncedSearch !== currentSearch) {
    setSyncedSearch(currentSearch);
    setSearch(currentSearch);
  }

  function apply(next: Record<string, string>) {
    const query = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) query.set(key, value);
      else query.delete(key);
    });
    // Any new filter starts from page 1.
    query.delete("page");
    router.push(`/services?${query.toString()}`);
  }

  const hasFilters = Boolean(currentSearch || category || serviceMode || sort !== "newest");

  return (
    <div className="card p-4 sm:p-5">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          apply({ search: search.trim() });
        }}
        className="flex flex-col gap-3 lg:flex-row lg:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or category…"
            className="input rounded-full py-3 pl-11"
            aria-label="Search services"
          />
        </div>

        <select
          value={category}
          onChange={(event) => apply({ category: event.target.value })}
          className="input rounded-full py-3 lg:w-48"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {CATEGORY_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={serviceMode}
          onChange={(event) => apply({ serviceMode: event.target.value })}
          className="input rounded-full py-3 lg:w-44"
          aria-label="Filter by service mode"
        >
          <option value="">Any service mode</option>
          {SERVICE_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => apply({ sort: event.target.value })}
          className="input rounded-full py-3 lg:w-52"
          aria-label="Sort services"
        >
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>

        <button type="submit" className="btn-primary rounded-full px-6 py-3">
          <SlidersHorizontal className="size-4" /> Apply
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-500">
        <p>
          <span className="font-semibold text-ink-900">{total}</span> service
          {total === 1 ? "" : "s"} found
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push("/services")}
            className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700"
          >
            <X className="size-3.5" /> Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
