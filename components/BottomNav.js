"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function ListIcon({ active }) {
  return (
    <svg
      className={`h-5 w-5 ${active ? "text-accent" : "text-gray-500"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75v-.008zm0 5.25h.007v.008H3.75v-.008z"
      />
    </svg>
  );
}

function CalendarIcon({ active }) {
  return (
    <svg
      className={`h-5 w-5 ${active ? "text-accent" : "text-gray-500"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}

function SettingsIcon({ active }) {
  return (
    <svg
      className={`h-5 w-5 ${active ? "text-accent" : "text-gray-500"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg
      className="h-5 w-5 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-6 w-6 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function NavLink({ href, active, icon, label }) {
  return (
    <Link href={href} className="flex flex-1 flex-col items-center gap-0.5 py-1.5">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          active ? "bg-blue-50" : ""
        }`}
      >
        {icon}
      </span>
      <span className={`text-[10px] ${active ? "font-medium text-accent" : "text-gray-500"}`}>
        {label}
      </span>
    </Link>
  );
}

export default function BottomNav({ onAddClick }) {
  const pathname = usePathname();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto flex w-full max-w-md items-center justify-around rounded-full bg-white px-2 py-2 shadow-lg ring-1 ring-black/5">
        <NavLink
          href="/"
          active={pathname === "/"}
          icon={<ListIcon active={pathname === "/"} />}
          label="リスト"
        />
        <NavLink
          href="/calendar"
          active={pathname === "/calendar"}
          icon={<CalendarIcon active={pathname === "/calendar"} />}
          label="カレンダー"
        />
        <button
          type="button"
          onClick={onAddClick}
          aria-label="締め切りを追加"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-md transition hover:bg-accent-hover"
        >
          <PlusIcon />
        </button>
        <NavLink
          href="/settings"
          active={pathname === "/settings"}
          icon={<SettingsIcon active={pathname === "/settings"} />}
          label="設定"
        />
        <button
          type="button"
          className="flex flex-1 cursor-default flex-col items-center gap-0.5 py-1.5"
          tabIndex={-1}
        >
          <span className="flex h-8 w-8 items-center justify-center">
            <PersonIcon />
          </span>
          <span className="text-[10px] text-gray-400">マイページ</span>
        </button>
      </div>
    </nav>
  );
}
