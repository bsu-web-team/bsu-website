import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EditorialDemo from "@/components/admin/EditorialDemo";
import { requireAdminRole, adminAccessEnabled } from "@/lib/admin-session";
export const metadata: Metadata = { title: "Кабинет факультета — БГУ", robots: { index: false, follow: false } };
export default async function FacultyAdminPage() {
  if (!adminAccessEnabled()) notFound();
  const principal = await requireAdminRole("faculty");
  return <EditorialDemo role="faculty" lockedSlug={principal.facultySlug ?? ""} />;
}
