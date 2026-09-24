import DeadlineListPage from "@/components/DeadlineListPage";
import { getAllDeadlines, getAllTypes } from "@/lib/db";

// サーバー側で初回データを取得して渡すことで、クライアントの fetch ウォーターフォール
// （HTML→JS→hydrate→useEffect→fetch→DB）を初回描画から取り除く
export default async function HomePage() {
  const [deadlines, types] = await Promise.all([getAllDeadlines(), getAllTypes()]);
  return <DeadlineListPage initialDeadlines={deadlines} initialTypes={types} />;
}
