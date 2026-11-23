import { getFaculties } from '@/lib/backend/data';
// BSU Interior v2
import FacultyPanel from "@/components/interior/FacultyPanel";

export const metadata={robots:{index:false,follow:false}};
export const instant=false;
export async function generateStaticParams(){return (await getFaculties()).map(f=>({slug:f.slug}));}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <FacultyPanel slug={slug} tab="staff"/>;}
