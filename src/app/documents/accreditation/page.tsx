// BSU Architecture v1
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArchitectureView from "@/components/architecture/ArchitectureView";
import {siteRegistry} from "@/lib/site-registry";
import "@/components/architecture/architecture.css";
export const metadata={robots:{index:false,follow:false}};
export default function Page(){const entry=siteRegistry.find(e=>e.route==="/documents/accreditation")!;return <div className="min-h-screen bg-[#f5f7fa]"><Header/><ArchitectureView entry={entry} childrenEntries={siteRegistry.filter(e=>e.parent===entry.route)} /><Footer/></div>;}
