// BSU Integrated Content v1
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {notFound} from "next/navigation";
import SectionContent,{pageSize} from "@/components/integrated/SectionContent";
import {sectionIndex} from "@/lib/integrated-index";
const section="news" as const;const total=Math.ceil(sectionIndex[section].length/pageSize);
export const metadata={robots:{index:false,follow:false}};
export function generateStaticParams(){return Array.from({length:Math.max(0,total-1)},(_,i)=>({page:String(i+2)}));}
export default async function Page({params}:{params:Promise<{page:string}>}){const value=(await params).page;const page=Number(value);if(!/^\d+$/.test(value)||page<2||page>total)notFound();return <div className="min-h-screen bg-[#f5f7fa] text-slate-900"><Header/><main><SectionContent section={section} page={page}/></main><Footer/></div>;}
