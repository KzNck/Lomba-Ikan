// All copy and imagery for the pembeli dashboard. Edit here to swap content without touching layout.
// Recommendations, notifications and figures are the export's sample data until they come from Supabase.
import type { SidebarNavItem } from '@/components/dashboard/sidebar-nav'
import type { ProductCardContent } from '@/components/pembeli/product-card'
import type { NotificationItemContent } from '@/components/pembeli/notification-item'
import type { ActivityStatContent } from '@/components/pembeli/activity-stat'

export const PEMBELI_USER = {
  name: 'CV Maggot Sejahtera',
  role: 'Pembeli',
}

export const PEMBELI_NAV: SidebarNavItem[] = [
  { href: '/pembeli', label: 'Dashboard', icon: 'house' },
  { href: '/marketplace', label: 'Marketplace', icon: 'store' },
  { href: '/pembeli/riwayat', label: 'Riwayat', icon: 'history' },
  { href: '/pembeli/akun', label: 'Akun', icon: 'user' },
]

export const PEMBELI_NOTIFICATIONS = { href: '/pembeli/notifikasi', label: 'Notifikasi', unreadCount: 2 }

export const DASHBOARD = {
  greeting: `Selamat datang, ${PEMBELI_USER.name} 👋`,
  subtitle: 'Temukan hasil laut berkualitas untuk kebutuhan bisnis Anda.',
  recommendations: {
    title: 'Rekomendasi Sesuai Preferensi Anda',
    description: 'Kami pilihkan hasil laut terbaik berdasarkan kebutuhan dan lokasi Anda.',
    viewAll: { href: '/marketplace', label: 'Lihat semua di Marketplace' },
    items: [
      {
        href: '/marketplace/tuna-sirip-kuning',
        image: { src: '/images/pembeli/rekomendasi-tuna-sirip-kuning.jpg', alt: 'Tuna sirip kuning segar' },
        name: 'Tuna Sirip Kuning',
        grade: 'A1',
        status: 'active',
        statusLabel: 'Aktif',
        weight: '12 kg',
        distance: '8 km',
        location: 'PPI Bitung',
        price: 'Rp 48.000/kg',
        actionLabel: 'Lihat detail',
      },
      {
        href: '/marketplace/ikan-cakalang',
        image: { src: '/images/pembeli/rekomendasi-ikan-cakalang.jpg', alt: 'Ikan cakalang segar' },
        name: 'Ikan Cakalang',
        grade: 'B2',
        status: 'active',
        statusLabel: 'Aktif',
        weight: '20 kg',
        distance: '15 km',
        location: 'PPI Tanjung Priok',
        price: 'Rp 32.000/kg',
        actionLabel: 'Lihat detail',
      },
      {
        href: '/marketplace/cumi-cumi',
        image: { src: '/images/pembeli/rekomendasi-cumi-cumi.jpg', alt: 'Cumi-cumi segar' },
        name: 'Cumi-Cumi',
        grade: 'B1',
        status: 'active',
        statusLabel: 'Aktif',
        weight: '15 kg',
        distance: '12 km',
        location: 'PPI Benoa',
        price: 'Rp 55.000/kg',
        actionLabel: 'Lihat detail',
      },
      {
        href: '/marketplace/ikan-kakap-merah',
        image: { src: '/images/pembeli/rekomendasi-ikan-kakap-merah.jpg', alt: 'Ikan kakap merah segar' },
        name: 'Ikan Kakap Merah',
        grade: 'A3',
        status: 'active',
        statusLabel: 'Aktif',
        weight: '10 kg',
        distance: '20 km',
        location: 'PPI Ambon',
        price: 'Rp 62.000/kg',
        actionLabel: 'Lihat detail',
      },
      {
        // Sold listings point to similar stock instead of their own detail page.
        href: '/marketplace?jenis=udang',
        image: { src: '/images/pembeli/rekomendasi-udang.webp', alt: 'Udang segar' },
        name: 'Udang',
        grade: 'A2',
        status: 'sold',
        statusLabel: 'Terjual',
        weight: '8 kg',
        distance: '8 km',
        location: 'PPI Bitung',
        price: 'Rp 75.000/kg',
        actionLabel: 'Lihat serupa',
      },
      {
        href: '/marketplace?jenis=ikan-tenggiri',
        image: { src: '/images/pembeli/rekomendasi-ikan-tenggiri.webp', alt: 'Ikan tenggiri segar' },
        name: 'Ikan Tenggiri',
        grade: 'B3',
        status: 'sold',
        statusLabel: 'Terjual',
        weight: '18 kg',
        distance: '25 km',
        location: 'PPI Cilacap',
        price: 'Rp 70.000/kg',
        actionLabel: 'Lihat serupa',
      },
    ] satisfies ProductCardContent[],
    // Shown when `items` is empty (the "Rekomendasi kosong" state).
    empty: {
      title: 'Belum ada rekomendasi',
      description: 'Atur jenis olahan dan radius lokasi supaya kami bisa memilihkan hasil laut yang cocok untuk Anda.',
      action: { href: '/pembeli/akun', label: 'Atur preferensi' },
    },
  },
  notificationList: {
    title: 'Notifikasi Terbaru',
    viewAll: { href: '/pembeli/notifikasi', label: 'Lihat semua notifikasi' },
    items: [
      { href: '/pembeli/notifikasi', icon: 'tag', title: 'Penawaran Harga Baru', description: 'Tuna Sirip Kuning · Rp 48.000/kg', time: '2 jam yang lalu' },
      { href: '/pembeli/notifikasi', icon: 'truck', title: 'Status Transaksi', description: 'Transaksi #BL-2025-0012 sedang diproses.', time: '5 jam yang lalu' },
      { href: '/pembeli/notifikasi', icon: 'file-text', title: 'Stok Menipis', description: 'Ikan Cakalang hampir habis di PPI Tanjung Priok.', time: '1 hari yang lalu' },
      { href: '/pembeli/notifikasi', icon: 'info', title: 'Informasi', description: 'Jadwal pengiriman PPI Bitung diperbarui.', time: '1 hari yang lalu' },
    ] satisfies NotificationItemContent[],
    // Shown when `items` is empty (the "Notifikasi kosong" state).
    empty: {
      title: 'Belum ada notifikasi',
      description: 'Kabar penawaran, transaksi, dan stok dari PPI akan muncul di sini.',
    },
  },
  activity: {
    title: 'Ringkasan Aktivitas',
    stats: [
      { icon: 'tag', label: 'Penawaran Aktif', value: '12', delta: '+3', caption: 'dari kemarin' },
      { icon: 'file-text', label: 'Transaksi Berjalan', value: '5', delta: '+2', caption: 'dari kemarin' },
      { icon: 'history', label: 'Total Transaksi (30 hari)', value: '28', delta: '+8', caption: 'dari bulan lalu' },
    ] satisfies ActivityStatContent[],
  },
}
