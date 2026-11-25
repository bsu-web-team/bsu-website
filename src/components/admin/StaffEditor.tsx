"use client";
import {useCallback,useEffect,useState} from "react";
import Link from "next/link";
type Staff={id:number;slug:string;name:string;position:string;biography:string;photoUrl?:string|null};
type Draft={id:number;staffId:number|null;name:string;position:string;biography:string;status:string;feedback:string;hasPhoto?:boolean};
const field="w-full rounded-lg border border-slate-300 p-3 text-sm";
const button="rounded-lg bg-[#204774] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50";
export default function StaffEditor(){
 const [staff,setStaff]=useState<Staff[]>([]);const [drafts,setDrafts]=useState<Draft[]>([]);
 const [selected,setSelected]=useState("");const [name,setName]=useState("");const [position,setPosition]=useState("");const [bio,setBio]=useState("");
 const [busy,setBusy]=useState(false);const [notice,setNotice]=useState("");
 const [editingDraftId,setEditingDraftId]=useState<number|null>(null);
 const [photoFile,setPhotoFile]=useState<File|null>(null);
 const load=useCallback(async()=>{
  const r=await fetch("/api/admin-staff?action=mine",{cache:"no-store"});const d=await r.json();
  if(!r.ok)throw new Error(d.detail??d.error??`HTTP ${r.status}`);
  setStaff(d.staff??[]);setDrafts(d.drafts??[]);
 },[]);
 useEffect(()=>{const t=window.setTimeout(()=>{void load().catch(e=>setNotice(String(e)));},0);return()=>window.clearTimeout(t);},[load]);
 function choose(id:string){setPhotoFile(null);setEditingDraftId(null);setSelected(id);const x=staff.find(s=>String(s.id)===id);setName(x?.name??"");setPosition(x?.position??"");setBio(x?.biography??"");setNotice("");}
 function editDraft(d:Draft){setPhotoFile(null);setEditingDraftId(d.id);setSelected(d.staffId===null?"":String(d.staffId));setName(d.name);setPosition(d.position);setBio(d.biography);setNotice("Редактирование существующего черновика №"+d.id);window.scrollTo({top:0,behavior:"smooth"});}
 async function send(action:"create"|"submit"|"update",id?:number){setBusy(true);setNotice("");try{
  const r=await fetch(`/api/admin-staff?action=${action}${id?`&id=${id}`:""}`,{method:action==="update"?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(action!=="submit"?{staffId:selected?Number(selected):null,name,position,biography:bio}:{})});
  const d=await r.json();if(!r.ok)throw new Error(d.detail??d.error??`HTTP ${r.status}`);
  if(action!=="submit" && photoFile){
    const form=new FormData();form.append("file",photoFile);
    const photoResp=await fetch(`/api/admin-staff-photo?id=${d.id}`,{method:"POST",body:form});
    if(!photoResp.ok){const err=await photoResp.json();throw new Error(err.detail??err.error??`Фото: HTTP ${photoResp.status}`);}
    setPhotoFile(null);
  }
  await load();if(action!=="submit")setEditingDraftId(null);setNotice(action==="submit"?"Заявка отправлена ЦЦР. Публичные сведения пока не изменены.":"Черновик сохранён в тестовой PostgreSQL. Теперь его можно отправить ЦЦР.");
 }catch(e){setNotice(e instanceof Error?e.message:String(e));}finally{setBusy(false);}}
 return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900"><div className="mx-auto max-w-5xl space-y-6">
  <Link href="/admin/faculty" className="text-sm font-semibold text-blue-800">← Вернуться в кабинет (для кафедры: /admin/department)</Link>
  <header><h1 className="text-3xl font-bold text-[#204774]">Сотрудники подразделения</h1><p className="mt-2 text-sm text-slate-600">Список из тестовой PostgreSQL. ФИО, должность и биография меняются только по одобрению ЦЦР. Личные контакты не редактируются.</p></header>
  {notice&&<p role="status" className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm">{notice}</p>}
  <section className="rounded-2xl border bg-white p-5"><h2 className="text-lg font-bold">Сейчас в базе ({staff.length})</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{staff.map(s=><button key={s.id} type="button" onClick={()=>choose(String(s.id))} className="rounded-lg border p-3 text-left text-sm hover:bg-slate-50"><strong>{s.name}</strong><p className="mt-1 text-slate-600">{s.position}</p></button>)}</div>{!staff.length&&<p className="mt-3 text-sm text-slate-600">Сотрудников пока нет. Можно подать заявку на добавление.</p>}</section>
  <section className="space-y-4 rounded-2xl border bg-white p-5"><h2 className="text-lg font-bold">{editingDraftId===null?"Создать заявку":"Редактировать черновик №"+editingDraftId}</h2><label className="block text-sm font-semibold">Запись<select className={`${field} mt-2`} disabled={editingDraftId!==null} value={selected} onChange={e=>choose(e.target.value)}><option value="">Новый сотрудник</option>{staff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
  <label className="block text-sm font-semibold">ФИО<input className={`${field} mt-2`} value={name} onChange={e=>setName(e.target.value)} maxLength={300}/></label>
  <label className="block text-sm font-semibold">Должность<input className={`${field} mt-2`} value={position} onChange={e=>setPosition(e.target.value)} maxLength={300}/></label>
  <label className="block text-sm font-semibold">Биография<textarea className={`${field} mt-2`} rows={5} value={bio} onChange={e=>setBio(e.target.value)} maxLength={12000}/></label>
  <label className="block text-sm font-semibold">Фотография (JPEG, PNG или WebP, до 5 МБ)
    <input type="file" accept="image/jpeg,image/png,image/webp" className={`${field} mt-2`} onChange={e=>setPhotoFile(e.target.files?.[0]??null)}/>
    <span className="mt-1 block text-xs text-slate-600">Фото сохраняется вместе с черновиком и публикуется только после решения ЦЦР.</span>
  </label>
  <div className="flex flex-wrap gap-2"><button className={button} disabled={busy||!name.trim()||!position.trim()} onClick={()=>void send(editingDraftId===null?"create":"update",editingDraftId??undefined)}>{editingDraftId===null?"Сохранить заявку как черновик":"Сохранить изменения в черновике"}</button>{editingDraftId!==null&&<button className="rounded-lg border px-4 py-2.5 text-sm" type="button" onClick={()=>choose("")}>Отменить редактирование</button>}</div></section>
  <section className="space-y-3 rounded-2xl border bg-white p-5"><h2 className="text-lg font-bold">Мои заявки ({drafts.length})</h2>{drafts.map(d=><div key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"><div><strong>{d.name}</strong><p className="text-sm text-slate-600">{d.position} · {({draft:"Черновик",submitted:"На проверке",changes_requested:"На доработке",approved:"Одобрено"} as Record<string,string>)[d.status]??d.status}</p>{d.hasPhoto&&<a target="_blank" rel="noopener noreferrer" href={`/api/admin-staff-photo?id=${d.id}`} className="mt-1 block text-sm font-semibold text-blue-700 underline">Посмотреть фото заявки</a>}{d.feedback&&<p className="mt-1 text-sm text-amber-700">Комментарий ЦЦР: {d.feedback}</p>}</div>{(d.status==="draft"||d.status==="changes_requested")&&<div className="flex flex-wrap gap-2"><button className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800" disabled={busy} onClick={()=>editDraft(d)}>Изменить</button><button className={button} disabled={busy} onClick={()=>void send("submit",d.id)}>Отправить ЦЦР</button></div>}</div>)}{!drafts.length&&<p className="text-sm text-slate-500">Заявок пока нет</p>}</section>
 </div></main>;
}
