import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-session";
import ProgramReview from "@/components/admin/ProgramReview";
export const metadata: Metadata = {title:"ЦЦР · программы",robots:{index:false,follow:false}};
export default async function Page(){
  if(process.env.NODE_ENV!=="development")notFound();
  await requireAdminRole("ccr");return <ProgramReview/>;
}
