import { colorForType } from "@/lib/constants";

export default function TypeBadge({ type, types }) {
  const color = colorForType(types, type);
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${color.badge}`}
    >
      {type}
    </span>
  );
}
