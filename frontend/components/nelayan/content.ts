// All copy and imagery for the nelayan dashboard. Edit here to swap content without touching layout.
// Figures, listings and notifications are the export's sample data until they come from Supabase.
import type { SidebarNavItem } from '@/components/nelayan/sidebar-nav'
import type { SummaryStatContent } from '@/components/nelayan/summary-stat'
import type { ListingCardContent } from '@/components/nelayan/listing-card'
import type { NotificationContent } from '@/components/nelayan/notification-item'

export const NELAYAN_USER = {
  name: 'Pak Dul',
  initials: 'PD',
  role: 'Nelayan',
  avatar: { src: '/images/nelayan/avatar.jpg', alt: 'Foto profil Pak Dul' },
}

export const NELAYAN_NAV: SidebarNavItem[] = [
  { href: '/nelayan', label: 'Dashboard', icon: 'house' },
  { href: '/nelayan/catat', label: 'Tambah Tangkapan', icon: 'circle-plus' },
  { href: '/nelayan/listing', label: 'Listing Saya', icon: 'tag' },
  { href: '/nelayan/riwayat', label: 'Riwayat', icon: 'history' },
  { href: '/nelayan/akun', label: 'Akun', icon: 'user' },
]

export const DASHBOARD = {
  greeting: `Selamat pagi, ${NELAYAN_USER.name}`,
  subtitle: 'Semoga hari ini banyak tangkapan dan rezeki yang lancar.',
  notifications: { href: '/nelayan/notifikasi', label: 'Notifikasi', unreadCount: 3 },
  breadcrumb: 'Dashboard',
  summary: {
    title: 'Ringkasan Hari Ini',
    image: {
      src: '/images/nelayan/boat.jpg',
      alt: 'Kapal nelayan biru di laut lepas dengan burung camar di atasnya',
    },
    stats: [
      { icon: 'fish', value: '120', unit: 'kg', label: 'Total Terjual', note: '20% dari kemarin', trend: 'up' },
      { icon: 'coins', value: 'Rp 2.480.000', label: 'Pendapatan', note: '15% dari kemarin', trend: 'up' },
      { icon: 'recycle', value: '360', unit: 'kg', label: 'Biomassa Terselamatkan', note: 'dari by-catch yang sebelumnya terbuang' },
    ] satisfies SummaryStatContent[],
  },
  quickAction: {
    href: '/nelayan/catat',
    label: 'Tambah Tangkapan',
    caption: 'Catat hasil tangkapan Anda hari ini',
    offlineNote: 'Pencatatan bisa dilakukan meski tanpa sinyal. Data akan tersinkron saat online.',
  },
  listings: {
    title: 'Listing Aktif Saya',
    viewAll: { href: '/nelayan/listing', label: 'Lihat semua listing' },
    detailLabel: 'Lihat detail',
    items: [
      {
        href: '/nelayan/listing/ikan-campuran',
        image: { src: '/images/nelayan/listing-ikan-campuran.jpg', alt: 'Tumpukan ikan campuran segar' },
        category: 'Ikan Campuran',
        location: 'PPI Pontang, Kab. Serang',
        status: 'active',
        statusLabel: 'Aktif',
        grade: { label: 'Grade B · Mati', condition: 'dead' },
        weight: '45 kg',
        pricePerKg: 'Rp 8.000',
        footer: 'Sisa 2 j 15 mnt',
      },
      {
        href: '/nelayan/listing/udang-rebon',
        image: { src: '/images/nelayan/listing-udang-rebon.jpg', alt: 'Udang rebon di atas piring putih' },
        category: 'Udang Rebon',
        location: 'PPI Karangsong, Indramayu',
        status: 'sold',
        statusLabel: 'Terjual',
        grade: { label: 'Grade A · Hidup', condition: 'live' },
        weight: '30 kg',
        pricePerKg: 'Rp 15.000',
        footer: 'Telah terjual',
      },
      {
        href: '/nelayan/listing/ikan-pelagis-kecil',
        image: { src: '/images/nelayan/listing-ikan-pelagis-kecil.jpg', alt: 'Ikan pelagis kecil bakar di atas piring' },
        category: 'Ikan Pelagis Kecil',
        location: 'PPI Tegal',
        status: 'active',
        statusLabel: 'Aktif',
        grade: { label: 'Grade B · Mati', condition: 'dead' },
        weight: '60 kg',
        pricePerKg: 'Rp 6.500',
        footer: 'Sisa 5 j 40 mnt',
      },
    ] satisfies ListingCardContent[],
    metricLabels: { weight: 'Berat', pricePerKg: 'Harga per kg' },
    // Shown when `items` is empty (the "Listing kosong" state).
    empty: {
      title: 'Belum ada listing aktif',
      description: 'Catat tangkapan hari ini supaya pembeli di sekitar PPI bisa melihat dan menawarnya.',
      action: { href: '/nelayan/catat', label: 'Tambah Tangkapan' },
    },
  },
  notificationList: {
    title: 'Notifikasi Terbaru',
    viewAll: { href: '/nelayan/notifikasi', label: 'Lihat semua notifikasi' },
    items: [
      { tone: 'success', icon: 'check', message: 'Pembeli dari CV Laut Jaya tertarik dengan listing Anda (Ikan Campuran).', time: '12 menit yang lalu' },
      { tone: 'info', icon: 'shopping-cart', message: 'Batch Anda (Udang Rebon) telah terjual dengan harga Rp 450.000.', time: '1 jam yang lalu' },
      { tone: 'warning', icon: 'badge-check', message: 'PPI Karangsong akan melakukan verifikasi batch Anda.', time: '2 jam yang lalu' },
      { tone: 'info', icon: 'message-circle', message: 'Pembeli dari PT Samudra Sejahtera mengirim pesan terkait listing.', time: '3 jam yang lalu' },
    ] satisfies NotificationContent[],
    // Shown when `items` is empty (the "Notifikasi kosong" state).
    empty: {
      title: 'Belum ada notifikasi',
      description: 'Kabar dari pembeli dan PPI akan muncul di sini.',
    },
  },
  tagline: 'Laut memberi, kita jaga bersama',
}
