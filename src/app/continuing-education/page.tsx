import InteriorNav from "@/components/interior/InteriorNav";
import IntegratedSectionContent from "@/components/integrated/SectionContent";
// BSU Pages v1: generated public route
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicResourcePage from "@/components/pages/PublicResourcePage";
export const metadata: Metadata = {title:"Дополнительное образование",description:"Повышение квалификации и переподготовка в ИНДОППК БГУ. Условия и сроки уточняйте в институте."};
export default function Page(){return <div className="min-h-screen bg-[#f5f7fa] text-slate-900"><Header/>
<InteriorNav route="/continuing-education"/>
<PublicResourcePage route="continuing-education"/><IntegratedSectionContent section="continuing-education" compact/><Footer/></div>;}
