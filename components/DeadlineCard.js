import { daysUntil, daysUntilLabel, formatDateShort } from "@/lib/dates";
import TypeBadge from "./TypeBadge";

export default function DeadlineCard({ deadline, types, onEdit, onDelete }) {
  const days = daysUntil(deadline.deadline_date);
  const urgent = days >= 0 && days <= 7;
  const overdue = days < 0;

  return (
    <article className="relative rounded-3xl bg-white p-4 shadow-card">
      <div className="absolute right-4 top-4">
        <TypeBadge type={deadline.type} types={types} />
      </div>

      <h3 className="pr-20 text-lg font-bold leading-snug text-gray-900">
        {deadline.company_name}
      </h3>

      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="min-w-0 flex-1 truncate text-xs text-gray-400">
          {deadline.memo || "メモなし"}
        </p>
        <div className="shrink-0 text-right">
          <p
            className={`text-sm font-bold ${
              overdue ? "text-gray-400" : urgent ? "text-red-500" : "text-gray-900"
            }`}
          >
            {formatDateShort(deadline.deadline_date)}
          </p>
          <p
            className={`text-[11px] ${
              overdue ? "text-gray-400" : urgent ? "text-red-500" : "text-accent"
            }`}
          >
            {daysUntilLabel(deadline.deadline_date)}
            {urgent && !overdue ? " 🔥" : ""}
          </p>
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-3 border-t border-gray-50 pt-2">
        <button
          type="button"
          onClick={() => onEdit(deadline)}
          className="text-xs text-gray-400 transition hover:text-accent"
        >
          編集
        </button>
        <button
          type="button"
          onClick={() => onDelete(deadline.id)}
          className="text-xs text-gray-400 transition hover:text-red-500"
        >
          削除
        </button>
      </div>
    </article>
  );
}
