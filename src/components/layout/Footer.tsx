"use client";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { siteRegistry } from "@/lib/site-registry";
const groups=[["/about","/contacts"],["/education","/programs","/admissions"],["/student-life","/schedule","/services/avn"],["/science","/news","/documents"]];
export default function Footer(){const {locale,t}=useLocale();const label=(href:string)=>siteRegistry.find(r=>r.route===href)?.titles[locale]??href;return <footer className="bn-footer"><div className="bn-footerinner"><div className="bn-footbrand"><strong>BSU<span> / </span>PORTAL</strong><p>{t("uniName")}</p></div><div className="bn-footgrid">{groups.map(g=><section key={g[0]}><h3>{label(g[0])}</h3>{g.slice(1).map(h=><Link href={h} key={h} prefetch={false}>{label(h)}</Link>)}</section>)}</div><div className="bn-footbottom"><span>{t("footerDev")}</span><Link href="/site-map">{label("/site-map")}</Link><Link href="/search">{label("/search")}</Link></div><p className="bn-footnote">{t("footerDisclaimer")}</p></div></footer>;}
