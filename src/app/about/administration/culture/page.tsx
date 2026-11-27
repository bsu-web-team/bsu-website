import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CultureYouthContent from "@/components/student-life/CultureYouthContent";

export const metadata: Metadata = {
  title: "Маданият жана жаштар менен иштөө бөлүмү | БГУ",
  description: "БГУ — Отдел культуры и работы с молодёжью. Руководитель: Султанбек уулу Азиз.",
};

export default function CultureAndYouthPage(){return <div className="min-h-screen bg-[#f5f7fb] text-[#183c65]"><Header/><CultureYouthContent/><Footer/></div>}
