"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ClipboardCheck, RefreshCw, RotateCcw } from "lucide-react";

type Draft = {
  id: number;
  name: string;
  position: string;
  biography: string;
  status: string;
  feedback: string;
  staffId: number | null;
  hasPhoto?: boolean;
  facultyId: number;
  departmentId: number | null;
};

const statusText: Record<string, string> = {
  draft: "Черновик",
  submitted: "На проверке",
  changes_requested: "На доработке",
  approved: "Одобрено",
};

const statusStyle: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  submitted: "bg-blue-50 text-blue-800 ring-blue-200",
  changes_requested: "bg-amber-50 text-amber-900 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export default function StaffReview() {
  const [items, setItems] = useState<Draft[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  const load = useCallback(async () => {
    const response = await fetch("/api/admin-staff?action=review", { cache: "no-store" });
    const data: Draft[] | { detail?: string; error?: string } = await response.json();
    if (!response.ok) {
      const error = data as { detail?: string; error?: string };
      throw new Error(error.detail ?? error.error ?? `HTTP ${response.status}`);
    }
    if (!Array.isArray(data)) throw new Error("Некорректный ответ Backend");
    setItems(data);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load().catch((error: unknown) => setNotice(error instanceof Error ? error.message : "Не удалось загрузить заявки"))
        .finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function refresh() {
    setLoading(true);
    setNotice("");
    try { await load(); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Ошибка загрузки"); }
    finally { setLoading(false); }
  }

  async function decide(id: number, approve: boolean) {
    if (busy) return;
    if (!approve && !(notes[id] ?? "").trim()) {
      setNotice("Укажите причину возврата на доработку.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch(`/api/admin-staff?action=decision&id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve, feedback: notes[id] ?? "" }),
      });
      const result: { detail?: string; error?: string } = await response.json();
      if (!response.ok) throw new Error(result.detail ?? result.error ?? `HTTP ${response.status}`);
      await load();
      setNotice(approve
        ? "Заявка одобрена. Изменения сохранены в тестовой базе сотрудников."
        : "Заявка возвращена на доработку с замечанием.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Не удалось обработать заявку");
    } finally {
      setBusy(false);
    }
  }

  const pendingCount = items.filter((item) => item.status === "submitted").length;
  const visible = filter === "pending" ? items.filter((item) => item.status === "submitted") : items;

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl bg-[#183e70] px-6 py-7 text-white shadow-sm sm:px-8">
          <Link href="/admin" className="text-sm font-semibold text-blue-100 hover:text-white">← Вернуться в панель ЦЦР</Link>
          <div className="mt-5 flex items-start gap-3">
            <ClipboardCheck size={28} className="shrink-0 text-blue-200" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200">БГУ · Центр цифрового развития</p>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Согласование сотрудников</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100">Заявки факультетов и кафедр. Одобрение меняет записи только в тестовой PostgreSQL. Фотографии и личные контакты не затрагиваются.</p>
            </div>
          </div>
        </header>

        {notice && <div role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-medium text-blue-950">{notice}</div>}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-slate-800">Ожидают решения: {pendingCount}</span>
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
              <button type="button" onClick={() => setFilter("pending")} className={`rounded-lg px-3 py-2 text-sm font-semibold ${filter === "pending" ? "bg-[#204774] text-white" : "text-slate-700 hover:bg-slate-100"}`}>На проверке</button>
              <button type="button" onClick={() => setFilter("all")} className={`rounded-lg px-3 py-2 text-sm font-semibold ${filter === "all" ? "bg-[#204774] text-white" : "text-slate-700 hover:bg-slate-100"}`}>Все заявки</button>
            </div>
          </div>
          <button type="button" onClick={() => void refresh()} disabled={loading || busy} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={16} /> Обновить</button>
        </div>

        {loading && <p className="text-sm text-slate-600">Загружаем заявки…</p>}
        {!loading && !visible.length && <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-600">{filter === "pending" ? "Сейчас нет заявок на согласование." : "Заявок пока нет."}</div>}
        {!loading && visible.map((item) => (
          <article key={item.id} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700">{item.staffId ? `Изменение сотрудника №${item.staffId}` : "Добавление сотрудника"}</p>
                <h2 className="mt-2 break-words text-xl font-bold text-slate-950">{item.name}</h2>
                <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Должность:</span> {item.position}</p>
                <p className="mt-1 text-sm text-slate-500">Факультет №{item.facultyId}{item.departmentId ? ` · Кафедра №${item.departmentId}` : ""}</p>
              </div>
              <span className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${statusStyle[item.status] ?? statusStyle.draft}`}>{statusText[item.status] ?? item.status}</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-bold text-slate-800">Биография</h3>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{item.biography || "Биография не указана"}</p>
            </div>
            {item.hasPhoto && <a href={`/api/admin-staff-photo?id=${item.id}`} target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-800">Просмотреть фотографию перед решением</a>}
            {item.feedback && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><strong>Замечание ЦЦР:</strong> {item.feedback}</div>}
            {item.status === "submitted" && (
              <div className="space-y-3 border-t border-slate-200 pt-5">
                <label htmlFor={`staff-feedback-${item.id}`} className="block text-sm font-semibold text-slate-800">Замечание при возврате</label>
                <textarea id={`staff-feedback-${item.id}`} rows={3} placeholder="Например: уточните должность или дополните биографию" className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" value={notes[item.id] ?? ""} onChange={(event) => setNotes((prev) => ({ ...prev, [item.id]: event.target.value }))} />
                <div className="flex flex-wrap gap-3">
                  <button type="button" disabled={busy} onClick={() => void decide(item.id, true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"><CheckCircle2 size={17} /> Одобрить</button>
                  <button type="button" disabled={busy || !(notes[item.id] ?? "").trim()} onClick={() => void decide(item.id, false)} className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-100 px-5 py-3 text-sm font-bold text-amber-950 hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"><RotateCcw size={17} /> Вернуть на доработку</button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
