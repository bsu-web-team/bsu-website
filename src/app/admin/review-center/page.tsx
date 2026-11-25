import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-session";
import UnifiedApprovals from "@/components/admin/UnifiedApprovals";

export const metadata: Metadata = { title: "Согласование материалов · ЦЦР БГУ", robots: { index: false, follow: false } };
export default async function ReviewCenterPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  await requireAdminRole("ccr");
  return <UnifiedApprovals />;
}
