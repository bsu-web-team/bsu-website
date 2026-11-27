import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccreditationCatalog from "@/components/accreditation/AccreditationCatalog";

export const metadata = { title: "Аккредитация | БГУ" };

export default function AccreditationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AccreditationCatalog />
      <Footer />
    </div>
  );
}
