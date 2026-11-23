import { getDocuments } from '@/lib/backend/data';
import type { Metadata } from "next";
import DocumentsLocalized from "@/components/documents/DocumentsLocalized";


export const metadata: Metadata = {title:"Документы | БГУ",description:"Каталог нормативных и информационных документов Бишкекского государственного университета."};
export default async function DocumentsPage(){const documents=await getDocuments();return <DocumentsLocalized documents={documents}/>;}
