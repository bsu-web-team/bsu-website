import type {Metadata} from "next";
import {notFound} from "next/navigation";
import ApprovedDocuments from "@/components/documents/ApprovedDocuments";
export const metadata:Metadata={title:"Одобренные документы · тест БГУ",robots:{index:false,follow:false}};
export default function Page(){
  if(process.env.NODE_ENV!=="development")notFound();
  return <ApprovedDocuments/>;
}
