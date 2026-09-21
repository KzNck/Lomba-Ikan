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
  freshness: string
  usage: string
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
    breadcrumb: t('title'),
    title: t('title'),
    subtitle: t('subtitle'),
    addAction: { href: '/nelayan/catat', label: t('addAction') },
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
    // Shown when there are no active listings (the "Aktif kosong" state).
    empty: {
      panelTitle: t('active.panelTitle'),
      title: t('active.emptyTitle'),
      description: t('active.emptyDescription'),
      action: { href: '/nelayan/catat', label: t('active.emptyAction') },
    } satisfies EmptyTabContent,
  }
}

export function closedTab(t: ListingT) {
  return {
    label: t('closed.label'),
    detailLabel: t('closed.detailLabel'),
    // Not in the export: the tab has no empty state there, so this mirrors the "Aktif" one without the button.
    empty: {
      panelTitle: t('closed.panelTitle'),
      title: t('closed.emptyTitle'),
      description: t('closed.emptyDescription'),
    } satisfies EmptyTabContent,
  }
}

export function listingDrawer(t: ListingT) {
  return {
    title: t('drawer.title'),
    closeLabel: t('drawer.close'),
    metricLabels: { weight: t('weight'), pricePerKg: t('pricePerKg'), timeLeft: t('drawer.timeLeft') },
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

export type ListingDrawerContent = ReturnType<typeof listingDrawer>
export type EditListingContent = ReturnType<typeof editListing>

// Opens a map search for the pickup point. Swap for the PPI's coordinates once they're stored.
export function mapHref(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
}
