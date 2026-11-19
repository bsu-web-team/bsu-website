import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ModernHome from "@/components/home/ModernHome";
import { getNews } from "@/lib/news-api";
import "./modern-home.css";

export default async function Home() {
  const latestNews = (await getNews()).slice(0, 3);
  return (
    <div className="bsu-modern-home min-h-screen bg-white text-slate-900">
      <Header />
      <ModernHome latestNews={latestNews} />
      <Footer />
    </div>
  );
}
