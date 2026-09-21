// All copy for "Listing Saya" (/nelayan/listing). Edit here to swap content without touching layout.
// The listings themselves come from Supabase — rows are shaped for these components in lib/catches/present.ts.
import type { ImageContent } from '@/components/home/hero'
import type { NavItem } from '@/components/home/navbar'
import type { ListingCardContent } from '@/components/nelayan/listing-card'

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
  // On a catch that was graded but never published: reopens its "Hasil Kesegaran" result, where it is published.
  publishLabel: 'Pasang ke listing',
  publishHref: (id: string) => `/nelayan/catat/hasil?id=${id}`,
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
  editLabel: 'Edit listing',
  cancelLabel: 'Batalkan listing',
  note: 'Listing tetap aktif sampai terjual atau Anda batalkan.',
}

// The drawer's edit mode (?detail=<id>&ubah=1). Only the weight and price change: the category, grade and photos come
// from the freshness assessment, so editing them would leave a grade that no longer matches the catch.
export const EDIT_LISTING = {
  title: 'Edit Listing',
  closeLabel: 'Tutup edit listing',
  intro: 'Ubah berat atau harga. Kategori, grade, dan foto berasal dari penilaian kesegaran, jadi tidak bisa diubah.',
  weight: {
    name: 'berat',
    label: 'Berat',
    helper: 'Perkiraan berat tangkapan, 1–200 kg.',
    suffix: 'kg',
  },
  // Min and max match the "Tambah Tangkapan" volume step.
  minWeight: 1,
  maxWeight: 200,
  errors: {
    weight: 'Masukkan berat antara 1 dan 200 kg, contoh 5 atau 5,5.',
    price: 'Masukkan harga dalam angka saja, contoh 8000.',
    // The listing was claimed, sold or cancelled while the form was open.
    notListed: 'Listing ini sudah tidak aktif, jadi tidak bisa diubah lagi.',
    saveFailed: 'Perubahan belum tersimpan. Periksa koneksi internet Anda, lalu coba simpan lagi.',
  },
  cancelLabel: 'Batal',
  saveLabel: 'Simpan perubahan',
  savingLabel: 'Menyimpan…',
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
