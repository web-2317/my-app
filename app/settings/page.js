import SettingsPageClient from "@/components/SettingsPageClient";
import { getAllTypes } from "@/lib/db";

export default async function SettingsPage() {
  const types = await getAllTypes();
  return <SettingsPageClient initialTypes={types} />;
}
