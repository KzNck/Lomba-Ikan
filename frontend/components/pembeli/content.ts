// All copy for the pembeli dashboard. Edit here to swap content without touching layout.
// Recommendations, notifications and figures come from Supabase — see lib/pembeli/dashboard.ts.
import type { SidebarNavItem } from '@/components/dashboard/sidebar-nav'
import type { Translator } from '@/lib/i18n/translator'

// Labels are in messages/*.json under `nav`.
export const PEMBELI_NAV: SidebarNavItem[] = [
  { href: '/pembeli', labelKey: 'dashboard', icon: 'house' },
  { href: '/marketplace', labelKey: 'marketplace', icon: 'store' },
  { href: '/pembeli/riwayat', labelKey: 'history', icon: 'history' },
  { href: '/pembeli/akun', labelKey: 'account', icon: 'user' },
]

// `unreadCount` is replaced per request with the number of notifications actually shown.
export const PEMBELI_NOTIFICATIONS = { href: '/pembeli/notifikasi', unreadCount: 0 }

// Text lives in messages/*.json under `dashboard.pembeli.home`.
export function dashboardCopy(t: Translator<'dashboard.pembeli.home'>) {
  return {
    // "Selamat datang, <nama usaha> 👋", built per request from the account.
    greeting: (name: string) => t('greeting', { name }),
    subtitle: t('subtitle'),
    recommendations: {
      title: t('recommendationsTitle'),
      description: t('recommendationsDescription'),
      viewAll: { href: '/marketplace', label: t('recommendationsViewAll') },
      // Shown when `items` is empty (the "Rekomendasi kosong" state).
      empty: {
        title: t('recommendationsEmptyTitle'),
        description: t('recommendationsEmptyDescription'),
        action: { href: '/pembeli/akun', label: t('recommendationsEmptyAction') },
      },
    },
    notificationList: {
      title: t('notificationsTitle'),
      viewAll: { href: '/pembeli/notifikasi', label: t('notificationsViewAll') },
      // Shown when `items` is empty (the "Notifikasi kosong" state).
      empty: {
        title: t('notificationsEmptyTitle'),
        description: t('notificationsEmptyDescription'),
      },
    },
    activity: {
      title: t('activityTitle'),
    },
  }
}
