import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminPrincipal, correctAdminHome } from "@/lib/admin-session";
import StaffEditor from "@/components/admin/StaffEditor";
import { redirect } from "next/navigation";

export const metadata: Metadata={title:"Сотрудники · кабинет подразделения",robots:{index:false,follow:false}};
export default async function Page(){
 if(process.env.NODE_ENV!=="development")notFound();
 const principal=await adminPrincipal();
 if(!principal)redirect("/admin/login");
 if(principal.role!=="faculty" && principal.role!=="department")redirect(correctAdminHome(principal.role));
 return <StaffEditor/>;
}
