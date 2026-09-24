import CalendarPageClient from "@/components/CalendarPageClient";
import { getAllDeadlines, getAllTypes } from "@/lib/db";

export default async function CalendarPage() {
  const [deadlines, types] = await Promise.all([getAllDeadlines(), getAllTypes()]);
  return <CalendarPageClient initialDeadlines={deadlines} initialTypes={types} />;
}
