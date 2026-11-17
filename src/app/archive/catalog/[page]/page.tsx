// BSU Full Content generated
import { notFound } from "next/navigation";
import ArchiveCatalog,{pageSize} from "@/components/archive/ArchiveCatalog";
import { archiveIndex } from "@/lib/archive-index";
const total=Math.ceil(archiveIndex.length/pageSize);
export function generateStaticParams(){return Array.from({length:total},(_,i)=>({page:String(i+1)}));}
export default async function Page({params}:{params:Promise<{page:string}>}){const s=(await params).page;const p=Number(s);if(!/^\d+$/.test(s)||!Number.isInteger(p)||p<1||p>total)notFound();return <ArchiveCatalog page={p}/>;}
