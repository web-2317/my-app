export function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export function daysUntilLabel(dateStr) {
  const days = daysUntil(dateStr);
  if (days === 0) return "今日";
  if (days > 0) return `あと${days}日`;
  return "期限切れ";
}

export function toDateKey(year, month, day) {
  const m = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${m}-${dd}`;
}

export function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const daysInMonth = last.getDate();
  const cells = [];
  const prevLast = new Date(year, month, 0).getDate();

  for (let i = startPad - 1; i >= 0; i--) {
    cells.push({ day: prevLast - i, otherMonth: true, dateKey: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      otherMonth: false,
      dateKey: toDateKey(year, month, d),
    });
  }
  let filler = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: filler++, otherMonth: true, dateKey: null });
  }
  return cells;
}
