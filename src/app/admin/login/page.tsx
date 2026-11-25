import { notFound, redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { adminPrincipal, correctAdminHome } from "@/lib/admin-session";
export const metadata = { title: "Вход в панель управления — БГУ", robots: { index: false, follow: false } };
export default async function AdminLoginPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  const principal = await adminPrincipal();
  if (principal) redirect(correctAdminHome(principal.role));
  return <AdminLoginForm />;
}
