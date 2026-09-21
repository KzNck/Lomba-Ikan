// lib/catches/recommendations.ts
//
// "Rekomendasi Penggunaan" di modal Hasil Kesegaran. Belum ada kolomnya di
// database, jadi disusun dari kategori dan grade tangkapan — sejalan dengan
// `usageLabel` di present.ts, tapi lengkap dengan ikon dan penjelasannya.

import type { UsageOptionContent } from '@/components/nelayan/usage-option'
import { gradeCondition } from './present'
import type { Translator } from '@/lib/i18n/translator'
import type { Catch } from '@/types/database'

/** Katalog jalur hilirisasi yang dikenal, dipakai ulang antar kategori. Teksnya di `dashboard.nelayan.freshness.uses`. */
const USE_ICONS = {
  maggot: 'bug',
  silase: 'factory',
  pupuk: 'sprout',
  tepung: 'factory',
  terasi: 'factory',
  umpan: 'fish',
  konsumsi: 'utensils',
  asin: 'sun',
  pakanTernak: 'factory',
} as const satisfies Record<string, UsageOptionContent['icon']>

type Use = keyof typeof USE_ICONS

const BY_CATEGORY: Record<string, { live: Use[]; dead: Use[] }> = {
  campuran: { live: ['konsumsi', 'asin', 'silase'], dead: ['maggot', 'silase', 'pupuk'] },
  teri: { live: ['konsumsi', 'asin', 'terasi'], dead: ['terasi', 'pakanTernak', 'maggot'] },
  udang: { live: ['konsumsi', 'terasi', 'asin'], dead: ['terasi', 'pakanTernak', 'maggot'] },
  'cumi-cumi-sotong': { live: ['konsumsi', 'umpan', 'asin'], dead: ['umpan', 'tepung', 'maggot'] },
  'ikan-pelagis-kecil': { live: ['konsumsi', 'asin', 'tepung'], dead: ['asin', 'tepung', 'maggot'] },
  'ikan-demersal': { live: ['konsumsi', 'asin', 'silase'], dead: ['silase', 'pupuk', 'maggot'] },
  rajungan: { live: ['konsumsi', 'tepung', 'pakanTernak'], dead: ['tepung', 'pakanTernak', 'pupuk'] },
}

const FALLBACK: { live: Use[]; dead: Use[] } = { live: ['konsumsi', 'silase', 'pupuk'], dead: ['maggot', 'silase', 'pupuk'] }

/** Tiga jalur teratas untuk satu tangkapan. */
export function recommendationsFor(
  t: Translator<'dashboard.nelayan.freshness'>,
  entry: Pick<Catch, 'species' | 'freshness_grade'>
): UsageOptionContent[] {
  const options = BY_CATEGORY[entry.species] ?? FALLBACK
  return options[gradeCondition(entry.freshness_grade)].map((key) => ({
    icon: USE_ICONS[key],
    title: t(`uses.${key}.title`),
    description: t(`uses.${key}.description`),
  }))
}
