// All copy and imagery for the nelayan dashboard. Edit here to swap content without touching layout.
// Figures, listings and notifications come from Supabase — see lib/nelayan/dashboard-data.ts.
import type { SidebarNavItem } from '@/components/dashboard/sidebar-nav'

export const NELAYAN_ROLE_LABEL = 'Nelayan'

export const NELAYAN_NAV: SidebarNavItem[] = [
  { href: '/nelayan', label: 'Dashboard', icon: 'house' },
  { href: '/nelayan/catat', label: 'Tambah Tangkapan', icon: 'circle-plus' },
  { href: '/nelayan/listing', label: 'Listing Saya', icon: 'tag' },
  { href: '/nelayan/riwayat', label: 'Riwayat', icon: 'history' },
  { href: '/nelayan/akun', label: 'Akun', icon: 'user' },
]

export const DASHBOARD = {
  // The greeting is built per request from the profile name and the time of day.
  subtitle: 'Semoga hari ini banyak tangkapan dan rezeki yang lancar.',
  notifications: { href: '/nelayan/notifikasi', label: 'Notifikasi', unreadCount: 3 },
  breadcrumb: 'Dashboard',
  summary: {
    title: 'Ringkasan Hari Ini',
    image: {
      src: '/images/nelayan/boat.jpg',
      alt: 'Kapal nelayan biru di laut lepas dengan burung camar di atasnya',
    },
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
    // Shown when `items` is empty (the "Notifikasi kosong" state).
    empty: {
      title: 'Belum ada notifikasi',
      description: 'Kabar dari pembeli dan PPI akan muncul di sini.',
    },
  },
  tagline: 'Laut memberi, kita jaga bersama',
}
