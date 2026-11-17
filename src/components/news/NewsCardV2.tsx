"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Newspaper } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { NewsRecord } from "@/lib/news-data";
import { formatLocalizedNewsDate, localizeNews, newsUi } from "@/lib/news-i18n";
import { newsV2 } from "@/lib/news-ui-v2";
import { safeNewsImage } from "@/lib/news-filter";
export default function NewsCardV2({item, featured=false, unit}: {item:NewsRecord; featured?:boolean; unit?:string}) {
 const {locale}=useLocale(); const ui=newsUi[locale]; const t=newsV2[locale]; const x=localizeNews(item,locale); const photo=safeNewsImage(x.imageUrl);
 return <Link href={`/news/${x.slug}`} className={`group grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-[#102b4e]/30 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#102b4e] ${featured?"md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]":"grid-rows-[auto_1fr]"}`}>
  <div className={`relative overflow-hidden bg-[#102b4e] ${featured?"min-h-52 md:min-h-80":"aspect-[16/9]"}`}>
   {photo?<Image src={photo} alt="" fill unoptimized sizes={featured?"(min-width: 768px) 50vw, 100vw":"(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"} className="object-cover"/>:<div aria-hidden="true" className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top_right,#375679,transparent_70%)]"><div className="absolute -right-12 -top-12 h-52 w-52 rounded-full border border-[#dfbd7e]/25"/><div className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full border border-white/10"/><Newspaper className="h-14 w-14 text-[#dfbd7e]" strokeWidth={1.1}/><span className="absolute bottom-4 left-5 text-xs font-semibold tracking-[.25em] text-white/70">BSU / NEWS</span></div>}
  </div>
  <div className={`flex min-w-0 flex-col ${featured?"p-6 sm:p-10":"p-5 sm:p-6"}`}>
   <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold tracking-wide text-[#876a39]"><span>{ui.categories[x.category]}</span>{featured&&<span className="text-slate-500">· {t.featured}</span>}</div>
   <h2 className={`mt-3 break-words font-extrabold leading-tight text-[#102b4e] group-hover:underline ${featured?"text-2xl sm:text-3xl":"text-xl"}`}>{x.title}</h2>
   {unit&&<p className="mt-2 text-xs font-medium text-slate-500">{unit}</p>}
   <p className={`mt-3 flex-1 break-words text-sm leading-6 text-slate-600 ${featured?"":"line-clamp-3"}`}>{x.excerpt}</p>
   <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500"><span className="inline-flex items-center gap-2"><CalendarDays size={15}/>{formatLocalizedNewsDate(x.date,locale)}</span><span className="inline-flex items-center gap-1 font-semibold text-[#102b4e]">{t.more}<ArrowUpRight size={17}/></span></div>
  </div>
 </Link>;
}
