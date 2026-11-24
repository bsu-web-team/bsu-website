import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EditorialDemo from "@/components/admin/EditorialDemo";
import { requireAdminRole } from "@/lib/admin-session";
export const metadata: Metadata = { title: "Кабинет кафедры — БГУ", robots: { index: false, follow: false } };
export default async function DepartmentAdminPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  const principal = await requireAdminRole("department");
  return <EditorialDemo role="department" lockedSlug={principal.departmentSlug ?? ""} />;
}
