// lib/catches/present.ts
//
// Menerjemahkan row `catches` dari Supabase ke bentuk yang dipakai komponen UI.
// Semua pemformatan (rupiah, berat, sisa waktu, grade) berkumpul di sini supaya
// kartu di dashboard, "Listing Saya", dan marketplace menampilkan hal yang sama.

import type { ImageContent } from '@/components/home/hero'
import type { ListingCardContent } from '@/components/nelayan/listing-card'
import type { ActiveListing } from '@/components/nelayan/listing-content'
import { CATEGORY_STEP } from '@/components/nelayan/catch-content'
import type { Catch, FreshnessGrade, StorageMethod } from '@/types/database'

/** Kategori dari wizard "Tambah Tangkapan" — nilainya yang tersimpan di kolom `species`. */
const CATEGORY = new Map(
  CATEGORY_STEP.options.map((option) => [
    option.value,
    { label: option.label, image: 'image' in option ? option.image : undefined },
  ])
)

// Kategori "Lainnya" tidak punya foto sendiri; pakai foto campuran sebagai penampung.
const FALLBACK_IMAGE = '/images/nelayan/kategori/campuran.jpg'

/** Nama kategori yang enak dibaca. Species di luar daftar ditampilkan apa adanya. */
export function categoryLabel(species: string): string {
  return CATEGORY.get(species)?.label ?? species
}

/**
 * Foto listing: foto asli dari nelayan kalau ada, kalau tidak foto kategori.
 * Alt text-nya menyebut kategori supaya tetap berguna di kedua kasus.
 */
export function catchImage(entry: Pick<Catch, 'photo_url' | 'species'>): ImageContent {
  const label = categoryLabel(entry.species)
  return {
    src: entry.photo_url || CATEGORY.get(entry.species)?.image || FALLBACK_IMAGE,
    alt: entry.photo_url ? `Foto tangkapan ${label}` : `Ilustrasi ${label}`,
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
export function gradeLabel(grade: FreshnessGrade | null): string {
  if (!grade) return 'Belum dinilai'
  return `Grade ${grade} · ${gradeCondition(grade) === 'live' ? 'Hidup' : 'Mati'}`
}

/** Cara penyimpanan, dalam kata-kata yang dipakai nelayan. */
export const STORAGE_LABEL: Record<StorageMethod, string> = {
  crushed_ice: 'Banyak es',
  chilled_seawater: 'Sedikit es',
  ambient: 'Tanpa es',
}

/** Kata sifat untuk skor kesegaran, dipakai di baris "Estimasi kesegaran". */
function scoreWord(score: number): string {
  if (score >= 85) return 'Bagus'
  if (score >= 75) return 'Baik'
  return 'Cukup'
}

/** "Grade A · Hidup, Bagus · 92%" — atau tanpa skor kalau AI belum selesai. */
export function freshnessLabel(entry: Pick<Catch, 'freshness_grade' | 'freshness_score'>): string {
  const base = gradeLabel(entry.freshness_grade)
  if (entry.freshness_score === null) return base
  const score = Number(entry.freshness_score)
  return `${base}, ${scoreWord(score)} · ${Math.round(score)}%`
}

/** "Rp 8.000". Harga yang belum diisi nelayan ditandai, bukan ditampilkan sebagai Rp 0. */
export function formatRupiah(value: number | null): string {
  if (value === null) return 'Belum diatur'
  return `Rp ${Math.round(Number(value)).toLocaleString('id-ID')}`
}

/** "45 kg" — desimal dibuang kalau bulat, karena berat di sini cuma perkiraan. */
export function formatWeight(kg: number): string {
  const value = Number(kg)
  return `${Number.isInteger(value) ? value : value.toFixed(1)} kg`
}

/**
 * Sisa waktu sampai `expires_at`, dalam gaya "2 j 15 mnt". Mengembalikan null
 * kalau listing sudah lewat batas waktunya.
 */
export function timeLeft(expiresAt: string | null, now: Date = new Date()): string | null {
  if (!expiresAt) return null
  const minutes = Math.floor((new Date(expiresAt).getTime() - now.getTime()) / 60000)
  if (minutes <= 0) return null
  const hours = Math.floor(minutes / 60)
  return hours > 0 ? `${hours} j ${minutes % 60} mnt` : `${minutes} mnt`
}

/** "12 jam lalu" untuk listing yang sudah selesai. */
export function timeAgo(iso: string | null, now: Date = new Date()): string {
  if (!iso) return ''
  const minutes = Math.floor((now.getTime() - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return 'baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  return `${Math.floor(hours / 24)} hari lalu`
}

/**
 * Rekomendasi penggunaan per kategori. Belum ada kolomnya di database, jadi
 * diturunkan dari kategori + grade: yang masih hidup layak konsumsi, yang sudah
 * mati diarahkan ke jalur pengolahan.
 */
const USAGE: Record<string, { live: string[]; dead: string[] }> = {
  campuran: { live: ['Konsumsi Langsung', 'Ikan Asin'], dead: ['Pakan Maggot (BSF)', 'Silase Ikan'] },
  teri: { live: ['Teri Nasi Kering', 'Konsumsi Langsung'], dead: ['Terasi', 'Pakan Ternak'] },
  udang: { live: ['Konsumsi Langsung', 'Udang Beku'], dead: ['Terasi', 'Pakan Ternak'] },
  'cumi-cumi-sotong': { live: ['Konsumsi Langsung', 'Cumi Beku'], dead: ['Umpan Pancing', 'Tepung Ikan'] },
  'ikan-pelagis-kecil': { live: ['Konsumsi Langsung', 'Pindang'], dead: ['Ikan Asin', 'Tepung Ikan'] },
  'ikan-demersal': { live: ['Konsumsi Langsung', 'Ikan Asap'], dead: ['Silase Ikan', 'Pupuk Organik'] },
  rajungan: { live: ['Konsumsi Langsung', 'Daging Rajungan'], dead: ['Tepung Cangkang', 'Pakan Ternak'] },
}

const USAGE_FALLBACK = { live: ['Konsumsi Langsung'], dead: ['Pakan Maggot (BSF)', 'Pupuk Organik'] }

export function usageLabel(
  entry: Pick<Catch, 'species' | 'freshness_grade' | 'hilirisasi_recommendation'>
): string {
  // Kalau model sudah memberi rekomendasi, itu yang dipakai; sisanya diturunkan
  // dari kategori dan grade.
  if (entry.hilirisasi_recommendation) return entry.hilirisasi_recommendation
  const options = USAGE[entry.species] ?? USAGE_FALLBACK
  return options[gradeCondition(entry.freshness_grade)].join(', ')
}

/** Status kartu: LISTED masih berjalan, CLAIMED/COMPLETED sudah tutup. */
function cardStatus(entry: Catch): { status: ListingCardContent['status']; statusLabel: string; footer: string } {
  switch (entry.status) {
    case 'CLAIMED':
      return { status: 'sold', statusLabel: 'Diklaim', footer: `Diklaim ${timeAgo(entry.updated_at)}` }
    case 'COMPLETED':
      return { status: 'closed', statusLabel: 'Terjual', footer: `Terjual ${timeAgo(entry.updated_at)}` }
    case 'EXPIRED':
      return { status: 'closed', statusLabel: 'Kedaluwarsa', footer: 'Waktu klaim habis' }
    // Saved and graded, but "Pasang ke listing" was never pressed. (The offline queue lives on the device and never
    // reaches this list, so a row here is always a catch waiting to be published, not one waiting to sync.)
    case 'WAITING_FOR_SYNC':
      return { status: 'draft', statusLabel: 'Belum dipasang', footer: 'Pasang untuk mulai 48 jam klaim' }
    default: {
      const remaining = timeLeft(entry.expires_at)
      return {
        status: 'active',
        statusLabel: 'Aktif',
        footer: remaining ? `Sisa ${remaining}` : 'Waktu klaim habis',
      }
    }
  }
}

/** Isi kartu tanpa tujuan link — dipakai kedua bentuk kartu di bawah. */
function cardContent(entry: Catch): Omit<ListingCardContent, 'href'> {
  return {
    image: catchImage(entry),
    category: categoryLabel(entry.species),
    location: entry.catch_location,
    grade: { label: gradeLabel(entry.freshness_grade), condition: gradeCondition(entry.freshness_grade) },
    weight: formatWeight(entry.weight_kg),
    pricePerKg: formatRupiah(entry.price_per_kg),
    ...cardStatus(entry),
  }
}

/** Bentuk kartu yang dipakai panel dashboard dan tab "Terjual/Diambil". */
export function toListingCard(entry: Catch, href: string): ListingCardContent {
  return { href, ...cardContent(entry) }
}

/** Bentuk kartu + isi drawer untuk tab "Aktif" di halaman "Listing Saya". */
export function toActiveListing(entry: Catch): ActiveListing {
  return {
    ...cardContent(entry),
    // Row id dipakai sebagai slug: stabil, dan drawer membukanya lewat ?detail=.
    slug: entry.id,
    detail: {
      description: entry.freshness_notes ?? `Hasil tangkapan ${categoryLabel(entry.species).toLowerCase()}.`,
      timeLeft: timeLeft(entry.expires_at) ?? 'Habis',
      freshness: freshnessLabel(entry),
      usage: usageLabel(entry),
      photos: [catchImage(entry)],
    },
  }
}
