"use client";

import { useEffect, useState } from "react";
import { useDeadlineTypes } from "@/lib/useDeadlineTypes";

const emptyForm = {
  company_name: "",
  deadline_date: "",
  type: "",
  memo: "",
};

export default function DeadlineForm({ editing, onSave, onCancel, showCancel = false }) {
  const { types } = useDeadlineTypes();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) {
      setForm({
        company_name: editing.company_name,
        deadline_date: editing.deadline_date,
        type: editing.type,
        memo: editing.memo || "",
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [editing]);

  // 種別一覧を取得できたら、未選択（新規追加時）の場合に先頭の種別を初期値にする
  useEffect(() => {
    if (!editing && !form.type && types.length > 0) {
      setForm((prev) => ({ ...prev, type: types[0].name }));
    }
  }, [types, editing, form.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editing ? `/api/deadlines/${editing.id}` : "/api/deadlines";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "保存に失敗しました");
      }
      setForm(emptyForm);
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
        {editing ? "締め切りを編集" : "締め切りを追加"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            企業名
          </label>
          <input
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            required
            placeholder="例: 株式会社サンプル"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              締め切り日
            </label>
            <input
              name="deadline_date"
              type="date"
              value={form.deadline_date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              種別
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {types.length === 0 && <option value="">種別がありません</option>}
              {types.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            メモ
          </label>
          <textarea
            name="memo"
            value={form.memo}
            onChange={handleChange}
            rows={3}
            placeholder="任意"
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-50"
          >
            {saving ? "保存中…" : editing ? "更新する" : "追加する"}
          </button>
          {(editing || showCancel) && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              キャンセル
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
