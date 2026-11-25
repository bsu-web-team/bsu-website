import { NextResponse } from "next/server";
import { adminApiBase } from "@/lib/admin-session";

// Test API only. Regular /api/v1/programs remains bound to the production data source.
export async function GET() {
  if (process.env.NODE_ENV !== "development") return NextResponse.json({error:"Недоступно"},{status:404});
  try {
    const r=await fetch(`${adminApiBase()}/programs`,{cache:"no-store",signal:AbortSignal.timeout(10000)});
    const result:unknown=await r.json();
    const output=NextResponse.json(result,{status:r.status});output.headers.set("Cache-Control","no-store");return output;
  }catch{return NextResponse.json({error:"Тестовый API недоступен"},{status:502});}
}
