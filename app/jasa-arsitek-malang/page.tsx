import type { Metadata } from "next";
import LocationLanding, { type LocationData } from "@/components/LocationLanding";

const location: LocationData = {
  city: "Malang",
  slug: "jasa-arsitek-malang",
  province: "Jawa Timur",
  seoTitle: "Jasa Arsitek Malang | RUMAH ARSITEK",
  seoDescription: "Jasa arsitek Malang untuk desain rumah, interior, eksterior, dan renovasi yang mengutamakan fungsi, kenyamanan, dan karakter bangunan.",
  h1: "Jasa Arsitek Malang",
  intro: "RUMAH ARSITEK membantu pemilik rumah dan usaha mengembangkan konsep bangunan di Malang dengan perhatian pada kebutuhan ruang, karakter lingkungan, dan kualitas pengalaman ruang.",
  localContext: "Konteks Malang dapat menghadirkan kebutuhan desain yang beragam, dari rumah keluarga hingga properti komersial. Kami mengembangkan rancangan dengan memperhatikan kondisi lahan, aktivitas penghuni, orientasi, kenyamanan, dan hubungan ruang dalam dengan ruang luar.",
  services: ["Desain rumah tinggal", "Interior & eksterior", "Renovasi & pengembangan desain"],
  process: ["Konsultasi kebutuhan", "Konsep & eksplorasi desain", "Pengembangan gambar", "Persiapan menuju pelaksanaan"],
  faqs: [
    { question: "Apakah RUMAH ARSITEK melayani proyek di Malang?", answer: "Ya. Kami membuka konsultasi untuk kebutuhan proyek di Malang dan area sekitarnya, dengan cakupan proyek dibahas berdasarkan kebutuhan masing-masing." },
    { question: "Apakah hanya menerima desain rumah?", answer: "Tidak. Layanan dapat mencakup arsitektur, interior, eksterior, dan renovasi sesuai lingkup proyek." },
    { question: "Informasi apa yang sebaiknya disiapkan saat konsultasi?", answer: "Lokasi atau kondisi lahan, kebutuhan ruang, perkiraan luas, referensi gaya, dan kisaran anggaran akan membantu proses konsultasi." },
  ],
};

export const metadata: Metadata = {
  title: location.seoTitle,
  description: location.seoDescription,
  alternates: { canonical: `/jasa-arsitek-malang` },
};

export default function MalangPage() {
  return <LocationLanding location={location} />;
}
