import { TYPE_BADGE_COLORS } from "@/lib/constants";

export default function TypeBadge({ type }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${TYPE_BADGE_COLORS[type] || "bg-gray-100 text-gray-600"}`}
    >
      {type}
    </span>
  );
}
