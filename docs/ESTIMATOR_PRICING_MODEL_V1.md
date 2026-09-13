# RUMAH ARSITEK — Estimator Pricing Model V1

## Tujuan

Estimator adalah alat pre-sales dan qualification. Hasilnya adalah **perkiraan investasi desain**, bukan quotation final.

Alur bisnis:

`INTENT → LOKASI → BUKTI → ESTIMASI → KONSULTASI → LEAD → KUALIFIKASI → MATCHING → PARTNER → PROPOSAL`

## Prinsip

1. Luas bangunan tetap menjadi basis utama.
2. Tarif Essential, Signature, dan Premium tetap menjadi konfigurasi dasar yang dapat diubah admin melalui Supabase.
3. Jenis proyek menggunakan multiplier yang sudah ada agar perubahan tetap kompatibel.
4. Scope kebutuhan menambah beban layanan secara terukur.
5. Kondisi existing, jumlah lantai, dan kompleksitas memengaruhi estimasi.
6. Lokasi dan timeline belum dijadikan markup otomatis; keduanya terutama untuk qualification dan matching.
7. Partner cost, operational cost, risk reserve, dan margin adalah informasi internal dan belum dihitung dari input publik.
8. Estimator tidak menjanjikan harga final, ruang lingkup final, atau keputusan teknis.

## Formula

```text
BASE
= luas × rate level × multiplier jenis proyek

ADJUSTED
= BASE
  × condition factor
  × floor factor
  × complexity factor
  × scope factor

ESTIMATED RANGE
= ADJUSTED × min range multiplier
  sampai
  ADJUSTED × max range multiplier
```

## Baseline rate

| Level | Rate awal |
|---|---:|
| Essential | Rp180.000/m² |
| Signature | Rp300.000/m² |
| Premium | Rp450.000/m² |

Rate ini adalah baseline konfigurasi, bukan klaim harga pasar atau standar resmi.

## Multiplier jenis proyek

| Jenis | Faktor awal |
|---|---:|
| Rumah Baru | 1.00 |
| Renovasi | 1.15 |
| Villa | 1.20 |
| Ruang Usaha | 1.30 |

## Faktor kondisi

| Kondisi | Faktor |
|---|---:|
| Lahan kosong | 1.00 |
| Persiapan pembangunan | 1.00 |
| Bangunan existing | 1.10 |
| Sebagian direnovasi | 1.15 |
| Renovasi total | 1.25 |

## Faktor lantai

| Lantai | Faktor |
|---|---:|
| 1 | 1.00 |
| 2 | 1.08 |
| 3 | 1.15 |
| 4+ | 1.25 |

## Faktor scope

Scope dihitung dari kebutuhan yang dipilih. Faktor tambahan sengaja moderat agar tidak menggantikan proses final scoping.

| Kebutuhan | Tambahan |
|---|---:|
| Konsep & denah | 0.00 |
| Desain arsitektur | 0.00 |
| Desain interior | +0.08 |
| Desain fasad | +0.04 |
| Visualisasi 3D | +0.04 |
| Gambar kerja | +0.08 |
| Perencanaan ruang | +0.03 |
| Renovasi & pengembangan | +0.06 |
| Paket desain lengkap | basis 1.12 + add-on terbatas |

Scope factor dibatasi maksimum 1.30.

## Kompleksitas

Kompleksitas diturunkan dari data yang sudah tersedia, bukan meminta calon pelanggan menilai proyeknya sendiri.

- >200 m²: +0.04
- >300 m²: +0.08
- 3 lantai atau lebih: +0.06
- 5 kebutuhan atau lebih: +0.05
- luas bangunan lebih besar dari luas tanah yang diisi: +0.03

Faktor kompleksitas dibatasi maksimum 1.25.

## Range

Default saat ini tetap memakai konfigurasi yang sudah ada:

- minimum: 0.85
- maksimum: 1.25

Ini dipertahankan untuk kompatibilitas. Pengetatan range berdasarkan confidence level dapat menjadi iterasi berikutnya setelah ada data lead nyata.

## Lokasi dan timeline

Lokasi tidak otomatis membuat harga lebih mahal. Lokasi dipakai untuk matching profesional dan pertimbangan operasional.

Timeline juga tidak otomatis menambah harga. "Segera" hanya menjadi sinyal qualification sampai RUMAH ARSITEK memiliki kebijakan rush/priority yang resmi.

## Internal economics — tahap berikutnya

Target fee internal nantinya dapat dianalisis sebagai:

```text
Partner Cost
+ Operational Cost
+ Risk Reserve
+ Margin
= Target Fee
```

Informasi ini tidak ditampilkan sebagai kalkulasi publik pada Estimator V1.

## Contoh

120 m², Rumah Baru, Signature, 1 lantai, lahan kosong, kebutuhan Desain arsitektur:

```text
BASE = 120 × Rp300.000 × 1.00
     = Rp36.000.000

ADJUSTED = Rp36.000.000

RANGE = Rp30.600.000 – Rp45.000.000
```

Renovasi 150 m², 2 lantai, renovasi total, Signature, kebutuhan kompleks:

```text
BASE = 150 × Rp300.000 × 1.15

ADJUSTED
= BASE × 1.25 × 1.08 × complexity × scope
```

Nilai akhir adalah indikatif dan tetap perlu dikonfirmasi melalui konsultasi serta proposal profesional.

## Batas tanggung jawab

RUMAH ARSITEK mengelola kebutuhan, qualification, matching, dan proses komunikasi. Profesional/partner menangani keputusan dan pekerjaan teknis sesuai kompetensinya. Estimator tidak menggantikan konsultasi teknis maupun proposal final.
