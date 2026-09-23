import { colorForType } from "@/lib/constants";

export default function TypeBadge({ type, types }) {
  const color = colorForType(types, type);
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${color.badge}`}
    >
      {type}
    </span>
  );
}
