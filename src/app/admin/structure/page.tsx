import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { adminPrincipal, correctAdminHome } from "@/lib/admin-session";
import StructureWorkspace from "@/components/admin/StructureWorkspace";
export const metadata: Metadata = { title: "БГУ · структура и редакторы", robots: { index: false, follow: false } };
export default async function Page() {
  if (process.env.NODE_ENV !== "development") notFound();
  const p = await adminPrincipal();
  if (!p) redirect("/admin/login");
  if (!["faculty", "department", "ccr"].includes(p.role)) redirect(correctAdminHome(p.role));
  return <StructureWorkspace role={p.role} />;
}
