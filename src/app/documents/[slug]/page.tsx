import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocumentsLocalized from "@/components/documents/DocumentsLocalized";
import { documents, getDocumentBySlug } from "@/lib/document-data";

export function generateStaticParams(){return documents.map(d=>({slug:d.slug}));}
export const instant = false;
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const d=await getDocumentBySlug(slug);return {title:d?`${d.title} | БГУ`:"Документ не найден | БГУ",description:d?.description};}
export default async function DocumentPage({params}:Props){const {slug}=await params;const d=await getDocumentBySlug(slug);if(!d)notFound();return <DocumentsLocalized documents={documents} slug={slug}/>;}
