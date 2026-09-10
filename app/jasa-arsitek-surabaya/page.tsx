import type { Metadata } from "next";
import LocationLanding, { type LocationData } from "@/components/LocationLanding";

const location: LocationData = {
  city: "Surabaya",
  slug: "jasa-arsitek-surabaya",
  province: "Jawa Timur",
  seoTitle: "Jasa Arsitek Surabaya | RUMAH ARSITEK",
  seoDescription: "Jasa arsitek Surabaya untuk desain rumah, interior, eksterior, dan renovasi dengan pendekatan desain yang fungsional dan terarah.",
  h1: "Jasa Arsitek Surabaya",
  intro: "RUMAH ARSITEK membantu merancang hunian dan ruang komersial di Surabaya dengan konsep yang disusun berdasarkan kebutuhan aktivitas, karakter bangunan, kondisi lahan, dan target proyek.",
  localContext: "Kebutuhan bangunan di Surabaya sangat beragam, mulai dari rumah tinggal hingga ruang usaha. Perancangan dapat mempertimbangkan kepadatan lingkungan, hubungan ruang dalam dan luar, kebutuhan privasi, sirkulasi, kenyamanan, serta karakter kawasan.",
  services: ["Desain rumah tinggal", "Interior & eksterior", "Renovasi & pengembangan desain"],
  process: ["Konsultasi kebutuhan", "Konsep & eksplorasi desain", "Pengembangan gambar", "Persiapan menuju pelaksanaan"],
  faqs: [
    { question: "Apakah menerima proyek di Surabaya?", answer: "Ya. Kami menyediakan konsultasi untuk kebutuhan desain di Surabaya dan sekitarnya. Lingkup pekerjaan disesuaikan dengan kebutuhan proyek." },
    { question: "Apakah desain bisa untuk rumah maupun usaha?", answer: "Ya. Konsultasi dapat mencakup hunian maupun kebutuhan ruang komersial, dengan lingkup desain ditentukan berdasarkan proyek." },
    { question: "Bagaimana memulai proses desain?", answer: "Sampaikan lokasi, kebutuhan ruang, kondisi bangunan atau lahan, serta target proyek melalui halaman kontak untuk memulai konsultasi." },
  ],
};

export const metadata: Metadata = {
  title: location.seoTitle,
  description: location.seoDescription,
  alternates: { canonical: `/jasa-arsitek-surabaya` },
};

export default function SurabayaPage() {
  return <LocationLanding location={location} />;
}
