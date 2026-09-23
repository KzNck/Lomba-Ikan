// All copy for "Listing Saya" (/nelayan/listing). Edit here to swap content without touching layout.
// Text lives in messages/*.json under `dashboard.nelayan.listing`.
// The listings themselves come from Supabase — rows are shaped for these components in lib/catches/present.ts.
import type { ImageContent } from '@/components/home/hero'
import type { NavItem } from '@/components/home/navbar'
import type { ListingCardContent } from '@/components/nelayan/listing-card'
import type { Translator } from '@/lib/i18n/translator'

export const LISTING_PATH = '/nelayan/listing'

export type ListingDetailContent = {
  // The raw values behind the card's "5 kg" and "Rp 10.000", which the edit form opens with.
  weightKg: number
  pricePerKg: number | null
  timeLeft: string
  // "21 Sep 2026, 14.30": when the catch was logged.
  logged: string
  freshness: string
  // The recommendation sentence for the grade; `usageOptions` lists the derived uses under it.
  usage: string
  usageOptions: string
  // The drawer shows the first two and a "+N" tile for the rest.
  photos: ImageContent[]
}

// Active cards open their drawer at `${LISTING_PATH}?detail=${slug}`, so they carry a slug instead of an href.
export type ActiveListing = Omit<ListingCardContent, 'href'> & { slug: string; detail: ListingDetailContent }

// The panel shown when a tab has nothing in it. Only "Aktif" offers a way out of it.
export type EmptyTabContent = {
  panelTitle: string
  title: string
  description: string
  action?: NavItem
}

type ListingT = Translator<'dashboard.nelayan.listing'>

export function listingPage(t: ListingT) {
  return {
    title: t('title'),
    addCatch: t('addCatch'),
    subtitle: t('subtitle'),
    metricLabels: { weight: t('weight'), pricePerKg: t('pricePerKg') },
  }
}

// On a catch that was graded but never published: reopens its "Hasil Kesegaran" result, where it is published.
export const publishHref = (id: string) => `/nelayan/catat/hasil?id=${id}`

export function activeTab(t: ListingT) {
  return {
    label: t('active.label'),
    detailLabel: t('active.detailLabel'),
    publishLabel: t('active.publishLabel'),
    // Also the heading of the loading state's panel.
    panelTitle: t('active.panelTitle'),
    // Shown when there are no active listings (the "Aktif kosong" state), and when there are none at all.
    empty: {
      panelTitle: t('active.panelTitle'),
      title: t('active.emptyTitle'),
      description: t('active.emptyDescription'),
      action: { href: '/nelayan/catat', label: t('active.emptyAction') },
    } satisfies EmptyTabContent,
  }
}

// The statuses past "Aktif". Claimed listings are "diproses" until the sale settles.
export const CLOSED_STATUSES = ['diproses', 'terjual', 'kedaluwarsa'] as const
export type ClosedStatus = (typeof CLOSED_STATUSES)[number]

const CLOSED_STATUS_KEYS = { diproses: 'processing', terjual: 'sold', kedaluwarsa: 'expired' } as const

export function closedStatus(t: ListingT, status: ClosedStatus) {
  const key = CLOSED_STATUS_KEYS[status]
  return {
    label: t(`${key}.label`),
    detailLabel: t(`${key}.detailLabel`),
    // Claimed and sold cards open their transaction; an expired one opens its drawer, where it can be deleted.
    cardHref: '/nelayan/riwayat',
    // Not in the export, which has no empty state for these; this mirrors the "Aktif" one without the button.
    empty: {
      panelTitle: t(`${key}.panelTitle`),
      title: t(`${key}.emptyTitle`),
      description: t(`${key}.emptyDescription`),
    } satisfies EmptyTabContent,
  }
}

// ?status= in the URL, like Riwayat; "semua" is the default and stays out of it.
export const LISTING_STATUSES = ['semua', 'aktif', ...CLOSED_STATUSES] as const
export type ListingStatus = (typeof LISTING_STATUSES)[number]

// ?urut=. "berakhir" (ending soonest) only means something while the claim window runs, so it is offered with the
// "Aktif" filter alone; elsewhere it reads as "baru".
export const LISTING_SORTS = ['baru', 'lama', 'berakhir'] as const
export type ListingSort = (typeof LISTING_SORTS)[number]
export const sortsFor = (status: ListingStatus): ListingSort[] => (status === 'aktif' ? [...LISTING_SORTS] : ['baru', 'lama'])

export function listingFilters(t: ListingT) {
  return {
    status: {
      label: t('status.label'),
      optionLabel: (status: ListingStatus) =>
        status === 'semua' ? t('status.semua') : status === 'aktif' ? t('active.label') : closedStatus(t, status).label,
    },
    sort: {
      label: t('sort.label'),
      optionLabel: (sort: ListingSort) => t(`sort.${sort}`),
    },
    dateRange: {
      label: t('dateRange.label'),
      // What the button reads with no range set.
      empty: t('dateRange.empty'),
      legend: t('dateRange.legend'),
      fromLabel: t('dateRange.from'),
      toLabel: t('dateRange.to'),
      apply: t('dateRange.apply'),
      reset: t('dateRange.reset'),
      between: (from: string, to: string) => `${from} – ${to}`,
      since: (from: string) => t('dateRange.since', { from }),
      until: (to: string) => t('dateRange.until', { to }),
      editLabel: (value: string) => t('dateRange.edit', { value }),
    },
  }
}

// The page's URL for a view; the defaults ("semua", "baru", all dates) stay out of it. `detail` opens a card's
// drawer, `ubah` its edit mode and `konfirmasi` the "Batalkan listing" or "Hapus listing" dialog over it.
export type ListingView = {
  status: ListingStatus
  urut: ListingSort
  dari?: string
  sampai?: string
  detail?: string
  ubah?: boolean
  konfirmasi?: 'batal' | 'hapus'
  // Set when a delete was refused, so the drawer can say so.
  gagal?: 'hapus'
}

export function listingHref({ status, urut, dari, sampai, detail, ubah, konfirmasi, gagal }: ListingView): string {
  const params = new URLSearchParams()
  if (status !== 'semua') params.set('status', status)
  if (dari) params.set('dari', dari)
  if (sampai) params.set('sampai', sampai)
  if (urut !== 'baru') params.set('urut', urut)
  if (detail) params.set('detail', detail)
  if (ubah) params.set('ubah', '1')
  if (konfirmasi) params.set('konfirmasi', konfirmasi)
  if (gagal) params.set('gagal', gagal)
  const query = params.toString()
  return query ? `${LISTING_PATH}?${query}` : LISTING_PATH
}

export function listingDrawer(t: ListingT) {
  return {
    title: t('drawer.title'),
    closeLabel: t('drawer.close'),
    metricLabels: { weight: t('weight'), pricePerKg: t('pricePerKg'), timeLeft: t('drawer.timeLeft') },
    loggedLabel: t('drawer.logged'),
    locationLabel: t('drawer.location'),
    mapLabel: t('drawer.map'),
    freshnessLabel: t('drawer.freshness'),
    usageLabel: t('drawer.usage'),
    photosLabel: t('drawer.photos'),
    // Read after the "+N" tile's count by screen readers only.
    morePhotosLabel: t('drawer.morePhotos'),
    editLabel: t('drawer.edit'),
    cancelLabel: t('drawer.cancel'),
    note: t('drawer.note'),
    // Drafts and expired listings: they can be deleted instead of edited or cancelled.
    publishLabel: t('drawer.publish'),
    deleteLabel: t('drawer.delete'),
    deleteNote: t('drawer.deleteNote'),
    // An expired listing someone once claimed keeps its row for the transaction's sake.
    lockedNote: t('drawer.lockedNote'),
    deleteFailed: t('drawer.deleteFailed'),
  }
}

// Min and max match the "Tambah Tangkapan" volume step.
export const WEIGHT_LIMITS = { min: 1, max: 200 }

// The drawer's edit mode (?detail=<id>&ubah=1). Only the weight and price change: the category, grade and photos come
// from the freshness assessment, so editing them would leave a grade that no longer matches the catch.
export function editListing(t: ListingT) {
  return {
    title: t('edit.title'),
    closeLabel: t('edit.close'),
    intro: t('edit.intro'),
    weight: {
      name: 'berat',
      label: t('weight'),
      helper: t('edit.weightHelper'),
      suffix: 'kg',
    },
    minWeight: WEIGHT_LIMITS.min,
    maxWeight: WEIGHT_LIMITS.max,
    errors: {
      weight: t('edit.weightError'),
      price: t('edit.priceError'),
      // The listing was claimed, sold or cancelled while the form was open.
      notListed: t('edit.notListed'),
      saveFailed: t('edit.saveFailed'),
    },
    cancelLabel: t('edit.cancel'),
    saveLabel: t('edit.save'),
    savingLabel: t('edit.saving'),
  }
}

export function cancelDialog(t: ListingT) {
  return {
    title: t('cancelDialog.title'),
    body: (category: string, weight: string) => t('cancelDialog.body', { category, weight }),
    backLabel: t('cancelDialog.back'),
    confirmLabel: t('cancelDialog.confirm'),
  }
}

export function deleteDialog(t: ListingT) {
  return {
    title: t('deleteDialog.title'),
    body: (category: string, weight: string) => t('deleteDialog.body', { category, weight }),
    backLabel: t('deleteDialog.back'),
    confirmLabel: t('deleteDialog.confirm'),
  }
}

export type ListingDrawerContent = ReturnType<typeof listingDrawer>
export type EditListingContent = ReturnType<typeof editListing>

// Opens a map search for the pickup point. Swap for the PPI's coordinates once they're stored.
export function mapHref(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
}
