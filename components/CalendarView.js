"use client";

import { useMemo, useState } from "react";
import { buildMonthGrid } from "@/lib/dates";
import { colorForType } from "@/lib/constants";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export default function CalendarView({ deadlines, types }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const byDate = useMemo(() => {
    return deadlines.reduce((acc, d) => {
      if (!acc[d.deadline_date]) acc[d.deadline_date] = [];
      acc[d.deadline_date].push(d);
      return acc;
    }, {});
  }, [deadlines]);

  const todayKey = now.toISOString().slice(0, 10);
  const cells = buildMonthGrid(year, month);

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          {year}年{month + 1}月
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-white"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => {
              setYear(now.getFullYear());
              setMonth(now.getMonth());
            }}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-white"
          >
            今月
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-white"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card">
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="py-2 text-center text-xs font-semibold text-gray-400"
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((cell, i) => {
            const events = cell.dateKey ? byDate[cell.dateKey] || [] : [];
            const isToday = cell.dateKey === todayKey;
            return (
              <div
                key={`${cell.dateKey ?? "x"}-${i}`}
                className={`min-h-[88px] border-b border-r border-gray-50 p-1.5 ${
                  cell.otherMonth ? "bg-gray-50/50" : "bg-white"
                } ${isToday ? "ring-1 ring-inset ring-accent" : ""}`}
              >
                <span
                  className={`text-xs ${
                    isToday
                      ? "font-bold text-accent"
                      : cell.otherMonth
                        ? "text-gray-300"
                        : "text-gray-500"
                  }`}
                >
                  {cell.day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      title={`${ev.company_name} (${ev.type})`}
                      className={`truncate rounded px-1 py-0.5 text-[10px] leading-tight ${
                        colorForType(types, ev.type).badge
                      }`}
                    >
                      {ev.company_name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
        {types.map((t) => (
          <span key={t.id} className="flex items-center gap-1">
            <span
              className={`inline-block rounded px-1.5 py-0.5 ${colorForType(types, t.name).badge}`}
            >
              {t.name}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
