"use client";

import { useCallback, useEffect, useState } from "react";
import DeadlineCard from "./DeadlineCard";
import DeadlineForm from "./DeadlineForm";
import TypeFilter from "./TypeFilter";
import TypeManager from "./TypeManager";
import { useDeadlineTypes } from "@/lib/useDeadlineTypes";

export default function DeadlineListPage() {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [excludedTypes, setExcludedTypes] = useState(() => new Set());
  const { types, reload: reloadTypes } = useDeadlineTypes();

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

  const handleDelete = async (id) => {
    if (!confirm("この締め切りを削除しますか？")) return;
    await fetch(`/api/deadlines/${id}`, { method: "DELETE" });
    if (editing?.id === id) setEditing(null);
    load();
  };

  const handleSaved = () => {
    setEditing(null);
    setShowForm(false);
    load();
  };

  const visibleDeadlines = deadlines.filter((d) => !excludedTypes.has(d.type));

  const upcoming = visibleDeadlines.filter((d) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(d.deadline_date + "T00:00:00") >= today;
  });

  const past = visibleDeadlines.filter((d) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(d.deadline_date + "T00:00:00") < today;
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">締め切り一覧</h1>
        <p className="mt-1 text-sm text-gray-500">
          ES・アンケートなど就活の締め切りを管理
        </p>
        {!showForm && !editing && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-4 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover"
          >
            ＋ 締め切りを追加
          </button>
        )}
      </div>

      {(showForm || editing) && (
        <div className="mb-8">
          <DeadlineForm
            editing={editing}
            showCancel={showForm && !editing}
            onSave={handleSaved}
            onCancel={() => {
              setEditing(null);
              setShowForm(false);
            }}
          />
        </div>
      )}

      <div className="mb-8 space-y-4">
        <TypeManager
          types={types}
          onChanged={() => {
            reloadTypes();
            load();
          }}
        />
        <TypeFilter
          types={types}
          excluded={excludedTypes}
          onChange={setExcludedTypes}
        />
      </div>

      {loading ? (
        <p className="text-center text-sm text-gray-400">読み込み中…</p>
      ) : deadlines.length === 0 ? (
        <p className="rounded-xl bg-white py-12 text-center text-sm text-gray-400 shadow-card">
          締め切りはまだありません
        </p>
      ) : visibleDeadlines.length === 0 ? (
        <p className="rounded-xl bg-white py-12 text-center text-sm text-gray-400 shadow-card">
          選択した種別の締め切りはありません
        </p>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-4 text-center text-lg font-bold text-gray-900">
                今後の締め切り
              </h2>
              <div className="space-y-4">
                {upcoming.map((d) => (
                  <DeadlineCard
                    key={d.id}
                    deadline={d}
                    types={types}
                    onEdit={(item) => {
                      setShowForm(false);
                      setEditing(item);
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="mb-4 text-center text-lg font-bold text-gray-400">
                期限切れ
              </h2>
              <div className="space-y-4 opacity-60">
                {past.map((d) => (
                  <DeadlineCard
                    key={d.id}
                    deadline={d}
                    types={types}
                    onEdit={(item) => {
                      setShowForm(false);
                      setEditing(item);
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
