import ContentGroups from "@/components/interior/ContentGroups";
import Link from "next/link";
import Image from "next/image";
import MigrationLabel from "@/components/pages/MigrationLabel";
type Related={label:string;href:string};
type Block={kind:string;text?:string;href?:string;rows?:string[][];links?:Related[]};
export type Material={title:string;lang:string;blocks:Block[]};
function Links({items}:{items:Related[]}) { return items.length>0?<div className="mt-4 grid gap-2 sm:grid-cols-2" data-bsu-motion-list>{items.map((a,i)=>a.href.startsWith('/')?<Link key={i} href={a.href} className="min-w-0 break-words rounded-xl border border-slate-200 p-3 font-semibold text-[#102b4e] hover:border-[#b5945e]" data-bsu-motion-item>{a.label} ↗</Link>:<a key={i} href={a.href} rel="noopener noreferrer" className="min-w-0 break-words rounded-xl border border-slate-200 p-3 text-[#102b4e]" data-bsu-motion-item>{a.label} ↗</a>)}</div>:null; }
export default function MaterialBlocks({data,compact=false}:{data:Material;compact?:boolean}) {return <div lang={data.lang} className="space-y-4 min-w-0">
<p className="rounded-xl border border-[#dfbd7e] bg-white p-4 text-sm text-slate-600" data-bsu-motion-item><MigrationLabel name="source"/> <MigrationLabel name="original"/>: {data.lang}</p>
<ContentGroups blocks={data.blocks} compact={compact}>{data.blocks.map((b,i)=>{
 if(b.kind==='heading')return <div key={i}><h2 className="mt-8 break-words text-2xl font-bold text-[#102b4e]" data-bsu-motion-item>{b.text}</h2><Links items={b.links??[]}/></div>;
 if(b.kind==='image'&&b.href)return <figure key={i} className="rounded-2xl border border-slate-200 bg-white p-4" data-bsu-motion-item><Image src={b.href} alt={b.text||''} width={1200} height={800} unoptimized className="mx-auto h-auto max-h-[550px] w-auto max-w-full object-contain"/>{b.text&&<figcaption className="mt-3 text-sm text-slate-500">{b.text}</figcaption>}</figure>;
 if(b.kind==='table')return <div key={i} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4"><div className="overflow-x-auto"><table className="w-full border-collapse text-sm"><tbody>{b.rows?.map((row,j)=><tr key={j} data-bsu-motion-item>{row.map((cell,k)=><td key={k} className="min-w-24 border border-slate-200 p-3 align-top break-words">{cell}</td>)}</tr>)}</tbody></table></div><Links items={b.links??[]}/></div>;
 return <div key={i} className="min-w-0 break-words rounded-xl border border-slate-200 bg-white p-4 sm:p-5" data-bsu-motion-item>{b.text&&<p className="leading-7">{b.kind==='bullet'?'• ':''}{b.text}</p>}<Links items={b.links??[]}/></div>;
})}</ContentGroups></div>}
