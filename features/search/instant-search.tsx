"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { products } from "@/lib/data/catalog";
import { bodyMetrics } from "@/lib/data/content";

const popularSearches = ["دهون الجسم", "ميزان ذكي", "كتلة العضلات", "ترطيب"];

export function InstantSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const normalized = query.toLowerCase();

    return products.filter((product) =>
      [product.title, product.subtitle, product.description, ...product.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  return (
    <div className="relative hidden min-w-72 lg:block">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
      <input
        aria-label="Search Vitaro"
        className="form-input h-11 rounded-full pl-11 pr-4"
        placeholder="ابحث عن الأجهزة، المؤشرات، الدعم"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {(query || results.length > 0) && (
        <div
          data-surface="light"
          className="absolute left-0 right-0 top-14 z-40 rounded-3xl border border-surface bg-surface p-3 shadow-2xl dark:bg-[#020617] dark:[--surface-bg:#020617] dark:[--surface-fg-heading:#f8fafc] dark:[--surface-fg-body:#e2e8f0] dark:[--surface-fg-muted:#cbd5e1] dark:[--surface-fg-subtle:#94a3b8] dark:[--surface-icon:#f8fafc] dark:[--surface-border:rgba(255,255,255,0.1)]"
        >
          {results.length > 0 ? (
            results.map((product) => (
              <Link
                key={product.id}
                className="block rounded-2xl p-3 transition hover:bg-zinc-50 dark:hover:bg-white/10"
                href={`/products/${product.slug}`}
              >
                <p className="font-semibold text-surface-heading">{product.title}</p>
                <p className="text-sm text-surface-muted">{product.subtitle}</p>
              </Link>
            ))
          ) : (
            <div className="space-y-3 p-2">
              <p className="text-sm font-medium text-surface-muted">عمليات بحث شائعة</p>
              <div className="flex flex-wrap gap-2">
                {[...popularSearches, ...bodyMetrics.slice(0, 3)].map((item) => (
                  <button
                    key={item}
                    className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-body transition hover:bg-emerald-50 hover:text-emerald-800 dark:bg-white/10 dark:text-[#e2e8f0] dark:hover:bg-emerald-500/15 dark:hover:text-emerald-200"
                    onClick={() => setQuery(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
