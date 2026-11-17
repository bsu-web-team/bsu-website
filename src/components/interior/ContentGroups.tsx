// BSU Interior v2
import type { ReactNode } from "react";
import PanelLabel from "./PanelLabel";
type Block={kind:string;text?:string};
/** Long reference materials use native disclosure controls; articles stay readable. */
export default function ContentGroups({blocks,children,compact=true}:{blocks:Block[];children:ReactNode[];compact?:boolean}){
 if(!compact||blocks.length<=14)return <>{children}</>;
 const groups:{title?:string;start:number;end:number}[]=[];
 let start=0;for(let i=1;i<blocks.length;i++){if((blocks[i].kind==="heading"&&i-start>=3)||i-start>=12){groups.push({title:blocks[start].kind==="heading"?blocks[start].text:undefined,start,end:i});start=i;}}
 groups.push({title:blocks[start].kind==="heading"?blocks[start].text:undefined,start,end:blocks.length});
 return <div className="bsu-interior-content-groups" data-bsu-motion-list>{groups.map((g,i)=><details key={g.start} open={i===0} className="bsu-interior-index-details"><summary>{g.title||<><PanelLabel name="part"/> {i+1}</>} <small>{g.end-g.start}</small></summary><div className="space-y-4 bsu-interior-group-body">{children.slice(g.start,g.end)}</div></details>)}</div>;
}
