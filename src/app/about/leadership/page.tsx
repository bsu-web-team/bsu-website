import type { Metadata } from "next";
import AboutLocalized from "@/components/about/AboutLocalized";
export const metadata: Metadata = { title: "Руководство университета | БГУ" };
export default function Page() { return <AboutLocalized view="leadership" />; }
