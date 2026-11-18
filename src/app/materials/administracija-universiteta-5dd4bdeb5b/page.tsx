// BSU Content Phase 1 generated
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MaterialBlocks from "@/components/pages/MaterialBlocks";
import Link from "next/link";
import data from "@/lib/content-phase1/administracija-universiteta-5dd4bdeb5b.json";
export const metadata: Metadata={title:"Администрация университета",robots:{index:false,follow:false}};
export default function Page(){return <div className="min-h-screen bg-[#f5f7fa] text-slate-900"><Header/><main><section className="bsu-page-hero bg-[#204774] px-5 py-16 text-white sm:px-8"><div className="mx-auto max-w-7xl"><Link href="/materials" className="text-sm text-blue-100">BSU / PORTAL ↗</Link><h1 className="mt-5 max-w-5xl break-words text-3xl font-extrabold sm:text-5xl">{data.title}</h1></div></section><section className="mx-auto max-w-5xl px-5 py-12 sm:px-8"><MaterialBlocks data={data}/></section></main><Footer/></div>;}
