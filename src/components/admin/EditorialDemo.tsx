"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Role = "faculty" | "department" | "review";
type Status = "draft" | "submitted" | "changes_requested" | "approved";
type Article = {
  id: string;
  owner: "faculty" | "department";
  title: string;
  summary: string;
  body: string;
  status: Status;
  feedback: string;
  updatedAt: string;
};
const KEY = "bsu-editorial-workflow-demo-v1";
const labels: Record<Status, string> = {
  draft: "Р§РµСЂРЅРѕРІРёРє", submitted: "РћР¶РёРґР°РµС‚ РїСЂРѕРІРµСЂРєРё", changes_requested: "Р’РµСЂРЅСѓС‚СЊ РЅР° РґРѕСЂР°Р±РѕС‚РєСѓ", approved: "РћРґРѕР±СЂРµРЅРѕ Р¦Р¦Р  (РґРµРјРѕ)",
};
const roleName: Record<Role,string> = { faculty: "РљР°Р±РёРЅРµС‚ С„Р°РєСѓР»СЊС‚РµС‚Р°", department: "РљР°Р±РёРЅРµС‚ РєР°С„РµРґСЂС‹", review: "РњРѕРґРµСЂР°С†РёСЏ Р¦Р¦Р " };
function load(): Article[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(data) ? data.filter((a): a is Article =>
      !!a && typeof a === "object" && typeof a.id === "string" && typeof a.title === "string" &&
      typeof a.body === "string" && (a.owner === "faculty" || a.owner === "department") &&
      ["draft", "submitted", "changes_requested", "approved"].includes(a.status)) : [];
  } catch { return []; }
}
const styles = {
  field: "w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none",
  button: "rounded-lg bg-[#204774] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50",
  secondary: "rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700",
};
export default function EditorialDemo({ role }: { role: Role }) {
  const [entries, setEntries] = useState<Article[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string,string>>({});
  const [notice, setNotice] = useState("");
  useEffect(() => {
  const timer = window.setTimeout(() => {
    setEntries(load());
    setHydrated(true);
  }, 0);

  return () => window.clearTimeout(timer);
}, []);
  function write(next: Article[]) {
    setEntries(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  function clearForm() {setTitle("");setSummary("");setBody("");setEditing(null);}
  function save(submit: boolean) {
    if (role === "review" || !title.trim() || !body.trim()) return;
    const now = new Date().toISOString();
    const status: Status = submit ? "submitted" : "draft";
    if (editing) {
      const original = entries.find(e => e.id === editing);
      if (!original || original.owner !== role || !["draft", "changes_requested"].includes(original.status)) return;
      write(entries.map(e => e.id === editing ? {...e, title: title.trim(),summary:summary.trim(), body:body.trim(),status,feedback:"",updatedAt:now} : e));
    } else {
      write([{ id: crypto.randomUUID(), owner: role, title:title.trim(),summary:summary.trim(),body:body.trim(),status,feedback:"",updatedAt:now },...entries]);
    }
    clearForm();
    setNotice(submit ? "РћС‚РїСЂР°РІР»РµРЅРѕ РЅР° РїСЂРѕРІРµСЂРєСѓ Р¦Р¦Р  вЂ” С‚РѕР»СЊРєРѕ РІ РґРµРјРѕ." : "Р§РµСЂРЅРѕРІРёРє СЃРѕС…СЂР°РЅС‘РЅ С‚РѕР»СЊРєРѕ РІ СЌС‚РѕРј Р±СЂР°СѓР·РµСЂРµ.");
  }
  function review(id: string, approve: boolean) {
    if (role !== "review") return;
    const item = entries.find(e => e.id === id);
    if (!item || item.status !== "submitted") return;
    const feedback = (comments[id] ?? "").trim();
    if (!approve && !feedback) {setNotice("Р§С‚РѕР±С‹ РІРµСЂРЅСѓС‚СЊ РЅРѕРІРѕСЃС‚СЊ РЅР° РґРѕСЂР°Р±РѕС‚РєСѓ, РЅР°РїРёС€РёС‚Рµ Р·Р°РјРµС‡Р°РЅРёРµ.");return;}
    write(entries.map(e => e.id === id ? {...e,status:approve?"approved":"changes_requested",feedback,updatedAt:new Date().toISOString()} : e));
    setNotice(approve ? "РќРѕРІРѕСЃС‚СЊ РѕРґРѕР±СЂРµРЅР° РІ РґРµРјРѕ. РќР° СЂРµР°Р»СЊРЅС‹Р№ СЃР°Р№С‚ РѕРЅР° РќР• РѕРїСѓР±Р»РёРєРѕРІР°РЅР°." : "Р’РѕР·РІСЂР°С‰РµРЅРѕ Р°РІС‚РѕСЂСѓ СЃ Р·Р°РјРµС‡Р°РЅРёРµРј (РґРµРјРѕ).");
  }
  const shown = role === "review" ? entries.filter(e => e.status !== "draft") : entries.filter(e => e.owner === role);
  return <main className="min-h-screen bg-[#f3f6fb] px-4 py-8 text-slate-900 sm:px-8">
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-2xl bg-[#204774] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-widest text-blue-200">Р‘Р“РЈ В· Р”РµРјРѕРЅСЃС‚СЂР°С†РёСЏ СЂРµРґР°РєС†РёРѕРЅРЅРѕРіРѕ РїСЂРѕС†РµСЃСЃР°</p><h1 className="mt-2 text-2xl font-bold">{roleName[role]}</h1></div><Link className="text-sm underline" href="/admin">в†ђ Р“Р»Р°РІРЅР°СЏ Р°РґРјРёРЅ-РїР°РЅРµР»СЊ</Link></div>
        <div className="mt-5 flex flex-wrap gap-2">{(["faculty", "department", "review"] as Role[]).map(r=><Link key={r} href={`/admin/${r}`} className={`rounded-lg px-3 py-2 text-sm ${role===r?"bg-white font-semibold text-[#204774]":"bg-white/10 text-white hover:bg-white/20"}`}>{roleName[r]}</Link>)}</div>
      </div>
      <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"><strong>РўРѕР»СЊРєРѕ Р»РѕРєР°Р»СЊРЅРѕРµ РґРµРјРѕ.</strong> Р—РґРµСЃСЊ РЅРµС‚ Р°РІС‚РѕСЂРёР·Р°С†РёРё, СЂР°Р·РіСЂР°РЅРёС‡РµРЅРёСЏ РїСЂР°РІ РЅР° СЃРµСЂРІРµСЂРµ, РѕС‚РїСЂР°РІРєРё РІ Backend Рё РЅР°СЃС‚РѕСЏС‰РµР№ РїСѓР±Р»РёРєР°С†РёРё. Р РѕР»Рё РїРµСЂРµРєР»СЋС‡Р°СЋС‚СЃСЏ СЃСЃС‹Р»РєР°РјРё РёСЃРєР»СЋС‡РёС‚РµР»СЊРЅРѕ РґР»СЏ РїСЂРѕРІРµСЂРєРё РёРЅС‚РµСЂС„РµР№СЃР°. Р”Р°РЅРЅС‹Рµ С…СЂР°РЅСЏС‚СЃСЏ РІ localStorage Р±СЂР°СѓР·РµСЂР°; РЅРµ РІРІРѕРґРёС‚Рµ СЂРµР°Р»СЊРЅС‹Рµ РїРµСЂСЃРѕРЅР°Р»СЊРЅС‹Рµ РґР°РЅРЅС‹Рµ РёР»Рё РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅСѓСЋ РёРЅС„РѕСЂРјР°С†РёСЋ.</p>
      {!hydrated && <p>Р—Р°РіСЂСѓР·РєР° РґРµРјРѕ-РґР°РЅРЅС‹С…вЂ¦</p>}
      {hydrated && <>
        {notice && <p role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm">{notice}</p>}
        {role!=="review" && <section className="space-y-3 rounded-2xl border bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">{editing?"Р РµРґР°РєС‚РёСЂРѕРІР°С‚СЊ РЅРѕРІРѕСЃС‚СЊ":"РЎРѕР·РґР°С‚СЊ РЅРѕРІРѕСЃС‚СЊ"}</h2><label className="block text-sm font-medium">Р—Р°РіРѕР»РѕРІРѕРє<input value={title} onChange={e=>setTitle(e.target.value)} className={`${styles.field} mt-1`} maxLength={180}/></label><label className="block text-sm font-medium">РљСЂР°С‚РєРѕРµ РѕРїРёСЃР°РЅРёРµ<textarea value={summary} onChange={e=>setSummary(e.target.value)} className={`${styles.field} mt-1`} rows={2}/></label><label className="block text-sm font-medium">РўРµРєСЃС‚ РЅРѕРІРѕСЃС‚Рё<textarea value={body} onChange={e=>setBody(e.target.value)} className={`${styles.field} mt-1`} rows={5}/></label><div className="flex flex-wrap gap-2"><button type="button" className={styles.secondary} disabled={!title.trim()||!body.trim()} onClick={()=>save(false)}>РЎРѕС…СЂР°РЅРёС‚СЊ С‡РµСЂРЅРѕРІРёРє</button><button type="button" className={styles.button} disabled={!title.trim()||!body.trim()} onClick={()=>save(true)}>РћС‚РїСЂР°РІРёС‚СЊ РІ Р¦Р¦Р </button>{editing&&<button type="button" className={styles.secondary} onClick={clearForm}>РћС‚РјРµРЅР°</button>}</div></section>}
        <section className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">{role==="review"?"РћС‡РµСЂРµРґСЊ Рё СЂРµС€РµРЅРёСЏ Р¦Р¦Р ":"РњРѕРё РЅРѕРІРѕСЃС‚Рё"}</h2><span className="text-sm text-slate-500">{shown.length} РјР°С‚РµСЂРёР°Р»РѕРІ</span></div>
        {shown.length===0 && <div className="rounded-xl border bg-white p-8 text-center text-slate-500">РњР°С‚РµСЂРёР°Р»РѕРІ РїРѕРєР° РЅРµС‚. РЎРѕР·РґР°Р№ РЅРѕРІРѕСЃС‚СЊ РІ РєР°Р±РёРЅРµС‚Рµ С„Р°РєСѓР»СЊС‚РµС‚Р° РёР»Рё РєР°С„РµРґСЂС‹, Р·Р°С‚РµРј РїРµСЂРµРєР»СЋС‡РёСЃСЊ РІ Р¦Р¦Р .</div>}
        {shown.map(a=><article key={a.id} className="space-y-3 rounded-xl border bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-bold">{a.title}</h3><p className="mt-1 text-xs text-slate-500">РСЃС‚РѕС‡РЅРёРє: {a.owner==="faculty"?"Р¤Р°РєСѓР»СЊС‚РµС‚ (РґРµРјРѕ)":"РљР°С„РµРґСЂР° (РґРµРјРѕ)"}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{labels[a.status]}</span></div>{a.summary&&<p className="text-sm text-slate-600">{a.summary}</p>}<p className="whitespace-pre-wrap text-sm">{a.body}</p>{a.feedback&&<p className="rounded-lg bg-amber-50 p-3 text-sm"><strong>РљРѕРјРјРµРЅС‚Р°СЂРёР№ Р¦Р¦Р :</strong> {a.feedback}</p>}
        {role==="review"&&a.status==="submitted"&&<div className="space-y-2 border-t pt-3"><label className="block text-sm font-medium">Р—Р°РјРµС‡Р°РЅРёРµ (РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ РїСЂРё РІРѕР·РІСЂР°С‚Рµ)<textarea className={`${styles.field} mt-1`} value={comments[a.id]??""} onChange={e=>setComments(old=>({...old,[a.id]:e.target.value}))} rows={2}/></label><div className="flex flex-wrap gap-2"><button className={styles.button} type="button" onClick={()=>review(a.id,true)}>РћРґРѕР±СЂРёС‚СЊ (РґРµРјРѕ)</button><button className={styles.secondary} type="button" onClick={()=>review(a.id,false)}>Р’РµСЂРЅСѓС‚СЊ РЅР° РґРѕСЂР°Р±РѕС‚РєСѓ</button></div></div>}
        {role!=="review"&&a.owner===role&&["draft","changes_requested"].includes(a.status)&&<button type="button" className={styles.secondary} onClick={()=>{setEditing(a.id);setTitle(a.title);setSummary(a.summary);setBody(a.body);window.scrollTo({top:0,behavior:"smooth"});}}>Р РµРґР°РєС‚РёСЂРѕРІР°С‚СЊ</button>}</article>)}
        </section>
      </>}
      <p className="text-xs text-slate-500">РќР°СЃС‚РѕСЏС‰РёРµ СЂРѕР»Рё, РїСЂРёРЅР°РґР»РµР¶РЅРѕСЃС‚СЊ РєР°С„РµРґСЂРµ/С„Р°РєСѓР»СЊС‚РµС‚Сѓ, Р°СѓРґРёС‚, С…СЂР°РЅРµРЅРёРµ Рё РїСѓР±Р»РёРєР°С†РёСЏ Р±СѓРґСѓС‚ РѕР±РµСЃРїРµС‡РµРЅС‹ СЃРµСЂРІРµСЂРѕРј РїРѕСЃР»Рµ РёРЅС‚РµРіСЂР°С†РёРё. Р­С‚РѕС‚ РїСЂРѕС‚РѕС‚РёРї РЅРµ РјРµРЅСЏРµС‚ РєРѕРЅС‚СЂР°РєС‚ Backend V7.4.</p>
    </div>
  </main>;
}

