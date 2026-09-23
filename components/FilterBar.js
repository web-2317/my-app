"use client";

import { useState } from "react";
import Modal from "./Modal";
import TypeFilterOptions from "./TypeFilterOptions";

const SORT_OPTIONS = [
  { key: "asc", label: "締切が近い順" },
  { key: "desc", label: "締切が遠い順" },
];

export default function FilterBar({
  types,
  excluded,
  onExcludedChange,
  sortOrder,
  onSortOrderChange,
}) {
  const [openDialog, setOpenDialog] = useState(null); // "sort" | "filter" | null
  const selectedCount = types.length - excluded.size;
  const sortLabel =
    SORT_OPTIONS.find((o) => o.key === sortOrder)?.label ?? SORT_OPTIONS[0].label;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {onSortOrderChange && (
        <button
          type="button"
          onClick={() => setOpenDialog("sort")}
          className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition hover:border-accent hover:text-accent"
        >
          <span aria-hidden>↓↑</span> {sortLabel}
        </button>
      )}
      <button
        type="button"
        onClick={() => setOpenDialog("filter")}
        className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition hover:border-accent hover:text-accent"
      >
        種別で絞り込み
        {excluded.size > 0 && (
          <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {selectedCount}
          </span>
        )}
      </button>

      {openDialog === "sort" && (
        <Modal title="並び替え" onClose={() => setOpenDialog(null)}>
          <div className="space-y-1">
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => {
                  onSortOrderChange(o.key);
                  setOpenDialog(null);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                  sortOrder === o.key
                    ? "bg-blue-50 font-medium text-accent"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {o.label}
                {sortOrder === o.key && <span aria-hidden>✓</span>}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {openDialog === "filter" && (
        <Modal title="種別で絞り込み" onClose={() => setOpenDialog(null)}>
          <TypeFilterOptions
            types={types}
            excluded={excluded}
            onChange={onExcludedChange}
          />
        </Modal>
      )}
    </div>
  );
}
