import type {Metadata} from "next";
import {notFound} from "next/navigation";
import StaffProfileLocalized from "@/components/staff/StaffProfileLocalized";
import {getStaffBySlug} from "@/lib/staff-data";
export const instant=false;
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const person=await getStaffBySlug(slug);return {title:person?`${person.name} | БГУ`:"Сотрудник не найден | БГУ"};}
export default async function Page({params}:Props){const {slug}=await params;const person=await getStaffBySlug(slug);if(!person)notFound();return <StaffProfileLocalized person={person}/>;}
