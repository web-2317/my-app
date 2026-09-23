// 種別に設定できる色のプリセット
// 自由なカラーピッカーではなくプリセットから選ばせることで、
// Tailwind のクラス名を静的に固定でき（purge 対策）、デザインの一貫性も保てる
export const TYPE_COLOR_PALETTE = [
  { key: "blue", label: "ブルー", badge: "bg-blue-50 text-accent", border: "border-t-accent", dot: "bg-accent" },
  { key: "orange", label: "オレンジ", badge: "bg-orange-50 text-orange-600", border: "border-t-orange-400", dot: "bg-orange-400" },
  { key: "pink", label: "ピンク", badge: "bg-pink-50 text-pink-600", border: "border-t-pink-400", dot: "bg-pink-400" },
  { key: "purple", label: "パープル", badge: "bg-purple-50 text-purple-600", border: "border-t-purple-400", dot: "bg-purple-400" },
  { key: "green", label: "グリーン", badge: "bg-green-50 text-green-600", border: "border-t-green-400", dot: "bg-green-400" },
  { key: "yellow", label: "イエロー", badge: "bg-yellow-50 text-yellow-700", border: "border-t-yellow-400", dot: "bg-yellow-400" },
  { key: "teal", label: "ティール", badge: "bg-teal-50 text-teal-600", border: "border-t-teal-400", dot: "bg-teal-400" },
  { key: "gray", label: "グレー", badge: "bg-gray-100 text-gray-600", border: "border-t-gray-400", dot: "bg-gray-400" },
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
