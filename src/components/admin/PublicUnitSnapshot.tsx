"use client";

import { useEffect, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";

type PublicRecord = {
  source: "public-api";
  role: "faculty" | "department";
  slug: string;
  name: string;
  category?: string;
  summary?: string;
  leader?: string;
  phone?: string;
  email?: string;
  address?: string;
  facultyName?: string;
};

type Result = { data?: PublicRecord; error?: string };

export default function PublicUnitSnapshot({ role }: { role: "faculty" | "department" }) {
  const [record, setRecord] = useState<PublicRecord | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    const start = window.setTimeout(() => {
      void (async () => {
        try {
          const res = await fetch("/api/admin-unit-public", { cache: "no-store", signal: ctrl.signal });
          const json: Result = await res.json();
          if (!res.ok || !json.data) throw new Error(json.error ?? `HTTP ${res.status}`);
          if (json.data.role !== role || json.data.source !== "public-api") throw new Error("Несовпадение подразделения");
          setRecord(json.data);
          setError("");
        } catch (e) {
          if (!ctrl.signal.aborted) { setRecord(null); setError(e instanceof Error ? e.message : "Не удалось прочитать опубликованные данные"); }
        } finally {
          if (!ctrl.signal.aborted) setLoading(false);
        }
      })();
    }, 0);
    return () => { window.clearTimeout(start); ctrl.abort(); };
  }, [role, version]);

  return <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Текущие публичные данные</p>
        <h3 className="mt-1 text-lg font-bold text-slate-900">Сейчас на сайте БГУ</h3>
        <p className="mt-1 text-xs text-slate-600">Источник: публичный Backend (порт 8000), не черновик и не подтверждение актуальности официального bsu.kg</p>
      </div>
      <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-800 hover:bg-blue-50" disabled={loading} onClick={() => { setLoading(true); setVersion(v => v + 1); }}>
        <RefreshCw size={15}/> Обновить
      </button>
    </div>
    {loading && <p className="mt-4 text-sm text-slate-600">Загружаем опубликованные сведения…</p>}
    {!loading && error && <p role="status" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error}. Черновик не изменён.</p>}
    {!loading && record && <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
      <div className="sm:col-span-2"><dt className="font-semibold text-slate-600">Название</dt><dd className="mt-1 font-semibold">{record.name}</dd></div>
      {record.category && <div><dt className="font-semibold text-slate-600">Направление</dt><dd className="mt-1">{record.category}</dd></div>}
      {record.facultyName && <div><dt className="font-semibold text-slate-600">Факультет</dt><dd className="mt-1">{record.facultyName}</dd></div>}
      {record.summary && <div className="sm:col-span-2"><dt className="font-semibold text-slate-600">Описание</dt><dd className="mt-1 whitespace-pre-wrap">{record.summary}</dd></div>}
      {record.leader && <div><dt className="font-semibold text-slate-600">Руководитель</dt><dd className="mt-1">{record.leader}</dd></div>}
      {record.phone && <div><dt className="font-semibold text-slate-600">Телефон</dt><dd className="mt-1">{record.phone}</dd></div>}
      {record.email && <div><dt className="font-semibold text-slate-600">E-mail</dt><dd className="mt-1">{record.email}</dd></div>}
      {record.address && <div className="sm:col-span-2"><dt className="font-semibold text-slate-600">Адрес</dt><dd className="mt-1">{record.address}</dd></div>}
      {record.role === "department" && <p className="sm:col-span-2 text-xs text-slate-500">Публичный API кафедр пока не отдаёт описание и контакты; они будут доступны после расширения контракта.</p>}
      <div className="sm:col-span-2"><a href={record.role === "faculty" ? `/faculties/${encodeURIComponent(record.slug)}` : `/departments/${encodeURIComponent(record.slug)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:underline">Открыть публичную страницу <ExternalLink size={15}/></a></div>
    </dl>}
  </section>;
}
