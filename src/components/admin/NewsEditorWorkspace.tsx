"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import NewsMediaPanel, { type EditorialMedia } from "@/components/admin/NewsMediaPanel";
import { CheckCircle2, ClipboardCheck, FilePenLine, Newspaper, RefreshCw, Send, ShieldCheck, XCircle } from "lucide-react";
import { faculties } from "@/lib/faculty-data";
import { departments } from "@/lib/department-data";

type Status = "draft" | "submitted" | "changes_requested" | "published";
type Item = { id: number; title: string; excerpt: string; body: string; category: string; facultySlug: string | null; departmentSlug: string | null; status: Status; feedback: string; updatedAt: string; publishedSlug: string | null; media: EditorialMedia[] };
type FormData = { title: string; excerpt: string; body: string; category: string; facultySlug: string; departmentSlug: string };
const blank: FormData = { title:"", excerpt:"", body:"", category:"Новости", facultySlug:"", departmentSlug:"" };
const field = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const primary = "rounded-xl bg-[#1e5799] px-4 py-3 text-sm font-semibold text-white hover:bg-[#16457c] disabled:opacity-40";
const secondary = "rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40";
const names: Record<Status,string> = {draft:"Черновик",submitted:"На проверке ЦЦР",changes_requested:"Нужны исправления",published:"Опубликовано"};

export default function NewsEditorWorkspace({ review = false }: { review?: boolean }) {
  const [items,setItems] = useState<Item[]>([]);
  const [form,setForm] = useState<FormData>(blank);
  const [editing,setEditing] = useState<number|null>(null);
  const [feedback,setFeedback] = useState<Record<number,string>>({});
  const [notice,setNotice] = useState("");
  const [busy,setBusy] = useState(false);
  const [loading,setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      const r=await fetch("/api/admin-editor",{cache:"no-store"});
      const json: unknown=await r.json();
      if(!r.ok) throw new Error(`Ошибка загрузки: ${r.status}`);
      if(!Array.isArray(json)) throw new Error("Неверный ответ сервера");
      setItems(json as Item[]);
    } catch(e) { setNotice(e instanceof Error?e.message:"Не удалось загрузить новости"); }
    finally {setLoading(false);}
  },[]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
        void refresh();
    }, 0);

    return () => window.clearTimeout(timer);
}, [refresh]);
  async function act(action: "create"|"update"|"submit"|"decision", id?: number, extra?: Record<string,unknown>) {
    setBusy(true); setNotice("");
    try {
      const payload = action === "create" || action === "update"
        ? { ...form, facultySlug:form.facultySlug||null, departmentSlug:form.departmentSlug||null }
        : (extra??{});
      const r=await fetch("/api/admin-editor",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,id,...payload})});
      if(!r.ok){const j: {detail?: unknown;error?:unknown}=await r.json(); throw new Error(typeof j.detail === "string" ? j.detail : typeof j.error === "string" ? j.error : `HTTP ${r.status}`);}
      setNotice(action==="decision"?(extra?.approve?"ЦЦР одобрил и опубликовал новость":"Возвращено на доработку"):action==="submit"?"Отправлено на проверку ЦЦР":"Черновик сохранён в PostgreSQL");
      if(action==="create"||action==="update"){setEditing(null);setForm(blank);}
      await refresh();
    }catch(e){setNotice(e instanceof Error?e.message:"Ошибка запроса");}
    finally{setBusy(false);}
  }
  const pending=items.filter(x=>x.status==="submitted");
  const sourceName=(x:Item)=> x.departmentSlug ? departments.find(d=>d.slug===x.departmentSlug)?.name ?? x.departmentSlug : x.facultySlug ? faculties.find(f=>f.slug===x.facultySlug)?.name ?? x.facultySlug : "Университет БГУ";
  const rows=review?items.filter(x=>x.status!=="draft"):items;
  return <div className="min-h-screen bg-[#f3f6fb] text-slate-900">
    <header className="bg-[#173e72] px-5 py-9 text-white sm:px-10"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">БГУ · Цифровой университет</p><h1 className="mt-2 text-3xl font-extrabold">{review?"ЦЦР · Согласование новостей":"Редакция новостей"}</h1><p className="mt-2 text-sm text-blue-100">{review?"Только ЦЦР решает, что появляется на сайте":"Создание и оформление новостей всех подразделений"}</p></div><Link className="rounded-xl border border-white/30 px-4 py-2.5 text-sm hover:bg-white/10" href={review?"/admin":"/"}>{review?"В панель ЦЦР":"На сайт БГУ"}</Link></div></header>
    <main className="mx-auto max-w-6xl space-y-6 px-5 py-7 sm:px-10">
      <div className="grid gap-4 sm:grid-cols-3">{[{label:"Всего материалов",n:items.length,icon:Newspaper},{label:"Ожидают ЦЦР",n:pending.length,icon:ClipboardCheck},{label:"Опубликовано",n:items.filter(x=>x.status==="published").length,icon:CheckCircle2}].map(s=><div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5"><s.icon className="text-[#1e5799]" size={22}/><p className="mt-4 text-3xl font-bold">{s.n}</p><p className="text-sm text-slate-500">{s.label}</p></div>)}</div>
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Локальная тестовая версия. Черновики сохраняются в тестовой PostgreSQL. Одобрение ЦЦР добавляет новость в публичную таблицу <strong>тестовой</strong> базы. Фото сохраняются в тестовой PostgreSQL и становятся публичными только после одобрения ЦЦР.</p>
      {notice&&<p role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">{notice}</p>}
      {!review&&<section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><FilePenLine size={22}/> {editing?`Редактирование №${editing}`:"Создать новость"}</h2>
        <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Факультет<select className={`${field} mt-2`} value={form.facultySlug} onChange={e=>setForm(f=>({...f,facultySlug:e.target.value,departmentSlug:""}))}><option value="">Весь университет</option>{faculties.map(f=><option key={f.slug} value={f.slug}>{f.name}</option>)}</select></label><label className="text-sm font-semibold">Кафедра<select className={`${field} mt-2`} value={form.departmentSlug} onChange={e=>setForm(f=>({...f,departmentSlug:e.target.value}))}><option value="">Без кафедры</option>{departments.filter(d=>!form.facultySlug||d.facultySlug===form.facultySlug).map(d=><option key={d.slug} value={d.slug}>{d.name}</option>)}</select></label></div>
        <label className="block text-sm font-semibold">Категория<select className={`${field} mt-2`} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>{["Новости","Наука","Международное сотрудничество","Мероприятия"].map(c=><option key={c}>{c}</option>)}</select></label>
        <label className="block text-sm font-semibold">Заголовок<input className={`${field} mt-2`} maxLength={180} value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></label>
        <label className="block text-sm font-semibold">Краткое описание<textarea className={`${field} mt-2`} rows={2} value={form.excerpt} onChange={e=>setForm(f=>({...f,excerpt:e.target.value}))}/></label>
        <label className="block text-sm font-semibold">Полный текст<textarea className={`${field} mt-2`} rows={8} value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))}/></label>
        <div className="flex flex-wrap gap-3"><button type="button" disabled={busy||!form.title.trim()||!form.body.trim()} className={primary} onClick={()=>void act(editing?"update":"create",editing??undefined)}>Сохранить черновик</button>{editing&&<button type="button" className={secondary} onClick={()=>{setEditing(null);setForm(blank);}}>Отменить</button>}</div>
      </section>}
      <section className="rounded-2xl border border-slate-200 bg-white p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-bold">{review?"Очередь согласования":"Мои новости"}</h2><p className="text-sm text-slate-500">{review?"Заявки всех подразделений и редактора":"Черновики, отправленные материалы и решения ЦЦР"}</p></div><button className={secondary} onClick={()=>void refresh()} type="button"><RefreshCw size={16} className="mr-2 inline"/>Обновить</button></div>
      {loading&&<p>Загрузка…</p>}{!loading&&rows.length===0&&<p className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">Материалов пока нет</p>}
      <div className="space-y-3">{rows.map(x=><article key={x.id} className="rounded-xl border border-slate-200 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{sourceName(x)}</p><h3 className="mt-1 text-lg font-bold">{x.title}</h3></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${x.status==="published"?"bg-green-100 text-green-800":x.status==="changes_requested"?"bg-amber-100 text-amber-800":"bg-blue-50 text-blue-800"}`}>{names[x.status]}</span></div><p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{x.excerpt||x.body.slice(0,300)}</p>{x.feedback&&<p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm">Замечание ЦЦР: {x.feedback}</p>}
      <NewsMediaPanel itemId={x.id} media={x.media??[]} readOnly={review || (x.status!=="draft" && x.status!=="changes_requested")} onChanged={refresh} />
      {!review&&(x.status==="draft"||x.status==="changes_requested")&&<div className="mt-4 flex flex-wrap gap-2"><button type="button" className={secondary} onClick={()=>{setEditing(x.id);setForm({title:x.title,excerpt:x.excerpt,body:x.body,category:x.category,facultySlug:x.facultySlug??"",departmentSlug:x.departmentSlug??""});window.scrollTo({top:0,behavior:"smooth"});}}><FilePenLine size={16} className="mr-2 inline"/>Изменить</button><button disabled={busy} type="button" className={primary} onClick={()=>void act("submit",x.id)}><Send size={16} className="mr-2 inline"/>Отправить в ЦЦР</button></div>}
      {review&&x.status==="submitted"&&<div className="mt-4 space-y-3 border-t border-slate-100 pt-4"><p className="whitespace-pre-wrap text-sm">{x.body}</p><textarea className={field} rows={2} placeholder="Причина возврата на доработку" value={feedback[x.id]??""} onChange={e=>setFeedback(f=>({...f,[x.id]:e.target.value}))}/><div className="flex flex-wrap gap-2"><button disabled={busy} className={primary} type="button" onClick={()=>void act("decision",x.id,{approve:true})}><ShieldCheck size={17} className="mr-2 inline"/>Одобрить и опубликовать</button><button disabled={busy||!feedback[x.id]?.trim()} className={secondary} type="button" onClick={()=>void act("decision",x.id,{approve:false,feedback:feedback[x.id]})}><XCircle size={17} className="mr-2 inline"/>Вернуть на доработку</button></div></div>}
      {x.status==="published"&&x.publishedSlug&&<p className="mt-3 text-xs text-slate-500">Публикация в тестовом Backend: {x.publishedSlug}</p>}
      </article>)}</div></section>
    </main>
  </div>;
}

