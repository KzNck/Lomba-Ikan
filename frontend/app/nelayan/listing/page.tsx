import { getTranslations } from 'next-intl/server'
import { ListingShell } from '@/components/nelayan/listing-shell'
import { DateRangeMenu } from '@/components/nelayan/date-range-menu'
import { FilterMenu } from '@/components/nelayan/filter-menu'
import { ListingCard } from '@/components/nelayan/listing-card'
import { ListingPanel } from '@/components/nelayan/listing-panel'
import { EmptyState } from '@/components/nelayan/empty-state'
import { ListingDrawer, type DrawerActions } from '@/components/nelayan/listing-drawer'
import { ListingEditForm } from '@/components/nelayan/listing-edit-form'
import { ConfirmListingDialog } from '@/components/nelayan/confirm-listing-dialog'
import { cancelListing, deleteListing, saveListingEdit } from '@/app/nelayan/actions'
import {
  activeTab,
  cancelDialog,
  closedStatus,
  deleteDialog,
  editListing,
  listingDrawer,
  listingFilters,
  listingHref,
  listingPage,
  LISTING_PATH,
  LISTING_STATUSES,
  publishHref,
  sortsFor,
  type ClosedStatus,
  type EmptyTabContent,
  type ListingStatus,
  type ListingView,
} from '@/components/nelayan/listing-content'
import { toActiveListing, toListingCard } from '@/lib/catches/present'
import { getMyCatches } from '@/lib/supabase/catches'
import { getMyTransactions } from '@/lib/supabase/transactions'
import { requireProfile } from '@/lib/supabase/auth'
import { initialsOf, recentNotifications } from '@/lib/nelayan/dashboard-data'
import { formatDay, withinRange } from '@/lib/nelayan/riwayat'
import { getPresenter } from '@/lib/i18n/presenter'
import { displayNameFor } from '@/lib/supabase/display-name'
import type { Catch, CatchStatus } from '@/types/database'

// A listing is still running while it is LISTED or waiting to sync; the rest have a status of their own.
const STATUS_OF: Record<CatchStatus, Exclude<ListingStatus, 'semua'>> = {
  LISTED: 'aktif',
  WAITING_FOR_SYNC: 'aktif',
  CLAIMED: 'diproses',
  COMPLETED: 'terjual',
  EXPIRED: 'kedaluwarsa',
}

type SearchParams = { [key: string]: string | string[] | undefined }

// Only "YYYY-MM-DD" counts, as on Riwayat; anything else reads as no bound.
const day = (value: string | string[] | undefined) =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined

function parseView({ status, urut, dari, sampai }: SearchParams): ListingView {
  const filter = LISTING_STATUSES.find((value) => value === status) ?? 'semua'
  // An order the filter doesn't offer (or none) reads as the default.
  return { status: filter, urut: sortsFor(filter).find((value) => value === urut) ?? 'baru', dari: day(dari), sampai: day(sampai) }
}

// Newest or oldest by when the catch was logged, the same date the range filters on. Ending soonest puts drafts last:
// they have no claim window until they're posted.
function sortCatches(entries: Catch[], sort: ListingView['urut']): Catch[] {
  const time = (value: string | null) => (value ? Date.parse(value) : Infinity)
  return [...entries].sort((a, b) => {
    if (sort === 'berakhir') return time(a.expires_at) - time(b.expires_at) || time(b.created_at) - time(a.created_at)
    const diff = time(a.created_at) - time(b.created_at)
    return sort === 'lama' ? diff : -diff
  })
}

// The "09 Listing Saya" frame. The URL holds the view, filtered like Riwayat: ?status=, ?dari= / ?sampai= and ?urut=,
// then ?detail=<slug> for the open drawer, &ubah=1 for its edit mode, and &konfirmasi=batal for the "Batalkan
// listing" dialog over it. See listingHref.
export default async function ListingSayaPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const view = parseView(params)
  const { detail, ubah, konfirmasi, gagal } = params
  // Every link keeps the filters; only what it changes differs.
  const hrefWith = (change: Partial<ListingView>) => listingHref({ ...view, ...change })
  const detailHref = (slug: string) => hrefWith({ detail: slug })

  // Loaded together; RLS scopes the catches to this fisher, and the role check redirects if it fails.
  const [profile, catches, transactions, p] = await Promise.all([
    requireProfile('nelayan'),
    getMyCatches(),
    getMyTransactions(),
    getPresenter(),
  ])
  const name = await displayNameFor(profile)
  const [home, t] = await Promise.all([getTranslations('dashboard.nelayan.home'), getTranslations('dashboard.nelayan.listing')])
  const [LISTING_PAGE, ACTIVE_TAB, FILTERS] = [listingPage(t), activeTab(t), listingFilters(t)]
  const [LISTING_DRAWER, EDIT_LISTING, CANCEL_DIALOG, DELETE_DIALOG] = [listingDrawer(t), editListing(t), cancelDialog(t), deleteDialog(t)]

  const range = { from: view.dari, to: view.sampai }
  const shown = sortCatches(
    catches.filter(
      (entry) => (view.status === 'semua' || STATUS_OF[entry.status] === view.status) && withinRange(entry.created_at, range),
    ),
    view.urut,
  )
  // A catch someone once claimed keeps its row for the transaction's sake (the database refuses the delete too).
  const claimed = new Set(transactions.map((tx) => tx.catch_id))
  // What the drawer's footer offers for a catch; undefined for claimed and sold ones, which have no drawer.
  const actionsFor = (entry: Catch): DrawerActions | undefined => {
    switch (entry.status) {
      case 'LISTED':
        return { kind: 'active', cancelHref: hrefWith({ detail: entry.id, konfirmasi: 'batal' }), editHref: hrefWith({ detail: entry.id, ubah: true }) }
      case 'WAITING_FOR_SYNC':
        return { kind: 'removable', deleteHref: hrefWith({ detail: entry.id, konfirmasi: 'hapus' }), publishHref: publishHref(entry.id) }
      case 'EXPIRED':
        return claimed.has(entry.id) ? { kind: 'locked' } : { kind: 'removable', deleteHref: hrefWith({ detail: entry.id, konfirmasi: 'hapus' }) }
      default:
        return undefined
    }
  }

  // The drawer opens on running, draft and expired listings, so a link to one works whatever the filters.
  const openEntry = catches.find((entry) => entry.id === detail)
  const openActions = openEntry && actionsFor(openEntry)
  const selected = openEntry && openActions ? { listing: toActiveListing(p, openEntry), actions: openActions } : undefined

  // Cards with a drawer open it; claimed and sold ones link to their transaction.
  const cards = shown.map((entry) => {
    const status = STATUS_OF[entry.status]
    if (actionsFor(entry)) {
      const detailLabel = status === 'aktif' ? ACTIVE_TAB.detailLabel : closedStatus(t, 'kedaluwarsa').detailLabel
      return { ...toActiveListing(p, entry), key: entry.id, href: detailHref(entry.id), detailLabel }
    }
    const copy = closedStatus(t, status as ClosedStatus)
    return { ...toListingCard(p, entry, copy.cardHref), key: entry.id, detailLabel: copy.detailLabel }
  })

  // The closed date control: the chosen range when there is one, otherwise "Semua tanggal".
  const { dateRange } = FILTERS
  const dateLabel =
    range.from && range.to
      ? dateRange.between(formatDay(p, range.from), formatDay(p, range.to))
      : range.from
        ? dateRange.since(formatDay(p, range.from))
        : range.to
          ? dateRange.until(formatDay(p, range.to))
          : dateRange.empty
  // Applying a range keeps the status and order; the form sends ?dari= / ?sampai= itself.
  const keep: Record<string, string> = {}
  if (view.status !== 'semua') keep.status = view.status
  if (view.urut !== 'baru') keep.urut = view.urut

  const statusOptions = LISTING_STATUSES.map((value) => ({
    // Switching status keeps the order where the next filter offers it.
    href: hrefWith({ status: value, urut: sortsFor(value).includes(view.urut) ? view.urut : 'baru' }),
    label: FILTERS.status.optionLabel(value),
    selected: value === view.status,
  }))
  const sortOptions = sortsFor(view.status).map((value) => ({
    href: hrefWith({ urut: value }),
    label: FILTERS.sort.optionLabel(value),
    selected: value === view.urut,
  }))

  // A status filter shows that status's empty state; with none, it's the "Aktif" one and its way out.
  // Typed as the shared shape so the optional `action` reads the same for every status.
  const empty: EmptyTabContent =
    view.status === 'semua' || view.status === 'aktif' ? ACTIVE_TAB.empty : closedStatus(t, view.status).empty

  return (
    <>
      <ListingShell
        header={{
          user: { name, initials: initialsOf(profile.full_name) },
          unreadCount: recentNotifications(p, home, catches, transactions).length,
        }}
        drawer={
          selected && (
            <ListingDrawer
              listing={selected.listing}
              labels={LISTING_DRAWER}
              actions={selected.actions}
              closeHref={hrefWith({})}
              error={gagal === 'hapus' && selected.actions.kind === 'removable' ? LISTING_DRAWER.deleteFailed : undefined}
              edit={
                // Only a running listing can be edited.
                ubah === '1' && selected.actions.kind === 'active'
                  ? {
                      title: EDIT_LISTING.title,
                      closeLabel: EDIT_LISTING.closeLabel,
                      // Keyed by listing so switching cards while editing starts a fresh form.
                      form: (
                        <ListingEditForm
                          key={selected.listing.slug}
                          listing={selected.listing}
                          action={saveListingEdit}
                          cancelHref={detailHref(selected.listing.slug)}
                        />
                      ),
                    }
                  : undefined
              }
            />
          )
        }
      >
        <div className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap lg:flex-nowrap gap-[14px] justify-start items-end">
          <DateRangeMenu
            action={LISTING_PATH}
            keep={keep}
            range={range}
            value={dateLabel}
            editLabel={dateRange.editLabel(dateLabel)}
            // Only the text crosses to the client; the formatters above stay on the server.
            copy={{
              label: dateRange.label,
              legend: dateRange.legend,
              fromLabel: dateRange.fromLabel,
              toLabel: dateRange.toLabel,
              apply: dateRange.apply,
              reset: dateRange.reset,
            }}
          />
          <FilterMenu label={FILTERS.status.label} icon="funnel" options={statusOptions} />
          <div className="box-border hidden sm:block [flex:1_1_0]" />
          <FilterMenu label={FILTERS.sort.label} icon="arrow-up-down" options={sortOptions} align="end" />
        </div>
        {cards.length > 0 ? (
          <ul className="box-border w-full h-fit shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] justify-start items-stretch">
            {cards.map(({ key, ...card }) => (
              <li key={key} className="box-border min-w-0 flex">
                <ListingCard {...card} metricLabels={LISTING_PAGE.metricLabels} photo="short" selected={key === selected?.listing.slug} />
              </li>
            ))}
          </ul>
        ) : (
          <ListingPanel title={empty.panelTitle}>
            <EmptyState icon="fish" title={empty.title} description={empty.description} action={empty.action} />
          </ListingPanel>
        )}
      </ListingShell>
      {selected && konfirmasi === 'batal' && selected.actions.kind === 'active' && (
        <ConfirmListingDialog
          listingId={selected.listing.slug}
          icon="circle-x"
          title={CANCEL_DIALOG.title}
          body={CANCEL_DIALOG.body(selected.listing.category, selected.listing.weight)}
          back={{ href: detailHref(selected.listing.slug), label: CANCEL_DIALOG.backLabel }}
          confirmLabel={CANCEL_DIALOG.confirmLabel}
          action={cancelListing}
        />
      )}
      {selected && konfirmasi === 'hapus' && selected.actions.kind === 'removable' && (
        <ConfirmListingDialog
          listingId={selected.listing.slug}
          icon="trash-2"
          // Where to land once it's gone: the same filters, without the drawer.
          hidden={{ back: hrefWith({}) }}
          title={DELETE_DIALOG.title}
          body={DELETE_DIALOG.body(selected.listing.category, selected.listing.weight)}
          back={{ href: detailHref(selected.listing.slug), label: DELETE_DIALOG.backLabel }}
          confirmLabel={DELETE_DIALOG.confirmLabel}
          action={deleteListing}
        />
      )}
    </>
  )
}
