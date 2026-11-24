"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, BookOpenText, Building2, CheckCircle2, ChevronRight,
  CircleAlert, ClipboardCheck, FilePenLine, LayoutDashboard, MessageSquareText,
  Newspaper, Save, Send, XCircle,
} from "lucide-react";
import { faculties } from "@/lib/faculty-data";
import { departments } from "@/lib/department-data";

type Mode = "faculty" | "department" | "review";
type Owner = "faculty" | "department";
type Status = "draft" | "submitted" | "changes_requested" | "approved";
type Article = {
  id: string; owner: Owner; ownerSlug: string; ownerName: string;
  title: string; summary: string; body: string;
  status: Status; feedback: string; updatedAt: string;
};
type Unit = { slug: string; name: string; facultySlug?: string };
type Section = "overview" | "profile" | "news";
const KEY = "bsu-editorial-workflow-demo-v2"; // Preserve V8.4 records.
const PROFILE_KEY = "bsu-unit-profiles-demo-v1";
const facultyUnits: Unit[] = faculties.map((f) => ({ slug: f.slug, name: f.name }));
const departmentUnits: Unit[] = departments.map((d) => ({ slug: d.slug, name: d.name, facultySlug: d.facultySlug }));
const statuses: Status[] = ["draft", "submitted", "changes_requested", "approved"];
const labels: Record<Status, string> = {
  draft: "Черновик", submitted: "На проверке", changes_requested: "На доработке", approved: "Одобрено · демо",
};
const input = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
const primary = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#235aa2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#174882] disabled:cursor-not-allowed disabled:opacity-40";
const secondary = "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40";
const card = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";
function validArticle(value: unknown): value is Article {
  if (!value || typeof value !== "object") return false;
  const a = value as Record<string, unknown>;
  return typeof a.id === "string" && (a.owner === "faculty" || a.owner === "department") &&
    typeof a.ownerSlug === "string" && typeof a.ownerName === "string" &&
    typeof a.title === "string" && typeof a.summary === "string" && typeof a.body === "string" &&
    typeof a.feedback === "string" && typeof a.updatedAt === "string" && statuses.includes(a.status as Status);
}
function readArticles(): Article[] {
  try { const x: unknown = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(x) ? x.filter(validArticle) : []; }
  catch { return []; }
}
function readProfiles(): Record<string, { description: string; contact: string }> {
  try {
    const x: unknown = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
    if (!x || typeof x !== "object" || Array.isArray(x)) return {};
    const result: Record<string, { description: string; contact: string }> = {};
    for (const [key, value] of Object.entries(x)) {
      if (value && typeof value === "object" && "description" in value && "contact" in value &&
        typeof value.description === "string" && typeof value.contact === "string")
        result[key] = { description: value.description, contact: value.contact };
    }
    return result;
  } catch { return {}; }
}
function StatusMark({ status }: { status: Status }) {
  const classes: Record<Status, string> = {
    draft: "bg-slate-100 text-slate-700", submitted: "bg-blue-50 text-blue-700",
    changes_requested: "bg-amber-50 text-amber-800", approved: "bg-emerald-50 text-emerald-700",
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes[status]}`}>{labels[status]}</span>;
}
export default function EditorialDemo({ role, lockedSlug }: { role: Mode; lockedSlug?: string }) {
  const reviewMode = role === "review";
  const isFaculty = role === "faculty";
  const units = isFaculty ? facultyUnits : role === "department" ? departmentUnits : [];
  const [selectedSlug, setSelectedSlug] = useState(lockedSlug ?? "");
  const [section, setSection] = useState<Section>("overview");
  const [entries, setEntries] = useState<Article[]>([]);
  const [profiles, setProfiles] = useState<Record<string, { description: string; contact: string }>>({});
  const [ready, setReady] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [reviewFilter, setReviewFilter] = useState<"pending" | "all">("pending");

  useEffect(() => {
    // Read browser storage after mount; do not synchronously set state inside the effect.
    const timer = window.setTimeout(() => { setEntries(readArticles()); setProfiles(readProfiles()); setReady(true); }, 0);
    const sync = (event: StorageEvent) => { if (event.key === KEY) setEntries(readArticles()); if (event.key === PROFILE_KEY) setProfiles(readProfiles()); };
    window.addEventListener("storage", sync);
    return () => { window.clearTimeout(timer); window.removeEventListener("storage", sync); };
  }, []);

  const unit = units.find((u) => u.slug === selectedSlug);
  const mine = useMemo(() => entries.filter((a) => a.owner === role && a.ownerSlug === selectedSlug).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)), [entries, role, selectedSlug]);
  const reviewItems = useMemo(() => entries.filter((a) => reviewFilter === "all" ? a.status !== "draft" : a.status === "submitted").sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)), [entries, reviewFilter]);
  const pending = entries.filter((a) => a.status === "submitted").length;
  const unitTitle = isFaculty ? "Факультет" : "Кафедра";
  const headerTitle = reviewMode ? "Проверка новостей" : isFaculty ? "Кабинет факультета" : "Кабинет кафедры";
  const profileKey = `${role}:${selectedSlug}`;

  function selectUnit(slug: string) {
    if (lockedSlug) return;
    setSelectedSlug(slug); setSection("overview"); setNotice(""); resetEditor();
    const p = profiles[`${role}:${slug}`]; setDescription(p?.description ?? ""); setContact(p?.contact ?? "");
  }
  function write(items: Article[]) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); setEntries(items); }
    catch { setNotice("Не удалось сохранить данные в браузере."); }
  }
  function resetEditor() { setTitle(""); setSummary(""); setBody(""); setEditing(null); }
  function saveProfile() {
    if (!unit) return;
    const next = { ...profiles, [profileKey]: { description: description.trim(), contact: contact.trim() } };
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(next)); setProfiles(next); setNotice("Описание подразделения сохранено только в этом браузере."); }
    catch { setNotice("Не удалось сохранить демо-профиль."); }
  }
  function saveArticle(submit: boolean) {
    if (reviewMode || !unit || !title.trim() || !body.trim()) return;
    const status: Status = submit ? "submitted" : "draft";
    const now = new Date().toISOString();
    if (editing) {
      const old = entries.find((a) => a.id === editing);
      if (!old || old.owner !== role || old.ownerSlug !== selectedSlug || !["draft", "changes_requested"].includes(old.status)) return;
      write(entries.map((a) => a.id === editing ? { ...a, title: title.trim(), summary: summary.trim(), body: body.trim(), feedback: "", status, updatedAt: now } : a));
    } else {
      write([{ id: crypto.randomUUID(), owner: role as Owner, ownerSlug: unit.slug, ownerName: unit.name, title: title.trim(), summary: summary.trim(), body: body.trim(), status, feedback: "", updatedAt: now }, ...entries]);
    }
    resetEditor();
    setNotice(submit ? "Новость передана в демонстрационную очередь ЦЦР." : "Черновик сохранён только в браузере.");
  }
  function editArticle(item: Article) {
    if (reviewMode || item.owner !== role || item.ownerSlug !== selectedSlug || !["draft", "changes_requested"].includes(item.status)) return;
    setEditing(item.id); setTitle(item.title); setSummary(item.summary); setBody(item.body); setSection("news"); setNotice("");
  }
  function review(id: string, approve: boolean) {
    if (!reviewMode) return;
    const item = entries.find((a) => a.id === id);
    if (!item || item.status !== "submitted") return;
    const comment = (notes[id] || "").trim();
    if (!approve && !comment) { setNotice("Чтобы вернуть новость, напишите замечание."); return; }
    write(entries.map((a) => a.id === id ? { ...a, status: approve ? "approved" : "changes_requested", feedback: approve ? "" : comment, updatedAt: new Date().toISOString() } : a));
    setNotice(approve ? "Одобрено в демо. На настоящий сайт новость НЕ опубликована." : "Материал возвращён на доработку в демо.");
  }

  const menu = reviewMode ? [{ label: "Очередь модерации", icon: ClipboardCheck, href: "/admin/review" }, { label: "Панель ЦЦР", icon: LayoutDashboard, href: "/admin" }]
    : [{ label: "Обзор", key: "overview" as const, icon: LayoutDashboard }, { label: "О подразделении", key: "profile" as const, icon: Building2 }, { label: "Новости и заявки", key: "news" as const, icon: Newspaper }];

  return <div className="min-h-screen bg-[#f4f7fb] text-slate-900 lg:flex">
    <aside className="w-full bg-[#153d70] text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0">
      <div className="border-b border-white/10 px-6 py-6"><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-200">БГУ · Портал</p><h1 className="mt-2 text-xl font-bold">{reviewMode ? "ЦЦР" : unitTitle}</h1><p className="mt-1 text-xs text-white/60">{reviewMode ? "Центр цифрового развития" : "Личный кабинет подразделения"}</p></div>
      <nav aria-label="Навигация кабинета" className="flex gap-1 overflow-x-auto px-3 py-3 lg:block lg:space-y-1 lg:overflow-visible lg:py-6">
        {menu.map((m) => {
          const Icon = m.icon;
          const active = "key" in m ? section === m.key : false;
          const cls = `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${active ? "bg-white text-[#153d70]" : "text-white/80 hover:bg-white/10"}`;
          return "href" in m ? <Link key={m.label} href={m.href} className={cls}><Icon size={18}/>{m.label}</Link> : <button key={m.label} type="button" onClick={() => { setSection(m.key!); setNotice(""); }} className={`${cls} w-full text-left`}><Icon size={18}/>{m.label}</button>;
        })}
      </nav>
      <div className="px-6 pb-5"><Link href="/" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"><ArrowLeft size={16}/> На сайт БГУ</Link></div>
    </aside>

    <div className="min-w-0 flex-1">
      <header className="border-b border-slate-200 bg-white px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{reviewMode ? "Центр цифрового развития" : "Управление подразделением"}</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-[#153d70]">{headerTitle}</h2></div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">ДЕМО · без публикации</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-6 px-5 py-7 sm:px-8">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><CircleAlert className="mt-0.5 shrink-0" size={19}/><p>Вход подтверждён через тестовый Backend. Формы и новости пока демонстрационные: данные находятся в localStorage и не передаются в PostgreSQL. Настоящая защита редактирования потребует серверных API.</p></div>
        {notice && <div role="status" className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900"><MessageSquareText size={18}/>{notice}</div>}
        {!ready ? <p className="text-sm text-slate-500">Загрузка демо-данных…</p> : <>
          {!reviewMode && !lockedSlug && <section className={card}>
            <label htmlFor="unit-choice" className="text-sm font-semibold text-slate-700">{isFaculty ? "Выбери факультет (для демонстрации)" : "Выбери кафедру (для демонстрации)"}</label>
            <select id="unit-choice" className={`${input} mt-3`} value={selectedSlug} onChange={(e) => selectUnit(e.target.value)}><option value="">— Выбрать подразделение —</option>{units.map((u) => <option key={u.slug} value={u.slug}>{u.name}</option>)}</select>
          </section>}
          {!reviewMode && !unit && <div className={`${card} py-12 text-center`}><Building2 size={32} className="mx-auto text-slate-400"/><p className="mt-3 font-semibold">Выберите своё подразделение</p><p className="mt-1 text-sm text-slate-500">Далее появятся его материалы и формы редактирования.</p></div>}
          {!reviewMode && unit && <>
            <div className="flex items-center gap-2 text-sm text-slate-500"><span>{unitTitle}</span><ChevronRight size={15}/><span className="font-medium text-slate-800">{unit.name}</span></div>
            {section === "overview" && <>
              <div className="grid gap-4 sm:grid-cols-3">
                {[{name:"Всего материалов",n:mine.length,icon:BookOpenText},{name:"Ожидают ЦЦР",n:mine.filter((a)=>a.status==="submitted").length,icon:Send},{name:"Нужно исправить",n:mine.filter((a)=>a.status==="changes_requested").length,icon:FilePenLine}].map((s) => <div key={s.name} className={card}><s.icon size={21} className="text-[#235aa2]"/><p className="mt-5 text-3xl font-bold text-[#153d70]">{s.n}</p><p className="mt-1 text-sm text-slate-500">{s.name}</p></div>)}
              </div>
              <section className={card}><h3 className="text-lg font-bold">{unit.name}</h3><p className="mt-2 text-sm text-slate-500">{isFaculty ? "Информация факультета и его новости управляются отдельно от кафедр." : "Материалы этой кафедры не смешиваются с материалами других кафедр."}</p><div className="mt-5 flex flex-wrap gap-2"><button className={primary} onClick={()=>setSection("news")} type="button"><Newspaper size={17}/> Управлять новостями</button><button className={secondary} onClick={()=>setSection("profile")} type="button"><FilePenLine size={17}/> Редактировать сведения</button></div></section>
            </>}
            {section === "profile" && <section className={`${card} space-y-4`}><div><h3 className="text-xl font-bold">Информация о {isFaculty ? "факультете" : "кафедре"}</h3><p className="mt-1 text-sm text-slate-500">Демонстрационная форма; не меняет публичную страницу.</p></div><label className="block text-sm font-medium">Описание<textarea className={`${input} mt-2`} rows={6} value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Расскажите о подразделении"/></label><label className="block text-sm font-medium">Рабочие контакты<textarea className={`${input} mt-2`} rows={3} value={contact} onChange={(e)=>setContact(e.target.value)} placeholder="Телефон, e-mail, кабинет"/></label><button type="button" className={primary} onClick={saveProfile}><Save size={17}/> Сохранить демо-профиль</button></section>}
            {section === "news" && <section className={`${card} space-y-4`}><div><h3 className="text-xl font-bold">{editing ? "Редактирование новости" : "Новая новость"}</h3><p className="mt-1 text-sm text-slate-500">Факультеты и кафедры создают новости отдельно. Публикация возможна только после проверки ЦЦР в будущем Backend.</p></div><label className="block text-sm font-medium">Заголовок<input className={`${input} mt-2`} value={title} maxLength={180} onChange={(e)=>setTitle(e.target.value)} placeholder="Название новости"/></label><label className="block text-sm font-medium">Краткий анонс<textarea className={`${input} mt-2`} rows={2} value={summary} onChange={(e)=>setSummary(e.target.value)}/></label><label className="block text-sm font-medium">Основной текст<textarea className={`${input} mt-2`} rows={7} value={body} onChange={(e)=>setBody(e.target.value)}/></label><div className="flex flex-wrap gap-2"><button type="button" className={secondary} disabled={!title.trim()||!body.trim()} onClick={()=>saveArticle(false)}><Save size={17}/> Сохранить черновик</button><button type="button" className={primary} disabled={!title.trim()||!body.trim()} onClick={()=>saveArticle(true)}><Send size={17}/> Отправить в ЦЦР</button>{editing&&<button className={secondary} type="button" onClick={resetEditor}>Отмена</button>}</div></section>}
            <section className={card}><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-bold">Материалы подразделения</h3><span className="text-sm text-slate-500">{mine.length} записей</span></div><div className="mt-4 space-y-3">{mine.length===0?<p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">Пока нет новостей. Создайте первую заявку.</p>:mine.map((a)=><article key={a.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-start justify-between gap-2"><h4 className="font-semibold">{a.title}</h4><StatusMark status={a.status}/></div><p className="mt-2 text-sm text-slate-600">{a.summary||a.body.slice(0,180)}</p>{a.feedback&&<p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900"><strong>Замечание ЦЦР:</strong> {a.feedback}</p>}{(a.status==="draft"||a.status==="changes_requested")&&<button type="button" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#235aa2]" onClick={()=>editArticle(a)}><FilePenLine size={16}/> Редактировать</button>}</article>)}</div></section>
          </>}
          {reviewMode && <>
            <div className="grid gap-4 sm:grid-cols-3">{[{label:"Ожидают проверки",n:pending,icon:ClipboardCheck},{label:"Одобрено (демо)",n:entries.filter((a)=>a.status==="approved").length,icon:CheckCircle2},{label:"Возвращено",n:entries.filter((a)=>a.status==="changes_requested").length,icon:XCircle}].map((s)=><div className={card} key={s.label}><s.icon className="text-[#235aa2]" size={22}/><p className="mt-5 text-3xl font-bold text-[#153d70]">{s.n}</p><p className="mt-1 text-sm text-slate-500">{s.label}</p></div>)}</div>
            <section className={card}><div className="flex flex-wrap items-center justify-between gap-4"><div><h3 className="text-lg font-bold">Заявки подразделений</h3><p className="text-sm text-slate-500">Новости от всех факультетов и кафедр</p></div><div className="flex gap-2"><button type="button" className={reviewFilter==="pending"?primary:secondary} onClick={()=>setReviewFilter("pending")}>Ожидают</button><button type="button" className={reviewFilter==="all"?primary:secondary} onClick={()=>setReviewFilter("all")}>История</button></div></div><div className="mt-5 space-y-3">{reviewItems.length===0?<p className="rounded-xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">Сейчас нет материалов в этой очереди.</p>:reviewItems.map((a)=><article key={a.id} className="rounded-xl border border-slate-200 p-5"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs font-bold uppercase tracking-wide text-blue-700">{a.owner==="faculty"?"Факультет":"Кафедра"} · {a.ownerName}</p><h4 className="mt-2 text-lg font-bold">{a.title}</h4></div><StatusMark status={a.status}/></div>{a.summary&&<p className="mt-3 text-sm text-slate-600">{a.summary}</p>}<p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{a.body}</p>{a.feedback&&<p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm">Замечание: {a.feedback}</p>}{a.status==="submitted"&&<div className="mt-5 space-y-3 border-t border-slate-100 pt-4"><label className="block text-sm font-medium">Комментарий к возврату<textarea className={`${input} mt-2`} value={notes[a.id]||""} rows={2} onChange={(e)=>setNotes((old)=>({...old,[a.id]:e.target.value}))}/></label><div className="flex flex-wrap gap-2"><button className={primary} type="button" onClick={()=>review(a.id,true)}><CheckCircle2 size={17}/> Одобрить</button><button className={secondary} type="button" onClick={()=>review(a.id,false)}><XCircle size={17}/> Вернуть на доработку</button></div></div>}</article>)}</div></section>
          </>}
        </>}
      </main>
    </div>
  </div>;
}
