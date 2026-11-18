"use client";
import Link from "next/link";
import { ArrowUpRight, Newspaper } from "lucide-react";
import type { NewsRecord } from "@/lib/news-data";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { newsV2 } from "@/lib/news-ui-v2";
import { localizeNews, formatLocalizedNewsDate } from "@/lib/news-i18n";
export default function UnitNewsV2({items,facultySlug,departmentSlug}: {items:NewsRecord[];facultySlug:string;departmentSlug?:string}) {
 const {locale}=useLocale();const t=newsV2[locale];const href=`/news?faculty=${encodeURIComponent(facultySlug)}${departmentSlug?`&department=${encodeURIComponent(departmentSlug)}`:""}`;
 return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
  <div className="mb-5 flex items-center gap-3"><Newspaper size={24} className="text-[#204774]"/><h2 className="text-xl font-bold text-[#204774] sm:text-2xl">{t.unitNews}</h2></div>
  {items.length?<div className="space-y-3">{items.map(item=>{const x=localizeNews(item,locale);return <Link key={x.slug} href={`/news/${x.slug}`} className="block rounded-xl border border-slate-200 p-4 hover:border-[#204774]"><p className="mb-2 text-xs text-slate-500">{formatLocalizedNewsDate(x.date,locale)}</p><h3 className="font-semibold text-[#204774]">{x.title}</h3></Link>})}</div>:<p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">{t.noUnitNews}</p>}
  <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#204774] hover:underline">{t.openAll}<ArrowUpRight size={16}/></Link>
 </section>;
}
