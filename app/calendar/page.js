import Header from "@/components/Header";
import CalendarPageClient from "@/components/CalendarPageClient";

export default function CalendarPage() {
  return (
    <>
      <Header activeTab="calendar" />
      <CalendarPageClient />
    </>
  );
}
