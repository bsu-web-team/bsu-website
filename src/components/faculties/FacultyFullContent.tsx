import { facultyRemainingContent } from "@/lib/faculty-overview-content";
// BSU Content Phase 1 generated
import MaterialBlocks, {type Material} from "@/components/pages/MaterialBlocks";
import faculty0 from "@/lib/content-phase1/fakultet-evropejskih-civilizacij-1d901d1af6.json";
import faculty1 from "@/lib/content-phase1/fakultet-jekologii-i-menedzhmenta-92ef33673b.json";
import faculty2 from "@/lib/content-phase1/fakultet-jekonomiki-i-finansov-7d6fe1f140.json";
import faculty3 from "@/lib/content-phase1/fakultet-pedagogicheskogo-obrazovanija-a6ec7ed84b.json";
import faculty4 from "@/lib/content-phase1/fakultet-russkoj-filologii-02223f0aae.json";
import faculty5 from "@/lib/content-phase1/fakultet-vostokovedenija-i-mezhdunarodnyh-otnoshenij-8efa55bb1c.json";
import faculty6 from "@/lib/content-phase1/fakultet-zhurnalistiki-i-informacionnyh-sistem-372dc71b14.json";
import faculty7 from "@/lib/content-phase1/indo-institut-nepreryvnogo-i-distancionnogo-obrazovanija-0b8720617e.json";
import faculty8 from "@/lib/content-phase1/kyrgyz-filologijasy-fakulteti-0d8eaf8f71.json";
import faculty9 from "@/lib/content-phase1/kyrgyzsko-kitajskij-fakultet-14de556b13.json";
import faculty10 from "@/lib/content-phase1/socialno-psihologicheskij-fakultet-2712ecd75b.json";
const records: Record<string,Material> = {"/fakultet-evropejskih-civilizacij": faculty0,"/fakultet-jekologii-i-menedzhmenta": faculty1,"/fakultet-jekonomiki-i-finansov": faculty2,"/fakultet-pedagogicheskogo-obrazovanija": faculty3,"/fakultet-russkoj-filologii": faculty4,"/fakultet-vostokovedenija-i-mezhdunarodnyh-otnoshenij": faculty5,"/fakultet-zhurnalistiki-i-informacionnyh-sistem": faculty6,"/indo-institut-nepreryvnogo-i-distancionnogo-obrazovanija": faculty7,"/kyrgyz-filologijasy-fakulteti": faculty8,"/kyrgyzsko-kitajskij-fakultet": faculty9,"/socialno-psihologicheskij-fakultet": faculty10};
export default function FacultyFullContent({sourceUrl,compact=false,overviewSlug}:{sourceUrl:string;compact?:boolean;overviewSlug?:string}){let k:string;try{k=new URL(sourceUrl).pathname.replace(/^\/(ru|kg|ky|en|cn|zh)(?=\/|$)/,'').replace(/\/$/,'');}catch{return null;}const data=records[k];if(!data)return null;return <section id="full-faculty-content" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8"><MaterialBlocks data={overviewSlug?facultyRemainingContent(overviewSlug,data):data} compact={compact}/></section>;}

export function getFacultyMaterial(sourceUrl:string):Material|undefined {try {const k=new URL(sourceUrl).pathname.replace(/^\/(ru|kg|ky|en|cn|zh)(?=\/|$)/,'').replace(/\/$/,'');return records[k];}catch{return undefined;}}
