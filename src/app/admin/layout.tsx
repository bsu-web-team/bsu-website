import AdminLogout from "@/components/admin/AdminLogout";
export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}<AdminLogout /></>;
}
