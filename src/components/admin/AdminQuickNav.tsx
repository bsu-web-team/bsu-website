"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LayoutGrid } from "lucide-react";
type AdminRole = "ccr" | "faculty" | "department" | "news_editor";

type NavItem = { href: string; label: string };
const ccr: NavItem[] = [
  { href: "/admin", label: "Главная ЦЦР" },
  { href: "/admin/review-center", label: "Все заявки" },
  { href: "/admin/editorial-review", label: "Новости" },
  { href: "/admin/unit-review", label: "Профили" },
  { href: "/admin/staff-review", label: "Сотрудники" },
  { href: "/admin/document-review", label: "Документы" },
  { href: "/admin/program-review", label: "Программы" },
  { href: "/admin/structure", label: "Структура и редакторы" },
  { href: "/admin/navigation", label: "Карта разделов" },
];
const faculty: NavItem[] = [
  { href: "/admin/faculty", label: "Кабинет факультета" },
  { href: "/admin/staff", label: "Сотрудники" },
  { href: "/admin/documents-workflow", label: "Документы" },
  { href: "/admin/programs-workflow", label: "Программы" },
  { href: "/admin/structure", label: "Структура" },
];
const department: NavItem[] = [
  { href: "/admin/department", label: "Кабинет кафедры" },
  { href: "/admin/staff", label: "Сотрудники" },
  { href: "/admin/documents-workflow", label: "Документы" },
  { href: "/admin/programs-workflow", label: "Программы" },
  { href: "/admin/structure", label: "Структура" },
];
const editorial: NavItem[] = [
  { href: "/admin/editor", label: "Редактор новостей" },
];
const links: Record<AdminRole, NavItem[]> = {
  ccr, faculty, department, news_editor: editorial,
};

export default function AdminQuickNav({ role }: { role: AdminRole }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = links[role];
  const current = items.find((item) => item.href === pathname);
  return (
    <nav aria-label="Быстрая навигация по кабинету БГУ" className="sticky top-0 z-30 border-b border-slate-200 bg-white text-slate-900 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
        <div className="flex shrink-0 items-center gap-2 text-sm font-bold text-[#204774]">
          <LayoutGrid size={17} aria-hidden="true" />
          <span>БГУ · Кабинет</span>
        </div>
        <div className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:flex">
          {items.map((item) => {
            const active = pathname === item.href;
            return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${active ? "bg-[#204774] text-white" : "text-slate-700 hover:bg-slate-100"}`}>{item.label}</Link>;
          })}
        </div>
        <div className="ml-auto lg:hidden">
          <button type="button" aria-expanded={open} aria-controls="bsu-admin-menu-v821" onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-[#204774]">
            {current?.label ?? "Разделы"} <ChevronDown size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      {open && <div id="bsu-admin-menu-v821" className="grid gap-1 border-t border-slate-200 bg-white p-3 lg:hidden">
        {items.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={pathname === item.href ? "page" : undefined}
          className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${pathname === item.href ? "bg-[#204774] text-white" : "text-slate-700 hover:bg-slate-50"}`}>{item.label}</Link>)}
      </div>}
    </nav>
  );
}
