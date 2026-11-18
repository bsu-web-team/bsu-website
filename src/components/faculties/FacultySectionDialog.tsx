"use client";
import { useId, useRef, type ReactNode } from "react";
import { X, ChevronRight } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
const closeLabels={ru:"Закрыть",ky:"Жабуу",en:"Close","zh-CN":"关闭"};
export default function FacultySectionDialog({label,children}:{label:ReactNode;children:ReactNode}) {
 const ref=useRef<HTMLDialogElement>(null); const titleId=useId(); const {locale}=useLocale();
 return <><button type="button" className="bsu-faculty-dialog-trigger" aria-haspopup="dialog" onClick={()=>ref.current?.showModal()}>{label}<ChevronRight size={16}/></button><dialog ref={ref} aria-labelledby={titleId} className="bsu-faculty-dialog" onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close();}}}><div className="bsu-faculty-dialog-head"><h2 id={titleId}>{label}</h2><button type="button" aria-label={closeLabels[locale]} onClick={()=>ref.current?.close()}><X size={23}/></button></div><div className="bsu-faculty-dialog-body">{children}</div></dialog></>;
}
