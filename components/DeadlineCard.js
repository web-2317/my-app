import { colorForType } from "@/lib/constants";
import { daysUntil, daysUntilLabel, formatDate } from "@/lib/dates";
import TypeBadge from "./TypeBadge";

export default function DeadlineCard({ deadline, types, onEdit, onDelete }) {
  const days = daysUntil(deadline.deadline_date);
  const urgent = days >= 0 && days <= 7;
  const borderClass = colorForType(types, deadline.type).border;

  return (
    <article
      className={`rounded-xl border border-gray-100 border-t-4 bg-white p-5 shadow-card ${borderClass}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-xs font-medium ${urgent ? "text-red-500" : "text-accent"}`}
          >
            {formatDate(deadline.deadline_date)} · {daysUntilLabel(deadline.deadline_date)}
          </p>
          <h3 className="mt-1 text-lg font-bold text-gray-900">
            {deadline.company_name}
          </h3>
        </div>
        <TypeBadge type={deadline.type} types={types} />
      </div>
      {deadline.memo && (
        <p className="mb-4 text-sm leading-relaxed text-gray-500">
          {deadline.memo}
        </p>
      )}
      <div className="flex gap-2 border-t border-gray-50 pt-3">
        <button
          type="button"
          onClick={() => onEdit(deadline)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:border-accent hover:text-accent"
        >
          編集
        </button>
        <button
          type="button"
          onClick={() => onDelete(deadline.id)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:border-red-300 hover:text-red-500"
        >
          削除
        </button>
      </div>
    </article>
  );
}
