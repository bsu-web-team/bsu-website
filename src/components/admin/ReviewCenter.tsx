"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ClipboardList, RefreshCw, Search } from "lucide-react";

type Kind = "news" | "units" | "staff" | "documents" | "programs";
type RawItem = Record<string, unknown>;
type Row = { key: string; kind: Kind; id: number; title: string; subtitle: string; status: string; updatedAt: string; href: string };
type Source = { kind: Kind; name: string; endpoint: string; href: string };
const sources: Source[] = [
  {kind:"news", name:"Новости", endpoint:"/api/admin-editor",href:"/admin/editorial-review"},
  {kind:"units", name:"Профили", endpoint:"/api/admin-unit-review",href:"/admin/unit-review"},
  {kind:"staff", name:"Сотрудники", endpoint:"/api/admin-staff?action=review",href:"/admin/staff-review"},
  {kind:"documents", name:"Документы", endpoint:"/api/admin-documents?action=review",href:"/admin/document-review"},
  {kind:"programs", name:"Программы", endpoint:"/api/admin-program-workflow?action=review",href:"/admin/program-review"},
];
const statusLabel: Record<string,string> = {draft:"Черновик",submitted:"На проверке",changes_requested:"На доработке",approved:"Одобрено",published:"Опубликовано"};
const statusClass: Record<string,string> = {draft:"bg-slate-100 text-slate-700",submitted:"bg-blue-100 text-blue-800",changes_requested:"bg-amber-100 text-amber-900",approved:"bg-emerald-100 text-emerald-800",published:"bg-emerald-100 text-emerald-800"};
const str = (value: unknown): string => typeof value === "string" ? value : "";
const num = (value: unknown): number => typeof value === "number" && Number.isSafeInteger(value) ? value : 0;
function asRow(source: Source, item: RawItem): Row | null {
  const id = num(item.id);
  if (id < 1) return null;
  const status = str(item.status);
  const title = source.kind === "units" ? str(item.unitName) || str(item.unitSlug) : str(item.title) || str(item.name);
  const faculty = num(item.facultyId);
  const dept = num(item.departmentId);
  const unitScope = source.kind === "units" ? str(item.unitKind) : "";
  const subtitle = source.kind === "news" ? str(item.category) : source.kind === "units" ? (unitScope === "faculty" ? "Факультет" : "Кафедра") :
    [faculty ? `Факультет №${faculty}` : "",dept ? `Кафедра №${dept}` : ""].filter(Boolean).join(" · ");
  return {key:`${source.kind}-${id}`,kind:source.kind,id,title:title || `Заявка №${id}`,subtitle,status,updatedAt:str(item.updatedAt),href:source.href};
}

export default function ReviewCenter() {
  const [rows,setRows] = useState<Row[]>([]);
  const [failures,setFailures] = useState<string[]>([]);
  const [loading,setLoading] = useState(true);
  const [type,setType] = useState<Kind | "all">("all");
  const [view,setView] = useState<"pending"|"all">("pending");
  const [query,setQuery] = useState("");
  const [updated,setUpdated] = useState("");
  const load = useCallback(async () => {
    const results = await Promise.all(sources.map(async source => {
      try {
        const response = await fetch(source.endpoint,{cache:"no-store"});
        const payload: unknown = await response.json();
        if(!response.ok) {
          const err = payload && typeof payload === "object" && !Array.isArray(payload) ? payload as Record<string,unknown> : {};
          throw new Error(str(err.detail) || str(err.error) || `HTTP ${response.status}`);
        }
        if(!Array.isArray(payload)) throw new Error("Неверный формат данных");
        return {items:payload.filter((item):item is RawItem => !!item && typeof item === "object" && !Array.isArray(item)).map(item=>asRow(source,item)).filter((item):item is Row=>item!==null),error:""};
      } catch(error) {return {items:[] as Row[],error:`${source.name}: ${error instanceof Error?error.message:String(error)}`};}
    }));
    setRows(results.flatMap(result=>result.items).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)));
    setFailures(results.map(result=>result.error).filter(Boolean));
    setUpdated(new Date().toLocaleTimeString("ru-RU"));
  },[]);
  useEffect(()=>{
    const id=window.setTimeout(()=>{void load().finally(()=>setLoading(false));},0);
    return()=>window.clearTimeout(id);
  },[load]);
  async function refresh(){setLoading(true);try{await load();}finally{setLoading(false);}}
  const pending=rows.filter(item=>item.status==="submitted");
  const filtered=useMemo(()=>rows.filter(row=>
    (type==="all"||row.kind===type) && (view==="all"||row.status==="submitted") &&
    `${row.title} ${row.subtitle} ${row.id}`.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru"))
  ),[rows,type,view,query]);
  return <main className="min-h-screen bg-[#f4f7fb] px-4 py-8 text-slate-900 sm:px-8">
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-2xl bg-[#183e70] p-6 text-white sm:p-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100 hover:text-white"><ArrowLeft size={16}/> Панель ЦЦР</Link>
        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div><div className="flex items-center gap-3"><ClipboardList size={28}/><h1 className="text-2xl font-bold sm:text-3xl">Единый центр согласования</h1></div><p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100">Все заявки подразделений в одном списке. Решения принимаются в защищённых разделах соответствующих модулей.</p></div>
          <button type="button" disabled={loading} onClick={()=>void refresh()} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#183e70] disabled:opacity-50"><RefreshCw size={16}/> Обновить</button>
        </div>
      </header>
      {failures.length>0&&<section role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"><strong>Не все очереди загрузились:</strong><ul className="mt-2 list-disc space-y-1 pl-5">{failures.map(item=><li key={item}>{item}</li>)}</ul><p className="mt-2">Показанные ниже данные могут быть неполными.</p></section>}
      <section className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-white p-5"><p className="text-sm text-slate-600">Ожидают ЦЦР</p><p className="mt-2 text-3xl font-extrabold text-[#204774]">{pending.length}</p></div><div className="rounded-xl border bg-white p-5"><p className="text-sm text-slate-600">Заявок в истории</p><p className="mt-2 text-3xl font-extrabold text-[#204774]">{rows.length}</p></div><div className="rounded-xl border bg-white p-5"><p className="text-sm text-slate-600">Последнее обновление</p><p className="mt-3 text-lg font-bold text-[#204774]">{updated||"—"}</p></div></section>
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"><div className="flex flex-wrap items-end gap-3">
        <label className="block min-w-[190px] flex-1 text-xs font-bold text-slate-700">Тип заявки<select className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm" value={type} onChange={event=>setType(event.target.value as Kind|"all")}><option value="all">Все типы</option>{sources.map(s=><option key={s.kind} value={s.kind}>{s.name}</option>)}</select></label>
        <label className="block min-w-[190px] flex-1 text-xs font-bold text-slate-700">Статус<select className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm" value={view} onChange={event=>setView(event.target.value as "pending"|"all")}><option value="pending">На проверке</option><option value="all">Все статусы</option></select></label>
        <label className="block min-w-[220px] flex-[2] text-xs font-bold text-slate-700">Поиск<div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3"><Search size={18} className="text-slate-500"/><input className="w-full py-3 text-sm outline-none" placeholder="Название, номер, подразделение" value={query} onChange={event=>setQuery(event.target.value)}/></div></label>
      </div></section>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="border-b border-slate-200 px-5 py-4 text-sm font-bold text-slate-800">Заявки ({filtered.length})</div>
        {loading&&<p className="p-6 text-sm text-slate-500">Обновляем данные…</p>}
        {!loading&&filtered.length===0&&<p className="p-8 text-center text-sm text-slate-600">По выбранным фильтрам заявок нет.</p>}
        {!loading&&filtered.map(item=>{const source=sources.find(s=>s.kind===item.kind)!;return <article key={item.key} className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 last:border-b-0 sm:flex-row sm:items-center"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wide text-blue-700">{source.name} · №{item.id}</p><h2 className="mt-1 break-words text-base font-bold text-slate-950">{item.title}</h2><p className="mt-1 text-sm text-slate-600">{item.subtitle||"Без дополнительной информации"}</p><p className="mt-2 text-xs text-slate-500">{item.updatedAt?`Обновлено: ${item.updatedAt.slice(0,16).replace("T"," ")}`:"Дата не указана"}</p></div><div className="flex shrink-0 flex-wrap items-center gap-3"><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass[item.status]??"bg-slate-100 text-slate-700"}`}>{statusLabel[item.status]??item.status}</span><Link href={item.href} className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-800 hover:bg-blue-100">{item.status==="submitted"?"Рассмотреть":"Открыть раздел"}<ArrowUpRight size={15}/></Link></div></article>})}
      </section>
      <p className="text-xs leading-5 text-slate-500">Данные загружаются через существующие API тестового Backend 8001. Это сводка, а не отдельный механизм публикации; действия в исходных модулях сохраняют прежние проверки прав ЦЦР. При проблемах с сетью отображается предупреждение, а не ложный ноль.</p>
    </div>
  </main>;
}
