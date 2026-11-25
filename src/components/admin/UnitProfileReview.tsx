"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
type Item={id:number;ownerKey:string;unitKind:"faculty"|"department";unitName:string;unitSlug:string;description:string;contact:string;approvedDescription:string|null;approvedContact:string|null;status:string;feedback:string;updatedAt:string|null};
const cls="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm";
export default function UnitProfileReview(){
 const [items,setItems]=useState<Item[]>([]);
 const [feedback,setFeedback]=useState<Record<number,string>>({});
 const [notice,setNotice]=useState("");
 const [busy,setBusy]=useState(false);
 const [loading,setLoading]=useState(true);
 const refresh=useCallback(async()=>{
  try{const r=await fetch('/api/admin-unit-review',{cache:'no-store'});const j:unknown=await r.json();if(!r.ok)throw new Error(`Ошибка загрузки ${r.status}`);if(!Array.isArray(j))throw new Error('Некорректные данные');setItems(j as Item[]);}
  catch(e){setNotice(e instanceof Error?e.message:'Ошибка загрузки');}
  finally{setLoading(false);}
 },[]);
 useEffect(()=>{const t=window.setTimeout(()=>{void refresh()},0);return()=>window.clearTimeout(t)},[refresh]);
 async function decide(id:number,approve:boolean){
  setBusy(true);setNotice('');
  try{const r=await fetch('/api/admin-unit-review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,approve,feedback:feedback[id]??''})});const j:{error?:string;detail?:string}=await r.json();if(!r.ok)throw new Error(j.detail??j.error??`HTTP ${r.status}`);setNotice(approve?'Сведения одобрены и сохранены отдельно. Публичный сайт пока не изменён.':'Возвращено на доработку');await refresh();}
  catch(e){setNotice(e instanceof Error?e.message:'Ошибка решения');}
  finally{setBusy(false);}
 }
 return <main className="min-h-screen bg-slate-50 text-slate-900"><header className="bg-[#173e72] p-7 text-white"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-blue-100">БГУ · ЦЦР</p><h1 className="mt-2 text-2xl font-bold">Согласование сведений подразделений</h1></div><Link href="/admin" className="rounded-lg border border-white/40 px-4 py-2">В панель ЦЦР</Link></div></header>
 <div className="mx-auto max-w-5xl space-y-5 p-6"><p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">Тестовая среда. Одобрение сохраняет проверенную копию в PostgreSQL, но ещё НЕ меняет публичные сведения. Публикацию подключим в V8.14.3.</p>
 {notice&&<p role="status" className="rounded-lg bg-blue-50 p-3">{notice}</p>}
 <div className="flex items-center justify-between"><p className="font-semibold">Ожидают решения: {items.filter(x=>x.status==='submitted').length}</p><button type="button" className="rounded-lg border bg-white px-4 py-2" onClick={()=>void refresh()}>Обновить</button></div>
 {loading?<p>Загрузка…</p>:items.length===0?<p>Заявок пока нет.</p>:items.map(x=><article key={x.id} className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm"><div className="flex flex-wrap justify-between gap-2"><div><p className="text-xs font-semibold uppercase text-blue-700">{x.unitKind==='faculty'?'Факультет':'Кафедра'} · {x.unitSlug}</p><h2 className="text-lg font-bold">{x.unitName}</h2></div><span className="text-sm font-semibold">{x.status==='submitted'?'На проверке':x.status==='approved'?'Одобрено':x.status==='changes_requested'?'На доработке':'Черновик'}</span></div>
 <div className="grid gap-4 md:grid-cols-2"><div className="rounded-xl bg-slate-100 p-4"><h3 className="mb-2 font-semibold">Предыдущая утверждённая версия</h3><p className="text-xs font-medium text-slate-500">Описание</p><p className="whitespace-pre-wrap text-sm">{x.approvedDescription??'Ещё нет утверждённой версии'}</p><p className="mt-3 text-xs font-medium text-slate-500">Контакты</p><p className="whitespace-pre-wrap text-sm">{x.approvedContact??'—'}</p></div><div className="rounded-xl border border-blue-200 bg-blue-50 p-4"><h3 className="mb-2 font-semibold">Предлагаемые изменения</h3><p className="text-xs font-medium text-blue-700">Описание</p><p className="whitespace-pre-wrap text-sm">{x.description||'—'}</p><p className="mt-3 text-xs font-medium text-blue-700">Контакты</p><p className="whitespace-pre-wrap text-sm">{x.contact||'—'}</p></div></div>
 {x.feedback&&<p className="rounded-lg bg-amber-50 p-3 text-sm">Замечание: {x.feedback}</p>}
 {x.status==='submitted'&&<div className="space-y-3 border-t pt-3"><textarea className={cls} rows={2} placeholder="Причина возврата (обязательно при отклонении)" value={feedback[x.id]??''} onChange={e=>setFeedback(f=>({...f,[x.id]:e.target.value}))}/><div className="flex flex-wrap gap-2"><button disabled={busy} onClick={()=>void decide(x.id,true)} className="rounded-lg bg-[#235aa2] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Одобрить</button><button disabled={busy||!(feedback[x.id]??'').trim()} onClick={()=>void decide(x.id,false)} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40">Вернуть на доработку</button></div></div>}
 </article>)}
 </div></main>;
}
