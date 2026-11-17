import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorNav from "@/components/interior/InteriorNav";
import PartnersCarousel from "@/components/partners/PartnersCarousel";
export const metadata={title:"Международные партнёры",robots:{index:false,follow:false}};
export default function Page(){return <div className="min-h-screen bg-[#f5f7fa]"><Header/><InteriorNav route="/international/partners"/><main><PartnersCarousel/></main><Footer/></div>}
