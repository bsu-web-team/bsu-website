"use client";
import Link from "next/link";
import { ArrowRight, BookOpen, Building2, Compass, History, Mail, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { aboutUi } from "@/lib/about-i18n";
import { aboutSources, historyEvents, leadership } from "@/lib/about-data";

type View = "overview" | "history" | "mission" | "leadership";
const cardIcons = [History, Compass, Users, Building2, BookOpen, Mail];
export default function AboutLocalized({ view }: { view: View }) {
  const { locale } = useLocale();
  const t = aboutUi[locale];
  const heading = view === "history" ? t.history : view === "mission" ? t.mission : view === "leadership" ? t.leadership : t.about;
  return <div className="min-h-screen bg-[#f5f7fb] text-slate-900"><Header /><main>
    <section className="bg-[#204774] px-5 py-16 text-white sm:px-8 sm:py-20"><div className="mx-auto max-w-7xl">
      <Link href={view === "overview" ? "/" : "/about"} className="text-sm text-blue-100 hover:underline">{view === "overview" ? t.home : `← ${t.about}`}</Link>
      {view === "overview" && <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-[#d5b780]">{t.eyebrow}</p>}
      <h1 className="mt-7 text-4xl font-extrabold sm:text-5xl">{heading}</h1>
      <p className="mt-4 max-w-3xl leading-7 text-blue-100">{view === "overview" ? t.intro : view === "history" ? t.historyIntro : view === "leadership" ? t.leadershipIntro : ""}</p>
    </div></section>
    {view === "overview" && <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <h2 className="text-2xl font-bold text-[#204774] sm:text-3xl">{t.explore}</h2>
      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{t.cards.map(([title, desc, href],i) => { const Icon = cardIcons[i]; return <Link href={href} key={href} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"><Icon size={28} className="text-[#a7864c]"/><h3 className="mt-5 text-xl font-bold text-[#204774]">{title}</h3><p className="mt-2 min-h-14 text-sm leading-6 text-slate-600">{desc}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#204774]">{t.go}<ArrowRight size={16}/></span></Link>; })}</div>
      <p className="mt-8 text-xs text-slate-500">{t.sourceIntro} <a className="underline" href={aboutSources.history} target="_blank" rel="noopener noreferrer">{t.officialSource} ↗</a></p>
    </section>}
    {view === "history" && <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8"><ol className="space-y-5">{historyEvents.map((event,i) => <li key={event.year} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[110px_1fr]"><span className="text-3xl font-extrabold text-[#a7864c]">{event.year}</span><div><h2 className="text-xl font-bold text-[#204774]">{t.events[i][0]}</h2><p className="mt-2 leading-7 text-slate-600">{t.events[i][1]}</p></div></li>)}</ol><a className="mt-8 inline-block font-semibold text-[#204774] underline" href={aboutSources.history} target="_blank" rel="noopener noreferrer">{t.historySource} ↗</a></section>}
    {view === "mission" && <section className="mx-auto max-w-6xl space-y-7 px-5 py-12 sm:px-8"><div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-10"><h2 className="text-2xl font-bold text-[#204774]">{t.ourMission}</h2><p className="mt-5 text-lg leading-8 text-slate-700">{t.missionText}</p><p className="mt-5 text-sm text-slate-500">{t.missionNote}</p></div><div className="grid gap-6 lg:grid-cols-2"><section className="rounded-2xl bg-white p-7"><h2 className="text-xl font-bold text-[#204774]">{t.principles}</h2><ul className="mt-5 list-disc space-y-3 pl-5 text-slate-700">{t.principleItems.map(x=><li key={x}>{x}</li>)}</ul></section><section className="rounded-2xl bg-white p-7"><h2 className="text-xl font-bold text-[#204774]">{t.priorities}</h2><ul className="mt-5 list-disc space-y-3 pl-5 text-slate-700">{t.priorityItems.map(x=><li key={x}>{x}</li>)}</ul></section></div><a className="inline-block font-semibold text-[#204774] underline" href={aboutSources.mission} target="_blank" rel="noopener noreferrer">{t.officialSource} ↗</a></section>}
    {view === "leadership" && <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8"><div className="grid gap-5 md:grid-cols-2">{leadership.map((person,i)=><article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" key={person.name}><p className="text-xs font-semibold uppercase tracking-widest text-[#a7864c]">{[t.roleRector,t.roleAcademic,t.roleScience,t.roleInternational][i] ?? person.role}</p><h2 className="mt-3 text-xl font-bold text-[#204774]">{person.name}</h2><a className="mt-5 block break-all text-sm text-blue-800 hover:underline" href={`mailto:${person.email}`}>{person.email}</a><p className="mt-1 text-sm text-slate-600">{person.phone}</p></article>)}</div><p className="mt-8 text-sm text-slate-500">{t.leadershipNote} <a href={aboutSources.leadership} target="_blank" rel="noopener noreferrer" className="underline">{t.administration} ↗</a></p></section>}
  </main><Footer /></div>;
}
