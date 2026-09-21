import { getTranslations } from 'next-intl/server'
import { ListingShell } from '@/components/nelayan/listing-shell'
import { ListingTabs } from '@/components/nelayan/listing-tabs'
import { ListingCard } from '@/components/nelayan/listing-card'
import { ListingPanel } from '@/components/nelayan/listing-panel'
import { EmptyState } from '@/components/nelayan/empty-state'
import { ListingDrawer } from '@/components/nelayan/listing-drawer'
import { ListingEditForm } from '@/components/nelayan/listing-edit-form'
import { CancelListingDialog } from '@/components/nelayan/cancel-listing-dialog'
import { cancelListing, saveListingEdit } from '@/app/nelayan/actions'
import {
  activeTab,
  cancelDialog,
  closedTab,
  editListing,
  listingDrawer,
  listingPage,
  LISTING_PATH,
  publishHref,
  type EmptyTabContent,
} from '@/components/nelayan/listing-content'
import { toActiveListing, toListingCard } from '@/lib/catches/present'
import { getMyCatches } from '@/lib/supabase/catches'
import { getMyTransactions } from '@/lib/supabase/transactions'
import { requireProfile } from '@/lib/supabase/auth'
import { greetingFor, initialsOf, recentNotifications } from '@/lib/nelayan/dashboard-data'
import { getPresenter } from '@/lib/i18n/presenter'
import { displayNameFor } from '@/lib/supabase/display-name'

const detailHref = (slug: string) => `${LISTING_PATH}?detail=${slug}`

// A listing is still running while it is LISTED or waiting to sync; everything else belongs to the second tab.
const isOpen = (status: string) => status === 'LISTED' || status === 'WAITING_FOR_SYNC'

// The "09 Listing Saya" frame. The URL holds the view: ?tab=terjual for the second tab, ?detail=<slug> for the open
// drawer, &ubah=1 for its edit mode, and &konfirmasi=batal for the "Batalkan listing" dialog over it.
export default async function ListingSayaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { tab, detail, ubah, konfirmasi } = await searchParams
  const showClosed = tab === 'terjual'

  // Loaded together; RLS scopes the catches to this fisher, and the role check redirects if it fails.
  const [profile, catches, transactions, p] = await Promise.all([
    requireProfile('nelayan'),
    getMyCatches(),
    getMyTransactions(),
    getPresenter(),
  ])
  const name = await displayNameFor(profile)
  const [home, t] = await Promise.all([getTranslations('dashboard.nelayan.home'), getTranslations('dashboard.nelayan.listing')])
  const [LISTING_PAGE, ACTIVE_TAB, CLOSED_TAB] = [listingPage(t), activeTab(t), closedTab(t)]
  const [LISTING_DRAWER, EDIT_LISTING, CANCEL_DIALOG] = [listingDrawer(t), editListing(t), cancelDialog(t)]

  const active = catches.filter((entry) => isOpen(entry.status)).map((entry) => toActiveListing(p, entry))
  const closed = catches.filter((entry) => !isOpen(entry.status))
  const selected = showClosed ? undefined : active.find((item) => item.slug === detail)

  const tabs = [
    { href: LISTING_PATH, label: ACTIVE_TAB.label, count: active.length, active: !showClosed },
    { href: `${LISTING_PATH}?tab=terjual`, label: CLOSED_TAB.label, count: closed.length, active: showClosed },
  ]

  const cards = showClosed
    ? closed.map((entry) => ({ ...toListingCard(p, entry, '/nelayan/riwayat'), key: entry.id }))
    : active.map((item) =>
        item.status === 'draft'
          ? { ...item, key: item.slug, href: publishHref(item.slug), cta: ACTIVE_TAB.publishLabel }
          : { ...item, key: item.slug, href: detailHref(item.slug) },
      )
  // Typed as the shared shape so the optional `action` reads the same on both tabs.
  const { detailLabel, empty }: { detailLabel: string; empty: EmptyTabContent } = showClosed
    ? CLOSED_TAB
    : ACTIVE_TAB

  return (
    <>
      <ListingShell
        header={{
          greeting: greetingFor(home, name),
          user: { name, initials: initialsOf(profile.full_name) },
          unreadCount: recentNotifications(p, home, catches, transactions).length,
        }}
        drawer={
          selected && (
            <ListingDrawer
              listing={selected}
              labels={LISTING_DRAWER}
              cancelHref={`${detailHref(selected.slug)}&konfirmasi=batal`}
              editHref={`${detailHref(selected.slug)}&ubah=1`}
              edit={
                ubah === '1'
                  ? {
                      title: EDIT_LISTING.title,
                      closeLabel: EDIT_LISTING.closeLabel,
                      // Keyed by listing so switching cards while editing starts a fresh form.
                      form: <ListingEditForm key={selected.slug} listing={selected} action={saveListingEdit} cancelHref={detailHref(selected.slug)} />,
                    }
                  : undefined
              }
            />
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
            <EmptyState icon="fish" title={empty.title} description={empty.description} action={empty.action} />
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
