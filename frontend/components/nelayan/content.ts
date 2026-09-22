// All copy and imagery for the nelayan dashboard. Edit here to swap content without touching layout.
// Figures and listings come from Supabase — see lib/nelayan/dashboard-data.ts.
import type { SidebarNavItem } from '@/components/dashboard/sidebar-nav'
import type { Translator } from '@/lib/i18n/translator'

// Labels are in messages/*.json under `nav`.
export const NELAYAN_NAV: SidebarNavItem[] = [
  { href: '/nelayan', labelKey: 'dashboard', icon: 'house' },
  { href: '/nelayan/catat', labelKey: 'addCatch', icon: 'circle-plus' },
  { href: '/nelayan/listing', labelKey: 'myListings', icon: 'tag' },
  { href: '/nelayan/riwayat', labelKey: 'history', icon: 'history' },
  { href: '/nelayan/akun', labelKey: 'account', icon: 'user' },
]

// Text lives in messages/*.json under `dashboard.nelayan.home`.
export function dashboardCopy(t: Translator<'dashboard.nelayan.home'>) {
  return {
    // The greeting is built per request from the profile name and the time of day.
    subtitle: t('subtitle'),
    summary: {
      title: t('summaryTitle'),
      image: {
        src: '/images/nelayan/boat.jpg',
        alt: t('summaryImageAlt'),
      },
    },
    quickAction: {
      href: '/nelayan/catat',
      label: t('quickAction.label'),
      caption: t('quickAction.caption'),
      offlineNote: t('quickAction.offlineNote'),
    },
    listings: {
      title: t('listings.title'),
      viewAll: { href: '/nelayan/listing', label: t('listings.viewAll') },
      detailLabel: t('listings.detailLabel'),
      metricLabels: { weight: t('listings.weight'), pricePerKg: t('listings.pricePerKg') },
      // Shown when `items` is empty (the "Listing kosong" state).
      empty: {
        title: t('listings.emptyTitle'),
        description: t('listings.emptyDescription'),
        action: { href: '/nelayan/catat', label: t('listings.emptyAction') },
      },
    },
  }
}
