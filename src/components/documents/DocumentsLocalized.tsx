"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronRight, ExternalLink, FileText, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { DocumentRecord } from "@/lib/document-data";
import { documentsUi, localizedDocument, localizedCategory } from "@/lib/documents-i18n";

type Props = { documents: DocumentRecord[]; slug?: string };
export default function DocumentsLocalized({ documents, slug }: Props) {
 const {locale} = useLocale();
 const t = documentsUi[locale];
 const [query,setQuery] = useState("");
 const [category,setCategory] = useState("");
 const items = useMemo(() => documents.map(d=>localizedDocument(d,locale)),[documents,locale]);
 const categories = useMemo(() => Array.from(new Set(documents.map(d=>d.category))),[documents]);
 const filtered = useMemo(() => {
   const q=query.toLocaleLowerCase(locale).trim();
   return items.filter(d=>(!category || documents.find(x=>x.slug===d.slug)?.category===category) &&
     `${d.title} ${d.description} ${d.category} ${documents.find(x=>x.slug===d.slug)?.title ?? ""}`.toLocaleLowerCase(locale).includes(q));
 },[items,category,query,locale,documents]);
 const current = slug ? items.find(d=>d.slug===slug) : undefined;
 const detail = !!slug;
 return <div className="min-h-screen bg-[#f5f7fb] text-slate-900"><Header/><main>
  <section className="bg-[#204774] px-5 py-14 text-white sm:px-8 sm:py-20"><div className="mx-auto max-w-7xl">
   <nav aria-label={t.home} className="mb-6 flex flex-wrap items-center gap-2 text-sm text-blue-100"><Link href="/" className="hover:underline">{t.home}</Link><ChevronRight size={16}/>{detail?<><Link href="/documents" className="hover:underline">{t.documents}</Link><ChevronRight size={16}/><span className="text-white" aria-current="page">{current?.category}</span></>:<span className="text-white" aria-current="page">{t.documents}</span>}</nav>
   <p className="text-sm font-semibold uppercase tracking-widest text-[#d5b780]">{detail?current?.category:t.eyebrow}</p>
   <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl">{detail?current?.title:t.heading}</h1>
   {!detail&&<p className="mt-5 max-w-2xl leading-7 text-blue-100">{t.intro}</p>}
  </div></section>
  {detail && current ? <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
   <div className="space-y-6"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-3"><FileText size={25} className="text-[#204774]"/><h2 className="text-2xl font-bold text-[#204774]">{t.description}</h2></div><p className="mt-5 leading-7 text-slate-700">{current.description}</p><p className="mt-5 text-sm leading-6 text-slate-500">{t.sourceNote}</p></section><Link href="/documents" className="inline-flex items-center gap-2 font-semibold text-[#204774] hover:underline"><ArrowLeft size={18}/>{t.allDocs}</Link></div>
   <aside className="lg:self-start"><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-[#204774]">{t.source}</h2><p className="mt-3 text-sm text-slate-600">{t.pageFormat} · {t.sourceStatus}</p><a href={current.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#204774] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-900">{t.sourceLink}<ExternalLink size={16}/></a><p className="mt-4 text-xs leading-5 text-slate-500">{t.sourceCaution}</p></div></aside>
  </div> : <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
   <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_280px]"><label className="relative block"><span className="mb-2 block text-sm font-semibold text-[#204774]">{t.search}</span><Search size={19} aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.placeholder} className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 outline-none focus:border-blue-700"/></label><label className="block"><span className="mb-2 block text-sm font-semibold text-[#204774]">{t.category}</span><select value={category} onChange={e=>setCategory(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-700"><option value="">{t.all}</option>{categories.map(c=><option key={c} value={c}>{localizedCategory(c,locale)}</option>)}</select></label></div>
   <p className="my-6 text-sm text-slate-500" aria-live="polite">{t.found}: {filtered.length} {t.of} {documents.length}</p>
   {filtered.length?<div className="grid gap-4 md:grid-cols-2">{filtered.map(d=><article key={d.slug} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#9b773f]"><FileText size={16}/>{d.category}</div><h2 className="mt-4 text-xl font-bold leading-snug text-[#204774]">{d.title}</h2><p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{d.description}</p><div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4"><span className="text-xs text-slate-500">{t.pageFormat}</span><Link href={`/documents/${d.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-[#204774] hover:underline">{t.more}<ArrowUpRight size={17}/></Link></div></article>)}</div>:<div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center text-slate-500">{t.empty}</div>}
   <p className="mt-9 text-xs leading-6 text-slate-500">{t.disclaimer}</p>
  </section>}
 </main><Footer/></div>;
}
