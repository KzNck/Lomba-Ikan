import { ListingShell } from '@/components/nelayan/listing-shell'
import { ListingPanel } from '@/components/nelayan/listing-panel'
import { ListingSkeletonCard } from '@/components/nelayan/listing-skeleton-card'
import { useTranslations } from 'next-intl'
import { activeTab } from '@/components/nelayan/listing-content'

// The "Memuat listing" state: the panel with placeholder cards while the listings load. Three across, like the grid
// (the export previews the panel at 480px wide with two). The header bar is a placeholder here — see ListingShell.
export default function ListingSayaLoading() {
  const t = useTranslations('dashboard.nelayan.listing')
  const ACTIVE_TAB = activeTab(t)
  return (
    <ListingShell>
      <ListingPanel title={ACTIVE_TAB.panelTitle}>
        <div role="status" className="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] justify-start items-start">
          <span className="sr-only">{t('loading')}</span>
          <ListingSkeletonCard />
          <ListingSkeletonCard />
          <ListingSkeletonCard />
        </div>
      </ListingPanel>
    </ListingShell>
  )
}
