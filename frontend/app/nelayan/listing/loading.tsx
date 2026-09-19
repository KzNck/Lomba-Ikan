import { ListingShell } from '@/components/nelayan/listing-shell'
import { ListingPanel } from '@/components/nelayan/listing-panel'
import { ListingSkeletonCard } from '@/components/nelayan/listing-skeleton-card'
import { ACTIVE_TAB } from '@/components/nelayan/listing-content'

// The "Memuat listing" state: the panel with placeholder cards while the listings load. Three across, like the grid
// (the export previews the panel at 480px wide with two).
export default function ListingSayaLoading() {
  return (
    <ListingShell>
      <ListingPanel title={ACTIVE_TAB.empty.panelTitle}>
        <div role="status" className="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] justify-start items-start">
          <span className="sr-only">Memuat listing…</span>
          <ListingSkeletonCard />
          <ListingSkeletonCard />
          <ListingSkeletonCard />
        </div>
      </ListingPanel>
    </ListingShell>
  )
}
