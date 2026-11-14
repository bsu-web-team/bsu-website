import type {Metadata} from "next";
import StaffIndexLocalized from "@/components/staff/StaffIndexLocalized";
import {getStaff} from "@/lib/staff-data";
export const metadata:Metadata={title:"Сотрудники и преподаватели | БГУ",description:"Предварительный справочник сотрудников БГУ"};
export default async function StaffPage(){const people=await getStaff();return <StaffIndexLocalized people={people}/>;}
