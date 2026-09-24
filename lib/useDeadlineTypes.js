"use client";

import { useCallback, useEffect, useState } from "react";

// 締め切り種別一覧を取得するフック（一覧・カレンダー・フォームで共通利用）
// initialTypes を渡した場合（サーバーコンポーネントから初回データを受け取ったページ）は
// マウント時の重複フェッチをスキップする。渡さない場合（モーダル内のフォームなど）は
// 従来通りマウント時にフェッチする。
export function useDeadlineTypes(initialTypes) {
  const [types, setTypes] = useState(initialTypes ?? []);
  const [loading, setLoading] = useState(initialTypes === undefined);

  const reload = useCallback(async () => {
    const res = await fetch("/api/types");
    const data = await res.json();
    if (res.ok) setTypes(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (initialTypes === undefined) reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return { types, loading, reload };
}
