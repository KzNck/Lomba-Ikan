// All copy and imagery for the landing page. Edit here to swap content without touching layout.
import type { NavItem } from '@/components/home/navbar'
import type { Step } from '@/components/home/step-card'
import type { Benefit } from '@/components/home/benefit-card'
import type { Stat } from '@/components/home/stat-item'
import type { Sdg } from '@/components/home/sdg-card'
import type { FooterContact, FooterSocial } from '@/components/home/footer'

export const SECTION_IDS = {
  home: 'beranda',
  howItWorks: 'cara-kerja',
  impact: 'dampak',
  sdgs: 'sdgs',
}

export const NAV_ITEMS: NavItem[] = [
  { href: `#${SECTION_IDS.home}`, label: 'Beranda' },
  { href: `#${SECTION_IDS.howItWorks}`, label: 'Cara Kerja' },
  { href: `#${SECTION_IDS.impact}`, label: 'Dampak' },
  { href: `#${SECTION_IDS.sdgs}`, label: 'SDGs' },
]

export const AUTH_LINKS = {
  login: { href: '/auth/login', label: 'Masuk' },
  register: { href: '/auth/choose-role', label: 'Daftar' },
}

export const HERO = {
  eyebrow: 'PLATFORM B2B EKONOMI LAUT SIRKULAR',
  headline: 'Dari By-catch Menjadi Nilai Ekonomi Bersama',
  subheadline:
    'ByCatch Loop menghubungkan nelayan dengan industri hilir sirkular melalui pencatatan batch, lelang cepat, dan estimasi kesegaran berbasis AI ringan.',
  image: {
    src: '/images/landing/hero-boat.jpg',
    alt: 'Nelayan berdiri di atas perahu kayu dengan hasil tangkapan di dek',
  },
  primaryCta: { href: '/auth/register/nelayan', label: 'Daftar sebagai Nelayan' },
  secondaryCta: { href: '/auth/register?role=pembeli', label: 'Daftar sebagai Pembeli' },
}

export const HOW_IT_WORKS = {
  eyebrow: 'CARA KERJA',
  title: 'Mudah, Transparan, dan Terhubung',
  subtitle: 'Proses sederhana dari laut hingga ke industri hilir, dengan teknologi yang memudahkan semua pihak.',
  steps: [
    {
      icon: 'sailboat',
      title: 'Nelayan Mencatat',
      description: 'Catat estimasi by‑catch (kategori, volume, waktu tarik, kondisi es) — bisa offline.',
    },
    {
      icon: 'shield-check',
      title: 'Cek Kesegaran',
      description: 'Sistem hitung estimasi kesegaran otomatis berbasis AI ringan.',
    },
    {
      icon: 'file-text',
      title: 'Pasang Listing',
      description: 'Data tersinkron & jadi listing saat sinyal tersedia.',
    },
    {
      icon: 'shopping-cart',
      title: 'Pembeli Beli Langsung',
      description: 'Pembeli dapat notifikasi dan membeli dalam jendela waktu tetap.',
    },
    {
      icon: 'package-check',
      title: 'Serah Terima di PPI',
      description: 'Batch diverifikasi PPI saat kapal merapat, lalu diserahkan ke pembeli.',
    },
  ] satisfies Step[],
}

export const IMPACT = {
  eyebrow: 'DAMPAK',
  title: 'Manfaat Nyata untuk Semua Pihak',
  benefits: [
    {
      icon: 'ship',
      accent: 'blue',
      title: 'Bagi Nelayan',
      subtitle: 'Pendapatan lebih baik, laut lebih lestari',
      image: {
        src: '/images/landing/benefit-nelayan.jpg',
        alt: 'Nelayan menarik jaring dari perahu di perairan dangkal',
      },
      points: [
        {
          icon: 'coins',
          title: 'Pendapatan Tambahan',
          description: 'Dari komoditas yang sebelumnya bernilai nol/negatif.',
        },
        {
          icon: 'fish',
          title: 'Tangkapan Tidak Terbuang',
          description: 'Mengurangi discard mortality dan memaksimalkan manfaat by‑catch.',
        },
      ],
    },
    {
      icon: 'factory',
      accent: 'green',
      title: 'Bagi Pembeli',
      subtitle: 'Pasokan stabil, harga transparan',
      image: {
        src: '/images/landing/benefit-pembeli.jpg',
        alt: 'Fasilitas pengolahan industri di tepi sungai',
      },
      points: [
        {
          icon: 'leaf',
          title: 'Pasokan Konsisten',
          description: 'Bahan baku hewani lebih stabil untuk kebutuhan industri hilir.',
        },
        {
          icon: 'shield-check',
          title: 'Harga Transparan',
          description: 'Bisa memilih berdasarkan grade kesegaran dan lokasi terdekat.',
        },
      ],
    },
  ] satisfies Benefit[],
  statsLabelLines: ['Target Dampak', 'Pilot Program'],
  stats: [
    { icon: 'fish', accent: 'blue', value: '3.000 kg/bulan', caption: 'Biomassa by‑catch terselamatkan' },
    { icon: 'handshake', accent: 'blue', value: '≥70%', caption: 'Closing rate transaksi' },
    { icon: 'sprout', accent: 'green', value: '<90 menit', caption: 'Rata-rata waktu listing → kesepakatan' },
  ] satisfies Stat[],
}

export const SDGS = {
  eyebrow: 'SDGs',
  title: 'Bersama untuk Masa Depan yang Lebih Baik',
  subtitle: 'ByCatch Loop mendukung 5 Tujuan Pembangunan Berkelanjutan yang relevan dengan misi kami.',
  goals: [
    {
      number: 14,
      badge: '/images/sdgs/goal-14.svg',
      title: 'Ekosistem Lautan',
      target: 'Target: 14.4',
      description:
        'Mengurangi discard mortality dengan memberi nilai ekonomi pada by‑catch, sekaligus mendata volume tangkapan non‑target.',
    },
    {
      number: 12,
      badge: '/images/sdgs/goal-12.svg',
      title: 'Konsumsi & Produksi Bertanggung Jawab',
      target: 'Target: 12.3 & 12.5',
      description: 'Mengubah biomassa yang akan dibuang menjadi bahan baku pakan/pupuk (valorisasi limbah).',
    },
    {
      number: 2,
      badge: '/images/sdgs/goal-02.svg',
      title: 'Tanpa Kelaparan',
      target: 'Target: 2.3',
      description: 'Nelayan kecil mendapat pendapatan tambahan dari komoditas yang sebelumnya tidak bernilai.',
    },
    {
      number: 8,
      badge: '/images/sdgs/goal-08.svg',
      title: 'Pekerjaan Layak & Pertumbuhan Ekonomi',
      target: 'Target: 8.3',
      description: 'Mendukung UMKM hilir (peternak maggot, produsen silase/pupuk) mendapat pasokan stabil.',
    },
    {
      number: 13,
      badge: '/images/sdgs/goal-13.svg',
      title: 'Aksi Iklim',
      target: 'Target: 13.2',
      description: 'Estimasi pengurangan emisi metana dari pembusukan biomassa laut di pesisir.',
    },
  ] satisfies Sdg[],
}

export const FOOTER = {
  tagline: 'Menghubungkan nelayan dengan industri hilir untuk masa depan laut yang lebih baik.',
  quickLinksHeading: 'Tautan Cepat',
  quickLinks: NAV_ITEMS,
  contactHeading: 'Kontak',
  contacts: [
    { icon: 'phone', text: '+62 812-3456-7890' },
    { icon: 'mail', text: 'info@bycatchloop.id' },
    { icon: 'map-pin', text: 'Jakarta, Indonesia' },
  ] satisfies FooterContact[],
  socialHeading: 'Ikuti Kami',
  socials: [
    { icon: 'instagram', label: 'Instagram' },
    { icon: 'youtube', label: 'YouTube' },
    { icon: 'linkedin', label: 'LinkedIn' },
  ] satisfies FooterSocial[],
  copyright: '© 2025 ByCatch Loop. Semua hak dilindungi.',
  legalItems: ['Syarat & Ketentuan', 'Kebijakan Privasi'],
}
