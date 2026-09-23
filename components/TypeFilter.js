"use client";

// 種別チェックボックスでの絞り込み UI
// excluded: 非表示にする種別名の Set（初期値は空 = 全種別表示）
export default function TypeFilter({ types, excluded, onChange }) {
  if (types.length === 0) return null;

  const allShown = excluded.size === 0;

  const toggle = (name) => {
    const next = new Set(excluded);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    onChange(next);
  };

  const toggleAll = () => {
    onChange(allShown ? new Set(types.map((t) => t.name)) : new Set());
  };

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-card">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">種別で絞り込む</p>
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs text-accent hover:underline"
        >
          {allShown ? "全解除" : "全選択"}
        </button>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {types.map((t) => (
          <label
            key={t.id}
            className="flex items-center gap-1.5 text-sm text-gray-700"
          >
            <input
              type="checkbox"
              checked={!excluded.has(t.name)}
              onChange={() => toggle(t.name)}
              className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
            />
            {t.name}
          </label>
        ))}
      </div>
    </section>
  );
}
