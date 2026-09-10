create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  slug text not null unique,
  province text not null default 'Jawa Timur',
  seo_title text not null,
  seo_description text not null,
  h1 text not null,
  intro text not null,
  local_context text not null default '',
  services jsonb not null default '[]'::jsonb,
  process jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists locations_published_idx on public.locations(published, sort_order, city);

alter table public.locations enable row level security;

drop policy if exists locations_public_read on public.locations;
create policy locations_public_read on public.locations
  for select to anon, authenticated
  using (published = true or public.is_staff());

drop policy if exists locations_staff_insert on public.locations;
create policy locations_staff_insert on public.locations
  for insert to authenticated
  with check (public.is_staff());

drop policy if exists locations_staff_update on public.locations;
create policy locations_staff_update on public.locations
  for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists locations_admin_delete on public.locations;
create policy locations_admin_delete on public.locations
  for delete to authenticated
  using (public.is_admin());

insert into public.locations (city, slug, province, seo_title, seo_description, h1, intro, local_context, services, process, faqs, published, sort_order)
values
('Kediri','jasa-arsitek-kediri','Jawa Timur','Jasa Arsitek Kediri | RUMAH ARSITEK','Jasa arsitek Kediri untuk desain rumah, interior, eksterior, dan renovasi dengan pendekatan fungsional dan sesuai kebutuhan proyek.','Jasa Arsitek Kediri','RUMAH ARSITEK membantu merancang rumah tinggal dan ruang komersial di Kediri dengan proses yang jelas, mulai dari memahami kebutuhan hingga mengembangkan konsep desain.','Setiap proyek di Kediri memiliki kebutuhan yang berbeda. Kami mempertimbangkan karakter lingkungan, kebutuhan ruang, gaya hidup, anggaran, serta hubungan antara bangunan dan area luar agar desain tidak hanya menarik tetapi juga nyaman digunakan.','["Desain rumah tinggal","Interior & eksterior","Renovasi & pengembangan desain"]','["Konsultasi kebutuhan","Konsep & eksplorasi desain","Pengembangan gambar","Persiapan menuju pelaksanaan"]','[{"question":"Apakah RUMAH ARSITEK melayani proyek di Kediri?","answer":"Ya. Halaman ini dibuat khusus untuk kebutuhan proyek di wilayah Kediri dan sekitarnya. Detail cakupan proyek dapat dibahas saat konsultasi."},{"question":"Layanan apa saja yang tersedia?","answer":"Layanan dapat mencakup desain arsitektur, interior, eksterior, serta renovasi sesuai kebutuhan proyek."},{"question":"Bagaimana cara memulai konsultasi?","answer":"Kirim kebutuhan dasar proyek melalui halaman kontak. Tim kemudian dapat membantu menentukan langkah berikutnya."}]'::jsonb,true,10),
('Nganjuk','jasa-arsitek-nganjuk','Jawa Timur','Jasa Arsitek Nganjuk | RUMAH ARSITEK','Jasa arsitek Nganjuk untuk desain rumah, interior, eksterior, dan renovasi dengan pendekatan yang fungsional dan sesuai kebutuhan.','Jasa Arsitek Nganjuk','RUMAH ARSITEK melayani kebutuhan perancangan rumah dan ruang di Nganjuk dengan fokus pada fungsi, proporsi, kenyamanan, serta karakter pemilik bangunan.','Perancangan di Nganjuk dapat disesuaikan dengan konteks lahan, lingkungan, aktivitas keluarga, kebutuhan ruang, dan rencana anggaran. Setiap konsep dikembangkan dari kebutuhan proyek, bukan sekadar mengikuti tren.','["Desain rumah tinggal","Interior & eksterior","Renovasi & pengembangan desain"]','["Konsultasi kebutuhan","Konsep & eksplorasi desain","Pengembangan gambar","Persiapan menuju pelaksanaan"]','[{"question":"Apakah melayani proyek rumah di Nganjuk?","answer":"Ya. Kami menyediakan halaman khusus untuk kebutuhan jasa arsitek di Nganjuk dan sekitarnya. Cakupan proyek dibicarakan saat konsultasi."},{"question":"Bisakah desain disesuaikan dengan anggaran?","answer":"Konsep desain dapat dikembangkan dengan mempertimbangkan kebutuhan dan batasan anggaran yang disampaikan sejak awal."},{"question":"Apa langkah pertama untuk menggunakan jasa arsitek?","answer":"Mulai dengan menyampaikan lokasi, kebutuhan ruang, perkiraan luas, serta gambaran proyek melalui halaman kontak."}]'::jsonb,true,20),
('Malang','jasa-arsitek-malang','Jawa Timur','Jasa Arsitek Malang | RUMAH ARSITEK','Jasa arsitek Malang untuk desain rumah, interior, eksterior, dan renovasi yang mengutamakan fungsi, kenyamanan, dan karakter bangunan.','Jasa Arsitek Malang','RUMAH ARSITEK membantu pemilik rumah dan usaha mengembangkan konsep bangunan di Malang dengan perhatian pada kebutuhan ruang, karakter lingkungan, dan kualitas pengalaman ruang.','Konteks Malang dapat menghadirkan kebutuhan desain yang beragam, dari rumah keluarga hingga properti komersial. Kami mengembangkan rancangan dengan memperhatikan kondisi lahan, aktivitas penghuni, orientasi, kenyamanan, dan hubungan ruang dalam dengan ruang luar.','["Desain rumah tinggal","Interior & eksterior","Renovasi & pengembangan desain"]','["Konsultasi kebutuhan","Konsep & eksplorasi desain","Pengembangan gambar","Persiapan menuju pelaksanaan"]','[{"question":"Apakah RUMAH ARSITEK melayani proyek di Malang?","answer":"Ya. Kami membuka konsultasi untuk kebutuhan proyek di Malang dan area sekitarnya, dengan cakupan proyek dibahas berdasarkan kebutuhan masing-masing."},{"question":"Apakah hanya menerima desain rumah?","answer":"Tidak. Layanan dapat mencakup arsitektur, interior, eksterior, dan renovasi sesuai lingkup proyek."},{"question":"Informasi apa yang sebaiknya disiapkan saat konsultasi?","answer":"Lokasi atau kondisi lahan, kebutuhan ruang, perkiraan luas, referensi gaya, dan kisaran anggaran akan membantu proses konsultasi."}]'::jsonb,true,30),
('Surabaya','jasa-arsitek-surabaya','Jawa Timur','Jasa Arsitek Surabaya | RUMAH ARSITEK','Jasa arsitek Surabaya untuk desain rumah, interior, eksterior, dan renovasi dengan pendekatan desain yang fungsional dan terarah.','Jasa Arsitek Surabaya','RUMAH ARSITEK membantu merancang hunian dan ruang komersial di Surabaya dengan konsep yang disusun berdasarkan kebutuhan aktivitas, karakter bangunan, kondisi lahan, dan target proyek.','Kebutuhan bangunan di Surabaya sangat beragam, mulai dari rumah tinggal hingga ruang usaha. Perancangan dapat mempertimbangkan kepadatan lingkungan, hubungan ruang dalam dan luar, kebutuhan privasi, sirkulasi, kenyamanan, serta karakter kawasan.','["Desain rumah tinggal","Interior & eksterior","Renovasi & pengembangan desain"]','["Konsultasi kebutuhan","Konsep & eksplorasi desain","Pengembangan gambar","Persiapan menuju pelaksanaan"]','[{"question":"Apakah menerima proyek di Surabaya?","answer":"Ya. Kami menyediakan konsultasi untuk kebutuhan desain di Surabaya dan sekitarnya. Lingkup pekerjaan disesuaikan dengan kebutuhan proyek."},{"question":"Apakah desain bisa untuk rumah maupun usaha?","answer":"Ya. Konsultasi dapat mencakup hunian maupun kebutuhan ruang komersial, dengan lingkup desain ditentukan berdasarkan proyek."},{"question":"Bagaimana memulai proses desain?","answer":"Sampaikan lokasi, kebutuhan ruang, kondisi bangunan atau lahan, serta target proyek melalui halaman kontak untuk memulai konsultasi."}]'::jsonb,true,40)
on conflict (slug) do update set city=excluded.city, province=excluded.province, seo_title=excluded.seo_title, seo_description=excluded.seo_description, h1=excluded.h1, intro=excluded.intro, local_context=excluded.local_context, services=excluded.services, process=excluded.process, faqs=excluded.faqs, published=excluded.published, sort_order=excluded.sort_order, updated_at=now();
