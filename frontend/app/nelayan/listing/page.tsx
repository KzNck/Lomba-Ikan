import { ListingShell } from '@/components/nelayan/listing-shell'
import { ListingTabs } from '@/components/nelayan/listing-tabs'
import { ListingCard } from '@/components/nelayan/listing-card'
import { ListingPanel } from '@/components/nelayan/listing-panel'
import { EmptyState } from '@/components/nelayan/empty-state'
import { ListingDrawer } from '@/components/nelayan/listing-drawer'
import { CancelListingDialog } from '@/components/nelayan/cancel-listing-dialog'
import { cancelListing } from '@/app/nelayan/actions'
import {
  ACTIVE_TAB,
  CANCEL_DIALOG,
  CLOSED_TAB,
  LISTING_DRAWER,
  LISTING_PAGE,
  LISTING_PATH,
} from '@/components/nelayan/listing-content'

const detailHref = (slug: string) => `${LISTING_PATH}?detail=${slug}`

// The "09 Listing Saya" frame. The URL holds the view: ?tab=terjual for the second tab, ?detail=<slug> for the open
// drawer, and &konfirmasi=batal for the "Batalkan listing" dialog over it.
export default async function ListingSayaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { tab, detail, konfirmasi } = await searchParams
  const showClosed = tab === 'terjual'
  const selected = showClosed ? undefined : ACTIVE_TAB.items.find((item) => item.slug === detail)

  const tabs = [
    { href: LISTING_PATH, label: ACTIVE_TAB.label, count: ACTIVE_TAB.items.length, active: !showClosed },
    { href: `${LISTING_PATH}?tab=terjual`, label: CLOSED_TAB.label, count: CLOSED_TAB.items.length, active: showClosed },
  ]

  const cards = showClosed
    ? CLOSED_TAB.items.map((item) => ({ ...item, key: item.category + item.location }))
    : ACTIVE_TAB.items.map((item) => ({ ...item, key: item.slug, href: detailHref(item.slug) }))
  const { detailLabel, empty } = showClosed ? CLOSED_TAB : ACTIVE_TAB

  return (
    <>
      <ListingShell
        drawer={
          selected && (
            <ListingDrawer listing={selected} labels={LISTING_DRAWER} cancelHref={`${detailHref(selected.slug)}&konfirmasi=batal`} />
          )
        }
      >
        <ListingTabs tabs={tabs} label={LISTING_PAGE.title} />
        {cards.length > 0 ? (
          <ul className="box-border w-full h-fit shrink-0 grid grid-cols-3 gap-[16px] justify-start items-stretch">
            {cards.map(({ key, ...card }) => (
              <li key={key} className="box-border min-w-0 flex">
                <ListingCard
                  {...card}
                  metricLabels={LISTING_PAGE.metricLabels}
                  detailLabel={detailLabel}
                  photo="short"
                  selected={key === selected?.slug}
                />
              </li>
            ))}
          </ul>
        ) : (
          <ListingPanel title={empty.panelTitle}>
            <EmptyState icon="fish" title={empty.title} description={empty.description} action={'action' in empty ? empty.action : undefined} />
          </ListingPanel>
        )}
      </ListingShell>
      {selected && konfirmasi === 'batal' && (
        <CancelListingDialog
          listingId={selected.slug}
          title={CANCEL_DIALOG.title}
          body={CANCEL_DIALOG.body(selected.category, selected.weight)}
          back={{ href: detailHref(selected.slug), label: CANCEL_DIALOG.backLabel }}
          confirmLabel={CANCEL_DIALOG.confirmLabel}
          action={cancelListing}
        />
      )}
    </>
  )
}
