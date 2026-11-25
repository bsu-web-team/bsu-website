import {NextResponse} from "next/server";
export async function GET(request:Request){
 if(process.env.NODE_ENV!=="development")return NextResponse.json({error:"Недоступно"},{status:404});
 const slug=new URL(request.url).searchParams.get("slug")??"";
 if(!/^[a-z0-9][a-z0-9-]{0,299}$/.test(slug))return NextResponse.json({error:"Неверный slug"},{status:400});
 const base=process.env.BSU_UNIT_PUBLICATION_BASE_URL;
 if(!base||!/^http:\/\/127\.0\.0\.1:8001\/api\/v1\/?$/.test(base))return NextResponse.json({error:"Тестовая публикация не настроена"},{status:503});
 try{
  const res=await fetch(`${base.replace(/\/$/,"")}/staff-photos/${slug}`,{cache:"no-store",signal:AbortSignal.timeout(10000)});
  if(!res.ok)return NextResponse.json({error:"Фото не опубликовано"},{status:res.status});
  return new NextResponse(await res.arrayBuffer(),{status:200,headers:{"Content-Type":res.headers.get("content-type")??"application/octet-stream","Cache-Control":"public, max-age=60","X-Content-Type-Options":"nosniff"}});
 }catch{return NextResponse.json({error:"Тестовый Backend недоступен"},{status:502})}
}
