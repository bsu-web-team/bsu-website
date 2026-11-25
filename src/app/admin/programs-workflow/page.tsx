import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { adminPrincipal, correctAdminHome } from "@/lib/admin-session";
import ProgramEditor from "@/components/admin/ProgramEditor";
export const metadata: Metadata = {title:"Программы · кабинет подразделения",robots:{index:false,follow:false}};
export default async function Page(){
  if(process.env.NODE_ENV!=="development")notFound();
  const user=await adminPrincipal();if(!user)redirect("/admin/login");
  if(user.role!=="faculty"&&user.role!=="department")redirect(correctAdminHome(user.role));
  return <ProgramEditor back={`/admin/${user.role}`}/>;
}
