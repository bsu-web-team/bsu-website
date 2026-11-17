import PartnersCarousel from "@/components/partners/PartnersCarousel";
import InteriorNav from "@/components/interior/InteriorNav";
import IntegratedSectionContent from "@/components/integrated/SectionContent";
// BSU Pages v1: generated public route
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicResourcePage from "@/components/pages/PublicResourcePage";
export const metadata: Metadata = {title:"Международное сотрудничество",description:"Академическая мобильность, обмен и международные проекты."};
export default function Page(){return <div className="min-h-screen bg-[#f5f7fa] text-slate-900"><Header/>
<InteriorNav route="/international"/>
<PublicResourcePage route="international"/><IntegratedSectionContent section="international" compact/><PartnersCarousel showLink/><Footer/></div>;}
