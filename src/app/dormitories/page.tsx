import InteriorNav from "@/components/interior/InteriorNav";
import IntegratedSectionContent from "@/components/integrated/SectionContent";
// BSU Pages v1: generated public route
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicResourcePage from "@/components/pages/PublicResourcePage";
export const metadata: Metadata = {title:"Общежития",description:"Наличие мест, условия проживания и порядок заселения уточняйте в университете."};
export default function Page(){return <div className="min-h-screen bg-[#f5f7fa] text-slate-900"><Header/>
<InteriorNav route="/dormitories"/>
<PublicResourcePage route="dormitories"/><IntegratedSectionContent section="dormitories" compact/><Footer/></div>;}
