import { facultyRoster } from "@/lib/faculty-leadership";
import FacultyLeadershipDrawer from "@/components/faculties/FacultyLeadershipDrawer";
import { facultyOverviewContent } from "@/lib/faculty-overview-content";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight, Mail, MapPin, Phone, UserRound } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicTextV13, { PublicPersonV13 } from "@/components/i18n/PublicTextV13";
import PanelLabel from "@/components/interior/PanelLabel";
import FacultySectionDialog from "@/components/faculties/FacultySectionDialog";
import { getFacultyMaterial } from "@/components/faculties/FacultyFullContent";
import { departmentHref } from "@/lib/department-data";
import { getFacultyBySlug } from "@/lib/faculty-data";
import { getNews } from "@/lib/news-data";
import { matchesNewsScope } from "@/lib/news-filter";
import UnitNewsV2 from "@/components/news/UnitNewsV2";
export const instant = false;
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const f=await getFacultyBySlug(slug);return {title:f?`${f.name} | БГУ`:"Подразделение не найдено | БГУ",description:f?.summary};}
export default async function FacultyPage({params}:Props){
 const {slug}=await params;const faculty=await getFacultyBySlug(slug);if(!faculty)notFound();
 const base=`/faculties/${slug}`;
 const unitNews=(await getNews()).filter(item=>matchesNewsScope(item,{facultySlug:slug})).slice(0,3);
 const blocks=getFacultyMaterial(faculty.sourceUrl)?.blocks??[];
 const brief=facultyOverviewContent(slug,blocks);

 const {people,deanPhoto}=facultyRoster(blocks,faculty.leader);

 const documents=Array.from(new Map(blocks.flatMap(b=>b.links??[]).filter(l=>/^(https?:\/\/|\/)/i.test(l.href)&&(/\.(pdf|docx?|xlsx?|pptx?)(?:[?#]|$)/i.test(l.href))&&!/\.(jpe?g|png|gif|webp|svg)(?:[?#]|$)/i.test(l.href)).map(l=>[l.href,l])).values());
 const contacts=<div className="bsu-faculty-contact-list">{faculty.address&&<div><MapPin size={19}/><span>{faculty.address}</span></div>}{faculty.phone&&<div><Phone size={19}/><a href={`tel:${faculty.phone.replace(/[^+\d]/g,"")}`}>{faculty.phone}</a></div>}{faculty.email&&<div><Mail size={19}/><a href={`mailto:${faculty.email}`}>{faculty.email}</a></div>}</div>;
 return <div className="min-h-screen bg-[#f5f7fb] text-slate-900 bsu-interior"><Header/><main>
 <section className="bsu-page-hero bg-[#204774] px-5 py-10 text-white sm:px-8 sm:py-14"><div className="mx-auto max-w-7xl"><nav aria-label="Navigation" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-blue-100"><Link href="/"><PublicTextV13 value="Главная"/></Link><ChevronRight size={15}/><Link href="/faculties"><PublicTextV13 value="Факультеты и институты"/></Link></nav><p className="text-sm font-semibold uppercase tracking-widest text-[#dfbd7e]">{faculty.shortName??<PublicTextV13 value={faculty.kind==="faculty"?"Факультет":"Институт"}/>}</p><h1 className="mt-3 max-w-4xl text-3xl font-extrabold leading-tight sm:text-5xl"><PublicTextV13 value={faculty.name}/></h1></div></section>
 <nav id="faculty-quick-nav" aria-label="Faculty sections" className="bsu-faculty-modal-nav" data-bsu-no-motion><div>
 <FacultySectionDialog label={<PanelLabel name="departments"/>}><div className="bsu-faculty-modal-list">{faculty.departments?.map(name=><Link key={name} href={departmentHref(slug,name)} prefetch={false}><PublicTextV13 value={name}/><ArrowUpRight size={17}/></Link>)}</div>{!faculty.departments?.length&&<p><PanelLabel name="pending"/></p>}<Link className="bsu-faculty-modal-link" href="/departments" prefetch={false}><PanelLabel name="all"/> ↗</Link></FacultySectionDialog>
 <FacultySectionDialog label={<PanelLabel name="programs"/>}><div className="bsu-faculty-modal-list">{faculty.programs?.map((p,i)=><div key={i}><div><strong><PublicTextV13 value={p.title}/></strong>{p.degree&&<p><PublicTextV13 value={p.degree}/></p>}</div>{p.code&&<small>{p.code}</small>}</div>)}</div>{!faculty.programs?.length&&<p><PanelLabel name="pending"/></p>}<Link className="bsu-faculty-modal-link" href="/programs" prefetch={false}><PanelLabel name="all"/> ↗</Link></FacultySectionDialog>
 
 <FacultySectionDialog label={<PanelLabel name="documents"/>}><div className="bsu-faculty-modal-list">{documents.map(d=><a key={d.href} href={d.href} target="_blank" rel="noopener noreferrer"><PublicTextV13 value={d.label}/><ArrowUpRight size={17}/></a>)}</div>{!documents.length&&<p><PanelLabel name="pending"/></p>}<Link className="bsu-faculty-modal-link" href="/documents" prefetch={false}><PanelLabel name="all"/> ↗</Link></FacultySectionDialog>
 <FacultySectionDialog label={<PublicTextV13 value="Контакты"/>}>{contacts}</FacultySectionDialog>
 <FacultySectionDialog label={<PanelLabel name="news"/>}><UnitNewsV2 items={unitNews} facultySlug={slug}/></FacultySectionDialog>
 </div></nav>
 <div className="bsu-faculty-new-body mx-auto max-w-7xl px-5 py-8 sm:px-8"><div className="bsu-faculty-main-copy"><section className="bsu-faculty-info-card"><h2><PublicTextV13 value="О подразделении"/></h2><p><PublicTextV13 value={faculty.summary}/></p>{brief.length?brief.map((b,i)=><div className="bsu-faculty-brief" key={i}><h3><PublicTextV13 value={b.heading}/></h3>{b.paragraphs.map((paragraph,j)=><p key={j}><PublicTextV13 value={paragraph}/></p>)}</div>):null}<Link href={`${base}/details`} prefetch={false} className="bsu-faculty-modal-link"><PanelLabel name="details"/> <ArrowUpRight size={16}/></Link></section></div>
 <aside className="bsu-faculty-info-card bsu-faculty-lead"><div className="flex items-center gap-3"><UserRound size={20}/><span><PublicTextV13 value={faculty.leadTitle}/></span></div>{deanPhoto&&<Image className="bsu-faculty-lead-photo" src={deanPhoto} alt={faculty.leader} width={200} height={240} unoptimized/>}<h2><PublicPersonV13 name={faculty.leader}/></h2>
 <FacultyLeadershipDrawer leader={{name:faculty.leader,position:faculty.leadTitle,photo:deanPhoto}} people={people}/>{contacts}</aside></div>
 </main><Footer/></div>;
}
