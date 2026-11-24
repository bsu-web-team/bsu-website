import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EditorialDemo from "@/components/admin/EditorialDemo";
export const metadata: Metadata = { title: "Кабинет факультета — БГУ", robots: { index: false, follow: false } };
export default function FacultyAdminPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <EditorialDemo role="faculty" />;
}
