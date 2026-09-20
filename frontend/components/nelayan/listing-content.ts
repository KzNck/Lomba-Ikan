// All copy for "Listing Saya" (/nelayan/listing). Edit here to swap content without touching layout.
// The listings themselves come from Supabase — rows are shaped for these components in lib/catches/present.ts.
import type { ImageContent } from '@/components/home/hero'
import type { NavItem } from '@/components/home/navbar'
import type { ListingCardContent } from '@/components/nelayan/listing-card'

export const LISTING_PATH = '/nelayan/listing'

export type ListingDetailContent = {
  description: string
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

export const LISTING_PAGE = {
  breadcrumb: 'Listing Saya',
  title: 'Listing Saya',
  subtitle: 'Kelola semua hasil tangkapan yang Anda daftarkan di platform.',
  addAction: { href: '/nelayan/catat', label: 'Tambah Tangkapan' },
  metricLabels: { weight: 'Berat', pricePerKg: 'Harga per kg' },
}

export const ACTIVE_TAB = {
  label: 'Aktif',
  detailLabel: 'Lihat detail',
  // Also the heading of the loading state's panel.
  panelTitle: 'Listing Aktif Saya',
  // Shown when there are no active listings (the "Aktif kosong" state).
  empty: {
    panelTitle: 'Listing Aktif Saya',
    title: 'Belum ada listing aktif',
    description: 'Catat tangkapan hari ini supaya pembeli di sekitar PPI bisa melihat dan menawarnya.',
    action: { href: '/nelayan/catat', label: 'Tambah tangkapan pertama' },
  } satisfies EmptyTabContent,
}

export const CLOSED_TAB = {
  label: 'Terjual/Diambil',
  detailLabel: 'Lihat transaksi',
  // Not in the export: the tab has no empty state there, so this mirrors the "Aktif" one without the button.
  empty: {
    panelTitle: 'Listing Terjual/Diambil',
    title: 'Belum ada listing terjual',
    description: 'Listing yang sudah terjual atau diambil pembeli akan muncul di sini.',
  } satisfies EmptyTabContent,
}

export const LISTING_DRAWER = {
  title: 'Detail Listing',
  closeLabel: 'Tutup detail listing',
  metricLabels: { weight: 'Berat', pricePerKg: 'Harga per kg', timeLeft: 'Sisa waktu' },
  locationLabel: 'Lokasi pengambilan',
  mapLabel: 'Lihat peta',
  freshnessLabel: 'Estimasi kesegaran',
  usageLabel: 'Rekomendasi penggunaan',
  photosLabel: 'Foto',
  // Read after the "+N" tile's count by screen readers only.
  morePhotosLabel: 'foto lainnya',
  // No edit screen exists yet, so the button renders disabled. Add `href` once one does and it becomes a link.
  editAction: { label: 'Edit listing' } as { label: string; href?: string },
  cancelLabel: 'Batalkan listing',
  note: 'Listing tetap aktif sampai terjual atau Anda batalkan.',
}

export const CANCEL_DIALOG = {
  title: 'Batalkan listing ini?',
  body: (category: string, weight: string) =>
    `Pembeli tidak bisa lagi menawar ${category} ${weight}, dan tawaran yang sudah masuk ikut dibatalkan.`,
  backLabel: 'Kembali',
  confirmLabel: 'Batalkan listing',
}

// Opens a map search for the pickup point. Swap for the PPI's coordinates once they're stored.
export function mapHref(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
}
