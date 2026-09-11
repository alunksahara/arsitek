"use client";

import { useMemo, useState } from "react";
import ArchitectureEstimator from "@/components/ArchitectureEstimator";
import TeamSection from "@/components/TeamSection";

const services = [
  {
    number: "01",
    title: "Bangun Rumah",
    description:
      "Mulai dari kebutuhan, konsep, hingga menemukan tenaga profesional yang sesuai untuk rencana rumah Anda.",
    items: ["Kebutuhan & brief", "Konsep desain", "Pengembangan desain"],
  },
  {
    number: "02",
    title: "Renovasi",
    description:
      "Ubah rumah yang ada menjadi ruang yang lebih nyaman, fungsional, dan sesuai kebutuhan baru.",
    items: ["Evaluasi kebutuhan", "Konsep renovasi", "Pengembangan desain"],
  },
  {
    number: "03",
    title: "Interior",
    description:
      "Tata ruang, material, warna, dan furniture agar interior terasa nyaman serta memiliki karakter.",
    items: ["Layout ruang", "Material & warna", "Furniture planning"],
  },
  {
    number: "04",
    title: "Bisnis & Properti",
    description:
      "Untuk café, kantor, toko, villa, kos, guest house, dan kebutuhan ruang komersial lainnya.",
    items: ["Kebutuhan proyek", "Konsep ruang", "Partner profesional"],
  },
];

const projects = [
  {
    number: "01",
    title: "Tropical Courtyard House",
    location: "Kediri, Jawa Timur",
    type: "Residential",
    description:
      "Contoh pendekatan rumah tropis kontemporer dengan cahaya alami, udara terbuka, dan ruang keluarga yang hangat.",
    imageClass: "project-one",
  },
  {
    number: "02",
    title: "Modern Family House",
    location: "Jawa Timur",
    type: "Residential",
    description:
      "Contoh hunian modern dengan komposisi sederhana, bukaan besar, dan penggunaan ruang yang efisien.",
    imageClass: "project-two",
  },
  {
    number: "03",
    title: "Compact Urban Residence",
    location: "Kediri, Jawa Timur",
    type: "Residential",
    description:
      "Contoh rumah kota dengan pendekatan compact living, privasi yang baik, dan hubungan dengan taman.",
    imageClass: "project-three",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Ceritakan kebutuhan",
    description:
      "Ceritakan rencana, lokasi, luas lahan, kondisi bangunan, atau gambaran ruang yang Anda inginkan.",
  },
  {
    number: "02",
    title: "Konsultasi awal",
    description:
      "Kami membantu memahami kebutuhan proyek dan menentukan langkah yang paling masuk akal untuk dilanjutkan.",
  },
  {
    number: "03",
    title: "Tentukan solusi",
    description:
      "Kebutuhan proyek diarahkan ke layanan dan tenaga profesional yang paling sesuai dengan lingkup pekerjaan.",
  },
  {
    number: "04",
    title: "Proyek berjalan",
    description:
      "Partner profesional menangani pekerjaan teknis sesuai ruang lingkup proyek yang telah disepakati.",
  },
];

const values = [
  {
    title: "Mudah dimulai",
    text: "Anda tidak perlu memahami istilah arsitektur untuk mulai berkonsultasi.",
  },
  {
    title: "Sesuai kebutuhan",
    text: "Setiap proyek memiliki kondisi, tujuan, budget, dan kebutuhan yang berbeda.",
  },
  {
    title: "Partner profesional",
    text: "Kebutuhan teknis dapat diarahkan kepada tenaga profesional yang sesuai dengan proyek.",
  },
];

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const whatsappMessage = encodeURIComponent(
    "Halo RUMAH ARSITEK, saya ingin berkonsultasi mengenai rencana proyek saya."
  );
  const whatsappUrl = useMemo(
    () => `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
    [whatsappNumber, whatsappMessage]
  );

  return (
    <main className="min-h-screen bg-white">
      <header className="site-header">
        <div className="container-main header-inner">
          <a href="/" className="brand" aria-label="RUMAH ARSITEK">
            <span className="brand-mark">R</span>
            <span className="brand-copy">
              <strong>RUMAH ARSITEK</strong>
              <small>Design · Planning · Professional Network</small>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#needs">Kebutuhan</a>
            <a href="#services">Layanan</a>
            <a href="#projects">Inspirasi</a>
            <a href="#process">Cara Kerja</a>
            <a href="#estimator">Estimasi</a>
          </nav>

          <a href="/contact" className="header-cta">
            Konsultasi <Arrow />
          </a>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMobileMenu((value) => !value)}
            aria-label="Buka menu"
            aria-expanded={mobileMenu}
          >
            <MenuIcon />
          </button>
        </div>

        {mobileMenu && (
          <div className="mobile-menu">
            <a href="#needs" onClick={() => setMobileMenu(false)}>
              Kebutuhan
            </a>
            <a href="#services" onClick={() => setMobileMenu(false)}>
              Layanan
            </a>
            <a href="#projects" onClick={() => setMobileMenu(false)}>
              Inspirasi
            </a>
            <a href="#process" onClick={() => setMobileMenu(false)}>
              Cara Kerja
            </a>
            <a href="#estimator" onClick={() => setMobileMenu(false)}>
              Estimasi
            </a>
            <a href="/contact" onClick={() => setMobileMenu(false)}>
              Konsultasi
            </a>
          </div>
        )}
      </header>

      <section className="hero-section">
        <div className="container-main hero-grid">
          <div className="hero-copy fade-up">
            <div className="eyebrow">
              <span className="dot-accent" />
              Solusi desain · renovasi · ruang
            </div>

            <h1 className="hero-title">
              Wujudkan ruang yang <em>sesuai</em> dengan hidup dan rencana Anda.
            </h1>

            <p className="hero-description">
              RUMAH ARSITEK membantu Anda memulai dari kebutuhan, memahami pilihan,
              dan menemukan solusi profesional untuk rumah, renovasi, interior,
              hingga ruang komersial.
            </p>

            <div className="hero-actions">
              <a href="/contact" className="btn-primary">
                Mulai Konsultasi <Arrow />
              </a>
              <a href="#estimator" className="btn-secondary">
                Cek Estimasi
              </a>
            </div>

            <div className="hero-meta">
              <div>
                <strong>Mulai dari kebutuhan</strong>
                <span>Tanpa harus paham istilah teknis</span>
              </div>
              <div>
                <strong>Partner profesional</strong>
                <span>Sesuai kebutuhan proyek</span>
              </div>
            </div>
          </div>

          <div className="hero-visual fade-up">
            <div className="hero-photo-placeholder">
              <div className="hero-house">
                <div className="house-roof" />
                <div className="house-body">
                  <div className="house-window window-one" />
                  <div className="house-window window-two" />
                  <div className="house-door" />
                </div>
              </div>
              <div className="hero-tree tree-one" />
              <div className="hero-tree tree-two" />
              <div className="hero-label hero-label-top">
                SPACE · HOME · LIFE
              </div>
              <div className="hero-label hero-label-bottom">
                START WITH YOUR NEEDS
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip-section" aria-label="Keunggulan layanan">
        <div className="container-main trust-strip">
          <div>
            <strong>Rumah baru</strong>
            <span>Bangun dari awal</span>
          </div>
          <div>
            <strong>Renovasi</strong>
            <span>Perbarui ruang yang ada</span>
          </div>
          <div>
            <strong>Interior</strong>
            <span>Atur ruang lebih nyaman</span>
          </div>
          <div>
            <strong>Komersial</strong>
            <span>Ruang untuk bisnis & properti</span>
          </div>
        </div>
      </section>

      <section id="needs" className="section needs-section">
        <div className="container-main">
          <div className="section-heading-row">
            <div>
              <p className="label">01 / Mulai dari kebutuhan</p>
              <h2 className="section-title">Anda sedang merencanakan apa?</h2>
            </div>
            <p className="section-heading-description">
              Tidak perlu tahu harus memakai jasa apa. Pilih kebutuhan Anda dan
              mulai dari percakapan yang sederhana.
            </p>
          </div>

          <div className="needs-grid">
            {services.map((service) => (
              <a key={service.number} href="#services" className="need-card">
                <span>{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="need-arrow">
                  Mulai dari sini <Arrow />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="section section-cream">
        <div className="container-main">
          <div className="section-heading-row">
            <div>
              <p className="label">02 / Layanan</p>
              <h2 className="section-title">Solusi yang bisa berkembang bersama kebutuhan Anda.</h2>
            </div>
            <p className="section-heading-description">
              Dari kebutuhan rumah tinggal hingga properti komersial, ruang lingkup
              dapat disesuaikan dengan proyek yang sedang Anda rencanakan.
            </p>
          </div>

          <div className="services-grid services-grid-four">
            {services.map((service) => (
              <article key={service.number} className="service-card">
                <div className="service-number">{service.number}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.items.map((item) => (
                    <li key={item}>
                      <span>
                        <CheckIcon />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="/contact" className="service-link">
                  Diskusikan kebutuhan <Arrow />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="problem-section">
        <div className="container-main problem-grid">
          <div>
            <p className="label">03 / Tidak tahu harus mulai dari mana?</p>
            <h2 className="section-title">
              Anda tidak harus sudah punya desain untuk mulai berkonsultasi.
            </h2>
          </div>
          <div className="problem-copy">
            <p>
              Punya tanah tetapi belum punya gambaran rumah? Ingin renovasi tetapi
              bingung menentukan kebutuhan? Sudah punya ide tetapi belum tahu siapa
              yang tepat untuk mengerjakannya?
            </p>
            <p>
              Ceritakan kondisi Anda terlebih dahulu. RUMAH ARSITEK membantu
              menyederhanakan langkah awal sebelum kebutuhan diteruskan kepada
              tenaga profesional yang sesuai.
            </p>
            <a href="/contact" className="text-link">
              Ceritakan rencana Anda <Arrow />
            </a>
          </div>
        </div>
      </section>

      <section id="projects" className="section projects-section">
        <div className="container-main">
          <div className="section-heading-row">
            <div>
              <p className="label">04 / Inspirasi</p>
              <h2 className="section-title">Contoh ruang yang bisa menjadi titik awal.</h2>
            </div>
            <p className="section-heading-description">
              Gunakan contoh proyek sebagai inspirasi. Setiap proyek tetap perlu
              disesuaikan dengan lahan, kebutuhan, gaya hidup, dan kondisi nyata.
            </p>
          </div>

          <div className="projects-grid">
            {projects.map((project) => (
              <article key={project.number} className="project-card">
                <div className={`project-visual ${project.imageClass}`}>
                  <div className="project-building">
                    <div className="building-top" />
                    <div className="building-main">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                  <div className="project-plant" />
                  <div className="project-overlay">{project.type}</div>
                </div>
                <div className="project-info">
                  <div className="project-number">{project.number}</div>
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.location}</p>
                    <small>{project.description}</small>
                  </div>
                  <a href="/contact" aria-label={`Diskusikan ${project.title}`}>
                    <Arrow />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="approach" className="section approach-section">
        <div className="container-main approach-grid">
          <div className="approach-visual">
            <div className="material-card">
              <div className="material-wall" />
              <div className="material-window">
                <span />
                <span />
                <span />
              </div>
              <div className="material-plant" />
            </div>
            <div className="material-caption">
              <span>RUMAH ARSITEK</span>
              <strong>Practical · Personal · Professional</strong>
            </div>
          </div>

          <div className="approach-copy">
            <p className="label">05 / Cara kami membantu</p>
            <h2 className="section-title">
              Lebih mudah dimulai. Lebih jelas dilanjutkan.
            </h2>
            <p className="section-text">
              Kami percaya kebutuhan desain seharusnya tidak terasa rumit bagi
              orang yang sedang ingin membangun atau memperbaiki ruangnya.
            </p>

            <div className="values-list">
              {values.map((value, index) => (
                <div className="value-item" key={value.title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{value.title}</h3>
                    <p>{value.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TeamSection />

      <section id="estimator" className="estimator-section">
        <div className="container-main">
          <div className="estimator-intro">
            <p className="label">07 / Estimasi awal</p>
            <h2 className="section-title">
              Punya gambaran luas dan jenis proyek?
              <span> Mulai cek estimasinya.</span>
            </h2>
            <p className="section-text">
              Gunakan estimator sebagai gambaran awal sebelum berdiskusi lebih
              lanjut. Nilai akhir tetap bergantung pada kebutuhan dan lingkup proyek.
            </p>
          </div>
          <div className="estimator-wrapper">
            <ArchitectureEstimator />
          </div>
        </div>
      </section>

      <section id="process" className="section process-section">
        <div className="container-main">
          <div className="section-heading-row">
            <div>
              <p className="label">08 / Cara Kerja</p>
              <h2 className="section-title">Dari cerita sederhana menuju proyek yang jelas.</h2>
            </div>
            <p className="section-heading-description">
              Anda tidak harus datang dengan brief yang sempurna. Kita mulai dari
              informasi yang Anda punya sekarang.
            </p>
          </div>

          <div className="process-grid">
            {processSteps.map((step) => (
              <article key={step.number} className="process-item">
                <div className="process-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="partner-note-section">
        <div className="container-main partner-note">
          <div>
            <p className="label">09 / Jaringan profesional</p>
            <h2 className="section-title">Satu pintu untuk memulai. Partner yang sesuai untuk melanjutkan.</h2>
          </div>
          <p>
            RUMAH ARSITEK dibangun sebagai brand yang dapat berkembang bersama
            jaringan tenaga profesional. Kebutuhan teknis proyek ditangani oleh
            profesional yang sesuai dengan ruang lingkup dan lokasi pekerjaan.
          </p>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container-main contact-grid">
          <div>
            <p className="label label-light">10 / Mulai sekarang</p>
            <h2 className="contact-title">
              Punya rencana untuk <em>ruang Anda?</em>
            </h2>
            <p className="contact-description">
              Tidak harus sudah memiliki gambar. Tidak harus sudah tahu semua
              jawabannya. Ceritakan dulu kebutuhan Anda dan kita mulai dari sana.
            </p>
          </div>

          <div className="contact-card">
            <div className="contact-card-top">
              <span>START A PROJECT</span>
              <span>01</span>
            </div>
            <h3>Konsultasi awal</h3>
            <p>
              Diskusikan rencana Anda melalui WhatsApp. Informasi awal yang Anda
              berikan akan membantu menentukan langkah berikutnya.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="contact-button"
            >
              Chat via WhatsApp <Arrow />
            </a>
            <a href="/contact" className="contact-secondary-link">
              Isi kebutuhan proyek terlebih dahulu <Arrow />
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container-main footer-grid">
          <div>
            <div className="brand footer-brand">
              <span className="brand-mark">R</span>
              <span className="brand-copy">
                <strong>RUMAH ARSITEK</strong>
                <small>Design · Planning · Professional Network</small>
              </span>
            </div>
            <p className="footer-description">
              Membantu Anda memulai kebutuhan ruang dan menemukan solusi profesional
              yang sesuai untuk proyek Anda.
            </p>
          </div>

          <div className="footer-links">
            <a href="#needs">Kebutuhan</a>
            <a href="#services">Layanan</a>
            <a href="#projects">Inspirasi</a>
            <a href="#process">Cara Kerja</a>
            <a href="#estimator">Estimasi</a>
            <a href="#contact">Konsultasi</a>
          </div>

          <div className="footer-location">
            <span>Starting point</span>
            <strong>Kediri, Jawa Timur</strong>
            <span className="footer-location-note">Melayani kebutuhan yang dapat berkembang ke berbagai wilayah.</span>
          </div>
        </div>

        <div className="container-main footer-bottom">
          <span>© {new Date().getFullYear()} RUMAH ARSITEK</span>
          <span>Designed around your needs.</span>
        </div>
      </footer>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="mobile-cta"
      >
        Konsultasi via WhatsApp <Arrow />
      </a>
    </main>
  );
}
