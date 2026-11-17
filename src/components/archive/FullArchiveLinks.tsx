// BSU Full Content generated
import Link from "next/link";
import Label from "@/components/archive/ArchiveLabel";
export default function FullArchiveLinks({items}:{items:{href:string;title:string}[]}){return <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><h2 className="mb-5 text-2xl font-bold text-[#102b4e]"><Label name="links"/></h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-bsu-motion-list>{items.map(p=><Link key={p.href} href={p.href} prefetch={false} data-bsu-motion-item className="rounded-xl border border-slate-200 bg-white p-5 font-semibold text-[#102b4e]">{p.title} ↗</Link>)}</div></section>;}
