"use client";

import { useCallback, useEffect, useState } from "react";

// 締め切り種別一覧をサーバーから取得するフック（一覧・カレンダー・フォームで共通利用）
export function useDeadlineTypes() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const res = await fetch("/api/types");
    const data = await res.json();
    if (res.ok) setTypes(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { types, loading, reload };
}
