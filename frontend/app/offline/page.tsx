import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { OfflineScreen } from '@/components/pwa/offline-screen'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('offline')
  return { title: t('pageTitle'), robots: { index: false } }
}

// What the service worker (public/sw.js) shows when a page can't load for lack of signal: a way to log a catch
// anyway. Public and free of user data on purpose — the worker keeps a copy on the device, and the PRD doesn't let one
// user's data linger there. Catches go to the device's queue; OfflineSync sends them once a fisher page opens online.
export default function OfflinePage() {
  return <OfflineScreen />
}
