import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminApiBase, allowedOrigin, SESSION_COOKIE } from "@/lib/admin-session";

async function proxy(request: Request, method: "GET" | "POST" | "PUT") {
  if (process.env.NODE_ENV !== "development") return NextResponse.json({error:"Недоступно"},{status:404});
  const token=(await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({error:"Требуется вход"},{status:401});
  if(method!=="GET" && !allowedOrigin(request)) return NextResponse.json({error:"Неверный источник"},{status:403});
  const u=new URL(request.url);
  const action=u.searchParams.get("action")??"mine",id=u.searchParams.get("id");
  if(id!==null && !/^[1-9]\d*$/.test(id))return NextResponse.json({error:"Недопустимый ID"},{status:400});
  let path="";
  if(method==="GET" && (action==="mine"||action==="review"))path=action;
  else if(method==="GET" && action==="file" && id)path=`drafts/${id}/file`;
  else if(method==="POST" && action==="create")path="drafts";
  else if(method==="PUT" && action==="update" && id)path=`drafts/${id}`;
  else if(method==="POST" && action==="upload" && id)path=`drafts/${id}/file`;
  else if(method==="POST" && (action==="submit"||action==="decision") && id)path=`drafts/${id}/${action}`;
  else return NextResponse.json({error:"Недопустимый запрос"},{status:400});
  try {
    const isUpload=action==="upload";
    const isFile=action==="file";
    const payload=method==="GET"?undefined:isUpload?await request.formData():await request.json();
    const headers:Record<string,string>={Authorization:`Bearer ${token}`};
    if(payload && !isUpload)headers["Content-Type"]="application/json";
    const response=await fetch(`${adminApiBase()}/admin-documents/${path}`,{
      method,cache:"no-store",signal:AbortSignal.timeout(20000),headers,
      ...(payload===undefined?{}:{body:isUpload?payload as FormData:JSON.stringify(payload)})
    });
    if(isFile && response.ok){
      const output=new NextResponse(response.body,{status:response.status});
      output.headers.set("Content-Type",response.headers.get("content-type")??"application/octet-stream");
      output.headers.set("Content-Disposition",response.headers.get("content-disposition")??"attachment");
      output.headers.set("Cache-Control","private, no-store");
      output.headers.set("X-Content-Type-Options","nosniff");
      return output;
    }
    const result:unknown=await response.json().catch(()=>({error:`Backend HTTP ${response.status}`}));
    const output=NextResponse.json(result,{status:response.status});output.headers.set("Cache-Control","no-store");return output;
  }catch{return NextResponse.json({error:"Тестовый Backend недоступен или некорректный запрос"},{status:502});}
}
export async function GET(request:Request){return proxy(request,"GET");}
export async function POST(request:Request){return proxy(request,"POST");}
export async function PUT(request:Request){return proxy(request,"PUT");}
