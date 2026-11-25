"use client";
import {useCallback,useEffect,useState} from "react";
import Link from "next/link";

type Program={id:number;title:string;level:string;code:string;profile:string;duration:string;languages:string;description:string;slug:string};
type Draft=Omit<Program,"slug">&{programId:number|null;status:string;feedback:string};
type Data={programs:Program[];drafts:Draft[];canEditExisting:boolean};
const blank=()=>({title:"",level:"Бакалавриат",code:"",profile:"",duration:"",languages:"",description:""});
const field="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900";
const btn="rounded-lg bg-[#204774] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40";
const labels:Record<string,string>={draft:"Черновик",submitted:"На проверке",changes_requested:"На доработке",approved:"Одобрено"};
export default function ProgramEditor({back}:{back:string}){
 const [data,setData]=useState<Data>({programs:[],drafts:[],canEditExisting:false});
 const [form,setForm]=useState(blank());
 const [target,setTarget]=useState("");
 const [editing,setEditing]=useState<number|null>(null);
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState("");
 const [loading,setLoading]=useState(true);
 const load=useCallback(async()=>{
   const r=await fetch("/api/admin-program-workflow?action=mine",{cache:"no-store"});
   const value:Data&{detail?:string;error?:string}=await r.json();
   if(!r.ok)throw new Error(value.detail??value.error??`HTTP ${r.status}`);
   setData(value);
 },[]);
 useEffect(()=>{const t=window.setTimeout(()=>{void load().catch(e=>setNotice(String(e))).finally(()=>setLoading(false));},0);return()=>clearTimeout(t);},[load]);
 function choose(value:string){
  setEditing(null);setTarget(value);setNotice("");
  const program=data.programs.find(p=>String(p.id)===value);
  setForm(program?{title:program.title,level:program.level,code:program.code,profile:program.profile,duration:program.duration,languages:program.languages,description:program.description}:blank());
 }
 function edit(d:Draft){setEditing(d.id);setTarget(d.programId===null?"":String(d.programId));
  setForm({title:d.title,level:d.level,code:d.code,profile:d.profile,duration:d.duration,languages:d.languages,description:d.description});
  setNotice(`Редактирование черновика №${d.id}`);window.scrollTo({top:0,behavior:"smooth"});}
 async function action(which:"create"|"update"|"submit",id?:number){
  if(busy)return;setBusy(true);setNotice("");
  try{
   const r=await fetch(`/api/admin-program-workflow?action=${which}${id?`&id=${id}`:""}`,{
    method:which==="update"?"PUT":"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify(which==="submit"?{}:{...form,programId:target?Number(target):null})});
   const result:{error?:string;detail?:string}=await r.json();
   if(!r.ok)throw new Error(result.detail??result.error??`HTTP ${r.status}`);
   await load();
   if(which!=="submit")setEditing(null);
   setNotice(which==="submit"?"Заявка отправлена в ЦЦР. Публичный список не изменён.":"Черновик сохранён в тестовой PostgreSQL.");
  }catch(e){setNotice(e instanceof Error?e.message:String(e));}finally{setBusy(false);}
 }
 const set=(key:keyof ReturnType<typeof blank>,v:string)=>setForm(prev=>({...prev,[key]:v}));
 return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900"><div className="mx-auto max-w-5xl space-y-6">
 <Link href={back} className="text-sm font-semibold text-blue-800">← Вернуться в кабинет</Link>
 <header><h1 className="text-3xl font-extrabold text-[#204774]">Образовательные программы</h1>
 <p className="mt-2 text-sm text-slate-600">V8.17 · Тестовая PostgreSQL. Новые сведения публикуются только после одобрения ЦЦР.</p></header>
 {notice&&<p role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">{notice}</p>}
 {loading&&<p>Загрузка…</p>}
 <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-lg font-bold">Программы факультета ({data.programs.length})</h2>
 <div className="mt-4 grid gap-2 sm:grid-cols-2">{data.programs.map(p=><button key={p.id} onClick={()=>data.canEditExisting&&choose(String(p.id))} disabled={!data.canEditExisting} className="rounded-xl border border-slate-200 p-4 text-left text-sm disabled:cursor-default"><strong>{p.title}</strong><p className="mt-1 text-slate-600">{p.level} · {p.code||"Без кода"}</p></button>)}</div>
 {!data.canEditExisting&&<p className="mt-3 text-xs text-amber-800">Для кафедр доступно создание новой программы. Изменение существующих программ — через факультет.</p>}</section>
 <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
 <h2 className="text-lg font-bold">{editing===null?"Новая заявка":"Редактирование черновика №"+editing}</h2>
 {data.canEditExisting&&<label className="block text-sm font-semibold">Какую запись изменить?
 <select className={field} disabled={editing!==null} value={target} onChange={e=>choose(e.target.value)}><option value="">Создать новую программу</option>
 {data.programs.map(p=><option value={p.id} key={p.id}>{p.title} · {p.level}</option>)}</select></label>}
 <div className="grid gap-4 sm:grid-cols-2">
 <label className="block text-sm font-semibold sm:col-span-2">Название программы<input className={field} maxLength={300} value={form.title} onChange={e=>set("title",e.target.value)}/></label>
 <label className="block text-sm font-semibold">Уровень<select className={field} value={form.level} onChange={e=>set("level",e.target.value)}><option>Бакалавриат</option><option>Магистратура</option><option>PhD</option></select></label>
 <label className="block text-sm font-semibold">Код направления<input className={field} maxLength={50} value={form.code} onChange={e=>set("code",e.target.value)}/></label>
 <label className="block text-sm font-semibold">Профиль<input className={field} maxLength={4000} value={form.profile} onChange={e=>set("profile",e.target.value)}/></label>
 <label className="block text-sm font-semibold">Срок обучения<input className={field} maxLength={100} value={form.duration} onChange={e=>set("duration",e.target.value)}/></label>
 <label className="block text-sm font-semibold sm:col-span-2">Языки обучения<input className={field} maxLength={200} value={form.languages} onChange={e=>set("languages",e.target.value)}/></label>
 <label className="block text-sm font-semibold sm:col-span-2">Описание программы<textarea className={field} rows={5} maxLength={12000} value={form.description} onChange={e=>set("description",e.target.value)}/></label>
 </div>
 <div className="flex flex-wrap gap-3"><button type="button" className={btn} disabled={busy||!form.title.trim()} onClick={()=>void action(editing===null?"create":"update",editing??undefined)}>{editing===null?"Сохранить черновик":"Сохранить изменения"}</button>
 {editing!==null&&<button type="button" className="rounded-lg border px-4 py-2.5 text-sm" onClick={()=>choose("")}>Отмена</button>}</div></section>
 <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-lg font-bold">Мои заявки ({data.drafts.length})</h2>
 {data.drafts.map(d=><div key={d.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border p-4"><div><strong>{d.title}</strong><p className="mt-1 text-sm text-slate-600">{d.level} · {labels[d.status]??d.status}</p>
 {d.feedback&&<p className="mt-2 text-sm text-amber-800">Замечание ЦЦР: {d.feedback}</p>}</div>
 {(d.status==="draft"||d.status==="changes_requested")&&<div className="flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={()=>edit(d)} className="rounded-lg border px-3 py-2 text-sm font-semibold">Изменить</button><button type="button" disabled={busy} onClick={()=>void action("submit",d.id)} className={btn}>Отправить ЦЦР</button></div>}</div>)}
 {!data.drafts.length&&<p className="text-sm text-slate-500">Заявок пока нет</p>}</section>
 </div></main>;
}
