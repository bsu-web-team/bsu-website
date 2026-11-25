import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminApiBase, allowedOrigin, SESSION_COOKIE } from "@/lib/admin-session";

type Method = "GET" | "POST" | "PUT";
async function proxy(request: Request, method: Method) {
  if (process.env.NODE_ENV !== "development") return NextResponse.json({error:"Недоступно"},{status:404});
  const token=(await cookies()).get(SESSION_COOKIE)?.value;
  if(!token)return NextResponse.json({error:"Требуется вход"},{status:401});
  if(method!=="GET"&&!allowedOrigin(request))return NextResponse.json({error:"Неверный источник"},{status:403});
  const u=new URL(request.url),action=u.searchParams.get("action")??"mine",id=u.searchParams.get("id");
  if(id!==null&&!/^[1-9]\d*$/.test(id))return NextResponse.json({error:"Недопустимый ID"},{status:400});
  let path:string;
  if(method==="GET"&&(action==="mine"||action==="review"))path=action;
  else if(method==="POST"&&action==="create")path="drafts";
  else if(method==="PUT"&&action==="update"&&id)path=`drafts/${id}`;
  else if(method==="POST"&&id&&(action==="submit"||action==="decision"))path=`drafts/${id}/${action}`;
  else return NextResponse.json({error:"Недопустимый запрос"},{status:400});
  try {
    const body=method==="GET"?undefined:await request.json();
    const resp=await fetch(`${adminApiBase()}/admin-program-workflow/${path}`,{
      method,cache:"no-store",signal:AbortSignal.timeout(12000),
      headers:{Authorization:`Bearer ${token}`,...(body===undefined?{}:{"Content-Type":"application/json"})},
      ...(body===undefined?{}:{body:JSON.stringify(body)})
    });
    const result:unknown=await resp.json().catch(()=>({error:`Backend HTTP ${resp.status}`}));
    const output=NextResponse.json(result,{status:resp.status});output.headers.set("Cache-Control","no-store");return output;
  } catch{return NextResponse.json({error:"Backend недоступен или некорректный запрос"},{status:502});}
}
export async function GET(r:Request){return proxy(r,"GET");}
export async function POST(r:Request){return proxy(r,"POST");}
export async function PUT(r:Request){return proxy(r,"PUT");}
