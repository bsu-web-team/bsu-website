import { notFound } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-session";
import NewsEditorWorkspace from "@/components/admin/NewsEditorWorkspace";
export const metadata = { title: "ЦЦР — согласование новостей", robots: { index: false, follow: false } };
export default async function EditorialReviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  await requireAdminRole("ccr");
  return <NewsEditorWorkspace review />;
}
