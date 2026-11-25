"use client";

import { useState } from "react";
import ReviewCenter from "@/components/admin/ReviewCenter";
import NewsEditorWorkspace from "@/components/admin/NewsEditorWorkspace";
import UnitProfileReview from "@/components/admin/UnitProfileReview";
import StaffReview from "@/components/admin/StaffReview";
import DocumentReview from "@/components/admin/DocumentReview";
import ProgramReview from "@/components/admin/ProgramReview";
import StructureWorkspace from "@/components/admin/StructureWorkspace";

type Tab = "queue" | "news" | "profiles" | "staff" | "documents" | "programs" | "structure";
const tabs: { key: Tab; label: string }[] = [
  { key: "queue", label: "Очередь заявок" },
  { key: "news", label: "Новости" },
  { key: "profiles", label: "Профили" },
  { key: "staff", label: "Сотрудники" },
  { key: "documents", label: "Документы" },
  { key: "programs", label: "Программы" },
  { key: "structure", label: "Структура" },
];

export default function UnifiedApprovals() {
  const [tab, setTab] = useState<Tab>("queue");
  return <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-blue-700">ЦЦР · Рабочая область</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#173d70]">Согласование материалов</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Заявки всех подразделений в одном месте. Выберите тип материала: формы одобрения и возврата откроются прямо на этой странице.</p>
      <div role="tablist" aria-label="Тип согласования" className="mt-7 flex gap-2 overflow-x-auto border-b border-slate-200 pb-3">
        {tabs.map(item => <button key={item.key} type="button" role="tab" id={`approval-tab-${item.key}`} aria-controls="approval-panel" aria-selected={tab === item.key} onClick={() => setTab(item.key)} className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tab === item.key ? "bg-[#173d70] text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}>{item.label}</button>)}
      </div>
    </div>
    <section id="approval-panel" role="tabpanel" aria-labelledby={`approval-tab-${tab}`} className="[&>main]:!min-h-0 [&>main]:!bg-transparent [&>div]:!min-h-0">
      {tab === "queue" && <ReviewCenter />}
      {tab === "news" && <NewsEditorWorkspace review />}
      {tab === "profiles" && <UnitProfileReview />}
      {tab === "staff" && <StaffReview />}
      {tab === "documents" && <DocumentReview />}
      {tab === "programs" && <ProgramReview />}
      {tab === "structure" && <StructureWorkspace role="ccr" />}
    </section>
  </main>;
}
