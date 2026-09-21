// lib/marketplace/batches.ts
//
// Membentuk "batch" marketplace dari row `catches` yang berstatus LISTED,
// lengkap dengan nama nelayan dan jarak dari PPI prioritas pembeli.

import type { ImageContent } from '@/components/home/hero'
import type { ProductCardContent } from '@/components/pembeli/product-card'
import { MARKETPLACE_PATH, PPI_LOCATIONS, type Condition } from '@/components/pembeli/marketplace-content'
import type { FreshnessT } from '@/components/nelayan/freshness-content'
import { getTranslations } from 'next-intl/server'
import {
  catchImage,
  categoryLabel,
  formatRupiah,
  formatWeight,
  gradeCondition,
  storageLabel,
  timeAgo,
  timeLeft,
  type Presenter,
} from '@/lib/catches/present'
import { getPresenter } from '@/lib/i18n/presenter'
import type { Translator } from '@/lib/i18n/translator'
import { recommendationsFor } from '@/lib/catches/recommendations'
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

// `t` is the marketplace's batch copy; `freshness` names the derived recommended uses.
type BatchCopy = { t: Translator<'dashboard.pembeli.marketplace.batch'>; freshness: FreshnessT }

export function toBatch(
  p: Presenter,
  { t, freshness }: BatchCopy,
  entry: Catch,
  seller: Profile | undefined,
  origin: string | null
): Batch {
  const weightKg = Number(entry.weight_kg)
  const pricePerKg = entry.price_per_kg === null ? 0 : Number(entry.price_per_kg)
  const total = weightKg * pricePerKg
  const distanceKm = distanceFrom(origin, entry.catch_location)
  const remaining = timeLeft(p, entry.expires_at)
  const image = catchImage(p, entry)

  return {
    slug: entry.id,
    href: `${MARKETPLACE_PATH}/${entry.id}`,
    image,
    name: categoryLabel(p, entry.species),
    category: entry.species,
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
      // The model's own recommendation when it graded this catch; the derived
      // list stands in for anything it has not looked at yet.
      usage:
        entry.hilirisasi_recommendation ??
        recommendationsFor(freshness, entry)
          .map((option) => option.title)
          .join(', '),
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
  const profile = await requireProfile('pembeli')
  const listed = await getListedCatches()
  const [sellers, p, t, freshness] = await Promise.all([
    getProfileNames(listed.map((entry) => entry.nelayan_id)),
    getPresenter(),
    getTranslations('dashboard.pembeli.marketplace.batch'),
    getTranslations('dashboard.nelayan.freshness'),
  ])
  return listed.map((entry) => toBatch(p, { t, freshness }, entry, sellers.get(entry.nelayan_id), profile.ppi_location))
}
