import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-session";
import UnitProfileReview from "@/components/admin/UnitProfileReview";
export const metadata: Metadata = {title:"ЦЦР · Согласование сведений подразделений",robots:{index:false,follow:false}};
export default async function UnitReviewPage(){
  if(process.env.NODE_ENV!=="development") notFound();
  await requireAdminRole("ccr");
  return <UnitProfileReview/>;
}
