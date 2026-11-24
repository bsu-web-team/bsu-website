import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EditorialDemo from "@/components/admin/EditorialDemo";
export const metadata: Metadata = { title: "Кабинет кафедры — БГУ", robots: { index: false, follow: false } };
export default function DepartmentAdminPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <EditorialDemo role="department" />;
}
