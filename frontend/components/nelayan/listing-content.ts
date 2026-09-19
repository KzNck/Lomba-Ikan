// All copy and imagery for "Listing Saya" (/nelayan/listing). Edit here to swap content without touching layout.
// The listings are the export's sample data until they come from Supabase. The export only details the first one;
// the other drawers' description, freshness, usage and photos are filled in to match their cards.
import type { ImageContent } from '@/components/home/hero'
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

export const LISTING_PAGE = {
  breadcrumb: 'Listing Saya',
  title: 'Listing Saya',
  subtitle: 'Kelola semua hasil tangkapan yang Anda daftarkan di platform.',
  addAction: { href: '/nelayan/catat', label: 'Tambah Tangkapan' },
  metricLabels: { weight: 'Berat', pricePerKg: 'Harga per kg' },
}

const IMAGES = {
  campuran: { src: '/images/nelayan/listing-ikan-campuran.jpg', alt: 'Tumpukan ikan campuran segar' },
  udang: { src: '/images/nelayan/listing-udang-rebon.jpg', alt: 'Udang rebon di atas piring putih' },
  cumi: { src: '/images/pembeli/rekomendasi-cumi-cumi.jpg', alt: 'Cumi-cumi segar' },
  pelagis: { src: '/images/nelayan/listing-ikan-pelagis-kecil.jpg', alt: 'Ikan pelagis kecil bakar di atas piring' },
  kakap: { src: '/images/pembeli/rekomendasi-ikan-kakap-merah.jpg', alt: 'Ikan kakap merah segar' },
} satisfies Record<string, ImageContent>

export const ACTIVE_TAB = {
  label: 'Aktif',
  detailLabel: 'Lihat detail',
  items: [
    {
      slug: 'ikan-campuran-pontang',
      image: IMAGES.campuran,
      category: 'Ikan Campuran (By-catch)',
      location: 'PPI Pontang, Kab. Serang',
      status: 'active',
      statusLabel: 'Aktif',
      grade: { label: 'Grade A1 · Hidup', condition: 'live' },
      weight: '45 kg',
      pricePerKg: 'Rp 8.000',
      footer: 'Sisa 2 j 15 mnt',
      detail: {
        description: 'Hasil tangkapan sampingan yang terdiri dari beberapa jenis ikan.',
        timeLeft: '2 j 15 mnt',
        freshness: 'Grade A1 · Hidup, Bagus · 92%',
        usage: 'Pakan Maggot (BSF), Silase Ikan',
        photos: [IMAGES.campuran, IMAGES.campuran, IMAGES.campuran, IMAGES.campuran],
      },
    },
    {
      slug: 'udang-rebon-karangsong',
      image: IMAGES.udang,
      category: 'Udang Rebon (By-catch)',
      location: 'PPI Karangsong, Indramayu',
      status: 'active',
      statusLabel: 'Aktif',
      grade: { label: 'Grade B2 · Mati', condition: 'dead' },
      weight: '30 kg',
      pricePerKg: 'Rp 15.000',
      footer: 'Sisa 5 j 40 mnt',
      detail: {
        description: 'Udang rebon kecil yang ikut terjaring bersama tangkapan utama.',
        timeLeft: '5 j 40 mnt',
        freshness: 'Grade B2 · Mati, Cukup · 71%',
        usage: 'Terasi, Pakan Ternak',
        photos: [IMAGES.udang, IMAGES.udang],
      },
    },
    {
      slug: 'cumi-cumi-tegal',
      image: IMAGES.cumi,
      category: 'Cumi-cumi / Sotong',
      location: 'PPI Tegal',
      status: 'active',
      statusLabel: 'Aktif',
      grade: { label: 'Grade B1 · Mati', condition: 'dead' },
      weight: '60 kg',
      pricePerKg: 'Rp 6.500',
      footer: 'Sisa 8 j 20 mnt',
      detail: {
        description: 'Cumi-cumi dan sotong berukuran kecil dari jaring malam.',
        timeLeft: '8 j 20 mnt',
        freshness: 'Grade B1 · Mati, Baik · 80%',
        usage: 'Umpan Pancing, Tepung Ikan',
        photos: [IMAGES.cumi, IMAGES.cumi, IMAGES.cumi],
      },
    },
    {
      slug: 'ikan-pelagis-kecil-cilacap',
      image: IMAGES.pelagis,
      category: 'Ikan Pelagis Kecil',
      location: 'PPI Cilacap',
      status: 'active',
      statusLabel: 'Aktif',
      grade: { label: 'Grade A1 · Hidup', condition: 'live' },
      weight: '80 kg',
      pricePerKg: 'Rp 6.500',
      footer: 'Sisa 11 j 10 mnt',
      detail: {
        description: 'Campuran teri, tembang dan lemuru dari tangkapan pagi.',
        timeLeft: '11 j 10 mnt',
        freshness: 'Grade A1 · Hidup, Bagus · 94%',
        usage: 'Ikan Asin, Pindang',
        photos: [IMAGES.pelagis, IMAGES.pelagis, IMAGES.pelagis, IMAGES.pelagis, IMAGES.pelagis],
      },
    },
    {
      slug: 'ikan-baronang-tanjung-priok',
      image: IMAGES.kakap,
      category: 'Ikan Baronang',
      location: 'PPI Tanjung Priok',
      status: 'active',
      statusLabel: 'Aktif',
      grade: { label: 'Grade A1 · Hidup', condition: 'live' },
      weight: '25 kg',
      pricePerKg: 'Rp 9.000',
      footer: 'Sisa 1 j 5 mnt',
      detail: {
        description: 'Baronang hasil tangkapan sampingan jaring karang.',
        timeLeft: '1 j 5 mnt',
        freshness: 'Grade A1 · Hidup, Bagus · 90%',
        usage: 'Konsumsi Langsung, Ikan Asap',
        photos: [IMAGES.kakap, IMAGES.kakap],
      },
    },
    {
      slug: 'ikan-campuran-bitung',
      image: IMAGES.campuran,
      category: 'Ikan Campuran (By-catch)',
      location: 'PPI Bitung',
      status: 'active',
      statusLabel: 'Aktif',
      grade: { label: 'Grade B2 · Mati', condition: 'dead' },
      weight: '70 kg',
      pricePerKg: 'Rp 7.000',
      footer: 'Sisa 6 j 30 mnt',
      detail: {
        description: 'Hasil tangkapan sampingan yang terdiri dari beberapa jenis ikan.',
        timeLeft: '6 j 30 mnt',
        freshness: 'Grade B2 · Mati, Cukup · 68%',
        usage: 'Pakan Maggot (BSF), Pupuk Organik',
        photos: [IMAGES.campuran, IMAGES.campuran, IMAGES.campuran],
      },
    },
  ] satisfies ActiveListing[],
  // Shown when `items` is empty (the "Aktif kosong" state).
  empty: {
    panelTitle: 'Listing Aktif Saya',
    title: 'Belum ada listing aktif',
    description: 'Catat tangkapan hari ini supaya pembeli di sekitar PPI bisa melihat dan menawarnya.',
    action: { href: '/nelayan/catat', label: 'Tambah tangkapan pertama' },
  },
}

export const CLOSED_TAB = {
  label: 'Terjual/Diambil',
  detailLabel: 'Lihat transaksi',
  items: [
    {
      href: '/nelayan/riwayat',
      image: IMAGES.cumi,
      category: 'Ikan Demersal',
      location: 'PPI Lampung',
      status: 'closed',
      statusLabel: 'Terjual',
      grade: { label: 'Grade B2 · Mati', condition: 'dead' },
      weight: '55 kg',
      pricePerKg: 'Rp 7.500',
      footer: 'Terjual 12 jam lalu',
    },
  ] satisfies ListingCardContent[],
  // Not in the export: the tab has no empty state there, so this mirrors the "Aktif" one without the button.
  empty: {
    panelTitle: 'Listing Terjual/Diambil',
    title: 'Belum ada listing terjual',
    description: 'Listing yang sudah terjual atau diambil pembeli akan muncul di sini.',
  },
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
