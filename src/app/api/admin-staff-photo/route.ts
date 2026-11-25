import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import {adminApiBase,allowedOrigin,SESSION_COOKIE} from "@/lib/admin-session";
async function proxy(request:Request,method:"GET"|"POST"|"DELETE"){
 if(process.env.NODE_ENV!=="development")return NextResponse.json({error:"РќРµРґРѕСЃС‚СѓРїРЅРѕ"},{status:404});
 const token=(await cookies()).get(SESSION_COOKIE)?.value;
 if(!token)return NextResponse.json({error:"РўСЂРµР±СѓРµС‚СЃСЏ РІС…РѕРґ"},{status:401});
 const id=new URL(request.url).searchParams.get("id");
 if(!id||!(/^[1-9]\d*$/.test(id)))return NextResponse.json({error:"РќРµРІРµСЂРЅС‹Р№ РёРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ"},{status:400});
 if(method!=="GET"&&!allowedOrigin(request))return NextResponse.json({error:"РќРµРІРµСЂРЅС‹Р№ РёСЃС‚РѕС‡РЅРёРє"},{status:403});
 let body:FormData|undefined;
 if(method==="POST"){
   body=await request.formData();const file=body.get("file");
   if(!(file instanceof File)||file.size===0||file.size>5*1024*1024)return NextResponse.json({error:"Р¤Р°Р№Р» РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ РѕС‚ 1 Р±Р°Р№С‚Р° РґРѕ 5 РњР‘"},{status:413});
   if(!["image/jpeg","image/png","image/webp"].includes(file.type))return NextResponse.json({error:"РўРѕР»СЊРєРѕ JPEG/PNG/WebP"},{status:415});
   body=new FormData();body.set("file",file);
 }
 try{
   const res=await fetch(`${adminApiBase()}/admin-staff/drafts/${id}/photo`,{method,headers:{Authorization:`Bearer ${token}`},...(body?{body}:{}),cache:"no-store",signal:AbortSignal.timeout(15000)});
   if(method==="GET"&&res.ok){return new NextResponse(await res.arrayBuffer(),{status:200,headers:{"Content-Type":res.headers.get("content-type")??"application/octet-stream","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}})}
   const value:unknown=await res.json().catch(()=>({error:`Backend HTTP ${res.status}`}));
   return NextResponse.json(value,{status:res.status,headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"РўРµСЃС‚РѕРІС‹Р№ Backend РЅРµРґРѕСЃС‚СѓРїРµРЅ"},{status:502})}
}
export async function GET(req:Request){return proxy(req,"GET")}
export async function POST(req:Request){return proxy(req,"POST")}
export async function DELETE(req:Request){return proxy(req,"DELETE")}
