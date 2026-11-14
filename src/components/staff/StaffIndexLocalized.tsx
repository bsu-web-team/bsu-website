"use client";
import Link from "next/link";
import {ChevronRight} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StaffDirectory from "@/components/staff/StaffDirectory";
import {useLocale} from "@/components/i18n/LocaleProvider";
import {catalogText as tr} from "@/lib/catalog-i18n-v14";
import type {StaffRecord} from "@/lib/staff-data";
export default function StaffIndexLocalized({people}:{people:StaffRecord[]}) {
 const {locale}=useLocale();return <div className="min-h-screen bg-[#f5f7fb] text-slate-900"><Header/><main>
  <section className="bg-[#102b4e] px-5 py-14 text-white sm:px-8 sm:py-20"><div className="mx-auto max-w-7xl"><nav aria-label={tr(locale,"home")} className="mb-6 flex flex-wrap items-center gap-2 text-sm text-blue-100"><Link href="/" className="hover:underline">{tr(locale,"home")}</Link><ChevronRight size={15}/><span aria-current="page" className="text-white">{tr(locale,"staff")}</span></nav><p className="text-sm font-semibold uppercase tracking-widest text-[#d5b780]">{tr(locale,"staffEyebrow")}</p><h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{tr(locale,"staffTitle")}</h1><p className="mt-5 max-w-2xl leading-relaxed text-blue-100">{tr(locale,"staffIntro")}</p></div></section>
  <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><StaffDirectory items={people}/><p className="mt-8 text-xs leading-relaxed text-slate-500">{tr(locale,"staffDisclaimer")}</p></section>
 </main><Footer/></div>;
}
