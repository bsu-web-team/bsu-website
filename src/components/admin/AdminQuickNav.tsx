"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ExternalLink, Menu, PanelsTopLeft, X } from "lucide-react";

type AdminRole = "ccr" | "faculty" | "department" | "news_editor";
type Item = { href: string; label: string };
const configs: Record<AdminRole, { home: string; title: string; main: Item[]; extras: Item[] }> = {
  ccr: {
    home: "/admin", title: "ЦЦР",
    main: [
      { href: "/admin", label: "Главная" },
      { href: "/admin/review-center", label: "Согласование" },
      { href: "/admin/structure", label: "Структура и редакторы" },
      { href: "/admin/navigation", label: "Разделы сайта" },
    ],
    extras: [
      { href: "/admin/editorial-review", label: "Новости" },
      { href: "/admin/unit-review", label: "Профили" },
      { href: "/admin/staff-review", label: "Сотрудники" },
      { href: "/admin/document-review", label: "Документы" },
      { href: "/admin/program-review", label: "Программы" },
    ],
  },
  faculty: {
    home: "/admin/faculty", title: "Факультет",
    main: [
      { href: "/admin/faculty", label: "Мой кабинет" },
      { href: "/admin/staff", label: "Сотрудники" },
      { href: "/admin/documents-workflow", label: "Документы" },
      { href: "/admin/programs-workflow", label: "Программы" },
      { href: "/admin/structure", label: "Структура" },
    ], extras: [],
  },
  department: {
    home: "/admin/department", title: "Кафедра",
    main: [
      { href: "/admin/department", label: "Мой кабинет" },
      { href: "/admin/staff", label: "Сотрудники" },
      { href: "/admin/documents-workflow", label: "Документы" },
      { href: "/admin/programs-workflow", label: "Программы" },
      { href: "/admin/structure", label: "Структура" },
    ], extras: [],
  },
  news_editor: {
    home: "/admin/editor", title: "Редакция",
    main: [{ href: "/admin/editor", label: "Новости" }], extras: [],
  },
};

export default function AdminQuickNav({ role }: { role: AdminRole }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const conf = configs[role];
  const active = (href: string) => pathname === href;
  const tabClass = (href: string) => `inline-flex min-h-10 shrink-0 items-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${active(href) ? "bg-[#173d70] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-[#173d70]"}`;
  return (
    <nav aria-label="Навигация по кабинету БГУ" className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href={conf.home} className="flex shrink-0 items-center gap-2.5 rounded-lg text-[#173d70]" aria-label={`БГУ · ${conf.title}`}>
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#173d70] text-white"><PanelsTopLeft size={20}/></span>
          <span className="flex flex-col leading-tight"><strong className="text-sm">БГУ</strong><span className="text-xs text-slate-500">{conf.title}</span></span>
        </Link>
        <div className="ml-5 hidden min-w-0 flex-1 items-center gap-1 lg:flex">
          {conf.main.map(item => <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} className={tabClass(item.href)}>{item.label}</Link>)}
          {conf.extras.length > 0 && <div className="relative">
            <button type="button" onClick={() => setMoreOpen(v => !v)} aria-expanded={moreOpen} aria-controls="bsu-admin-extra" className="inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100">Ещё <ChevronDown size={15}/></button>
            {moreOpen && <div id="bsu-admin-extra" className="absolute left-0 top-full z-50 mt-2 min-w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              {conf.extras.map(item => <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm hover:bg-slate-100">{item.label}</Link>)}
            </div>}
          </div>}
        </div>
        <Link href="/" className="ml-auto hidden shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 lg:inline-flex">На сайт <ExternalLink size={14}/></Link>
        <button type="button" onClick={() => setMobileOpen(v => !v)} aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"} aria-expanded={mobileOpen} aria-controls="bsu-admin-mobile" className="ml-auto rounded-xl border border-slate-200 p-2.5 lg:hidden">{mobileOpen ? <X size={21}/> : <Menu size={21}/>}</button>
      </div>
      {mobileOpen && <div id="bsu-admin-mobile" className="grid gap-1 border-t border-slate-200 p-3 lg:hidden">
        {[...conf.main, ...conf.extras].map(item => <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} aria-current={active(item.href) ? "page" : undefined} className={tabClass(item.href)}>{item.label}</Link>)}
        <Link href="/" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600">На публичный сайт</Link>
      </div>}
    </nav>
  );
}
