export const instant = false;
// BSU Integrated Content v1
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import { allEntries,entryFor } from "@/lib/integrated-loader";
import { getArchiveMaterial } from "@/lib/backend/content";
import IntegratedArticle from "@/components/integrated/IntegratedArticle";
const section="continuing-education" as const; type Props={params:Promise<{id:string}>};
export function generateStaticParams(){return allEntries.filter(e=>e.section===section).flatMap(e=>[...new Set([e.id,...Object.values(e.variants)])].map(id=>({id})));}
export const metadata={robots:{index:false,follow:false}};
export default async function Page({params}:Props){const {id}=await params;const entry=entryFor(section,id);if(!entry)notFound();const raw=await getArchiveMaterial(id);if(!raw)notFound();return <div className="min-h-screen bg-[#f5f7fa] text-slate-900"><Header/><IntegratedArticle data={raw} entry={entry} id={id} section={section}/><Footer/></div>;}

