import type {Metadata} from "next";
import {notFound,redirect} from "next/navigation";
import {adminPrincipal,correctAdminHome} from "@/lib/admin-session";
import DocumentEditor from "@/components/admin/DocumentEditor";
export const metadata:Metadata={title:"Документы · кабинет подразделения",robots:{index:false,follow:false}};
export default async function Page(){
  if(process.env.NODE_ENV!=="development")notFound();
  const u=await adminPrincipal();if(!u)redirect("/admin/login");
  if(u.role!=="faculty"&&u.role!=="department")redirect(correctAdminHome(u.role));
  return <DocumentEditor back={`/admin/${u.role}`}/>;
}
