"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Role = "ccr" | "faculty" | "department" | "news_editor";
type Unit = { id: number; name: string; slug: string; facultyId?: number };
type Draft = { id: number; kind: "faculty" | "department"; targetId: number | null; facultyId: number | null; name: string; status: string; feedback: string; authorId: number; updatedAt: string };
type User = { id: number; username: string; role: Role; facultyId: number | null; departmentId: number | null; active: boolean };
const status: Record<string, string> = { draft: "Черновик", submitted: "На проверке", changes_requested: "На доработке", approved: "Одобрено" };
const input = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const primary = "rounded-xl bg-[#204774] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50";

async function api(action: string, method: "GET" | "POST" | "PUT" = "GET", id?: number, body?: object) {
  const url = `/api/admin-structure?action=${action}${id ? `&id=${id}` : ""}`;
  const res = await fetch(url, { method, cache: "no-store", ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }) });
  const data: unknown = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
  if (!res.ok) {
    const err = data as { detail?: string; error?: string };
    throw new Error(err.detail ?? err.error ?? `HTTP ${res.status}`);
  }
  return data;
}
export default function StructureWorkspace({ role }: { role: Role }) {
  const [faculties, setFaculties] = useState<Unit[]>([]);
  const [departments, setDepartments] = useState<Unit[]>([]);
  const [mine, setMine] = useState<Draft[]>([]);
  const [review, setReview] = useState<Draft[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [kind, setKind] = useState<"faculty" | "department">("department");
  const [target, setTarget] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [assignment, setAssignment] = useState<Record<number, { role: Role; facultyId: string; departmentId: string; active: boolean }>>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const load = useCallback(async () => {
    const base = await Promise.all([api("catalog"), api("mine")]);
    const catalog = base[0] as { faculties: Unit[]; departments: Unit[] };
    setFaculties(catalog.faculties); setDepartments(catalog.departments); setMine(base[1] as Draft[]);
    if (role === "ccr") {
      const [rv, us] = await Promise.all([api("review"), api("users")]);
      setReview(rv as Draft[]); const rows = us as User[]; setUsers(rows);
      setAssignment(Object.fromEntries(rows.map(u => [u.id, { role: u.role, facultyId: String(u.facultyId ?? ""), departmentId: String(u.departmentId ?? ""), active: u.active }])));
    }
  }, [role]);
  useEffect(() => { const t = setTimeout(() => { void load().catch(e => setNotice(String(e))); }, 0); return () => clearTimeout(t); }, [load]);
  function changeKind(v: "faculty" | "department") { setKind(v); setTarget(""); setFacultyId(""); setName(""); setEditing(null); }
  function changeTarget(v: string) {
    setTarget(v);
    const row = (kind === "faculty" ? faculties : departments).find(x => String(x.id) === v);
    if (row) { setName(row.name); if (kind === "department") setFacultyId(String(row.facultyId ?? "")); }
    else setName("");
  }
  function editDraft(row: Draft) { setKind(row.kind); setTarget(String(row.targetId ?? "")); setFacultyId(String(row.facultyId ?? "")); setName(row.name); setEditing(row.id); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function perform(action: "create" | "update" | "submit" | "decision" | "assign", id?: number, body?: object) {
    if (busy) return;
    setBusy(true); setNotice("");
    try {
      await api(action, action === "update" || action === "assign" ? "PUT" : "POST", id, body);
      await load();
      if (action === "create" || action === "update") setNotice("Черновик сохранён. Теперь отправьте его на проверку ЦЦР.");
      else if (action === "submit") setNotice("Отправлено на проверку ЦЦР.");
      else if (action === "decision") setNotice("Решение сохранено в тестовой базе.");
      else setNotice("Права изменены, предыдущие сессии пользователя отозваны.");
      if (action === "update") setEditing(null);
    } catch (err) { setNotice(err instanceof Error ? err.message : String(err)); }
    finally { setBusy(false); }
  }
  const options = kind === "faculty" ? faculties : departments;
  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900"><div className="mx-auto max-w-6xl space-y-6">
    <Link className="text-sm font-semibold text-blue-800" href={role === "ccr" ? "/admin/review-center" : role === "faculty" ? "/admin/faculty" : "/admin/department"}>← Вернуться в кабинет</Link>
    <header className="rounded-2xl bg-[#204774] p-7 text-white"><p className="text-xs font-bold uppercase tracking-widest text-blue-200">БГУ · V8.19</p><h1 className="mt-2 text-3xl font-bold">Структура университета</h1><p className="mt-2 text-sm text-blue-100">Подразделения и назначение редакторов · тестовая PostgreSQL 8001</p></header>
    {notice && <p role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">{notice}</p>}
    <div className="grid gap-4 sm:grid-cols-2"><section className="rounded-2xl border bg-white p-5"><h2 className="font-bold">Факультеты: {faculties.length}</h2><div className="mt-3 max-h-56 space-y-2 overflow-auto text-sm">{faculties.map(x => <div key={x.id}>{x.name}</div>)}</div></section><section className="rounded-2xl border bg-white p-5"><h2 className="font-bold">Кафедры: {departments.length}</h2><div className="mt-3 max-h-56 space-y-2 overflow-auto text-sm">{departments.map(x => <div key={x.id}>{x.name} <span className="text-slate-500">· {faculties.find(f => f.id === x.facultyId)?.name ?? "—"}</span></div>)}</div></section></div>
    <section className="space-y-4 rounded-2xl border bg-white p-5"><h2 className="text-xl font-bold">{editing ? `Редактирование черновика №${editing}` : "Новая заявка"}</h2>
      <label className="block text-sm font-semibold">Тип подразделения<select className={`${input} mt-2`} value={kind} disabled={editing !== null} onChange={e => changeKind(e.target.value as "faculty" | "department")}><option value="faculty">Факультет</option><option value="department">Кафедра</option></select></label>
      <label className="block text-sm font-semibold">Запись<select className={`${input} mt-2`} disabled={editing !== null} value={target} onChange={e => changeTarget(e.target.value)}><option value="">Новое подразделение</option>{options.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      {kind === "department" && <label className="block text-sm font-semibold">Факультет<select className={`${input} mt-2`} value={facultyId} onChange={e => setFacultyId(e.target.value)}><option value="">Выберите факультет</option>{faculties.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>}
      <label className="block text-sm font-semibold">Название<input className={`${input} mt-2`} maxLength={300} value={name} onChange={e => setName(e.target.value)}/></label>
      <div className="flex flex-wrap gap-3"><button disabled={busy || !name.trim() || (kind === "department" && !facultyId)} className={primary} onClick={() => void perform(editing ? "update" : "create", editing ?? undefined, {kind, targetId:target ? Number(target) : null, facultyId:kind === "department" ? Number(facultyId) : null, name})}>{editing ? "Сохранить изменения" : "Сохранить черновик"}</button><button className="rounded-xl border px-4 py-2.5" onClick={() => { setEditing(null); setTarget(""); setFacultyId(""); setName(""); }}>Сбросить</button></div>
      <p className="text-xs text-slate-600">Новые факультеты создаёт только ЦЦР. Редакторы подразделений могут предлагать изменения в рамках своих прав.</p>
    </section>
    <section className="space-y-3 rounded-2xl border bg-white p-5"><h2 className="text-xl font-bold">Мои заявки ({mine.length})</h2>{mine.map(x => <article key={x.id} className="flex flex-wrap justify-between gap-3 rounded-xl border p-4"><div><strong>{x.name}</strong><p className="text-sm text-slate-600">{x.kind === "faculty" ? "Факультет" : "Кафедра"} · {status[x.status] ?? x.status}</p>{x.feedback && <p className="text-sm text-amber-800">ЦЦР: {x.feedback}</p>}</div>{["draft", "changes_requested"].includes(x.status) && <div className="flex gap-2"><button className="rounded-lg border px-3 py-2" onClick={() => editDraft(x)}>Изменить</button><button disabled={busy} className={primary} onClick={() => void perform("submit",x.id)}>Отправить ЦЦР</button></div>}</article>)}{mine.length === 0 && <p className="text-sm text-slate-500">Черновиков пока нет.</p>}</section>
    {role === "ccr" && <><section className="space-y-4 rounded-2xl border bg-white p-5"><h2 className="text-xl font-bold">Согласование структуры ({review.filter(x=>x.status === "submitted").length})</h2>{review.filter(x => x.status === "submitted").map(x => <article key={x.id} className="space-y-3 rounded-xl border p-4"><strong>{x.name}</strong><p className="text-sm text-slate-600">{x.kind} · {x.targetId ? `Изменение №${x.targetId}` : "Создание"} · Факультет {x.facultyId ?? "—"}</p><textarea className={input} placeholder="Причина возврата" maxLength={4000} value={feedback[x.id] ?? ""} onChange={e => setFeedback(o => ({...o,[x.id]:e.target.value}))}/><div className="flex flex-wrap gap-2"><button disabled={busy} className={primary} onClick={() => void perform("decision",x.id,{approve:true,feedback:""})}>Одобрить</button><button disabled={busy || !(feedback[x.id] ?? "").trim()} className="rounded-xl bg-amber-100 px-4 py-2.5 text-sm font-semibold text-amber-900 disabled:opacity-50" onClick={() => void perform("decision",x.id,{approve:false,feedback:feedback[x.id]})}>Вернуть</button></div></article>)}{!review.some(x=>x.status === "submitted") && <p className="text-sm text-slate-500">Нет заявок на проверку.</p>}</section>
    <section className="space-y-4 rounded-2xl border bg-white p-5"><h2 className="text-xl font-bold">Редакторы и права доступа</h2><p className="text-sm text-slate-600">Только ЦЦР может изменить роль или подразделение. После сохранения все сессии изменённого пользователя будут завершены.</p>{users.map(u => {const a=assignment[u.id]; if (!a) return null; return <div key={u.id} className="grid items-end gap-3 rounded-xl border p-4 md:grid-cols-5"><div><strong className="block break-all text-sm">{u.username}</strong><span className="text-xs text-slate-500">ID {u.id}</span></div><label className="text-xs font-semibold">Роль<select className={`${input} mt-1`} value={a.role} onChange={e => setAssignment(o => ({...o,[u.id]:{...a,role:e.target.value as Role,facultyId:"",departmentId:""}}))}><option value="ccr">ЦЦР</option><option value="faculty">Факультет</option><option value="department">Кафедра</option><option value="news_editor">Редактор новостей</option></select></label><label className="text-xs font-semibold">Подразделение<select className={`${input} mt-1`} disabled={a.role !== "faculty" && a.role !== "department"} value={a.role === "faculty" ? a.facultyId : a.departmentId} onChange={e => setAssignment(o => ({...o,[u.id]:{...a,[a.role === "faculty" ? "facultyId" : "departmentId"]:e.target.value}}))}><option value="">—</option>{a.role === "faculty" ? faculties.map(x => <option key={x.id} value={x.id}>{x.name}</option>) : a.role === "department" ? departments.map(x => <option key={x.id} value={x.id}>{x.name}</option>) : null}</select></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={a.active} onChange={e => setAssignment(o => ({...o,[u.id]:{...a,active:e.target.checked}}))}/>Активен</label><button disabled={busy} className={primary} onClick={() => void perform("assign",u.id,{role:a.role,facultyId:a.role === "faculty" && a.facultyId ? Number(a.facultyId) : null,departmentId:a.role === "department" && a.departmentId ? Number(a.departmentId) : null,active:a.active})}>Сохранить</button></div>;})}</section></>}
  </div></main>;
}
