import InteriorNav from "@/components/interior/InteriorNav";
import {Suspense} from 'react';
import type {Metadata} from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchPageClient from '@/components/search/SearchPageClient';
export const metadata:Metadata={title:'Поиск | БГУ',robots:{index:false,follow:true}};
export default function SearchPage(){return <div className="min-h-screen bg-white text-slate-900"><Header/><main>
<InteriorNav route="/search"/>
<Suspense fallback={<div className="min-h-80"/>}><SearchPageClient/></Suspense></main><Footer/></div>}
