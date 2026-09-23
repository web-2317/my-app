"use client";

import { useEffect, useState } from "react";
import CalendarView from "./CalendarView";
import TypeFilter from "./TypeFilter";
import { useDeadlineTypes } from "@/lib/useDeadlineTypes";

export default function CalendarPageClient() {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [excludedTypes, setExcludedTypes] = useState(() => new Set());
  const { types } = useDeadlineTypes();

  useEffect(() => {
    fetch("/api/deadlines")
      .then((r) => r.json())
      .then((data) => {
        setDeadlines(data);
        setLoading(false);
      });
  }, []);

  const visibleDeadlines = deadlines.filter((d) => !excludedTypes.has(d.type));

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">カレンダー</h1>
        <p className="mt-1 text-sm text-gray-500">月表示で締め切りを確認</p>
      </div>

      {!loading && (
        <div className="mb-6">
          <TypeFilter
            types={types}
            excluded={excludedTypes}
            onChange={setExcludedTypes}
          />
        </div>
      )}

      {loading ? (
        <p className="text-center text-sm text-gray-400">読み込み中…</p>
      ) : (
        <CalendarView deadlines={visibleDeadlines} types={types} />
      )}
    </main>
  );
}
