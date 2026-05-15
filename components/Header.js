import Link from "next/link";

function ListIcon({ active }) {
  return (
    <svg
      className={`h-5 w-5 ${active ? "text-accent" : "text-gray-400"}`}
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
      className={`h-5 w-5 ${active ? "text-accent" : "text-gray-400"}`}
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

function NavTab({ href, active, icon, label }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 px-6 py-3 text-sm transition-colors ${
        active
          ? "border-b-[3px] border-accent text-accent font-medium"
          : "border-b-[3px] border-transparent text-gray-400 hover:text-gray-600"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function Header({ activeTab }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-accent text-sm font-bold text-white">
            D
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            DEADLINE
          </span>
        </Link>
        <p className="hidden text-xs text-gray-400 sm:block">就活締め切り管理</p>
      </div>
      <nav className="mx-auto flex max-w-3xl justify-center border-t border-gray-100">
        <NavTab
          href="/"
          active={activeTab === "list"}
          icon={<ListIcon active={activeTab === "list"} />}
          label="リスト"
        />
        <NavTab
          href="/calendar"
          active={activeTab === "calendar"}
          icon={<CalendarIcon active={activeTab === "calendar"} />}
          label="カレンダー"
        />
      </nav>
    </header>
  );
}
