"use client";

import { useState } from "react";
import { TYPE_COLOR_PALETTE, getTypeColor } from "@/lib/constants";

const emptyForm = { name: "", color: TYPE_COLOR_PALETTE[0].key };

export default function TypeManager({ types, onChanged }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({ name: t.name, color: t.color });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editingId ? `/api/types/${editingId}` : "/api/types";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "保存に失敗しました");
      }
      resetForm();
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (t) => {
    if (!confirm(`「${t.name}」を削除しますか？`)) return;
    const res = await fetch(`/api/types/${t.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "削除に失敗しました");
      return;
    }
    if (editingId === t.id) resetForm();
    onChanged();
  };

  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-gray-700"
      >
        種別を管理
        <span className="text-gray-400">{open ? "－" : "＋"}</span>
      </button>

      {open && (
        <div className="border-t border-gray-50 px-5 py-4">
          {types.length > 0 && (
            <ul className="mb-4 space-y-2">
              {types.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-2 text-sm text-gray-700"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${getTypeColor(t.color).dot}`}
                    />
                    {t.name}
                  </span>
                  <span className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(t)}
                      className="text-xs text-gray-500 hover:text-accent"
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t)}
                      className="text-xs text-gray-500 hover:text-red-500"
                    >
                      削除
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                種別名
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                placeholder="例: 適性検査"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                色
              </label>
              <div className="flex flex-wrap gap-2">
                {TYPE_COLOR_PALETTE.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    title={c.label}
                    onClick={() => setForm((p) => ({ ...p, color: c.key }))}
                    className={`h-6 w-6 rounded-full ${c.dot} ${
                      form.color === c.key
                        ? "ring-2 ring-accent ring-offset-2"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-white transition hover:bg-accent-hover disabled:opacity-50"
              >
                {saving ? "保存中…" : editingId ? "更新する" : "追加する"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50"
                >
                  キャンセル
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
