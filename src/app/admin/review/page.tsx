import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EditorialDemo from "@/components/admin/EditorialDemo";
import { requireAdminRole, adminAccessEnabled } from "@/lib/admin-session";
export const metadata: Metadata = { title: "ЦЦР · Проверка новостей — БГУ", robots: { index: false, follow: false } };
export default async function CCRReviewPage() {
  if (!adminAccessEnabled()) notFound();
  await requireAdminRole("ccr");
  return <EditorialDemo role="review" />;
}
