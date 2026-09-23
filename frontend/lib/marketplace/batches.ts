// Membentuk "batch" marketplace dari row `catches` yang berstatus LISTED,
// lengkap dengan nama nelayan, letak PPI-nya di peta, dan jaraknya dari
// pembeli (dari PPI pembeli, atau pusat kabupaten/kota yang ia daftarkan).

import type { ImageContent } from '@/components/home/hero'
import type { ProductCardContent } from '@/components/pembeli/product-card'
import { MARKETPLACE_PATH, type Condition } from '@/components/pembeli/marketplace-content'
import { getTranslations } from 'next-intl/server'
import {
  catchImage,
  categoryLabel,
  formatRupiah,
  formatWeight,
  gradeCondition,
  isCategory,
  storageLabel,
  timeAgo,
  timeLeft,
  usageLabel,
  type Presenter,
} from '@/lib/catches/present'
import { getPresenter } from '@/lib/i18n/presenter'
import type { Translator } from '@/lib/i18n/translator'
import { getListedCatches } from '@/lib/supabase/catches'
import { getProfileNames, type ProfileName } from '@/lib/supabase/profiles'
import { getSessionUser, requireProfile } from '@/lib/supabase/auth'
import { getKoordinatPelabuhan, type LatLng } from '@/lib/wilayah'
import { getKoordinatKabKota } from '@/lib/wilayah/koordinat'
import type { Catch } from '@/types/database'

export type Batch = ProductCardContent & {
  slug: string
  // The catch category (the wizard's values), which the "Jenis bahan" filter matches on.
  category: string
  weightKg: number
  pricePerKg: number
  // The batch's whole value, without the card's "Total " prefix — the drawer prints it on its own.
  totalPrice: string
  // null when either end has no known coordinates, which sorts it last under "Terdekat".
  distanceKm: number | null
  listedAt: string
  // The PPI's name, and where it is; null for a name that isn't a known port (the batch then has no map pin).
  location: string
  coords: LatLng | null
  detail: {
    condition: Condition
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

/** Jarak lingkaran besar antara dua titik, dalam kilometer. */
function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)))
}

/** Kondisi yang ditampilkan drawer, dari grade dan cara penyimpanannya. */
function conditionOf(entry: Catch): Condition {
    return gradeCondition(entry.freshness_grade) === 'live' && entry.storage_method !== 'ambient'
        ? 'hidup'
        : 'es'
}

/** Nomor batch yang enak dibaca, dari tahun dan potongan awal UUID row. */
export function batchNumber(entry: Pick<Catch, 'id' | 'created_at'>): string {
  return `BL-${new Date(entry.created_at).getFullYear()}-${entry.id.slice(0, 4).toUpperCase()}`
}

// The marketplace's batch copy.
type BatchCopy = { t: Translator<'dashboard.pembeli.marketplace.batch'> }

export function toBatch(
  p: Presenter,
  { t }: BatchCopy,
  entry: Catch,
  seller: ProfileName | undefined,
  // Where the buyer is; null leaves every distance unknown.
  origin: LatLng | null
): Batch {
  const weightKg = Number(entry.weight_kg)
  const pricePerKg = entry.price_per_kg === null ? 0 : Number(entry.price_per_kg)
  const total = weightKg * pricePerKg
  const coords = getKoordinatPelabuhan(entry.catch_location)
  const distanceKm = origin && coords ? haversineKm(origin, coords) : null
  const remaining = timeLeft(p, entry.expires_at)
  const image = catchImage(p, entry)

  return {
    slug: entry.id,
    href: `${MARKETPLACE_PATH}/${entry.id}`,
    image,
    name: categoryLabel(p, entry.species),
    // A name typed for "Lainnya" ("Ikan Kakap") is filtered as "Lainnya"; its card still shows the name.
    category: isCategory(entry.species) ? entry.species : 'lainnya',
    // "—" for a catch the AI has not graded yet; the badge falls back to the neutral tone.
    grade: entry.freshness_grade ?? '—',
    status: 'active',
    statusLabel: t('active'),
    actionLabel: t('buyNow'),
    weightKg,
    pricePerKg,
    distanceKm,
    listedAt: entry.listed_at ?? entry.created_at,
    location: entry.catch_location,
    coords,
    weight: formatWeight(p, weightKg),
    distance: distanceKm === null ? '—' : `${distanceKm} km`,
    // No price yet (it follows the auction): say so, rather than "Belum diatur/kg".
    price: entry.price_per_kg === null ? t('priceUnset') : t('perKg', { price: formatRupiah(p, entry.price_per_kg) }),
    totalPrice: total > 0 ? formatRupiah(p, total) : t('auctionPrice'),
    total: total > 0 ? t('total', { price: formatRupiah(p, total) }) : t('auctionPrice'),
    detail: {
      condition: conditionOf(entry),
      caught: t('caught', { ago: timeAgo(p, entry.catch_time) }),
      auctionLeft: remaining ?? undefined,
      // The recommendation sentence for this grade, in the active language (see usageLabel).
      usage: usageLabel(p, entry),
      fisherman: seller?.full_name ?? t('registeredFisher'),
      // Metode tangkap belum ada kolomnya; yang tercatat baru cara penyimpanannya.
      method: storageLabel(p, entry.storage_method),
      batchNumber: batchNumber(entry),
      photos: [image],
    },
  }
}

/** Total harga satu batch, dipakai saat klaim/escrow. */
export function batchTotal(batch: Batch): number {
  return batch.weightKg * batch.pricePerKg
}

/** Semua batch yang tampil di marketplace, untuk pembeli yang sedang login. */
export async function loadBatches(): Promise<Batch[]> {
  const [profile, user] = await Promise.all([requireProfile('pembeli'), getSessionUser()])
  const listed = await getListedCatches()
  // The buyer's own PPI when they picked one, else the centre of the kabupaten/kota they registered.
  const kabKota = user?.metadata.kab_kota
  const origin = getKoordinatPelabuhan(profile.ppi_location) ?? getKoordinatKabKota(typeof kabKota === 'string' ? kabKota : null)
  const [sellers, p, t] = await Promise.all([
    getProfileNames(listed.map((entry) => entry.nelayan_id)),
    getPresenter(),
    getTranslations('dashboard.pembeli.marketplace.batch'),
  ])
  return listed.map((entry) => toBatch(p, { t }, entry, sellers.get(entry.nelayan_id), origin))
}
