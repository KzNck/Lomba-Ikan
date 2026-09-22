// All copy for the pembeli dashboard. Edit here to swap content without touching layout.
// Recommendations and figures come from Supabase — see lib/pembeli/dashboard.ts.
import type { SidebarNavItem } from '@/components/dashboard/sidebar-nav'
import type { Translator } from '@/lib/i18n/translator'

// Labels are in messages/*.json under `nav`.
export const PEMBELI_NAV: SidebarNavItem[] = [
  { href: '/pembeli', labelKey: 'dashboard', icon: 'house' },
  { href: '/marketplace', labelKey: 'marketplace', icon: 'store' },
  { href: '/pembeli/riwayat', labelKey: 'history', icon: 'history' },
  { href: '/pembeli/akun', labelKey: 'account', icon: 'user' },
]

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
    activity: {
      title: t('activityTitle'),
    },
  }
}
