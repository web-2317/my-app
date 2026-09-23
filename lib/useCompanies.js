"use client";

import { useCallback, useEffect, useState } from "react";

// 企業名のオートコンプリート候補一覧を取得するフック
export function useCompanies() {
  const [companies, setCompanies] = useState([]);

  const reload = useCallback(async () => {
    const res = await fetch("/api/companies");
    const data = await res.json();
    if (res.ok) setCompanies(data);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { companies, reload };
}
