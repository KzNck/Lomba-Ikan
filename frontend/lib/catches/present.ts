// lib/catches/present.ts
//
// Menerjemahkan row `catches` dari Supabase ke bentuk yang dipakai komponen UI.
// Semua pemformatan (rupiah, berat, sisa waktu, grade) berkumpul di sini supaya
// kartu di dashboard, "Listing Saya", dan marketplace menampilkan hal yang sama.
// Kode di database (kategori, grade, status, cara simpan) tetap kode; teksnya
// diambil dari messages/*.json (`common`) sesuai bahasa aktif lewat `Presenter`.

import type { createFormatter } from 'next-intl'
import type { ImageContent } from '@/components/home/hero'
import type { ListingCardContent } from '@/components/nelayan/listing-card'
import type { ActiveListing } from '@/components/nelayan/listing-content'
import { CATEGORY_OPTIONS } from '@/components/nelayan/catch-content'
import type { Translator } from '@/lib/i18n/translator'
import type { Catch, FreshnessGrade, StorageMethod } from '@/types/database'

/** Pesan `common` dan formatter bahasa aktif. Di server: `await getPresenter()` (lib/i18n/presenter.ts). */
export type Presenter = {
  t: Translator<'common'>
  format: ReturnType<typeof createFormatter>
}

/** Kategori dari wizard "Tambah Tangkapan" — nilainya yang tersimpan di kolom `species`. */
const CATEGORIES = [
  'campuran',
  'teri',
  'udang',
  'cumi-cumi-sotong',
  'ikan-pelagis-kecil',
  'ikan-demersal',
  'rajungan',
  'lainnya',
] as const
type Category = (typeof CATEGORIES)[number]

/** Satu dari kategori wizard; selain itu nama yang diketik nelayan untuk "Lainnya". */
export const isCategory = (species: string): species is Category => CATEGORIES.includes(species as Category)

const CATEGORY_IMAGE = new Map<string, string>(
  CATEGORY_OPTIONS.flatMap((option): [string, string][] => ('image' in option ? [[option.value, option.image]] : []))
)

// Kategori "Lainnya" tidak punya foto sendiri; pakai foto campuran sebagai penampung.
const FALLBACK_IMAGE = '/images/nelayan/kategori/campuran.jpg'

/** Nama kategori yang enak dibaca. Species di luar daftar ditampilkan apa adanya. */
export function categoryLabel({ t }: Presenter, species: string): string {
  return isCategory(species) ? t(`category.${species}`) : species
}

/**
 * Foto listing: foto asli dari nelayan kalau ada, kalau tidak foto kategori.
 * Alt text-nya menyebut kategori supaya tetap berguna di kedua kasus.
 */
export function catchImage(p: Presenter, entry: Pick<Catch, 'photo_url' | 'species'>): ImageContent {
  const category = categoryLabel(p, entry.species)
  return {
    src: entry.photo_url || CATEGORY_IMAGE.get(entry.species) || FALLBACK_IMAGE,
    alt: entry.photo_url ? p.t('catchImage.photo', { category }) : p.t('catchImage.illustration', { category }),
  }
}

/**
 * Grade A berarti ikan masih hidup, B sudah mati — mengikuti pengelompokan di
 * form preferensi pembeli ("Hidup (Grade A)" / "Mati (Grade B)"). Angkanya
 * (A1…A3) menyatakan seberapa baik kondisinya dalam kelompok itu.
 */
export function gradeCondition(grade: FreshnessGrade | null): 'live' | 'dead' {
  return grade?.startsWith('A') ? 'live' : 'dead'
}

/** "Grade A1 · Hidup". Tangkapan yang belum dinilai AI belum punya grade. */
export function gradeLabel({ t }: Presenter, grade: FreshnessGrade | null): string {
  if (!grade) return t('grade.unrated')
  return t('grade.label', { grade, condition: gradeCondition(grade) })
}

/** Cara penyimpanan, dalam kata-kata yang dipakai nelayan. */
export function storageLabel({ t }: Presenter, method: StorageMethod): string {
  return t(`storage.${method}`)
}

/** Kata sifat untuk skor kesegaran, dipakai di baris "Estimasi kesegaran". */
function scoreWord(score: number): 'good' | 'fine' | 'fair' {
  if (score >= 85) return 'good'
  if (score >= 75) return 'fine'
  return 'fair'
}

/** "Grade A · Hidup, Bagus · 92%" — atau tanpa skor kalau AI belum selesai. */
export function freshnessLabel(p: Presenter, entry: Pick<Catch, 'freshness_grade' | 'freshness_score'>): string {
  const grade = gradeLabel(p, entry.freshness_grade)
  if (entry.freshness_score === null) return grade
  const score = Number(entry.freshness_score)
  return p.t('grade.freshness', { grade, score: scoreWord(score), percent: Math.round(score) })
}

/** "Rp 8.000". Harga yang belum diisi nelayan ditandai, bukan ditampilkan sebagai Rp 0. */
export function formatRupiah({ t, format }: Presenter, value: number | null): string {
  if (value === null) return t('price.unset')
  return format.number(Math.round(Number(value)), 'rupiah')
}

/** "45 kg" — paling banyak satu desimal, karena berat di sini cuma perkiraan. */
export function formatWeight({ t, format }: Presenter, kg: number): string {
  return t('weight', { weight: format.number(Number(kg), 'weight') })
}

/**
 * Sisa waktu sampai `expires_at`, dalam gaya "2 j 15 mnt". Mengembalikan null
 * kalau listing sudah lewat batas waktunya.
 */
export function timeLeft({ t }: Presenter, expiresAt: string | null, now: Date = new Date()): string | null {
  if (!expiresAt) return null
  const minutes = Math.floor((new Date(expiresAt).getTime() - now.getTime()) / 60000)
  if (minutes <= 0) return null
  const hours = Math.floor(minutes / 60)
  return hours > 0 ? t('timeLeft.hours', { hours, minutes: minutes % 60 }) : t('timeLeft.minutes', { minutes })
}

/** "12 jam yang lalu" untuk listing yang sudah selesai. */
export function timeAgo({ t, format }: Presenter, iso: string | null, now: Date = new Date()): string {
  if (!iso) return ''
  const date = new Date(iso)
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60000)
  if (minutes < 1) return t('justNow')
  const unit = minutes < 60 ? 'minute' : minutes < 60 * 24 ? 'hour' : 'day'
  return format.relativeTime(date, { now, unit })
}

/**
 * Rekomendasi penggunaan per kategori. Belum ada kolomnya di database, jadi
 * diturunkan dari kategori + grade: yang masih hidup layak konsumsi, yang sudah
 * mati diarahkan ke jalur pengolahan.
 */
const USAGE_KEYS = new Set<string>(CATEGORIES.filter((category) => category !== 'lainnya'))
type UsageKey = Exclude<Category, 'lainnya'> | 'fallback'

export function usageLabel(
  { t }: Presenter,
  entry: Pick<Catch, 'species' | 'freshness_grade' | 'hilirisasi_recommendation'>
): string {
  // Kalau model sudah memberi rekomendasi, itu yang dipakai (teks dari model, apa
  // adanya); sisanya diturunkan dari kategori dan grade.
  if (entry.hilirisasi_recommendation) return entry.hilirisasi_recommendation
  const key = (USAGE_KEYS.has(entry.species) ? entry.species : 'fallback') as UsageKey
  return t(`usage.${key}.${gradeCondition(entry.freshness_grade)}`)
}

/** Status kartu: LISTED masih berjalan, CLAIMED/COMPLETED sudah tutup. */
function cardStatus(p: Presenter, entry: Catch): { status: ListingCardContent['status']; statusLabel: string; footer: string } {
  const { t } = p
  switch (entry.status) {
    case 'CLAIMED':
      return {
        status: 'sold',
        statusLabel: t('listingStatus.claimed'),
        footer: t('listingStatus.claimedFooter', { ago: timeAgo(p, entry.updated_at) }),
      }
    case 'COMPLETED':
      return {
        status: 'closed',
        statusLabel: t('listingStatus.completed'),
        footer: t('listingStatus.completedFooter', { ago: timeAgo(p, entry.updated_at) }),
      }
    case 'EXPIRED':
      return { status: 'closed', statusLabel: t('listingStatus.expired'), footer: t('listingStatus.claimWindowOver') }
    // Saved and graded, but "Pasang ke listing" was never pressed. (The offline queue lives on the device and never
    // reaches this list, so a row here is always a catch waiting to be published, not one waiting to sync.)
    case 'WAITING_FOR_SYNC':
      return { status: 'draft', statusLabel: t('listingStatus.draft'), footer: t('listingStatus.draftFooter') }
    default: {
      const remaining = timeLeft(p, entry.expires_at)
      return {
        status: 'active',
        statusLabel: t('listingStatus.active'),
        footer: remaining ? t('listingStatus.activeFooter', { time: remaining }) : t('listingStatus.claimWindowOver'),
      }
    }
  }
}

/** Isi kartu tanpa tujuan link — dipakai kedua bentuk kartu di bawah. */
function cardContent(p: Presenter, entry: Catch): Omit<ListingCardContent, 'href'> {
  return {
    image: catchImage(p, entry),
    category: categoryLabel(p, entry.species),
    location: entry.catch_location,
    grade: { label: gradeLabel(p, entry.freshness_grade), condition: gradeCondition(entry.freshness_grade) },
    weight: formatWeight(p, entry.weight_kg),
    pricePerKg: formatRupiah(p, entry.price_per_kg),
    // The day the catch was logged, the date "Listing Saya" filters and sorts on.
    logged: { at: entry.created_at, label: p.t('listingStatus.logged', { date: p.format.dateTime(new Date(entry.created_at), 'day') }) },
    ...cardStatus(p, entry),
  }
}

/** Bentuk kartu yang dipakai panel dashboard dan tab "Terjual/Diambil". */
export function toListingCard(p: Presenter, entry: Catch, href: string): ListingCardContent {
  return { href, ...cardContent(p, entry) }
}

/** Bentuk kartu + isi drawer untuk tab "Aktif" di halaman "Listing Saya". */
export function toActiveListing(p: Presenter, entry: Catch): ActiveListing {
  return {
    ...cardContent(p, entry),
    // Row id dipakai sebagai slug: stabil, dan drawer membukanya lewat ?detail=.
    slug: entry.id,
    detail: {
      weightKg: Number(entry.weight_kg),
      pricePerKg: entry.price_per_kg === null ? null : Number(entry.price_per_kg),
      timeLeft: timeLeft(p, entry.expires_at) ?? p.t('timeLeft.over'),
      // "21 Sep 2026, 14.30"
      logged: `${p.format.dateTime(new Date(entry.created_at), 'day')}, ${p.format.dateTime(new Date(entry.created_at), 'time')}`,
      freshness: freshnessLabel(p, entry),
      usage: usageLabel(p, entry),
      photos: [catchImage(p, entry)],
    },
  }
}
