"use client";

import { useMemo, useState } from "react";
import ArchitectureEstimator from "@/components/ArchitectureEstimator";
import TeamSection from "@/components/TeamSection";

const projects = [
  { number: "01", title: "Tropical Courtyard House", location: "Kediri, Jawa Timur", type: "Residential", description: "Rumah tropis kontemporer yang memadukan cahaya alami, udara terbuka, dan ruang keluarga yang hangat.", imageClass: "project-one" },
  { number: "02", title: "Modern Family House", location: "Jawa Timur", type: "Residential", description: "Hunian modern dengan komposisi sederhana, bukaan besar, dan ruang yang efisien untuk keluarga.", imageClass: "project-two" },
  { number: "03", title: "Compact Urban Residence", location: "Kediri, Jawa Timur", type: "Residential", description: "Rumah kota dengan pendekatan compact living, privasi yang baik, dan hubungan kuat dengan taman.", imageClass: "project-three" },
];

const services = [
  { number: "01", title: "Rumah Baru", description: "Dari ide awal sampai gambar kerja, kami membantu menerjemahkan kebutuhan keluarga menjadi rumah yang tepat.", items: ["Konsep desain", "Denah & fasad", "Gambar kerja"] },
  { number: "02", title: "Renovasi", description: "Mengubah rumah lama menjadi ruang yang lebih nyaman, fungsional, dan sesuai kebutuhan masa kini.", items: ["Evaluasi bangunan", "Konsep renovasi", "Pengembangan desain"] },
  { number: "03", title: "Interior", description: "Interior yang sederhana, hangat, dan menyatu dengan karakter arsitektur bangunan.", items: ["Layout ruang", "Material & warna", "Furniture planning"] },
];

const processSteps = [
  { number: "01", title: "Konsultasi", description: "Kami memahami kebutuhan, gaya hidup, lokasi, luas lahan, dan target proyek Anda." },
  { number: "02", title: "Konsep", description: "Ide dikembangkan menjadi konsep ruang, massa, fasad, material, dan suasana." },
  { number: "03", title: "Pengembangan", description: "Konsep diterjemahkan menjadi desain yang semakin detail dan siap dikembangkan." },
  { number: "04", title: "Gambar Kerja", description: "Dokumen desain disiapkan sebagai dasar komunikasi dan pelaksanaan pembangunan." },
];

const values = [
  { title: "Berangkat dari kebutuhan", text: "Desain tidak dimulai dari gaya, tetapi dari bagaimana ruang tersebut akan digunakan setiap hari." },
  { title: "Tropis & kontekstual", text: "Kami mempertimbangkan cahaya, udara, iklim, material, lingkungan, dan karakter lokasi." },
  { title: "Sederhana tetapi berkarakter", text: "Kami mengejar desain yang bersih, proporsional, nyaman, dan tetap memiliki identitas." },
];

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomePage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const whatsappMessage = encodeURIComponent("Halo RUMAH ARSITEK, saya ingin berkonsultasi mengenai proyek arsitektur.");
  const whatsappUrl = useMemo(() => `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, [whatsappNumber, whatsappMessage]);

  return (
    <main className="min-h-screen bg-white">
      <header className="site-header">
        <div className="container-main header-inner">
          <a href="/" className="brand" aria-label="RUMAH ARSITEK">
            <span className="brand-mark">R</span>
            <span className="brand-copy"><strong>RUMAH ARSITEK</strong><small>Architecture · Interior · Exterior</small></span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#services">Layanan</a><a href="#projects">Proyek</a><a href="#approach">Pendekatan</a><a href="#team">Tim</a><a href="#process">Proses</a><a href="#contact">Kontak</a>
          </nav>
          <a href="/contact" className="header-cta">Konsultasi<Arrow /></a>
          <button type="button" className="mobile-menu-button" onClick={() => setMobileMenu((value) => !value)} aria-label="Buka menu" aria-expanded={mobileMenu}><MenuIcon /></button>
        </div>
        {mobileMenu && (
          <div className="mobile-menu">
            <a href="#services" onClick={() => setMobileMenu(false)}>Layanan</a>
            <a href="#projects" onClick={() => setMobileMenu(false)}>Proyek</a>
            <a href="#approach" onClick={() => setMobileMenu(false)}>Pendekatan</a>
            <a href="#team" onClick={() => setMobileMenu(false)}>Tim</a>
            <a href="#process" onClick={() => setMobileMenu(false)}>Proses</a>
            <a href="/contact" onClick={() => setMobileMenu(false)}>Konsultasi</a>
          </div>
        )}
      </header>

      <section className="hero-section">
        <div className="container-main hero-grid">
          <div className="hero-copy fade-up">
            <div className="eyebrow"><span className="dot-accent" />Architecture · Interior · Space</div>
            <h1 className="hero-title">Ruang yang<br /><em>dirancang</em><br />untuk hidup Anda.</h1>
            <p className="hero-description">Studio arsitektur yang merancang rumah dan ruang dengan pendekatan tropis kontemporer, fungsional, dan berkarakter.</p>
            <div className="hero-actions"><a href="/contact" className="btn-primary">Mulai Konsultasi<Arrow /></a><a href="#projects" className="btn-secondary">Lihat Proyek</a></div>
            <div className="hero-meta"><div><strong>Kediri</strong><span>Jawa Timur</span></div><div><strong>Residential</strong><span>Architecture</span></div><div><strong>Tailored</strong><span>Design</span></div></div>
          </div>
          <div className="hero-visual fade-up">
            <div className="hero-photo-placeholder">
              <div className="hero-house"><div className="house-roof" /><div className="house-body"><div className="house-window window-one" /><div className="house-window window-two" /><div className="house-door" /></div></div>
              <div className="hero-tree tree-one" /><div className="hero-tree tree-two" />
              <div className="hero-label hero-label-top">TROPICAL<br />CONTEMPORARY</div>
              <div className="hero-label hero-label-bottom">KEDIRI · EAST JAVA</div>
            </div>
          </div>
        </div>
      </section>

      <section className="intro-section">
        <div className="container-main intro-grid"><div><p className="label">01 / Our Philosophy</p></div><div><h2 className="section-title large">Kami percaya rumah yang baik bukan hanya terlihat bagus.<span> Ia harus terasa tepat.</span></h2><p className="section-text">Setiap proyek memiliki kebutuhan, karakter, dan cerita yang berbeda. Karena itu, kami memulai desain dari manusia yang akan menggunakan ruang tersebut.</p></div></div>
      </section>

      <section id="services" className="section section-cream">
        <div className="container-main">
          <div className="section-heading-row"><div><p className="label">02 / Layanan</p><h2 className="section-title">Apa yang bisa kami bantu?</h2></div><p className="section-heading-description">Dari rumah baru hingga renovasi dan interior, kami membantu proyek Anda berkembang dari ide menjadi ruang yang nyata.</p></div>
          <div className="services-grid">{services.map((service) => <article key={service.number} className="service-card"><div className="service-number">{service.number}</div><h3>{service.title}</h3><p>{service.description}</p><ul>{service.items.map((item) => <li key={item}><span><CheckIcon /></span>{item}</li>)}</ul><a href="/contact" className="service-link">Diskusikan proyek<Arrow /></a></article>)}</div>
        </div>
      </section>

      <section id="projects" className="section projects-section">
        <div className="container-main">
          <div className="section-heading-row"><div><p className="label">03 / Selected Projects</p><h2 className="section-title">Beberapa karya pilihan.</h2></div><p className="section-heading-description">Portofolio ini menjadi contoh pendekatan desain. Setiap proyek tetap dikembangkan berdasarkan konteks dan kebutuhan klien.</p></div>
          <div className="projects-grid">{projects.map((project) => <article key={project.number} className="project-card"><div className={`project-visual ${project.imageClass}`}><div className="project-building"><div className="building-top" /><div className="building-main"><span /><span /><span /></div></div><div className="project-plant" /><div className="project-overlay"><span>{project.type}</span></div></div><div className="project-info"><div className="project-number">{project.number}</div><div><h3>{project.title}</h3><p>{project.location}</p><small>{project.description}</small></div><a href="/contact" aria-label={`Diskusikan ${project.title}`}><Arrow /></a></div></article>)}</div>
        </div>
      </section>

      <section id="approach" className="section approach-section">
        <div className="container-main approach-grid">
          <div className="approach-visual"><div className="material-card"><div className="material-wall" /><div className="material-window"><span /><span /><span /></div><div className="material-plant" /></div><div className="material-caption"><span>Material</span><strong>Natural · Warm · Timeless</strong></div></div>
          <div className="approach-copy"><p className="label">04 / Pendekatan</p><h2 className="section-title">Tropis.<br />Sederhana.<br />Berkarakter.</h2><p className="section-text">Kami menyukai arsitektur yang tidak berlebihan. Bentuk yang sederhana, material yang jujur, cahaya yang baik, dan ruang yang terasa nyaman dalam keseharian.</p><div className="values-list">{values.map((value, index) => <div className="value-item" key={value.title}><span>0{index + 1}</span><div><h3>{value.title}</h3><p>{value.text}</p></div></div>)}</div></div>
        </div>
      </section>

      <TeamSection />

      <section className="estimator-section">
        <div className="container-main"><div className="estimator-intro"><p className="label">06 / Mulai Merencanakan</p><h2 className="section-title">Punya rencana rumah?<br /><span>Mulai dari sini.</span></h2><p className="section-text">Gunakan estimator sebagai gambaran awal sebelum berdiskusi langsung dengan tim kami.</p></div><div className="estimator-wrapper"><ArchitectureEstimator /></div></div>
      </section>

      <section id="process" className="section process-section">
        <div className="container-main"><div className="section-heading-row"><div><p className="label">07 / Proses</p><h2 className="section-title">Dari ide menuju ruang.</h2></div><p className="section-heading-description">Proses yang terstruktur membuat komunikasi lebih jelas dan keputusan desain lebih terarah.</p></div><div className="process-grid">{processSteps.map((step) => <article key={step.number} className="process-item"><div className="process-number">{step.number}</div><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container-main contact-grid"><div><p className="label label-light">08 / Let's Talk</p><h2 className="contact-title">Mari mulai membicarakan<br /><em>ruang Anda.</em></h2><p className="contact-description">Ceritakan kebutuhan, lokasi, luas lahan, atau gambaran rumah yang Anda inginkan. Tidak harus sudah memiliki konsep.</p></div><div className="contact-card"><div className="contact-card-top"><span>START A PROJECT</span><span>01</span></div><h3>Konsultasi awal</h3><p>Diskusikan proyek Anda melalui WhatsApp. Kami akan membantu menentukan langkah berikutnya.</p><a href={whatsappUrl} target="_blank" rel="noreferrer" className="contact-button">Chat via WhatsApp<Arrow /></a><a href="mailto:hello@rumaharsitek.local" className="contact-email">hello@rumaharsitek.local</a></div></div>
      </section>

      <footer className="site-footer">
        <div className="container-main footer-grid"><div><div className="brand footer-brand"><span className="brand-mark">R</span><span className="brand-copy"><strong>RUMAH ARSITEK</strong><small>Architecture · Interior · Exterior</small></span></div><p className="footer-description">Architecture, interior and spatial design crafted around the way you live.</p></div><div className="footer-links"><a href="#services">Layanan</a><a href="#projects">Proyek</a><a href="#approach">Pendekatan</a><a href="#team">Tim</a><a href="#process">Proses</a><a href="#contact">Kontak</a></div><div className="footer-location"><span>Based in</span><strong>Kediri, Jawa Timur</strong></div></div>
        <div className="container-main footer-bottom"><span>© {new Date().getFullYear()} RUMAH ARSITEK Architecture · Interior · Exterior</span><span>Designed with purpose.</span></div>
      </footer>

      <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mobile-cta">Konsultasi via WhatsApp<Arrow /></a>
    </main>
  );
}
