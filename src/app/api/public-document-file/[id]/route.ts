import {NextResponse} from "next/server";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
  if(process.env.NODE_ENV!=="development")return NextResponse.json({error:"Только тестовая среда"},{status:404});
  const {id}=await params;
  if(!/^[1-9]\d*$/.test(id))return NextResponse.json({error:"Неверный ID"},{status:400});
  const base=process.env.BSU_UNIT_PUBLICATION_BASE_URL || "http://127.0.0.1:8001/api/v1";
  try{
    const res=await fetch(`${base}/approved-documents/${id}/download`,{cache:"no-store",signal:AbortSignal.timeout(20000)});
    if(!res.ok)return NextResponse.json({error:"Документ не опубликован"},{status:res.status});
    const result=new NextResponse(res.body,{status:200});
    result.headers.set("Content-Type",res.headers.get("content-type")??"application/octet-stream");
    result.headers.set("Content-Disposition",res.headers.get("content-disposition")??"attachment");
    result.headers.set("Cache-Control","public, max-age=60");
    result.headers.set("X-Content-Type-Options","nosniff");
    return result;
  }catch{return NextResponse.json({error:"Тестовый Backend недоступен"},{status:502});}
}
