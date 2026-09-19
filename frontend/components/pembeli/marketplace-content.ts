// All copy and imagery for the marketplace (/marketplace). Edit here to swap content without touching layout.
// Batches, filters and map markers are the export's sample data until they come from Supabase.
import type { ImageContent } from '@/components/home/hero'
import type { ProductCardContent } from '@/components/pembeli/product-card'

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

export const CATEGORIES = [
  { value: 'ikan', label: 'Ikan' },
  { value: 'udang', label: 'Udang' },
  { value: 'cumi', label: 'Cumi-cumi' },
] as const
export type Category = (typeof CATEGORIES)[number]['value']

// The buyer's saved preferences (set at registration): the filters the marketplace opens with. "PPI prioritas" puts
// those PPIs' batches first rather than hiding the rest, which is why the design lists Benoa, Ambon and Cilacap
// batches under it. "Reset filter" comes back here.
export const PREFERENCES: { maxGrade: Grade | null; categories: Category[]; priorityPpis: string[] } = {
  maxGrade: 'B3',
  categories: ['ikan', 'udang', 'cumi'],
  priorityPpis: ['PPI Bitung', 'PPI Tanjung Priok'],
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

// `distanceKm` is from the buyer's registered address (it drives "Terdekat"); `listedAt` drives "Terbaru". Weight and
// price are numbers so the card's total and the drawer's "Harga total" are worked out rather than typed twice.
// Only Ikan Cakalang's drawer details are from the export; the others are sample values in the same shape.
type BatchData = {
  slug: string
  image: ImageContent
  name: string
  grade: Grade
  category: Category
  status: 'active' | 'sold'
  weightKg: number
  pricePerKg: number
  distanceKm: number
  listedAt: string
  location: string
  detail: {
    condition: keyof typeof CONDITIONS
    caught: string
    // Time left on the auction; sold batches have none.
    auctionLeft?: string
    usage: string
    fisherman: string
    method: string
    batchNumber: string
    // The drawer's carousel. The first is the card photo.
    photos: ImageContent[]
  }
}

// How the catch is kept, shown in the drawer's grade badge and "Kondisi & Kesegaran".
export const CONDITIONS = {
  es: { icon: 'snowflake', label: 'Dingin (es)' },
  hidup: { icon: 'leaf', label: 'Hidup' },
} as const

const BATCH_DATA: BatchData[] = [
  {
    slug: 'tuna-sirip-kuning',
    image: { src: '/images/pembeli/rekomendasi-tuna-sirip-kuning.jpg', alt: 'Tuna sirip kuning segar' },
    name: 'Tuna Sirip Kuning',
    grade: 'A1',
    category: 'ikan',
    status: 'active',
    weightKg: 12,
    pricePerKg: 48000,
    distanceKm: 8,
    listedAt: '2026-09-19T05:40:00+07:00',
    location: 'PPI Bitung',
    detail: {
      condition: 'es',
      caught: 'Ditangkap 8 jam lalu',
      auctionLeft: '3 j 20 mnt',
      usage: 'Cocok untuk olahan sashimi, steak ikan, dan pengalengan.',
      fisherman: 'Pak Yohanis Mandagi',
      method: 'Pancing ulur',
      batchNumber: 'BL-2025-0138',
      photos: [{ src: '/images/pembeli/rekomendasi-tuna-sirip-kuning.jpg', alt: 'Tuna sirip kuning segar' }],
    },
  },
  {
    slug: 'ikan-cakalang',
    image: { src: '/images/pembeli/rekomendasi-ikan-cakalang.jpg', alt: 'Ikan cakalang segar' },
    name: 'Ikan Cakalang',
    grade: 'B2',
    category: 'ikan',
    status: 'active',
    weightKg: 20,
    pricePerKg: 32000,
    distanceKm: 15,
    listedAt: '2026-09-19T07:15:00+07:00',
    location: 'PPI Tanjung Priok',
    detail: {
      condition: 'es',
      caught: 'Ditangkap 1 hari lalu',
      auctionLeft: '5 j 40 mnt',
      usage: 'Cocok untuk pakan maggot (BSF) dan silase ikan.',
      fisherman: 'Pak Budi Santoso',
      method: 'Pancing',
      batchNumber: 'BL-2025-0142',
      photos: [{ src: '/images/pembeli/rekomendasi-ikan-cakalang.jpg', alt: 'Ikan cakalang segar' }],
    },
  },
  {
    slug: 'cumi-cumi',
    image: { src: '/images/pembeli/rekomendasi-cumi-cumi.jpg', alt: 'Cumi-cumi segar' },
    name: 'Cumi-Cumi',
    grade: 'B1',
    category: 'cumi',
    status: 'active',
    weightKg: 15,
    pricePerKg: 55000,
    distanceKm: 12,
    listedAt: '2026-09-18T21:30:00+07:00',
    location: 'PPI Benoa',
    detail: {
      condition: 'es',
      caught: 'Ditangkap 14 jam lalu',
      auctionLeft: '6 j 10 mnt',
      usage: 'Cocok untuk olahan cumi goreng tepung dan cumi kering.',
      fisherman: 'Pak Made Suarta',
      method: 'Jaring lampu (bagan)',
      batchNumber: 'BL-2025-0131',
      photos: [{ src: '/images/pembeli/rekomendasi-cumi-cumi.jpg', alt: 'Cumi-cumi segar' }],
    },
  },
  {
    slug: 'ikan-kakap-merah',
    image: { src: '/images/pembeli/rekomendasi-ikan-kakap-merah.jpg', alt: 'Ikan kakap merah segar' },
    name: 'Ikan Kakap Merah',
    grade: 'A3',
    category: 'ikan',
    status: 'active',
    weightKg: 10,
    pricePerKg: 62000,
    distanceKm: 20,
    listedAt: '2026-09-19T06:05:00+07:00',
    location: 'PPI Ambon',
    detail: {
      condition: 'es',
      caught: 'Ditangkap 10 jam lalu',
      auctionLeft: '4 j 15 mnt',
      usage: 'Cocok untuk restoran: fillet, bakar, dan sup ikan.',
      fisherman: 'Pak Samuel Latuihamallo',
      method: 'Pancing dasar',
      batchNumber: 'BL-2025-0140',
      photos: [{ src: '/images/pembeli/rekomendasi-ikan-kakap-merah.jpg', alt: 'Ikan kakap merah segar' }],
    },
  },
  {
    slug: 'ikan-tenggiri',
    image: { src: '/images/marketplace/ikan-tenggiri.jpg', alt: 'Ikan tenggiri di atas es' },
    name: 'Ikan Tenggiri',
    grade: 'B3',
    category: 'ikan',
    status: 'active',
    weightKg: 18,
    pricePerKg: 70000,
    distanceKm: 25,
    listedAt: '2026-09-18T19:50:00+07:00',
    location: 'PPI Cilacap',
    detail: {
      condition: 'es',
      caught: 'Ditangkap 1 hari lalu',
      auctionLeft: '2 j 50 mnt',
      usage: 'Cocok untuk bahan baku pempek, otak-otak, dan kerupuk ikan.',
      fisherman: 'Pak Sutrisno',
      method: 'Jaring insang',
      batchNumber: 'BL-2025-0129',
      photos: [{ src: '/images/marketplace/ikan-tenggiri.jpg', alt: 'Ikan tenggiri di atas es' }],
    },
  },
  {
    slug: 'ikan-kerapu',
    image: { src: '/images/pembeli/rekomendasi-ikan-kakap-merah.jpg', alt: 'Ikan kakap merah segar' },
    name: 'Ikan Kerapu',
    grade: 'A1',
    category: 'ikan',
    status: 'active',
    weightKg: 7,
    pricePerKg: 90000,
    distanceKm: 8,
    listedAt: '2026-09-19T08:20:00+07:00',
    location: 'PPI Bitung',
    detail: {
      condition: 'hidup',
      caught: 'Ditangkap 4 jam lalu',
      auctionLeft: '7 j 30 mnt',
      usage: 'Cocok untuk restoran seafood hidup dan ekspor.',
      fisherman: 'Pak Yohanis Mandagi',
      method: 'Bubu',
      batchNumber: 'BL-2025-0145',
      photos: [{ src: '/images/pembeli/rekomendasi-ikan-kakap-merah.jpg', alt: 'Ikan kakap merah segar' }],
    },
  },
  {
    slug: 'udang-windu',
    image: { src: '/images/marketplace/udang-windu.jpg', alt: 'Udang kupas segar' },
    name: 'Udang Windu',
    grade: 'A3',
    category: 'udang',
    status: 'active',
    weightKg: 12,
    pricePerKg: 80000,
    distanceKm: 15,
    listedAt: '2026-09-19T04:10:00+07:00',
    location: 'PPI Tanjung Priok',
    detail: {
      condition: 'es',
      caught: 'Ditangkap 12 jam lalu',
      auctionLeft: '5 j 5 mnt',
      usage: 'Cocok untuk olahan udang beku dan restoran.',
      fisherman: 'Pak Rahmat Hidayat',
      method: 'Jaring trammel',
      batchNumber: 'BL-2025-0136',
      photos: [{ src: '/images/marketplace/udang-windu.jpg', alt: 'Udang kupas segar' }],
    },
  },
  {
    slug: 'cumi-cumi-jumbo',
    image: { src: '/images/pembeli/rekomendasi-cumi-cumi.jpg', alt: 'Cumi-cumi segar' },
    name: 'Cumi-Cumi Jumbo',
    grade: 'B2',
    category: 'cumi',
    status: 'active',
    weightKg: 9,
    pricePerKg: 68000,
    distanceKm: 10,
    listedAt: '2026-09-18T23:45:00+07:00',
    location: 'PPI Bitung',
    detail: {
      condition: 'es',
      caught: 'Ditangkap 18 jam lalu',
      auctionLeft: '3 j 45 mnt',
      usage: 'Cocok untuk cumi isi, bakar, dan olahan beku.',
      fisherman: 'Pak Frans Rumengan',
      method: 'Pancing cumi',
      batchNumber: 'BL-2025-0133',
      photos: [{ src: '/images/pembeli/rekomendasi-cumi-cumi.jpg', alt: 'Cumi-cumi segar' }],
    },
  },
  {
    slug: 'udang-vaname',
    image: { src: '/images/marketplace/udang-vaname.webp', alt: 'Udang kupas segar' },
    name: 'Udang Vaname',
    grade: 'A2',
    category: 'udang',
    status: 'sold',
    weightKg: 8,
    pricePerKg: 75000,
    distanceKm: 8,
    listedAt: '2026-09-18T18:00:00+07:00',
    location: 'PPI Bitung',
    detail: {
      condition: 'es',
      caught: 'Ditangkap 1 hari lalu',
      usage: 'Cocok untuk olahan udang beku dan dimsum.',
      fisherman: 'Pak Frans Rumengan',
      method: 'Jaring trammel',
      batchNumber: 'BL-2025-0127',
      photos: [{ src: '/images/marketplace/udang-vaname.webp', alt: 'Udang kupas segar' }],
    },
  },
]

const rupiah = (amount: number) => `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`

// The batches with everything the card and the drawer print, worked out from the numbers above.
export const BATCHES = BATCH_DATA.map((batch) => {
  const total = batch.weightKg * batch.pricePerKg
  return {
    ...batch,
    href: `${MARKETPLACE_PATH}/${batch.slug}`,
    statusLabel: batch.status === 'sold' ? 'Terjual' : 'Aktif',
    actionLabel: batch.status === 'sold' ? 'Stok habis' : 'Beli sekarang',
    weight: `${batch.weightKg} kg`,
    distance: `${batch.distanceKm} km`,
    price: `${rupiah(batch.pricePerKg)}/kg`,
    totalPrice: rupiah(total),
    total: `Total ${rupiah(total)}`,
  } satisfies ProductCardContent & Record<string, unknown>
})

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
