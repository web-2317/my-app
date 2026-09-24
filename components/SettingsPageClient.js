"use client";

import TypeManager from "./TypeManager";
import { useDeadlineTypes } from "@/lib/useDeadlineTypes";

export default function SettingsPageClient({ initialTypes }) {
  const { types, reload } = useDeadlineTypes(initialTypes);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="mt-1 text-sm text-gray-500">締め切りの種別を管理します</p>
      </div>
      <TypeManager types={types} onChanged={reload} />
    </main>
  );
}
