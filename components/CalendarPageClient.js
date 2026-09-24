"use client";

import { useCallback, useState } from "react";
import CalendarView from "./CalendarView";
import FilterBar from "./FilterBar";
import { useDeadlineTypes } from "@/lib/useDeadlineTypes";
import { useDeadlinesChanged } from "@/lib/useDeadlinesChanged";

export default function CalendarPageClient({ initialDeadlines, initialTypes }) {
  const [deadlines, setDeadlines] = useState(initialDeadlines);
  const [excludedTypes, setExcludedTypes] = useState(() => new Set());
  const { types } = useDeadlineTypes(initialTypes);

  const load = useCallback(async () => {
    const res = await fetch("/api/deadlines");
    const data = await res.json();
    setDeadlines(data);
  }, []);

  useDeadlinesChanged(load);

  const visibleDeadlines = deadlines.filter((d) => !excludedTypes.has(d.type));

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">カレンダー</h1>
        <p className="mt-1 text-sm text-gray-500">月表示で締め切りを確認</p>
      </div>

      <FilterBar
        types={types}
        excluded={excludedTypes}
        onExcludedChange={setExcludedTypes}
      />

      <CalendarView deadlines={visibleDeadlines} types={types} />
    </main>
  );
}
