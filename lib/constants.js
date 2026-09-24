// 種別に設定できる色のプリセット
// 自由なカラーピッカーではなくプリセットから選ばせることで、
// Tailwind のクラス名を静的に固定でき（purge 対策）、デザインの一貫性も保てる
export const TYPE_COLOR_PALETTE = [
  { key: "blue", label: "ブルー", badge: "bg-blue-50 text-accent", dot: "bg-accent" },
  { key: "sky", label: "スカイ", badge: "bg-sky-50 text-sky-600", dot: "bg-sky-400" },
  { key: "cyan", label: "シアン", badge: "bg-cyan-50 text-cyan-600", dot: "bg-cyan-400" },
  { key: "teal", label: "ティール", badge: "bg-teal-50 text-teal-600", dot: "bg-teal-400" },
  { key: "emerald", label: "エメラルド", badge: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-400" },
  { key: "green", label: "グリーン", badge: "bg-green-50 text-green-600", dot: "bg-green-400" },
  { key: "lime", label: "ライム", badge: "bg-lime-50 text-lime-700", dot: "bg-lime-400" },
  { key: "yellow", label: "イエロー", badge: "bg-yellow-50 text-yellow-700", dot: "bg-yellow-400" },
  { key: "amber", label: "アンバー", badge: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
  { key: "orange", label: "オレンジ", badge: "bg-orange-50 text-orange-600", dot: "bg-orange-400" },
  { key: "red", label: "レッド", badge: "bg-red-50 text-red-600", dot: "bg-red-400" },
  { key: "rose", label: "ローズ", badge: "bg-rose-50 text-rose-600", dot: "bg-rose-400" },
  { key: "pink", label: "ピンク", badge: "bg-pink-50 text-pink-600", dot: "bg-pink-400" },
  { key: "fuchsia", label: "フクシア", badge: "bg-fuchsia-50 text-fuchsia-600", dot: "bg-fuchsia-400" },
  { key: "purple", label: "パープル", badge: "bg-purple-50 text-purple-600", dot: "bg-purple-400" },
  { key: "violet", label: "バイオレット", badge: "bg-violet-50 text-violet-600", dot: "bg-violet-400" },
  { key: "indigo", label: "インディゴ", badge: "bg-indigo-50 text-indigo-600", dot: "bg-indigo-400" },
  { key: "gray", label: "グレー", badge: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
];

const PALETTE_BY_KEY = Object.fromEntries(TYPE_COLOR_PALETTE.map((c) => [c.key, c]));
const DEFAULT_COLOR_KEY = "gray";

// 色キーからパレット情報を取得（未知のキーはグレーにフォールバック）
export function getTypeColor(colorKey) {
  return PALETTE_BY_KEY[colorKey] || PALETTE_BY_KEY[DEFAULT_COLOR_KEY];
}

// 種別名（deadline.type）から色情報を取得
export function colorForType(types, typeName) {
  const match = types.find((t) => t.name === typeName);
  return getTypeColor(match?.color);
}

// DATABASE_URL 未設定時（開発用フォールバック）の初期種別
export const FALLBACK_TYPES = [
  { id: 1, name: "ES", color: "blue", sort_order: 0 },
  { id: 2, name: "アンケート", color: "orange", sort_order: 1 },
  { id: 3, name: "その他", color: "pink", sort_order: 2 },
];
