// BSU Integrated Content v1
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionContent from "@/components/integrated/SectionContent";
export const metadata={robots:{index:false,follow:false}};
export default function Page(){return <div className="min-h-screen bg-[#f5f7fa] text-slate-900"><Header/><main><SectionContent section="about"/></main><Footer/></div>;}
