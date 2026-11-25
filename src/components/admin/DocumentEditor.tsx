"use client";
import Link from "next/link";
import {useCallback,useEffect,useState} from "react";
type Draft={id:number;title:string;category:string;description:string;status:string;feedback:string;hasFile:boolean;filename:string|null};
const categories=["Нормативные документы","Наука","Абитуриентам","Учебный процесс"];
const labels:Record<string,string>={draft:"Черновик",submitted:"На проверке",changes_requested:"На доработке",approved:"Одобрено"};
const control="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900";
const btn="rounded-lg bg-[#204774] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50";
export default function DocumentEditor({back}:{back:string}){
 const [list,setList]=useState<Draft[]>([]);const [editing,setEditing]=useState<number|null>(null);
 const [title,setTitle]=useState("");const [category,setCategory]=useState(categories[0]);const [description,setDescription]=useState("");const [file,setFile]=useState<File|null>(null);
 const [busy,setBusy]=useState(false);const [notice,setNotice]=useState("");
 const load=useCallback(async()=>{const r=await fetch("/api/admin-documents?action=mine",{cache:"no-store"});const d:Draft[]|{detail?:string;error?:string}=await r.json();if(!r.ok)throw new Error((d as {detail?:string;error?:string}).detail??(d as {error?:string}).error??`HTTP ${r.status}`);if(!Array.isArray(d))throw new Error("Некорректный ответ");setList(d);},[]);
 useEffect(()=>{const timer=window.setTimeout(()=>{void load().catch(e=>setNotice(String(e)));},0);return()=>window.clearTimeout(timer);},[load]);
 function edit(x:Draft){setEditing(x.id);setTitle(x.title);setCategory(x.category);setDescription(x.description);setFile(null);window.scrollTo({top:0,behavior:"smooth"});}
 function reset(){setEditing(null);setTitle("");setCategory(categories[0]);setDescription("");setFile(null);}
 async function act(action:"create"|"update"|"submit",id?:number){setBusy(true);setNotice("");try{
   const r=await fetch(`/api/admin-documents?action=${action}${id?`&id=${id}`:""}`,{method:action==="update"?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(action==="submit"?{}:{title,category,description})});
   const d:Draft&{detail?:string;error?:string}=await r.json();if(!r.ok)throw new Error(d.detail??d.error??`HTTP ${r.status}`);
   if(action!=="submit"&&file){const form=new FormData();form.append("file",file);const up=await fetch(`/api/admin-documents?action=upload&id=${d.id}`,{method:"POST",body:form});if(!up.ok){const err=await up.json();throw new Error(err.detail??err.error??`Ошибка файла HTTP ${up.status}`);}}
   await load();if(action!=="submit")reset();setNotice(action==="submit"?"Документ отправлен в ЦЦР":"Черновик сохранён. Документ не опубликован.");
  }catch(e){setNotice(e instanceof Error?e.message:String(e));}finally{setBusy(false);}}
 return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900"><div className="mx-auto max-w-5xl space-y-6">
 <Link href={back} className="font-semibold text-blue-800">← В кабинет</Link>
 <header><h1 className="text-3xl font-bold text-[#204774]">Документы подразделения</h1><p className="mt-2 text-sm text-slate-600">Тестовая PostgreSQL · PDF, DOCX, XLSX до 10 МБ · публикация только после согласования ЦЦР</p></header>
 {notice&&<div role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">{notice}</div>}
 <section className="space-y-4 rounded-xl border bg-white p-5"><h2 className="text-lg font-bold">{editing?`Редактировать заявку №${editing}`:"Новый документ"}</h2>
 <label className="block text-sm font-semibold">Название<input className={control} maxLength={240} value={title} onChange={e=>setTitle(e.target.value)}/></label>
 <label className="block text-sm font-semibold">Категория<select className={control} value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
 <label className="block text-sm font-semibold">Описание<textarea className={control} maxLength={6000} rows={4} value={description} onChange={e=>setDescription(e.target.value)}/></label>
 <label className="block text-sm font-semibold">Файл (PDF, DOCX, XLSX; до 10 МБ)<input type="file" accept=".pdf,.docx,.xlsx" className={control} onChange={e=>setFile(e.target.files?.[0]??null)}/></label>
 <div className="flex flex-wrap gap-3"><button type="button" className={btn} disabled={busy||!title.trim()} onClick={()=>void act(editing?"update":"create",editing??undefined)}>{busy?"Сохранение…":"Сохранить черновик"}</button>{editing&&<button className="rounded-lg border px-4 py-2.5" onClick={reset}>Отменить</button>}</div></section>
 <section className="space-y-3 rounded-xl border bg-white p-5"><h2 className="text-lg font-bold">Мои заявки ({list.length})</h2>{list.map(x=><article key={x.id} className="space-y-2 rounded-xl border p-4"><div className="flex flex-wrap justify-between gap-2"><strong>{x.title}</strong><span className="text-sm text-blue-800">{labels[x.status]??x.status}</span></div><p className="text-sm text-slate-600">{x.category} · {x.filename??"Файл не загружен"}</p>{x.feedback&&<p className="text-sm text-amber-800">Замечание ЦЦР: {x.feedback}</p>}{x.hasFile&&<a href={`/api/admin-documents?action=file&id=${x.id}`} className="block text-sm font-semibold text-blue-700 underline">Скачать файл заявки</a>}{(x.status==="draft"||x.status==="changes_requested")&&<div className="flex flex-wrap gap-2"><button className="rounded-lg border px-4 py-2 text-sm font-semibold" disabled={busy} onClick={()=>edit(x)}>Изменить</button><button className={btn} disabled={busy||!x.hasFile} onClick={()=>void act("submit",x.id)}>Отправить ЦЦР</button></div>}</article>)}{!list.length&&<p className="text-sm text-slate-500">Заявок пока нет</p>}</section>
 <Link href="/documents/approved-test" className="text-sm font-semibold text-blue-800 underline">Посмотреть опубликованные тестовые документы</Link>
 </div></main>;
}
