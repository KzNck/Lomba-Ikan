// All copy for the pembeli dashboard. Edit here to swap content without touching layout.
// Recommendations, notifications and figures come from Supabase — see lib/pembeli/dashboard.ts.
import type { SidebarNavItem } from '@/components/dashboard/sidebar-nav'

export const PEMBELI_ROLE_LABEL = 'Pembeli'

// Labels are in messages/*.json under `nav`.
export const PEMBELI_NAV: SidebarNavItem[] = [
  { href: '/pembeli', labelKey: 'dashboard', icon: 'house' },
  { href: '/marketplace', labelKey: 'marketplace', icon: 'store' },
  { href: '/pembeli/riwayat', labelKey: 'history', icon: 'history' },
  { href: '/pembeli/akun', labelKey: 'account', icon: 'user' },
]

// `unreadCount` is replaced per request with the number of notifications actually shown.
export const PEMBELI_NOTIFICATIONS = { href: '/pembeli/notifikasi', unreadCount: 0 }

export const DASHBOARD = {
  // "Selamat datang, <nama usaha> 👋", built per request from the account.
  greeting: (name: string) => `Selamat datang, ${name} 👋`,
  subtitle: 'Temukan hasil laut berkualitas untuk kebutuhan bisnis Anda.',
  recommendations: {
    title: 'Rekomendasi Sesuai Preferensi Anda',
    description: 'Kami pilihkan hasil laut terbaik berdasarkan kebutuhan dan lokasi Anda.',
    viewAll: { href: '/marketplace', label: 'Lihat semua di Marketplace' },
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
    // Shown when `items` is empty (the "Notifikasi kosong" state).
    empty: {
      title: 'Belum ada notifikasi',
      description: 'Kabar penawaran, transaksi, dan stok dari PPI akan muncul di sini.',
    },
  },
  activity: {
    title: 'Ringkasan Aktivitas',
  },
}
