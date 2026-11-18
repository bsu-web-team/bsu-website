// BSU Content Phase 1 generated
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MigrationLabel from "@/components/pages/MigrationLabel";
import { migratedPages } from "@/lib/migration-index";
export const metadata = {robots:{index:false,follow:false}};
export default function Page(){return <div className="min-h-screen bg-[#f5f7fa] text-slate-900"><Header/><main><section className="bsu-page-hero bg-[#204774] px-5 py-16 text-white sm:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold tracking-[.2em] text-[#dfbd7e]">BSU / PORTAL</p><h1 className="mt-4 text-4xl font-extrabold sm:text-5xl"><MigrationLabel name="catalog"/></h1></div></section><section className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><p className="mb-7 text-sm text-slate-500"><MigrationLabel name="source"/></p><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-bsu-motion-list>{migratedPages.map(p=><Link key={p.href} href={p.href} data-bsu-motion-item className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#b5945e]"><span className="flex items-center justify-between text-xs font-bold uppercase text-[#a7864c]">{p.lang}<ArrowUpRight size={18}/></span><h2 className="mt-3 break-words text-xl font-bold text-[#204774]">{p.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{p.description}</p></Link>)}</div></section></main><Footer/></div>}
