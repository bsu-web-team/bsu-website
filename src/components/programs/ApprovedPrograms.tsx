"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
type Item={slug:string;title:string;level:string;code?:string;facultySlug:string;description?:string};
export default function ApprovedPrograms(){
 const [items,setItems]=useState<Item[]>([]),[error,setError]=useState("");
 useEffect(()=>{const controller=new AbortController();void (async()=>{try{const r=await fetch("/api/test-approved-programs",{cache:"no-store",signal:controller.signal});const j=await r.json();if(!r.ok)throw new Error(j.error??`HTTP ${r.status}`);setItems(j.items??[]);}catch(e){if(!controller.signal.aborted)setError(e instanceof Error?e.message:String(e));}})();return()=>controller.abort();},[]);
 return <main className="min-h-screen bg-slate-50 px-5 py-12 text-slate-900"><div className="mx-auto max-w-5xl space-y-6"><Link href="/programs" className="text-sm font-semibold text-blue-800">← Программы БГУ</Link><h1 className="text-3xl font-extrabold text-[#204774]">Программы тестовой базы</h1>
 <p className="text-sm text-slate-600">Предпросмотр данных из Backend 8001, отдельно от основного публичного каталога 8000. Новые записи имеют slug <code>approved-program-*</code>.</p>
 {error&&<p className="rounded-lg bg-amber-50 p-4 text-amber-900">{error}</p>}
 <div className="grid gap-3 sm:grid-cols-2">{items.map(x=><article key={x.slug} className="rounded-xl border bg-white p-5"><h2 className="font-bold">{x.title}</h2><p className="mt-2 text-sm text-slate-600">{x.level} · {x.code||"без кода"}</p><p className="mt-2 text-xs text-slate-500">{x.facultySlug}</p>{x.description&&<p className="mt-3 whitespace-pre-wrap text-sm">{x.description}</p>}</article>)}</div></div></main>;
}
