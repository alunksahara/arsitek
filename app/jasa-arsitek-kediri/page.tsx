import type { Metadata } from "next";
import LocationLanding, { type LocationData } from "@/components/LocationLanding";

const location: LocationData = {
  city: "Kediri",
  slug: "jasa-arsitek-kediri",
  province: "Jawa Timur",
  seoTitle: "Jasa Arsitek Kediri | RUMAH ARSITEK",
  seoDescription: "Jasa arsitek Kediri untuk desain rumah, interior, eksterior, dan renovasi dengan pendekatan fungsional dan sesuai kebutuhan proyek.",
  h1: "Jasa Arsitek Kediri",
  intro: "RUMAH ARSITEK membantu merancang rumah tinggal dan ruang komersial di Kediri dengan proses yang jelas, mulai dari memahami kebutuhan hingga mengembangkan konsep desain.",
  localContext: "Setiap proyek di Kediri memiliki kebutuhan yang berbeda. Kami mempertimbangkan karakter lingkungan, kebutuhan ruang, gaya hidup, anggaran, serta hubungan antara bangunan dan area luar agar desain tidak hanya menarik tetapi juga nyaman digunakan.",
  services: ["Desain rumah tinggal", "Interior & eksterior", "Renovasi & pengembangan desain"],
  process: ["Konsultasi kebutuhan", "Konsep & eksplorasi desain", "Pengembangan gambar", "Persiapan menuju pelaksanaan"],
  faqs: [
    { question: "Apakah RUMAH ARSITEK melayani proyek di Kediri?", answer: "Ya. Halaman ini dibuat khusus untuk kebutuhan proyek di wilayah Kediri dan sekitarnya. Detail cakupan proyek dapat dibahas saat konsultasi." },
    { question: "Layanan apa saja yang tersedia?", answer: "Layanan dapat mencakup desain arsitektur, interior, eksterior, serta renovasi sesuai kebutuhan proyek." },
    { question: "Bagaimana cara memulai konsultasi?", answer: "Kirim kebutuhan dasar proyek melalui halaman kontak. Tim kemudian dapat membantu menentukan langkah berikutnya." },
  ],
};

export const metadata: Metadata = {
  title: location.seoTitle,
  description: location.seoDescription,
  alternates: { canonical: `/jasa-arsitek-kediri` },
};

export default function KediriPage() {
  return <LocationLanding location={location} />;
}
