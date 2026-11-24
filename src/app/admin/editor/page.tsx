import { notFound } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-session";
import NewsEditorWorkspace from "@/components/admin/NewsEditorWorkspace";
export const metadata = { title: "Редакция новостей — БГУ", robots: { index: false, follow: false } };
export default async function EditorPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  await requireAdminRole("news_editor");
  return <NewsEditorWorkspace />;
}
