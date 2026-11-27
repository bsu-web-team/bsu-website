import CultureYouthLink from "@/components/student-life/CultureYouthLink";
import Link from "next/link";
import InteriorNav from "@/components/interior/InteriorNav";
import IntegratedSectionContent from "@/components/integrated/SectionContent";
// BSU Pages v1: generated public route
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicResourcePage from "@/components/pages/PublicResourcePage";
export const metadata: Metadata = {title:"Студенческая жизнь",description:"Студенческие инициативы, мероприятия и возможности участия."};
export default function Page(){return <div className="min-h-screen bg-[#f5f7fa] text-slate-900"><Header/>
<InteriorNav route="/student-life"/>
<PublicResourcePage route="student-life"/><IntegratedSectionContent section="student-life" compact/>        <CultureYouthLink/>
<Footer/></div>;}
