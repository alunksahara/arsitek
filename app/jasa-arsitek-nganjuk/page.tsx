import type { Metadata } from "next";
import LocationLanding, { type LocationData } from "@/components/LocationLanding";

const location: LocationData = {
  city: "Nganjuk",
  slug: "jasa-arsitek-nganjuk",
  province: "Jawa Timur",
  seoTitle: "Jasa Arsitek Nganjuk | RUMAH ARSITEK",
  seoDescription: "Jasa arsitek Nganjuk untuk desain rumah, interior, eksterior, dan renovasi dengan pendekatan yang fungsional dan sesuai kebutuhan.",
  h1: "Jasa Arsitek Nganjuk",
  intro: "RUMAH ARSITEK melayani kebutuhan perancangan rumah dan ruang di Nganjuk dengan fokus pada fungsi, proporsi, kenyamanan, serta karakter pemilik bangunan.",
  localContext: "Perancangan di Nganjuk dapat disesuaikan dengan konteks lahan, lingkungan, aktivitas keluarga, kebutuhan ruang, dan rencana anggaran. Setiap konsep dikembangkan dari kebutuhan proyek, bukan sekadar mengikuti tren.",
  services: ["Desain rumah tinggal", "Interior & eksterior", "Renovasi & pengembangan desain"],
  process: ["Konsultasi kebutuhan", "Konsep & eksplorasi desain", "Pengembangan gambar", "Persiapan menuju pelaksanaan"],
  faqs: [
    { question: "Apakah melayani proyek rumah di Nganjuk?", answer: "Ya. Kami menyediakan halaman khusus untuk kebutuhan jasa arsitek di Nganjuk dan sekitarnya. Cakupan proyek dibicarakan saat konsultasi." },
    { question: "Bisakah desain disesuaikan dengan anggaran?", answer: "Konsep desain dapat dikembangkan dengan mempertimbangkan kebutuhan dan batasan anggaran yang disampaikan sejak awal." },
    { question: "Apa langkah pertama untuk menggunakan jasa arsitek?", answer: "Mulai dengan menyampaikan lokasi, kebutuhan ruang, perkiraan luas, serta gambaran proyek melalui halaman kontak." },
  ],
};

export const metadata: Metadata = {
  title: location.seoTitle,
  description: location.seoDescription,
  alternates: { canonical: `/jasa-arsitek-nganjuk` },
};

export default function NganjukPage() {
  return <LocationLanding location={location} />;
}
