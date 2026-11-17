"use client";
import { archiveSourceHref } from "@/lib/archive-source-link";
import ArchiveLabel from "@/components/archive/ArchiveLabel";

import Link from "next/link";
import Image from "next/image";
import { safeNewsImage } from "@/lib/news-filter";
import { ArrowLeft, CalendarDays } from "lucide-react";
import type { NewsRecord } from "@/lib/news-data";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatLocalizedNewsDate, localizeNews, newsUi } from "@/lib/news-i18n";
export default function NewsArticleLocalized({item}:{item:NewsRecord}){
 const {locale}=useLocale();const t=newsUi[locale];const x=localizeNews(item,locale);const photo=safeNewsImage(x.imageUrl);
 return <main><section className="bg-[#102b4e] px-5 py-14 text-white sm:px-8"><div className="mx-auto max-w-4xl"><div className="flex flex-wrap gap-3 text-sm text-blue-100"><Link href="/" className="hover:underline">{t.home}</Link><span>/</span><Link href="/news" className="hover:underline">{t.news}</Link></div><p className="mt-8 text-sm font-bold uppercase tracking-wider text-[#d5b780]">{t.categories[x.category]}</p><h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">{x.title}</h1><p className="mt-6 flex items-center gap-2 text-blue-100"><CalendarDays size={18}/>{formatLocalizedNewsDate(x.date,locale)}</p></div></section><section className="mx-auto max-w-4xl px-5 py-12 sm:px-8"><article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">{photo&&<div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-xl"><Image src={photo} alt="" fill unoptimized sizes="(max-width: 896px) 100vw, 896px" className="object-cover"/></div>}<p className="text-lg leading-8 text-slate-700">{x.excerpt}</p>{x.content?.length? <div className="mt-6 space-y-4 leading-8 text-slate-700">{x.content.map((paragraph,index)=><p key={index} className="whitespace-pre-line break-words">{paragraph}</p>)}</div>:<p className="mt-6 text-sm text-slate-500">{t.fullMissing}</p>}<a href={archiveSourceHref(x.sourceUrl)} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#102b4e] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900"><ArchiveLabel name="catalog" /></a></article><Link href="/news" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#102b4e] hover:underline"><ArrowLeft size={18}/>{t.allNews}</Link></section></main>;
}
