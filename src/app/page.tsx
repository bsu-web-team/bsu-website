import { getFaculties, getNews } from "@/lib/backend/data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ModernHome from "@/components/home/ModernHome";
import "./modern-home.css";

export default async function Home() {
  const [faculties, newsRecords] = await Promise.all([getFaculties(), getNews()]);
  return (
    <div className="bsu-modern-home min-h-screen bg-white text-slate-900">
      <Header />
      <ModernHome faculties={faculties} newsRecords={newsRecords} />
      <Footer />
    </div>
  );
}
