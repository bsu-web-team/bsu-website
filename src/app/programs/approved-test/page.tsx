import { notFound } from "next/navigation";
import ApprovedPrograms from "@/components/programs/ApprovedPrograms";
export default function Page(){
 if(process.env.NODE_ENV!=="development")notFound();
 return <ApprovedPrograms/>;
}
