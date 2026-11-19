import { getNews, getFaculties, getDepartments } from '@/lib/backend/data';
import InteriorNav from "@/components/interior/InteriorNav";
import IntegratedSectionContent from "@/components/integrated/SectionContent";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsIndexLocalized from "@/components/news/NewsIndexLocalized";

export const metadata:Metadata={title:"Новости и мероприятия | БГУ",description:"Новости, научные события и мероприятия Бишкекского государственного университета"};
export default async function NewsPage(){const [items,faculties,departments]=await Promise.all([getNews(),getFaculties(),getDepartments()]);return <div className="min-h-screen bg-[#f5f7fb] text-slate-900"><Header/>
<InteriorNav route="/news"/>
<NewsIndexLocalized items={items} faculties={faculties} departments={departments}/><IntegratedSectionContent section="news" compact/><Footer/></div>}
