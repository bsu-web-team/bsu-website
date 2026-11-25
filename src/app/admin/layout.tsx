import AdminLogout from "@/components/admin/AdminLogout";
import AdminQuickNav from "@/components/admin/AdminQuickNav";
import { adminPrincipal } from "@/lib/admin-session";
export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const principal = await adminPrincipal();
  return <>{principal && principal.role !== "faculty" && <AdminQuickNav role={principal.role} />}{children}<AdminLogout /></>;
}
