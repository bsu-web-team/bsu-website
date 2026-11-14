"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, UserRound } from "lucide-react";
import type { StaffRecord } from "@/lib/staff-data";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { translateContent } from "@/lib/content-translations";
import { catalogText as tr, displayPersonName } from "@/lib/catalog-i18n-v14";

export default function StaffDirectory({items}:{items:StaffRecord[]}) {
 const {locale}=useLocale();const [query,setQuery]=useState("");const [faculty,setFaculty]=useState("all");
 const faculties=useMemo(()=>Array.from(new Map(items.map(item=>[item.facultySlug,item.facultyName])).entries()).sort((a,b)=>translateContent(a[1],locale).localeCompare(translateContent(b[1],locale),locale)),[items,locale]);
 const filtered=useMemo(()=>items.filter(person=>{
  const haystack=[person.name,displayPersonName(person.name,locale),person.position,translateContent(person.position,locale),person.facultyName,translateContent(person.facultyName,locale)].join(" ").toLocaleLowerCase(locale);
  return (faculty==="all"||person.facultySlug===faculty)&&haystack.includes(query.trim().toLocaleLowerCase(locale));
 }).sort((a,b)=>displayPersonName(a.name,locale).localeCompare(displayPersonName(b.name,locale),locale)),[items,query,faculty,locale]);
 return <div>
  <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_minmax(220px,360px)]">
   <div><label htmlFor="staff-search" className="mb-2 block text-sm font-semibold text-[#102b4e]">{tr(locale,"staffSearch")}</label><div className="relative"><Search size={19} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input id="staff-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={tr(locale,"staffPlaceholder")} className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#102b4e]"/></div></div>
   <div><label htmlFor="staff-faculty" className="mb-2 block text-sm font-semibold text-[#102b4e]">{tr(locale,"faculty")}</label><select id="staff-faculty" value={faculty} onChange={e=>setFaculty(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-[#102b4e]"><option value="all">{tr(locale,"allUnits")}</option>{faculties.map(([slug,name])=><option key={slug} value={slug}>{translateContent(name,locale)}</option>)}</select></div>
  </div><div aria-live="polite" className="mt-6 text-sm text-slate-500">{tr(locale,"found")}: {filtered.length}</div>
  {filtered.length?<div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(person=><Link key={person.slug} href={`/staff/${person.slug}`} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf3fa] text-[#102b4e]"><UserRound size={32} aria-hidden="true"/></div><h2 className="text-lg font-bold leading-snug text-[#102b4e]">{displayPersonName(person.name,locale)}</h2><p className="mt-2 text-sm font-semibold text-[#a48652]">{translateContent(person.position,locale)}</p><p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{translateContent(person.facultyName,locale)}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#102b4e]">{tr(locale,"more")}<ArrowUpRight size={16} aria-hidden="true"/></span></Link>)}</div>:<div className="mt-4 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">{tr(locale,"noStaff")}</div>}
 </div>;
}
