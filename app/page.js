import Header from "@/components/Header";
import DeadlineListPage from "@/components/DeadlineListPage";

export default function HomePage() {
  return (
    <>
      <Header activeTab="list" />
      <DeadlineListPage />
    </>
  );
}
