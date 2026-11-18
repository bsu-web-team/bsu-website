// BSU Interior v2
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicTextV13 from "@/components/i18n/PublicTextV13";
import FacultyFullContent from "@/components/faculties/FacultyFullContent";
import { departmentHref } from "@/lib/department-data";
import { getFacultyBySlug } from "@/lib/faculty-data";
import InteriorNav from "./InteriorNav";
import PanelLabel from "./PanelLabel";
export type FacultyTab="details"|"departments"|"programs"|"staff"|"documents"|"news";
const fallback={staff:"/staff",documents:"/documents",news:"/news"} as const;
export default async function FacultyPanel({slug,tab}:{slug:string;tab:FacultyTab}){
 const faculty=await getFacultyBySlug(slug);if(!faculty)notFound();const base=`/faculties/${slug}`;
 return <div className="min-h-screen bg-[#f5f7fa] text-[#204774]"><Header/><main className="bsu-interior-faculty"><section className="bsu-interior-hero"><div><Link href="/faculties" prefetch={false}><PanelLabel name="faculties"/></Link><p>BSU / PORTAL</p><h1><PublicTextV13 value={faculty.name}/></h1></div></section><InteriorNav facultyBase={base} activeTab={tab}/><div className="bsu-interior-body"><h2><PanelLabel name={tab}/></h2>{tab==="details"?<FacultyFullContent sourceUrl={faculty.sourceUrl} compact/>:tab==="departments"?<><div className="bsu-interior-grid" data-bsu-motion-list>{faculty.departments?.map(name=><Link href={departmentHref(slug,name)} prefetch={false} key={name} className="bsu-interior-card" data-bsu-motion-item><PublicTextV13 value={name}/> ↗</Link>)}</div><Link className="bsu-interior-action" href="/departments" prefetch={false}><PanelLabel name="all"/> ↗</Link></>:tab==="programs"?<><div className="bsu-interior-grid" data-bsu-motion-list>{faculty.programs?.map((p,i)=><div key={i} className="bsu-interior-card" data-bsu-motion-item><strong><PublicTextV13 value={p.title}/></strong>{p.degree&&<p><PublicTextV13 value={p.degree}/></p>}{p.code&&<small>{p.code}</small>}</div>)}</div><Link className="bsu-interior-action" href="/programs" prefetch={false}><PanelLabel name="all"/> ↗</Link></>:<div className="bsu-interior-card"><p><PanelLabel name="pending"/></p><Link className="bsu-interior-action" href={fallback[tab]} prefetch={false}><PanelLabel name="all"/> ↗</Link></div>}</div></main><Footer/></div>;
}
