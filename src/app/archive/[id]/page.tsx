// BSU Full Content generated
import { notFound } from "next/navigation";
import { archiveLoaders } from "@/lib/archive-loader";
import ArchiveArticle from "@/components/archive/ArchiveArticle";
type Props={params:Promise<{id:string}>};
export function generateStaticParams(){return Object.keys(archiveLoaders).map(id=>({id}));}
async function getData(id:string){if(!Object.hasOwn(archiveLoaders,id))notFound();return archiveLoaders[id]();}
export async function generateMetadata({params}:Props){const data=await getData((await params).id);return {title:data.title,robots:{index:false,follow:false}};}
export default async function Page({params}:Props){const data=await getData((await params).id);return <ArchiveArticle data={data}/>;}
