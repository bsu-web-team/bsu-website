"use client";
import {useCallback,useEffect,useState} from "react";
import Link from "next/link";
type Draft={id:number;programId:number|null;title:string;level:string;code:string;profile:string;duration:string;languages:string;description:string;facultyId:number;departmentId:number|null;status:string;feedback:string};
const label:Record<string,string>={draft:"Черновик",submitted:"На проверке",changes_requested:"На доработке",approved:"Одобрено"};
export default function ProgramReview(){
 const [list,setList]=useState<Draft[]>([]),[notes,setNotes]=useState<Record<number,string>>({});
 const [filter,setFilter]=useState<"pending"|"all">("pending");
 const [busy,setBusy]=useState(false),[notice,setNotice]=useState("");
 const load=useCallback(async()=>{const r=await fetch("/api/admin-program-workflow?action=review",{cache:"no-store"});const d=await r.json();if(!r.ok)throw new Error(d.detail??d.error??`HTTP ${r.status}`);if(!Array.isArray(d))throw new Error("Некорректный ответ сервера");setList(d);},[]);
 useEffect(()=>{const t=window.setTimeout(()=>{void load().catch(e=>setNotice(String(e)));},0);return()=>clearTimeout(t);},[load]);
 async function decide(id:number,approve:boolean){if(busy)return;
  if(!approve&&!(notes[id]??"").trim()){setNotice("Введите причину возврата");return;}
  setBusy(true);setNotice("");try{
   const r=await fetch(`/api/admin-program-workflow?action=decision&id=${id}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({approve,feedback:notes[id]??""})});
   const d=await r.json();if(!r.ok)throw new Error(d.detail??d.error??`HTTP ${r.status}`);
   await load();setNotice(approve?"Одобрено. Программа опубликована только в тестовой базе.":"Возвращено на доработку.");
  }catch(e){setNotice(e instanceof Error?e.message:String(e));}finally{setBusy(false);}
 }
 const visible=filter==="pending"?list.filter(x=>x.status==="submitted"):list;
 return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900"><div className="mx-auto max-w-5xl space-y-6">
 <Link href="/admin" className="text-sm font-semibold text-blue-800">← Панель ЦЦР</Link>
 <header><h1 className="text-3xl font-extrabold text-[#204774]">Согласование программ</h1><p className="mt-2 text-sm text-slate-600">V8.17 · Только ЦЦР может публиковать изменения.</p></header>
 {notice&&<p role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">{notice}</p>}
 <div className="flex flex-wrap items-center gap-3"><span className="font-semibold">Ожидают решения: {list.filter(x=>x.status==="submitted").length}</span>
 <button type="button" className="rounded-lg border bg-white px-3 py-2 text-sm" onClick={()=>setFilter("pending")}>На проверке</button><button type="button" className="rounded-lg border bg-white px-3 py-2 text-sm" onClick={()=>setFilter("all")}>Все заявки</button>
 <button type="button" className="rounded-lg border bg-white px-3 py-2 text-sm" onClick={()=>void load().catch(e=>setNotice(String(e)))}>Обновить</button></div>
 {visible.map(d=><article key={d.id} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
  <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase text-blue-700">{d.programId?`Изменение программы №${d.programId}`:"Новая программа"}</p><h2 className="mt-2 text-xl font-bold text-slate-950">{d.title}</h2><p className="mt-1 text-sm text-slate-600">Факультет №{d.facultyId}{d.departmentId?` · Кафедра №${d.departmentId}`:""}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">{label[d.status]??d.status}</span></div>
  <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2"><p><strong>Уровень:</strong> {d.level}</p><p><strong>Код:</strong> {d.code||"—"}</p><p><strong>Профиль:</strong> {d.profile||"—"}</p><p><strong>Срок:</strong> {d.duration||"—"}</p><p className="sm:col-span-2"><strong>Языки:</strong> {d.languages||"—"}</p><p className="whitespace-pre-wrap sm:col-span-2"><strong>Описание:</strong> {d.description||"—"}</p></div>
  {d.feedback&&<p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Замечание: {d.feedback}</p>}
  {d.status==="submitted"&&<div className="space-y-3"><label className="block text-sm font-semibold">Замечание при возврате<textarea className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900" rows={3} value={notes[d.id]??""} onChange={e=>setNotes(v=>({...v,[d.id]:e.target.value}))}/></label><div className="flex gap-3"><button type="button" className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50" disabled={busy} onClick={()=>void decide(d.id,true)}>Одобрить</button><button type="button" className="rounded-lg bg-amber-100 px-4 py-2.5 text-sm font-semibold text-amber-950 disabled:opacity-50" disabled={busy||!(notes[d.id]??"").trim()} onClick={()=>void decide(d.id,false)}>Вернуть на доработку</button></div></div>}
 </article>)}
 {!visible.length&&<p className="rounded-xl bg-white p-8 text-center text-slate-500">Нет заявок в выбранном разделе</p>}
 </div></main>;
}
