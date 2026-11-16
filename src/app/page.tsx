import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ModernHome from "@/components/home/ModernHome";
import "./modern-home.css";

export default function Home() {
  return (
    <div className="bsu-modern-home min-h-screen bg-white text-slate-900">
      <Header />
      <ModernHome />
      <Footer />
    </div>
  );
}
