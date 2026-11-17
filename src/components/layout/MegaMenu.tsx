"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { siteRegistry } from "@/lib/site-registry";
import type { Locale } from "@/lib/i18n";
export type NavLink={label:string;href:string;description?:string};
export type NavGroup={title:string;links:NavLink[]};
export type NavSection={title:string;summary:string;href:string;groups:NavGroup[]};
const specs = [
  [
    "/about",
    [
      [
        [
          "Об университете",
          "Университет жөнүндө",
          "About BSU",
          "大学概况"
        ],
        [
          "/about/history",
          "/about/mission",
          "/about/leadership",
          "/about/academic-council"
        ]
      ],
      [
        [
          "Структура и управление",
          "Түзүм жана башкаруу",
          "Governance",
          "组织与管理"
        ],
        [
          "/about/structure",
          "/about/administration"
        ]
      ],
      [
        [
          "Связь с БГУ",
          "БМУ менен байланыш",
          "Connect with BSU",
          "联系我们"
        ],
        [
          "/contacts"
        ]
      ]
    ]
  ],
  [
    "/education",
    [
      [
        [
          "Структура обучения",
          "Окуу түзүмү",
          "Academic units",
          "教学单位"
        ],
        [
          "/faculties",
          "/departments"
        ]
      ],
      [
        [
          "Уровни образования",
          "Билим деңгээлдери",
          "Degree levels",
          "学位层次"
        ],
        [
          "/programs"
        ]
      ],
      [
        [
          "Учебная информация",
          "Окуу маалыматы",
          "Academic information",
          "教学信息"
        ],
        [
          "/continuing-education"
        ]
      ]
    ]
  ],
  [
    "/admissions",
    [
      [
        [
          "Как поступить",
          "Кантип тапшыруу керек",
          "How to apply",
          "申请入学"
        ],
        [
          "/admissions/rules",
          "/admissions/documents",
          "/admissions/tuition",
          "/admissions/international"
        ]
      ],
      [
        [
          "Среднее профессиональное образование",
          "Орто кесиптик билим",
          "Vocational education",
          "职业教育"
        ],
        [
          "/college"
        ]
      ]
    ]
  ],
  [
    "/science",
    [
      [
        [
          "Исследования",
          "Изилдөөлөр",
          "Research",
          "科研"
        ],
        [
          "/science/research-office"
        ]
      ],
      [
        [
          "Научная коммуникация",
          "Илимий байланыш",
          "Scholarly communication",
          "学术交流"
        ],
        [
          "/science/dissertation-councils"
        ]
      ],
      [
        [
          "Издания",
          "Басылмалар",
          "Journals",
          "学术期刊"
        ],
        [
          "/science/journals"
        ]
      ]
    ]
  ],
  [
    "/international",
    [
      [
        [
          "Сотрудничество",
          "Кызматташтык",
          "Partnerships",
          "国际合作"
        ],
        [
          "/international/office",
          "/international/partners",
          "/international/projects"
        ]
      ],
      [
        [
          "Обучение и обмен",
          "Окуу жана алмашуу",
          "Study and exchange",
          "学习与交流"
        ],
        [
          "/international/mobility",
          "/international/education-center"
        ]
      ]
    ]
  ],
  [
    "/student-life",
    [
      [
        [
          "Учёба и сервисы",
          "Окуу жана кызматтар",
          "Study and services",
          "学习与服务"
        ],
        [
          "/schedule",
          "/academic-calendar",
          "/services"
        ]
      ],
      [
        [
          "Кампус",
          "Кампус",
          "Campus",
          "校园生活"
        ],
        [
          "/dormitories"
        ]
      ],
      [
        [
          "Чтение и ресурсы",
          "Окуу жана ресурстар",
          "Reading and resources",
          "阅读与资源"
        ],
        [
          "/library"
        ]
      ],
      [
        [
          "Информация",
          "Маалымат",
          "Information",
          "信息"
        ],
        [
          "/news",
          "/documents"
        ]
      ]
    ]
  ]
] as const;
const wording={ru:["Студентам","Новости и документы","Открыть раздел"],ky:["Студенттерге","Жаңылыктар жана документтер","Бөлүмдү ачуу"],en:["Students","News & documents","Explore section"],"zh-CN":["学生服务","新闻与文件","进入栏目"]};
export function getNavigation(locale:Locale):NavSection[]{
 const idx={ru:0,ky:1,en:2,"zh-CN":3}[locale]; const w=wording[locale];
 const link=(href:string):NavLink=>({href,label:siteRegistry.find(r=>r.route===href)?.titles[locale]??href});
 return specs.map(([root,groups],i)=>({href:root,title:i===5?w[0]:i===6?w[1]:link(root).label,summary:w[2],groups:groups.map(([titles,links])=>({title:titles[idx],links:links.map(link)}))}));
}
export const navigation=getNavigation("ru");
export default function MegaMenu({onOpen}:{onOpen?:()=>void}){const {locale,t}=useLocale();const sections=getNavigation(locale);const [active,setActive]=useState<number|null>(null);const root=useRef<HTMLElement>(null);const triggers=useRef<(HTMLButtonElement|null)[]>([]);const current=active===null?null:sections[active];
 useEffect(()=>{const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setActive(null);}; const key=(e:KeyboardEvent)=>{if(e.key==="Escape"&&active!==null){setActive(null);triggers.current[active]?.focus();}};document.addEventListener("pointerdown",outside);document.addEventListener("keydown",key);return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",key);};},[active]);
 return <nav ref={root} className="bn-desktop" aria-label={t("navLabel")} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setActive(null);}}><div className="bn-navline">{sections.map((s,i)=><button key={s.href} ref={el=>{triggers.current[i]=el;}} type="button" aria-expanded={active===i} aria-controls={active===i?"bn-mega":undefined} onClick={()=>{if(active!==i)onOpen?.();setActive(active===i?null:i);}}>{s.title}<ChevronDown size={14} aria-hidden="true"/></button>)}</div>{current&&<div id="bn-mega" key={current.href} className="bn-mega bn-mega-v5" data-groups={current.groups.length}><aside className="bn-feature"><span>BSU / {String((active??0)+1).padStart(2,"0")}</span><strong>{current.title}</strong><Link href={current.href} onClick={()=>setActive(null)}>{wording[locale][2]} <ArrowUpRight size={18}/></Link></aside><div className="bn-groups">{current.groups.map((g,i)=><section key={i} style={{animationDelay:`${Math.min(i,8)*35}ms`}}><h3>{g.title}</h3>{g.links.map(l=><Link key={l.href} href={l.href} prefetch={false} onClick={()=>setActive(null)}>{l.label}<ArrowUpRight size={13} aria-hidden="true"/></Link>)}</section>)}</div></div>}</nav>;
}
