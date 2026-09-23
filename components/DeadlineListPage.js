"use client";

import { useCallback, useEffect, useState } from "react";
import DeadlineCard from "./DeadlineCard";
import DeadlineForm from "./DeadlineForm";
import FilterBar from "./FilterBar";
import Modal from "./Modal";
import { useDeadlineTypes } from "@/lib/useDeadlineTypes";
import { useDeadlinesChanged, notifyDeadlinesChanged } from "@/lib/useDeadlinesChanged";

export default function DeadlineListPage() {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [excludedTypes, setExcludedTypes] = useState(() => new Set());
  const [sortOrder, setSortOrder] = useState("asc");
  const { types } = useDeadlineTypes();

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/deadlines");
    const data = await res.json();
    if (!res.ok) {
      console.error(data.error);
      setDeadlines([]);
    } else {
      setDeadlines(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useDeadlinesChanged(load);

  const handleDelete = async (id) => {
    if (!confirm("この締め切りを削除しますか？")) return;
    await fetch(`/api/deadlines/${id}`, { method: "DELETE" });
    if (editing?.id === id) setEditing(null);
    load();
    notifyDeadlinesChanged();
  };

  const handleSaved = () => {
    setEditing(null);
    load();
    notifyDeadlinesChanged();
  };

  const visibleDeadlines = deadlines
    .filter((d) => !excludedTypes.has(d.type))
    .sort((a, b) => {
      const diff = new Date(a.deadline_date) - new Date(b.deadline_date);
      return sortOrder === "asc" ? diff : -diff;
    });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">締め切り一覧</h1>
        <p className="mt-1 text-sm text-gray-500">
          ES・アンケートなど就活の締め切りを管理
        </p>
      </div>

      <FilterBar
        types={types}
        excluded={excludedTypes}
        onExcludedChange={setExcludedTypes}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {loading ? (
        <p className="text-center text-sm text-gray-400">読み込み中…</p>
      ) : deadlines.length === 0 ? (
        <p className="rounded-2xl bg-white py-12 text-center text-sm text-gray-400 shadow-card">
          締め切りはまだありません
        </p>
      ) : visibleDeadlines.length === 0 ? (
        <p className="rounded-2xl bg-white py-12 text-center text-sm text-gray-400 shadow-card">
          選択した種別の締め切りはありません
        </p>
      ) : (
        <div className="space-y-3">
          {visibleDeadlines.map((d) => (
            <DeadlineCard
              key={d.id}
              deadline={d}
              types={types}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {editing && (
        <Modal title="締め切りを編集" onClose={() => setEditing(null)}>
          <DeadlineForm
            editing={editing}
            onSave={handleSaved}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </main>
  );
}
