// BSU Pages v1: generated public route
import InteriorNav from "@/components/interior/InteriorNav";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicResourcePage from "@/components/pages/PublicResourcePage";
export const metadata: Metadata = {title:"Административные подразделения",description:"Управление университетом и контакты подразделений."};
export default function Page(){return <div className="min-h-screen bg-[#f5f7fa] text-slate-900"><Header/>
<InteriorNav route="/about/administration"/>
<PublicResourcePage route="about/administration"/><Footer/></div>;}
