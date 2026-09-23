"use client";

import { useEffect } from "react";

const EVENT_NAME = "deadlines-changed";

// FAB（グローバル追加モーダル）など、現在のページ外で締め切りが変更されたことを通知する
export function notifyDeadlinesChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

export function useDeadlinesChanged(handler) {
  useEffect(() => {
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, [handler]);
}
