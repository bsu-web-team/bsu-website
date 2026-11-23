"use client";
import Link from "next/link";
import NewsDirectory from "@/components/news/NewsDirectory";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { newsUi } from "@/lib/news-i18n";
import type { NewsRecord } from "@/lib/news-data";
import type { FacultyRecord } from "@/lib/faculty-data";
import type { DepartmentRecord } from "@/lib/department-data";
export default function NewsIndexLocalized({items,faculties,departments}:{items:NewsRecord[];faculties:FacultyRecord[];departments:DepartmentRecord[]}){
 const {locale}=useLocale();const t=newsUi[locale];
 return <main><section className="bg-[#204774] px-5 py-16 text-white sm:px-8"><div className="mx-auto max-w-7xl"><Link href="/" className="text-sm text-blue-100 hover:underline">{t.home}</Link><p className="mt-8 text-sm font-semibold uppercase tracking-widest text-[#d5b780]">{t.press}</p><h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{t.headline}</h1><p className="mt-5 max-w-2xl text-blue-100">{t.intro}</p></div></section><section className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><NewsDirectory items={items} faculties={faculties} departments={departments}/><p className="mt-10 text-xs text-slate-500">{t.partial}</p></section></main>;
}
