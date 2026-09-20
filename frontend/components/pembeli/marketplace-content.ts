// All copy for the marketplace (/marketplace). Edit here to swap content without touching layout.
// The batches themselves come from Supabase — rows are shaped for these components in lib/marketplace/batches.ts.
import { CATEGORY_STEP } from '@/components/nelayan/catch-content'

export const MARKETPLACE_PATH = '/marketplace'

export const MARKETPLACE = {
  title: 'Marketplace',
  subtitle: 'Temukan hasil laut berkualitas langsung dari nelayan.',
  search: {
    label: 'Cari batch',
    placeholder: 'Cari jenis ikan, PPI, atau kata kunci',
  },
  filtersLabel: 'Filter',
  resetLabel: 'Reset filter',
  resultCount: (count: number, ppi?: string) => `Menampilkan ${count} batch${ppi ? ` di ${ppi}` : ''}`,
}

// "Urutkan" options, in menu order. The first is the default. Sold batches always sort last.
export const SORT_OPTIONS = [
  { value: 'terdekat', label: 'Terdekat' },
  { value: 'kesegaran', label: 'Kesegaran tertinggi' },
  { value: 'terbaru', label: 'Terbaru' },
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]['value']

export const SORT_MENU = {
  buttonLabel: (option: string) => `Urutkan: ${option}`,
}

// Freshness grades from best to worst. A grade filter keeps everything from A1 down to the chosen grade.
export const GRADES = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'] as const
export type Grade = (typeof GRADES)[number]

// The same categories the catch wizard offers, so every listing falls under one of them.
export const CATEGORIES = CATEGORY_STEP.options.map(({ value, label }) => ({ value, label }))
export type Category = string

// The filters the marketplace opens with when the URL says nothing. "PPI prioritas" puts those PPIs' batches first
// rather than hiding the rest. "Reset filter" comes back here. The buyer's own saved preferences are not stored yet
// (no column for them), so these are the defaults for everyone — see the note in lib/supabase/auth.ts.
export const PREFERENCES: { maxGrade: Grade | null; categories: Category[]; priorityPpis: string[] } = {
  maxGrade: null,
  categories: [],
  priorityPpis: [],
}

// The three filter chips. The designer hasn't drawn the editing panels yet; they reuse the sort menu's style.
// `none` is the chip's value after its "x" removes the filter; the chip stays so it can be set again.
export const FILTERS = {
  grade: {
    icon: 'leaf',
    label: 'Grade',
    none: 'Semua grade',
    legend: 'Tampilkan grade',
    option: (grade: Grade) => (grade === 'A1' ? 'A1 saja' : `A1–${grade}`),
  },
  categories: {
    icon: 'fish',
    label: 'Jenis bahan',
    none: 'Semua jenis',
    legend: 'Tampilkan jenis bahan',
  },
  priority: {
    icon: 'map-pin',
    label: 'PPI prioritas',
    none: 'Tidak ada',
    legend: 'Tampilkan lebih dulu',
  },
  apply: 'Terapkan',
  editLabel: (label: string, value: string) => `Ubah filter ${label}: ${value}`,
  removeLabel: (label: string) => `Hapus filter ${label}`,
} as const

// The "Tidak ada hasil" state, shown when nothing matches the search and filters.
export const NO_RESULTS = {
  title: 'Tidak ada batch sesuai filter',
  body: (query: string) =>
    `Belum ada batch${query ? ` “${query}”` : ''} yang cocok dengan filter Anda. Coba longgarkan filter atau cari di PPI lain.`,
}

// How the catch is kept, shown in the drawer's grade badge and "Kondisi & Kesegaran".
export const CONDITIONS = {
  es: { icon: 'snowflake', label: 'Dingin (es)' },
  hidup: { icon: 'leaf', label: 'Hidup' },
} as const

// The "Detail Drawer" at /marketplace/<slug>, over the marketplace.
export const BATCH_DRAWER = {
  closeLabel: 'Tutup detail batch',
  gradeLabel: 'Grade',
  photoPrevLabel: 'Foto sebelumnya',
  photoNextLabel: 'Foto berikutnya',
  photoCounter: (current: number, total: number) => `${current} / ${total}`,
  weightLabel: 'Berat tersedia',
  totalLabel: 'Harga total',
  conditionTitle: 'Kondisi & Kesegaran',
  auctionLeft: (time: string) => `Sisa waktu lelang ${time}`,
  locationTitle: 'Lokasi',
  distance: (km: number) => `${km} km dari lokasi Anda`,
  usageTitle: 'Rekomendasi Penggunaan',
  infoTitle: 'Informasi Tambahan',
  infoLabels: { fisherman: 'Nelayan', method: 'Metode tangkap', batchNumber: 'No. batch' },
  buyLabel: (total: string) => `Beli sekarang · ${total}`,
  processingLabel: 'Memproses pembelian…',
  // "Batch sudah terjual": shown instead of the buy button once someone else has bought it.
  soldOut: {
    title: 'Maaf, batch ini sudah terjual',
    body: (category: string) =>
      `Pembeli lain menyelesaikan pembelian lebih dulu. Masih ada batch ${category.toLocaleLowerCase('id')} lain di PPI terdekat.`,
    action: 'Lihat batch serupa',
  },
}

// Where each PPI is, for the map. A PPI with no batches gets no marker.
export const PPI_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  'PPI Bitung': { lat: 1.4406, lng: 125.195 },
  'PPI Tanjung Priok': { lat: -6.1045, lng: 106.8053 },
  'PPI Benoa': { lat: -8.7454, lng: 115.2116 },
  'PPI Ambon': { lat: -3.6954, lng: 128.1814 },
  'PPI Cilacap': { lat: -7.727, lng: 109.008 },
}

export const PPI_MAP = {
  label: 'Peta PPI',
  markerDetail: (count: number) => `${count} batch tersedia`,
  // Screen-reader name for a marker; clicking one filters the results to that PPI, clicking it again clears it.
  markerLabel: (name: string, detail: string, selected: boolean) =>
    `${name}, ${detail}. ${selected ? 'Tampilkan semua PPI' : `Tampilkan batch di ${name}`}`,
  zoomInLabel: 'Perbesar peta',
  zoomOutLabel: 'Perkecil peta',
  locateLabel: 'Tampilkan lokasi saya',
  locating: 'Mencari lokasi Anda…',
  locateError: 'Lokasi Anda tidak bisa ditemukan. Izinkan akses lokasi di browser, lalu coba lagi.',
  loading: 'Memuat peta…',
  // OpenStreetMap's standard tiles: no API key, fine for development and light use. For production traffic, point
  // this at a tile provider you have an account with (OSM's tile policy asks heavy users to). Swap URL and
  // attribution together.
  tiles: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
}
