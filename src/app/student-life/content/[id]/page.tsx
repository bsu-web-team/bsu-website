// BSU Integrated Content v1
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import { allEntries,entryFor,contentLoaders } from "@/lib/integrated-loader";
import IntegratedArticle from "@/components/integrated/IntegratedArticle";
const section="student-life" as const; type Props={params:Promise<{id:string}>};
export function generateStaticParams(){return allEntries.filter(e=>e.section===section).flatMap(e=>[...new Set([e.id,...Object.values(e.variants)])].map(id=>({id})));}
export const metadata={robots:{index:false,follow:false}};
export default async function Page({params}:Props){const {id}=await params;const entry=entryFor(section,id);if(!entry||!Object.hasOwn(contentLoaders,id))notFound();const raw=await contentLoaders[id]();return <div className="min-h-screen bg-[#f5f7fa] text-slate-900"><Header/><IntegratedArticle data={raw} entry={entry} id={id} section={section}/><Footer/></div>;}
