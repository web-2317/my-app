"use client";

// 種別チェックボックス一覧（FilterBar のダイアログ内で使用）
// excluded: 非表示にする種別名の Set（初期値は空 = 全種別表示）
export default function TypeFilterOptions({ types, excluded, onChange }) {
  if (types.length === 0) {
    return <p className="text-sm text-gray-400">種別が登録されていません</p>;
  }

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
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs text-accent hover:underline"
        >
          {allShown ? "全解除" : "全選択"}
        </button>
      </div>
      <div className="space-y-1">
        {types.map((t) => (
          <label
            key={t.id}
            className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
    </div>
  );
}
