"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { NewsRecord, NewsCategory } from "@/lib/news-data";
import type { Locale } from "@/lib/i18n";
import type { FacultyRecord } from "@/lib/faculty-data";
import type { DepartmentRecord } from "@/lib/department-data";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localizeNews, newsUi } from "@/lib/news-i18n";
import { newsV2 } from "@/lib/news-ui-v2";
import { translateContent } from "@/lib/content-translations";
import { matchesNewsQuery, matchesNewsScope } from "@/lib/news-filter";
import NewsCardV2 from "./NewsCardV2";
const categories: NewsCategory[] = ["Новости","Наука","Международное сотрудничество","Мероприятия"];
const languages: Locale[] = ["ru","ky","en","zh-CN"];
const PAGE_SIZE=12;
const field="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-[#204774] focus:ring-2 focus:ring-blue-100";
type DirectoryProps = { items: NewsRecord[]; faculties: FacultyRecord[]; departments: DepartmentRecord[] };
function Catalog({items, faculties, departments, initialFaculty, initialDepartment}: DirectoryProps & {initialFaculty:string;initialDepartment:string}) {
 const {locale}=useLocale();const ui=newsUi[locale];const t=newsV2[locale];
 const [query,setQuery]=useState("");const [category,setCategory]=useState<NewsCategory|"">("");
 const [faculty,setFaculty]=useState(initialFaculty);const [department,setDepartment]=useState(initialDepartment);
 const [year,setYear]=useState("");const [month,setMonth]=useState("");const [limit,setLimit]=useState(PAGE_SIZE);
 const resetLimit=()=>setLimit(PAGE_SIZE);
 const facultyOptions=useMemo(()=>[...faculties].sort((a,b)=>translateContent(a.name,locale).localeCompare(translateContent(b.name,locale),locale)),[faculties,locale]);
 const departmentOptions=useMemo(()=>departments.filter(d=>!faculty||d.facultySlug===faculty).sort((a,b)=>translateContent(a.name,locale).localeCompare(translateContent(b.name,locale),locale)),[departments,faculty,locale]);
 const years=useMemo(()=>[...new Set(items.map(x=>x.date.slice(0,4)))].sort().reverse(),[items]);
 const months=useMemo(()=>[...new Set(items.filter(x=>!year||x.date.startsWith(year)).map(x=>x.date.slice(5,7)))].sort(),[items,year]);
 const index=useMemo(()=>items.map(item=>{
  const f=faculties.find(f=>f.slug===item.facultySlug); const d=departments.find(d=>d.slug===item.departmentSlug);
  const translated=languages.flatMap(l=>{const x=localizeNews(item,l);return [x.title,x.excerpt,newsUi[l].categories[item.category],translateContent(f?.name,l),translateContent(d?.name,l)];});
  return {item,search:[...translated,f?.shortName,...(item.content??[]),...(item.tags??[])]};
 }),[items,faculties,departments]);
 const filtered=useMemo(()=>index.filter(({item,search})=>(!category||item.category===category)&&matchesNewsScope(item,{facultySlug:faculty||undefined,departmentSlug:department||undefined})&&(!year||item.date.startsWith(year))&&(!month||item.date.slice(5,7)===month)&&matchesNewsQuery(query,search)).map(x=>x.item).sort((a,b)=>b.date.localeCompare(a.date)||a.slug.localeCompare(b.slug)),[index,category,faculty,department,year,month,query]);
 const unitName=(x:NewsRecord)=>{const name=departments.find(d=>d.slug===x.departmentSlug)?.name??faculties.find(f=>f.slug===x.facultySlug)?.name;return name?translateContent(name,locale):t.general;};
 const active=Boolean(query.trim()||category||faculty||department||year||month);
 const visible=filtered.slice(0,limit);const featured=!active&&visible.length>0;
 const clear=()=>{setQuery("");setCategory("");setFaculty("");setDepartment("");setYear("");setMonth("");resetLimit();};
 return <>
  <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
   <div className="flex items-center gap-3"><SlidersHorizontal size={20} className="text-[#204774]"/><label htmlFor="bsu-news-v2-search" className="font-semibold text-[#204774]">{ui.search}</label></div>
   <div className="relative mt-3"><Search size={19} className="pointer-events-none absolute left-3 top-3.5 text-slate-400"/><input id="bsu-news-v2-search" value={query} onChange={e=>{setQuery(e.target.value);resetLimit();}} placeholder={ui.search} className={`${field} pl-10`}/></div>
   <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <label className="min-w-0"><span className="mb-1.5 block text-xs font-semibold text-slate-600">{ui.category}</span><select className={field} value={category} onChange={e=>{setCategory(e.target.value as NewsCategory|"");resetLimit();}}><option value="">{ui.all}</option>{categories.map(c=><option key={c} value={c}>{ui.categories[c]}</option>)}</select></label>
    <label className="min-w-0"><span className="mb-1.5 block text-xs font-semibold text-slate-600">{t.faculty}</span><select className={field} value={faculty} onChange={e=>{setFaculty(e.target.value);setDepartment("");resetLimit();}}><option value="">{t.allFaculties}</option>{facultyOptions.map(f=><option key={f.slug} value={f.slug}>{translateContent(f.name,locale)}</option>)}</select></label>
    <label className="min-w-0"><span className="mb-1.5 block text-xs font-semibold text-slate-600">{t.department}</span><select className={field} value={department} onChange={e=>{setDepartment(e.target.value);resetLimit();}}><option value="">{t.allDepartments}</option>{departmentOptions.map(d=><option key={d.slug} value={d.slug}>{translateContent(d.name,locale)}</option>)}</select></label>
    <label><span className="mb-1.5 block text-xs font-semibold text-slate-600">{t.year}</span><select className={field} value={year} onChange={e=>{setYear(e.target.value);setMonth("");resetLimit();}}><option value="">{t.allYears}</option>{years.map(y=><option key={y} value={y}>{y}</option>)}</select></label>
    <label><span className="mb-1.5 block text-xs font-semibold text-slate-600">{t.month}</span><select className={field} value={month} onChange={e=>{setMonth(e.target.value);resetLimit();}}><option value="">{t.allMonths}</option>{months.map(m=><option key={m} value={m}>{new Intl.DateTimeFormat(locale,{month:"long",timeZone:"UTC"}).format(new Date(`2024-${m}-01T12:00:00Z`))}</option>)}</select></label>
    <button type="button" disabled={!active} onClick={clear} className="self-end inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-3 text-sm font-semibold text-[#204774] hover:bg-slate-50 disabled:opacity-50"><X size={16}/>{t.reset}</button>
   </div>
  </div>
  <p className="mb-5 text-sm text-slate-600" aria-live="polite">{ui.found}: <strong>{filtered.length}</strong></p>
  {featured&&<div className="mb-6"><NewsCardV2 item={visible[0]} featured unit={unitName(visible[0])}/></div>}
  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.slice(featured?1:0).map(x=><NewsCardV2 key={x.slug} item={x} unit={unitName(x)}/>)}</div>
  {!visible.length&&<div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><Search className="mx-auto mb-3 text-slate-400" size={30}/><p className="text-slate-600">{ui.none}</p>{active&&<button onClick={clear} type="button" className="mt-4 rounded-xl bg-[#204774] px-4 py-3 text-sm font-semibold text-white">{t.reset}</button>}</div>}
  {visible.length<filtered.length&&<div className="mt-8 flex flex-col items-center gap-3"><p className="text-sm text-slate-500">{t.results}: {visible.length} / {filtered.length}</p><button type="button" onClick={()=>setLimit(v=>v+PAGE_SIZE)} className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-[#204774] hover:bg-slate-50">{t.showMore}</button></div>}
 </>;
}
function CatalogWithParams({items, faculties, departments}: DirectoryProps) {
 const params=useSearchParams();const d=departments.find(d=>d.slug===params.get("department"));const f=d?.facultySlug??faculties.find(f=>f.slug===params.get("faculty"))?.slug??"";
 return <Catalog key={`${f}:${d?.slug??""}`} items={items} faculties={faculties} departments={departments} initialFaculty={f} initialDepartment={d?.slug??""}/>;
}
export default function NewsDirectory(props: DirectoryProps) {
 return <Suspense fallback={<div aria-busy="true" className="h-44 rounded-2xl bg-white"/>}><CatalogWithParams {...props}/></Suspense>;
}
