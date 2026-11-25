import {NextResponse} from "next/server";
export async function GET(){
  if(process.env.NODE_ENV!=="development") return NextResponse.json({error:"Только тестовая среда"},{status:404});
  const base=process.env.BSU_UNIT_PUBLICATION_BASE_URL || "http://127.0.0.1:8001/api/v1";
  try{
    const res=await fetch(`${base}/approved-documents`,{cache:"no-store",signal:AbortSignal.timeout(10000)});
    if(!res.ok)return NextResponse.json({error:`Тестовый Backend: HTTP ${res.status}`},{status:502});
    const data:unknown=await res.json();
    return NextResponse.json(data,{headers:{"Cache-Control":"no-store"}});
  }catch{return NextResponse.json({error:"Тестовый Backend недоступен"},{status:502});}
}
