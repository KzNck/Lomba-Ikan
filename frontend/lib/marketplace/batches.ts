// lib/marketplace/batches.ts
//
// Membentuk "batch" marketplace dari row `catches` yang berstatus LISTED,
// lengkap dengan nama nelayan dan jarak dari PPI prioritas pembeli.

import type { ImageContent } from '@/components/home/hero'
import type { ProductCardContent } from '@/components/pembeli/product-card'
import { CONDITIONS, MARKETPLACE_PATH, PPI_LOCATIONS } from '@/components/pembeli/marketplace-content'
import { catchImage, categoryLabel, formatRupiah, formatWeight, timeAgo, timeLeft } from '@/lib/catches/present'
import { recommendationsFor } from '@/lib/catches/recommendations'
import { displaySubgrade } from '@/lib/freshness/client'
import { getListedCatches } from '@/lib/supabase/catches'
import { getProfileNames } from '@/lib/supabase/profiles'
import { requireProfile } from '@/lib/supabase/auth'
import type { Catch, Profile } from '@/types/database'

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

/** Jarak lingkaran besar antara dua titik, dalam kilometer. */
function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)))
}

/**
 * Jarak dari PPI prioritas pembeli ke PPI batch. Hanya bisa dihitung kalau
 * koordinat kedua PPI ada di PPI_LOCATIONS — data pelabuhan nasional di
 * lib/wilayah belum menyimpan koordinat.
 */
function distanceFrom(origin: string | null, location: string): number | null {
  if (!origin) return null
  const from = PPI_LOCATIONS[origin]
  const to = PPI_LOCATIONS[location]
  if (!from || !to) return null
  return haversineKm(from, to)
}

/** Metode penyimpanan (nilai dari wizard) → kondisi yang ditampilkan drawer. */
function conditionOf(entry: Catch): keyof typeof CONDITIONS {
  return entry.freshness_grade === 'A' && entry.storage_method !== 'tanpa' ? 'hidup' : 'es'
}

/** Nomor batch yang enak dibaca, dari tahun dan potongan awal UUID row. */
function batchNumber(entry: Catch): string {
  return `BL-${new Date(entry.created_at).getFullYear()}-${entry.id.slice(0, 4).toUpperCase()}`
}

export function toBatch(entry: Catch, seller: Profile | undefined, origin: string | null): Batch {
  const weightKg = Number(entry.weight_kg)
  const pricePerKg = entry.price_per_kg === null ? 0 : Number(entry.price_per_kg)
  const total = weightKg * pricePerKg
  const distanceKm = distanceFrom(origin, entry.catch_location)
  const remaining = timeLeft(entry.expires_at)
  const image = catchImage(entry)

  return {
    slug: entry.id,
    href: `${MARKETPLACE_PATH}/${entry.id}`,
    image,
    name: categoryLabel(entry.species),
    category: entry.species,
    // "—" for a catch the AI has not graded yet; the badge falls back to the neutral tone.
    grade: displaySubgrade(entry.freshness_grade, entry.freshness_score) ?? '—',
    status: 'active',
    statusLabel: 'Aktif',
    actionLabel: 'Beli sekarang',
    weightKg,
    pricePerKg,
    distanceKm,
    listedAt: entry.listed_at ?? entry.created_at,
    location: entry.catch_location,
    weight: formatWeight(weightKg),
    distance: distanceKm === null ? '—' : `${distanceKm} km`,
    price: `${formatRupiah(entry.price_per_kg)}/kg`,
    totalPrice: total > 0 ? formatRupiah(total) : 'Harga lelang',
    total: total > 0 ? `Total ${formatRupiah(total)}` : 'Harga lelang',
    detail: {
      condition: conditionOf(entry),
      caught: `Ditangkap ${timeAgo(entry.catch_time)}`,
      auctionLeft: remaining ?? undefined,
      usage: recommendationsFor(entry)
        .map((option) => option.title)
        .join(', '),
      fisherman: seller?.full_name ?? 'Nelayan terdaftar',
      // Metode tangkap belum ada kolomnya; yang tercatat baru cara penyimpanannya.
      method: entry.storage_method === 'tanpa' ? 'Tanpa es' : `Es ${entry.storage_method}`,
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
  const profile = await requireProfile('pembeli')
  const listed = await getListedCatches()
  const sellers = await getProfileNames(listed.map((entry) => entry.nelayan_id))
  return listed.map((entry) => toBatch(entry, sellers.get(entry.nelayan_id), profile.ppi_location))
}
